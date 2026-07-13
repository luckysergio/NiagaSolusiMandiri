<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string|float|int|null $product_price
 * @property string|float|int|null $qty
 * @property string|float|int|null $total_price
 * @property string|float|int|null $expense
 */
class TransactionDetail extends Model
{
    use SoftDeletes;

    protected $table = 'transaction_details';

    protected $fillable = [
        'transaction_id',
        'product_id',
        'unit',
        'product_price',
        'qty',
        'total_price',
        'supplier_id',
        'expense',
    ];

    protected $casts = [
        'product_price' => 'decimal:2',
        'qty' => 'decimal:2',
        'total_price' => 'decimal:2',
        'expense' => 'decimal:2',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function scopeByTransaction(Builder $query, int $transactionId): Builder
    {
        return $query->where('transaction_id', $transactionId);
    }

    public function scopeByProduct(Builder $query, int $productId): Builder
    {
        return $query->where('product_id', $productId);
    }

    public function scopeBySupplier(Builder $query, int $supplierId): Builder
    {
        return $query->where('supplier_id', $supplierId);
    }

    public function scopeWithSupplier(Builder $query): Builder
    {
        return $query->whereNotNull('supplier_id');
    }

    public function scopeWithoutSupplier(Builder $query): Builder
    {
        return $query->whereNull('supplier_id');
    }

    public function calculateTotalPrice(): float
    {
        return (float) $this->product_price * (float) $this->qty;
    }

    public function recalculateTotalPrice(): void
    {
        $this->update([
            'total_price' => $this->calculateTotalPrice(),
        ]);
    }

    public static function createFromProduct(int $transactionId, Product $product, array $overrides = []): self
    {
        return self::create([
            'transaction_id' => $transactionId,
            'product_id' => $product->id,
            'unit' => $overrides['unit'] ?? $product->unit,
            'product_price' => $overrides['product_price'] ?? $product->price,
            'qty' => $overrides['qty'] ?? 1,
            'total_price' => 0, 
            'supplier_id' => $overrides['supplier_id'] ?? null,
            'expense' => $overrides['expense'] ?? 0,
        ]);
    }

    public function getFormattedProductPriceAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->product_price, 0, ',', '.');
    }

    public function getFormattedTotalPriceAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->total_price, 0, ',', '.');
    }

    public function getFormattedExpenseAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->expense, 0, ',', '.');
    }

    public function getProductNameAttribute(): string
    {
        return $this->product?->name ?? '-';
    }

    public function getProductCodeAttribute(): string
    {
        return $this->product?->code ?? '-';
    }

    public function getSupplierNameAttribute(): string
    {
        return $this->supplier?->name ?? '-';
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function (TransactionDetail $detail) {
            if (empty($detail->total_price) || $detail->isDirty(['product_price', 'qty'])) {
                $calculated = (float) $detail->product_price * (float) $detail->qty;
                $detail->total_price = (string) round($calculated, 2);
            }
        });

        static::saved(function (TransactionDetail $detail) {
            $detail->transaction?->recalculateTotals();
        });

        static::deleted(function (TransactionDetail $detail) {
            $detail->transaction?->recalculateTotals();
        });
    }
}