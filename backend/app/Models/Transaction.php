<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property \Illuminate\Support\Carbon|null $transaction_date
 * @property string|float|int|null $total_transaction
 * @property string|float|int|null $total_expense
 */
class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'invoice',
        'user_id',
        'transaction_date',
        'customer_name',
        'project_name',
        'project_address',
        'status',
        'total_transaction',
        'total_expense',
        'notes',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'total_transaction' => 'decimal:2',
        'total_expense' => 'decimal:2',
        'status' => TransactionStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function scopeByStatus(Builder $query, TransactionStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeDipesan(Builder $query): Builder
    {
        return $query->where('status', TransactionStatus::DIPESAN);
    }

    public function scopeDikerjakan(Builder $query): Builder
    {
        return $query->where('status', TransactionStatus::DIKERJAKAN);
    }

    public function scopeSelesai(Builder $query): Builder
    {
        return $query->where('status', TransactionStatus::SELESAI);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByDateRange(Builder $query, ?string $startDate, ?string $endDate): Builder
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('invoice', 'like', "%{$search}%")
                ->orWhere('customer_name', 'like', "%{$search}%")
                ->orWhere('project_name', 'like', "%{$search}%");
        });
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc');
    }

    public function isDipesan(): bool
    {
        return $this->status === TransactionStatus::DIPESAN;
    }

    public function isDikerjakan(): bool
    {
        return $this->status === TransactionStatus::DIKERJAKAN;
    }

    public function isSelesai(): bool
    {
        return $this->status === TransactionStatus::SELESAI;
    }

    public function canChangeTo(TransactionStatus $newStatus): bool
    {
        $order = [
            TransactionStatus::DIPESAN->value => 1,
            TransactionStatus::DIKERJAKAN->value => 2,
            TransactionStatus::SELESAI->value => 3,
        ];

        return ($order[$newStatus->value] ?? 0) >= ($order[$this->status->value] ?? 0);
    }

    public function changeStatus(TransactionStatus $newStatus): bool
    {
        if (!$this->canChangeTo($newStatus)) {
            return false;
        }

        return $this->update(['status' => $newStatus]);
    }

    public function recalculateTotals(): void
    {
        $this->update([
            'total_transaction' => $this->details()->sum('total_price'),
            'total_expense' => $this->details()->sum('expense'),
        ]);
    }

    public function getStatusLabelAttribute(): string
    {
        return $this->status?->label() ?? '-';
    }

    public function getStatusColorAttribute(): string
    {
        return $this->status?->color() ?? 'gray';
    }

    public function getFormattedTotalTransactionAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->total_transaction, 0, ',', '.');
    }

    public function getFormattedTotalExpenseAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->total_expense, 0, ',', '.');
    }

    public function getProfitAttribute(): float
    {
        return (float) $this->total_transaction - (float) $this->total_expense;
    }

    public function getFormattedProfitAttribute(): string
    {
        return 'Rp ' . number_format($this->profit, 0, ',', '.');
    }

    public function getFormattedTransactionDateAttribute(): string
    {
        return $this->transaction_date ? $this->transaction_date->format('d/m/Y') : '-';
    }

    public static function generateInvoice(): string
    {
        $date = date('Ymd');
        $count = self::whereDate('created_at', today())->count() + 1;
        
        return sprintf('INV-%s-%04d', $date, $count);
    }

    public static function getStatistics(?string $startDate = null, ?string $endDate = null): array
    {
        $query = self::query();

        if ($startDate && $endDate) {
            $query->byDateRange($startDate, $endDate);
        }

        return [
            'total' => (clone $query)->count(),
            'dipesan' => (clone $query)->dipesan()->count(),
            'dikerjakan' => (clone $query)->dikerjakan()->count(),
            'selesai' => (clone $query)->selesai()->count(),
            'total_transaction' => (clone $query)->sum('total_transaction'),
            'total_expense' => (clone $query)->sum('total_expense'),
            'total_profit' => (clone $query)->sum('total_transaction') - (clone $query)->sum('total_expense'),
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Transaction $transaction) {
            if (empty($transaction->invoice)) {
                $transaction->invoice = self::generateInvoice();
            }
        });
    }
}