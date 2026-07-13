<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductType;
use App\Events\ProductCreated;
use App\Events\ProductUpdated;
use App\Events\ProductDeleted;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(
        protected ActivityLogService $activityLogService
    ) {}
    private const CACHE_KEY_LIST = 'products.list';
    private const CACHE_KEY_LIST_REGISTRY = 'products.list.registry';
    private const CACHE_KEY_DROPDOWN = 'products.dropdown';
    private const CACHE_KEY_STATISTICS = 'products.statistics';
    private const CACHE_KEY_PREFIX = 'product:';
    private const CACHE_TTL_LIST = 300;
    private const CACHE_TTL_REGISTRY = 86400;
    private const CACHE_TTL_STATIC = 3600;

    public function paginate(
        array $filters = [],
        int $perPage = 10
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey($filters, $perPage);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
            return Product::query()
                ->select([
                    'id',
                    'product_type_id',
                    'code',
                    'name',
                    'description',
                    'price',
                    'unit',
                    'minimum_order',
                    'specifications',
                    'sort_order',
                    'featured',
                    'is_active',
                    'created_at',
                    'updated_at',
                ])
                ->with([
                    'productType:id,name,category_id',
                    'productType.category:id,name',
                ])
                ->search($filters['search'] ?? null)
                ->when(
                    !empty($filters['product_type_id']),
                    fn($q) => $q->where('product_type_id', (int) $filters['product_type_id'])
                )
                ->when(
                    !empty($filters['category_id']),
                    fn($q) => $q->byCategory((int) $filters['category_id'])
                )
                ->when(
                    isset($filters['is_active']) && $filters['is_active'] !== '',
                    fn($q) => $q->where('is_active', (bool) $filters['is_active'])
                )
                ->when(
                    isset($filters['featured']) && $filters['featured'] !== '',
                    fn($q) => $q->where('featured', (bool) $filters['featured'])
                )
                ->when(
                    !empty($filters['price_min']),
                    fn($q) => $q->where('price', '>=', (float) $filters['price_min'])
                )
                ->when(
                    !empty($filters['price_max']),
                    fn($q) => $q->where('price', '<=', (float) $filters['price_max'])
                )
                ->ordered()
                ->paginate(min($perPage, 100));
        });
    }

    public function find(int $id): Product
    {
        $cacheKey = self::CACHE_KEY_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($id) {
            return Product::with([
                'productType:id,name,category_id',
                'productType.category:id,name',
            ])->findOrFail($id);
        });
    }

    public function getProductsForDropdown(?int $typeId = null, ?int $categoryId = null): array
    {
        $cacheKey = self::CACHE_KEY_DROPDOWN . ":{$typeId}:{$categoryId}";

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($typeId, $categoryId) {
            $query = Product::select('id', 'product_type_id', 'code', 'name', 'price', 'unit')
                ->with('productType:id,name,category_id')
                ->active();

            if ($typeId) {
                $query->byType($typeId);
            }

            if ($categoryId) {
                $query->byCategory($categoryId);
            }

            return $query->ordered()->get()->toArray();
        });
    }

    public function getStatistics(?int $categoryId = null, ?int $typeId = null): array
    {
        $cacheKey = self::CACHE_KEY_STATISTICS . ":{$categoryId}:{$typeId}";

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($categoryId, $typeId) {
            $baseQuery = Product::query();

            if ($categoryId) {
                $baseQuery->byCategory($categoryId);
            }

            if ($typeId) {
                $baseQuery->byType($typeId);
            }

            return [
                'total' => (clone $baseQuery)->count(),
                'active' => (clone $baseQuery)->active()->count(),
                'inactive' => (clone $baseQuery)->inactive()->count(),
                'featured' => (clone $baseQuery)->featured()->count(),
                'with_price' => (clone $baseQuery)->where('price', '>', 0)->count(),
            ];
        });
    }

    public function getNextSortOrder(?int $typeId = null): int
    {
        $query = Product::query();

        if ($typeId) {
            $query->byType($typeId);
        }

        $maxSortOrder = $query->max('sort_order') ?? 0;
        return $maxSortOrder + 1;
    }

    public function generateCode(string $prefix = 'PRD'): string
    {
        return Product::generateCode($prefix);
    }

    public function create(array $data): Product
    {
        $this->validateProductTypeExists($data['product_type_id']);
        $this->validateCodeUniqueness($data['code'] ?? null);
        $this->validateNameUniqueness($data['name'], $data['product_type_id']);

        return DB::transaction(function () use ($data) {
            $sortOrder = !empty($data['sort_order'])
                ? (int) $data['sort_order']
                : $this->getNextSortOrder($data['product_type_id']);

            $code = !empty($data['code'])
                ? $data['code']
                : $this->generateCode();

            $isActive = isset($data['is_active'])
                ? filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN)
                : true;

            $isFeatured = isset($data['featured'])
                ? filter_var($data['featured'], FILTER_VALIDATE_BOOLEAN)
                : false;

            $product = Product::create([
                'product_type_id' => $data['product_type_id'],
                'code' => $code,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'] ?? 0,
                'unit' => $data['unit'] ?? 'unit',
                'minimum_order' => $data['minimum_order'] ?? 1,
                'specifications' => $data['specifications'] ?? null,
                'sort_order' => $sortOrder,
                'featured' => $isFeatured,
                'is_active' => $isActive,
            ]);

            $product->load([
                'productType:id,name,category_id',
                'productType.category:id,name',
            ]);

            $this->activityLogService->create(
                module: 'products',
                action: 'create',
                referenceId: $product->id,
                newData: $product->toArray()
            );

            broadcast(new ProductCreated($product));

            $this->clearAllListCache();

            return $product;
        });
    }

    public function update(int $id, array $data): Product
    {
        return DB::transaction(function () use ($id, $data) {
            $product = Product::findOrFail($id);

            if (isset($data['product_type_id']) && $data['product_type_id'] !== $product->product_type_id) {
                $this->validateProductTypeExists($data['product_type_id']);
            }

            if (isset($data['code']) && $data['code'] !== $product->code) {
                $this->validateCodeUniqueness($data['code'], $id);
            }

            $typeId = $data['product_type_id'] ?? $product->product_type_id;
            if (isset($data['name']) && $data['name'] !== $product->name) {
                $this->validateNameUniqueness($data['name'], $typeId, $id);
            }

            $oldData = $product->toArray();

            $updateData = [
                'product_type_id' => $data['product_type_id'] ?? $product->product_type_id,
                'code' => $data['code'] ?? $product->code,
                'name' => $data['name'] ?? $product->name,
                'description' => $data['description'] ?? $product->description,
                'price' => $data['price'] ?? $product->price,
                'unit' => $data['unit'] ?? $product->unit,
                'minimum_order' => $data['minimum_order'] ?? $product->minimum_order,
                'specifications' => $data['specifications'] ?? $product->specifications,
                'sort_order' => $data['sort_order'] ?? $product->sort_order,
            ];

            if (isset($data['is_active'])) {
                $updateData['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
            }

            if (isset($data['featured'])) {
                $updateData['featured'] = filter_var($data['featured'], FILTER_VALIDATE_BOOLEAN);
            }

            $product->update($updateData);

            $product = $product->fresh();
            $product->load([
                'productType:id,name,category_id',
                'productType.category:id,name',
            ]);

            $this->activityLogService->create(
                module: 'products',
                action: 'update',
                referenceId: $product->id,
                oldData: $oldData,
                newData: $product->toArray()
            );

            broadcast(new ProductUpdated($product));

            $this->clearProductCache($id);

            return $product;
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $product = Product::with([
                'productType:id,name,category_id',
            ])->findOrFail($id);

            $oldData = $product->toArray();
            $productName = $product->name;
            $productCode = $product->code;

            $this->activityLogService->create(
                module: 'products',
                action: 'delete',
                referenceId: $product->id,
                oldData: $oldData
            );

            broadcast(new ProductDeleted($id, $productName, $productCode));

            $product->delete();

            $this->clearProductCache($id);
        });
    }

    public function toggleActive(int $id): Product
    {
        return DB::transaction(function () use ($id) {
            $product = Product::findOrFail($id);

            $oldData = $product->toArray();

            $product->update([
                'is_active' => !$product->is_active,
            ]);

            $product = $product->fresh();
            $product->load([
                'productType:id,name,category_id',
                'productType.category:id,name',
            ]);

            $this->activityLogService->create(
                module: 'products',
                action: $product->is_active ? 'activate' : 'deactivate',
                referenceId: $product->id,
                oldData: $oldData,
                newData: $product->toArray()
            );

            broadcast(new ProductUpdated($product));

            $this->clearProductCache($id);

            return $product;
        });
    }

    public function toggleFeatured(int $id): Product
    {
        return DB::transaction(function () use ($id) {
            $product = Product::findOrFail($id);

            $oldData = $product->toArray();

            $product->update([
                'featured' => !$product->featured,
            ]);

            $product = $product->fresh();
            $product->load([
                'productType:id,name,category_id',
                'productType.category:id,name',
            ]);

            $this->activityLogService->create(
                module: 'products',
                action: $product->featured ? 'mark_featured' : 'remove_featured',
                referenceId: $product->id,
                oldData: $oldData,
                newData: $product->toArray()
            );

            broadcast(new ProductUpdated($product));

            $this->clearProductCache($id);

            return $product;
        });
    }

    private function validateProductTypeExists(int $typeId): void
    {
        $exists = ProductType::where('id', $typeId)->exists();

        if (!$exists) {
            throw ValidationException::withMessages([
                'product_type_id' => ['Jenis produk tidak ditemukan.']
            ]);
        }
    }

    private function validateCodeUniqueness(?string $code, ?int $excludeId = null): void
    {
        if (empty($code)) {
            return;
        }

        $query = Product::where('code', $code);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'code' => ['Kode produk sudah digunakan.']
            ]);
        }
    }

    private function validateNameUniqueness(string $name, int $typeId, ?int $excludeId = null): void
    {
        $query = Product::where('name', $name)
            ->where('product_type_id', $typeId);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'name' => ['Nama produk sudah digunakan di jenis produk ini.']
            ]);
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
            Cache::put(
                self::CACHE_KEY_LIST_REGISTRY,
                $registry,
                self::CACHE_TTL_REGISTRY
            );
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

    private function clearProductCache(int $productId): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . $productId);
        $this->clearAllListCache();
    }

    public function clearCache(): void
    {
        $this->clearAllListCache();
    }
}