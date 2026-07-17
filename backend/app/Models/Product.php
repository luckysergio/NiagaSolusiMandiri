<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'product_type_id',
        'code',
        'name',
        'description',
        'price',
        'unit',
        'minimum_order',
        'sort_order',
        'featured',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'minimum_order' => 'decimal:2',
        'specifications' => 'array',
        'sort_order' => 'integer',
        'featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class, 'product_type_id');
    }

    public function category(): HasOneThrough
    {
        return $this->hasOneThrough(
            ProductCategory::class,
            ProductType::class,
            'id',
            'id',
            'product_type_id',
            'category_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    public function scopeNotFeatured(Builder $query): Builder
    {
        return $query->where('featured', false);
    }

    public function scopeByType(Builder $query, int $typeId): Builder
    {
        return $query->where('product_type_id', $typeId);
    }

    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->whereHas('productType', function (Builder $q) use ($categoryId) {
            $q->where('category_id', $categoryId);
        });
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc');
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function scopePriceRange(Builder $query, ?float $min, ?float $max): Builder
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }

        if ($max !== null) {
            $query->where('price', '<=', $max);
        }

        return $query;
    }

    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    public function isFeatured(): bool
    {
        return $this->featured === true;
    }

    public function toggleActive(): void
    {
        $this->update([
            'is_active' => !$this->is_active,
        ]);
    }

    public function toggleFeatured(): void
    {
        $this->update([
            'featured' => !$this->featured,
        ]);
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function markAsFeatured(): void
    {
        $this->update(['featured' => true]);
    }

    public function removeFeatured(): void
    {
        $this->update(['featured' => false]);
    }

    public function getFormattedPriceAttribute(): string
    {
        $price = (float) ($this->price ?? 0);
        return 'Rp ' . number_format($price, 0, ',', '.');
    }

    public function getPriceWithUnitAttribute(): string
    {
        return $this->formatted_price . ' / ' . ($this->unit ?? 'unit');
    }

    public function getCategoryNameAttribute(): string
    {
        return $this->productType?->category?->name ?? '-';
    }

    public function getTypeNameAttribute(): string
    {
        return $this->productType?->name ?? '-';
    }

    public static function generateCode(string $prefix = 'PRD'): string
    {
        do {
            $code = $prefix . '-' . strtoupper(Str::random(6));
        } while (self::where('code', $code)->exists());

        return $code;
    }

    public static function getByCategory(int $categoryId): Builder
    {
        return self::with(['productType.category'])
            ->byCategory($categoryId)
            ->active()
            ->ordered();
    }

    public static function getFeatured(int $limit = 10): Builder
    {
        return self::with(['productType.category'])
            ->featured()
            ->active()
            ->ordered()
            ->limit($limit);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Product $product) {
            if (empty($product->code)) {
                $product->code = self::generateCode();
            }
        });
    }
}