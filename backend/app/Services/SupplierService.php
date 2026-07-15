<?php

namespace App\Services;

use App\Models\Supplier;
use App\Events\SupplierCreated;
use App\Events\SupplierUpdated;
use App\Events\SupplierDeleted;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SupplierService
{
    public function __construct(
        protected ActivityLogService $activityLogService
    ) {}

    private const CACHE_KEY_LIST = 'suppliers.list';
    private const CACHE_KEY_LIST_REGISTRY = 'suppliers.list.registry';
    private const CACHE_KEY_DROPDOWN = 'suppliers.dropdown';
    private const CACHE_KEY_STATISTICS = 'suppliers.statistics';
    private const CACHE_KEY_PREFIX = 'supplier:';
    private const CACHE_TTL_LIST = 300;
    private const CACHE_TTL_REGISTRY = 86400;
    private const CACHE_TTL_STATIC = 3600;

    public function paginate(array $filters = [], int $perPage = 12, int $page = 1): LengthAwarePaginator
    {
        $cacheKey = $this->buildCacheKey($filters, $perPage, $page);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage, $page) {
            return Supplier::query()
                ->select(['id', 'name', 'address', 'phone', 'is_active', 'created_at', 'updated_at'])
                ->withCount('transactionDetails')
                ->search($filters['search'] ?? null)
                ->when(
                    isset($filters['is_active']) && $filters['is_active'] !== '',
                    fn($q) => $q->where('is_active', (bool) $filters['is_active'])
                )
                ->ordered()
                ->paginate(min($perPage, 100), ['*'], 'page', $page);
        });
    }

    public function find(int $id): Supplier
    {
        $cacheKey = self::CACHE_KEY_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($id) {
            return Supplier::withCount('transactionDetails')->findOrFail($id);
        });
    }

    public function getSuppliersForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL_STATIC, function () {
            return Supplier::select('id', 'name', 'phone')
                ->active()
                ->ordered()
                ->get()
                ->toArray();
        });
    }

    public function getStatistics(): array
    {
        return Cache::remember(self::CACHE_KEY_STATISTICS, self::CACHE_TTL_LIST, function () {
            return [
                'total' => Supplier::count(),
                'active' => Supplier::active()->count(),
                'inactive' => Supplier::inactive()->count(),
                'with_transactions' => Supplier::has('transactionDetails')->count(),
            ];
        });
    }

    public function create(array $data): Supplier
    {
        $this->validateNameUniqueness($data['name']);

        return DB::transaction(function () use ($data) {
            $supplier = Supplier::create([
                'name' => $data['name'],
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            $supplier->loadCount('transactionDetails');

            $this->activityLogService->create(
                module: 'suppliers',
                action: 'create',
                referenceId: $supplier->id,
                newData: $supplier->toArray()
            );

            broadcast(new SupplierCreated($supplier));
            $this->clearAllListCache();

            return $supplier;
        });
    }

    public function update(int $id, array $data): Supplier
    {
        return DB::transaction(function () use ($id, $data) {
            $supplier = Supplier::findOrFail($id);

            if (isset($data['name']) && $data['name'] !== $supplier->name) {
                $this->validateNameUniqueness($data['name'], $id);
            }

            $oldData = $supplier->toArray();

            $supplier->update([
                'name' => $data['name'] ?? $supplier->name,
                'address' => $data['address'] ?? $supplier->address,
                'phone' => $data['phone'] ?? $supplier->phone,
                'is_active' => $data['is_active'] ?? $supplier->is_active,
            ]);

            $supplier = $supplier->fresh();
            $supplier->loadCount('transactionDetails');

            $this->activityLogService->create(
                module: 'suppliers',
                action: 'update',
                referenceId: $supplier->id,
                oldData: $oldData,
                newData: $supplier->toArray()
            );

            broadcast(new SupplierUpdated($supplier));
            $this->clearSupplierCache($id);

            return $supplier;
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $supplier = Supplier::findOrFail($id);
            $oldData = $supplier->toArray();
            $supplierName = $supplier->name;

            $this->activityLogService->create(
                module: 'suppliers',
                action: 'delete',
                referenceId: $supplier->id,
                oldData: $oldData
            );

            broadcast(new SupplierDeleted($id, $supplierName));
            $supplier->delete();

            $this->clearSupplierCache($id);
        });
    }

    public function toggleActive(int $id): Supplier
    {
        return DB::transaction(function () use ($id) {
            $supplier = Supplier::findOrFail($id);
            $oldData = $supplier->toArray();

            $supplier->update(['is_active' => !$supplier->is_active]);

            $supplier = $supplier->fresh();
            $supplier->loadCount('transactionDetails');

            $this->activityLogService->create(
                module: 'suppliers',
                action: $supplier->is_active ? 'activate' : 'deactivate',
                referenceId: $supplier->id,
                oldData: $oldData,
                newData: $supplier->toArray()
            );

            broadcast(new SupplierUpdated($supplier));
            $this->clearSupplierCache($id);

            return $supplier;
        });
    }

    private function validateNameUniqueness(string $name, ?int $excludeId = null): void
    {
        $query = Supplier::where('name', $name);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'name' => ['Nama supplier sudah digunakan.']
            ]);
        }
    }

    private function buildCacheKey(array $filters, int $perPage, int $page): string
    {
        $filterHash = md5(json_encode($filters));
        return sprintf('%s:%s:%d:%d', self::CACHE_KEY_LIST, $filterHash, $perPage, $page);
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

    private function clearSupplierCache(int $supplierId): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . $supplierId);
        $this->clearAllListCache();
    }

    public function clearCache(): void
    {
        $this->clearAllListCache();
    }
}