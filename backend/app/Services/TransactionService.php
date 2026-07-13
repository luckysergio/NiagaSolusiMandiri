<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Enums\TransactionStatus;
use App\Events\TransactionCreated;
use App\Events\TransactionUpdated;
use App\Events\TransactionDeleted;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TransactionService
{
    public function __construct(
        protected ActivityLogService $activityLogService
    ) {}

    private const CACHE_KEY_LIST = 'transactions.list';
    private const CACHE_KEY_LIST_REGISTRY = 'transactions.list.registry';
    private const CACHE_KEY_DROPDOWN = 'transactions.dropdown';
    private const CACHE_KEY_STATISTICS = 'transactions.statistics';
    private const CACHE_KEY_PREFIX = 'transaction:';
    private const CACHE_TTL_LIST = 300;
    private const CACHE_TTL_REGISTRY = 86400;
    private const CACHE_TTL_STATIC = 3600;

    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $cacheKey = $this->buildCacheKey($filters, $perPage);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
            return Transaction::query()
                ->select([
                    'id',
                    'invoice',
                    'user_id',
                    'transaction_date',
                    'customer_name',
                    'project_name',
                    'status',
                    'total_transaction',
                    'total_expense',
                    'created_at',
                    'updated_at',
                ])
                ->with([
                    'user:id,name,email',
                ])
                ->withCount('details')
                ->search($filters['search'] ?? null)
                ->when(
                    !empty($filters['status']) && TransactionStatus::isValid($filters['status']),
                    fn($q) => $q->byStatus(TransactionStatus::from($filters['status']))
                )
                ->when(
                    !empty($filters['user_id']),
                    fn($q) => $q->byUser((int) $filters['user_id'])
                )
                ->when(
                    !empty($filters['start_date']) && !empty($filters['end_date']),
                    fn($q) => $q->byDateRange($filters['start_date'], $filters['end_date'])
                )
                ->ordered()
                ->paginate(min($perPage, 100));
        });
    }

    public function find(int $id): Transaction
    {
        $cacheKey = self::CACHE_KEY_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($id) {
            return Transaction::with([
                'user:id,name,email',
                'details.product:id,name,code,unit,price',
                'details.supplier:id,name',
            ])->findOrFail($id);
        });
    }

    public function getTransactionsForDropdown(?string $status = null): array
    {
        $cacheKey = self::CACHE_KEY_DROPDOWN . ':' . ($status ?? 'all');

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($status) {
            $query = Transaction::select('id', 'invoice', 'customer_name', 'transaction_date', 'status')
                ->withCount('details');

            if ($status && TransactionStatus::isValid($status)) {
                $query->byStatus(TransactionStatus::from($status));
            }

            return $query->ordered()->limit(100)->get()->toArray();
        });
    }

    public function getStatistics(?string $startDate = null, ?string $endDate = null): array
    {
        $cacheKey = self::CACHE_KEY_STATISTICS . ":{$startDate}:{$endDate}";

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($startDate, $endDate) {
            $baseQuery = Transaction::query();

            if ($startDate && $endDate) {
                $baseQuery->byDateRange($startDate, $endDate);
            }

            return [
                'total' => (clone $baseQuery)->count(),
                'dipesan' => (clone $baseQuery)->dipesan()->count(),
                'dikerjakan' => (clone $baseQuery)->dikerjakan()->count(),
                'selesai' => (clone $baseQuery)->selesai()->count(),
                'total_transaction' => (float) (clone $baseQuery)->sum('total_transaction'),
                'total_expense' => (float) (clone $baseQuery)->sum('total_expense'),
                'total_profit' => (float) (clone $baseQuery)->sum('total_transaction') 
                    - (float) (clone $baseQuery)->sum('total_expense'),
            ];
        });
    }

    public function create(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $status = isset($data['status']) && TransactionStatus::isValid($data['status'])
                ? TransactionStatus::from($data['status'])
                : TransactionStatus::DIPESAN;

            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'transaction_date' => $data['transaction_date'],
                'customer_name' => $data['customer_name'],
                'project_name' => $data['project_name'] ?? null,
                'project_address' => $data['project_address'] ?? null,
                'status' => $status,
                'notes' => $data['notes'] ?? null,
                'total_transaction' => 0,
                'total_expense' => 0,
            ]);

            if (!empty($data['details']) && is_array($data['details'])) {
                foreach ($data['details'] as $detail) {
                    $this->createDetail($transaction->id, $detail);
                }
            }

            $transaction->recalculateTotals();
            $transaction = $transaction->fresh();
            $transaction->load([
                'user:id,name,email',
                'details.product:id,name,code,unit,price',
                'details.supplier:id,name',
            ]);
            $transaction->loadCount('details');

            $this->activityLogService->create(
                module: 'transactions',
                action: 'create',
                referenceId: $transaction->id,
                newData: $transaction->toArray()
            );

            broadcast(new TransactionCreated($transaction));
            $this->clearAllListCache();

            return $transaction;
        });
    }

    public function update(int $id, array $data): Transaction
    {
        return DB::transaction(function () use ($id, $data) {
            $transaction = Transaction::findOrFail($id);
            $oldData = $transaction->toArray();

            if (isset($data['status'])) {
                $newStatus = TransactionStatus::from($data['status']);
                if (!$transaction->canChangeTo($newStatus)) {
                    throw ValidationException::withMessages([
                        'status' => ["Status tidak dapat diubah dari {$transaction->status->label()} ke {$newStatus->label()}"]
                    ]);
                }
                $data['status'] = $newStatus;
            }

            $transaction->update([
                'transaction_date' => $data['transaction_date'] ?? $transaction->transaction_date,
                'customer_name' => $data['customer_name'] ?? $transaction->customer_name,
                'project_name' => $data['project_name'] ?? $transaction->project_name,
                'project_address' => $data['project_address'] ?? $transaction->project_address,
                'status' => $data['status'] ?? $transaction->status,
                'notes' => array_key_exists('notes', $data) ? $data['notes'] : $transaction->notes,
            ]);

            if (isset($data['details']) && is_array($data['details'])) {
                $this->syncDetails($transaction->id, $data['details']);
            }

            $transaction->recalculateTotals();
            $transaction = $transaction->fresh();
            $transaction->load([
                'user:id,name,email',
                'details.product:id,name,code,unit,price',
                'details.supplier:id,name',
            ]);
            $transaction->loadCount('details');

            $this->activityLogService->create(
                module: 'transactions',
                action: 'update',
                referenceId: $transaction->id,
                oldData: $oldData,
                newData: $transaction->toArray()
            );

            broadcast(new TransactionUpdated($transaction));
            $this->clearTransactionCache($id);

            return $transaction;
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $transaction = Transaction::findOrFail($id);
            $oldData = $transaction->toArray();
            $invoice = $transaction->invoice;

            $this->activityLogService->create(
                module: 'transactions',
                action: 'delete',
                referenceId: $transaction->id,
                oldData: $oldData
            );

            broadcast(new TransactionDeleted($id, $invoice));

            $transaction->details()->delete();
            $transaction->delete();

            $this->clearTransactionCache($id);
        });
    }

    public function changeStatus(int $id, string $newStatusValue): Transaction
    {
        if (!TransactionStatus::isValid($newStatusValue)) {
            throw ValidationException::withMessages([
                'status' => ['Status tidak valid.']
            ]);
        }

        $newStatus = TransactionStatus::from($newStatusValue);

        return DB::transaction(function () use ($id, $newStatus) {
            $transaction = Transaction::findOrFail($id);

            if (!$transaction->canChangeTo($newStatus)) {
                throw ValidationException::withMessages([
                    'status' => ["Status tidak dapat diubah dari {$transaction->status->label()} ke {$newStatus->label()}"]
                ]);
            }

            $oldData = $transaction->toArray();

            $transaction->update(['status' => $newStatus]);

            $transaction = $transaction->fresh();
            $transaction->load([
                'user:id,name,email',
                'details.product:id,name,code,unit,price',
                'details.supplier:id,name',
            ]);
            $transaction->loadCount('details');

            $this->activityLogService->create(
                module: 'transactions',
                action: 'change_status',
                referenceId: $transaction->id,
                oldData: $oldData,
                newData: $transaction->toArray()
            );

            broadcast(new TransactionUpdated($transaction));
            $this->clearTransactionCache($id);

            return $transaction;
        });
    }

    private function createDetail(int $transactionId, array $detail): TransactionDetail
    {
        return TransactionDetail::create([
            'transaction_id' => $transactionId,
            'product_id' => $detail['product_id'],
            'unit' => $detail['unit'] ?? 'unit',
            'product_price' => $detail['product_price'] ?? 0,
            'qty' => $detail['qty'] ?? 1,
            'total_price' => 0,
            'supplier_id' => $detail['supplier_id'] ?? null,
            'expense' => $detail['expense'] ?? 0,
        ]);
    }

    private function syncDetails(int $transactionId, array $details): void
    {
        TransactionDetail::where('transaction_id', $transactionId)->delete();

        foreach ($details as $detail) {
            $this->createDetail($transactionId, $detail);
        }
    }

    private function buildCacheKey(array $filters, int $perPage): string
    {
        $filterHash = md5(json_encode($filters));
        return sprintf('%s:%s:%d', self::CACHE_KEY_LIST, $filterHash, $perPage);
    }

    private function registerListCacheKey(string $cacheKey): void
    {
        $registry = $this->getListCacheRegistry();
        if (!in_array($cacheKey, $registry, true)) {
            $registry[] = $cacheKey;
            Cache::put(self::CACHE_KEY_LIST_REGISTRY, $registry, self::CACHE_TTL_REGISTRY);
        }
    }

    private function getListCacheRegistry(): array
    {
        return Cache::get(self::CACHE_KEY_LIST_REGISTRY, []);
    }

    private function clearAllListCache(): void
    {
        $registry = $this->getListCacheRegistry();
        foreach ($registry as $cacheKey) {
            Cache::forget($cacheKey);
        }

        Cache::forget(self::CACHE_KEY_LIST_REGISTRY);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
        Cache::forget(self::CACHE_KEY_STATISTICS);
    }

    private function clearTransactionCache(int $transactionId): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . $transactionId);
        $this->clearAllListCache();
    }

    public function clearCache(): void
    {
        $this->clearAllListCache();
    }
}