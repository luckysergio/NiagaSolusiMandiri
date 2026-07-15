<?php

namespace App\Services;

use App\Models\ProductType;
use App\Events\ProductTypeCreated;
use App\Events\ProductTypeUpdated;
use App\Events\ProductTypeDeleted;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductTypeService
{
    public function __construct(
        protected ActivityLogService $activityLogService,
        protected ImageService $imageService
    ) {}

    private const CACHE_KEY_LIST = 'product_types.list';
    private const CACHE_KEY_LIST_REGISTRY = 'product_types.list.registry';
    private const CACHE_KEY_DROPDOWN = 'product_types.dropdown';
    private const CACHE_KEY_STATISTICS = 'product_types.statistics';
    private const CACHE_KEY_PREFIX = 'product_type:';
    private const IMAGE_FOLDER = 'product-types';
    private const CACHE_TTL_LIST = 300;
    private const CACHE_TTL_REGISTRY = 86400;
    private const CACHE_TTL_STATIC = 3600;

    public function paginate(
        array $filters = [],
        int $perPage = 12,
        int $page = 1
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey($filters, $perPage, $page);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage, $page) {
            return ProductType::query()
                ->select([
                    'id',
                    'category_id',
                    'name',
                    'slug',
                    'description',
                    'image',
                    'sort_order',
                    'is_active',
                    'created_at',
                    'updated_at',
                ])
                ->with([
                    'category:id,name',
                ])
                ->withCount('products')
                ->byCategory((int) ($filters['category_id'] ?? 0) ?: null)
                ->search($filters['search'] ?? null)
                ->when(
                    isset($filters['is_active']) && $filters['is_active'] !== '',
                    fn($q) => $q->where('is_active', (bool) $filters['is_active'])
                )
                ->ordered()
                ->paginate($perPage, ['*'], 'page', $page);
        });
    }

    public function find(int $id): ProductType
    {
        $cacheKey = self::CACHE_KEY_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($id) {
            return ProductType::with(['category:id,name', 'products'])
                ->withCount('products')
                ->findOrFail($id);
        });
    }

    public function getTypesForDropdown(?int $categoryId = null): array
    {
        $cacheKey = self::CACHE_KEY_DROPDOWN . ($categoryId ? ":{$categoryId}" : '');

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($categoryId) {
            $query = ProductType::select('id', 'category_id', 'name', 'slug')
                ->with('category:id,name')
                ->active();

            if ($categoryId) {
                $query->byCategory($categoryId);
            }

            return $query->ordered()->get()->toArray();
        });
    }

    public function getStatistics(?int $categoryId = null): array
    {
        $cacheKey = self::CACHE_KEY_STATISTICS . ($categoryId ? ":{$categoryId}" : '');

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($categoryId) {
            $baseQuery = ProductType::query();

            if ($categoryId) {
                $baseQuery->byCategory($categoryId);
            }

            return [
                'total' => (clone $baseQuery)->count(),
                'active' => (clone $baseQuery)->active()->count(),
                'inactive' => (clone $baseQuery)->inactive()->count(),
                'with_products' => (clone $baseQuery)->has('products')->count(),
                'without_products' => (clone $baseQuery)->doesntHave('products')->count(),
            ];
        });
    }

    public function getNextSortOrder(?int $categoryId = null): int
    {
        $query = ProductType::query();

        if ($categoryId) {
            $query->byCategory($categoryId);
        }

        $maxSortOrder = $query->max('sort_order') ?? 0;
        return $maxSortOrder + 1;
    }

    public function create(array $data, ?UploadedFile $image = null): ProductType
    {
        $this->validateCategoryExists($data['category_id']);
        $this->validateNameUniqueness($data['name'], $data['category_id']);

        return DB::transaction(function () use ($data, $image) {
            $sortOrder = !empty($data['sort_order'])
                ? (int) $data['sort_order']
                : $this->getNextSortOrder($data['category_id']);

            $imagePath = null;
            if ($image) {
                $imagePath = $this->imageService->uploadAndCompress($image, self::IMAGE_FOLDER);
            }

            $productType = ProductType::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'description' => $data['description'] ?? null,
                'image' => $imagePath,
                'sort_order' => $sortOrder,
                'is_active' => $data['is_active'] ?? true,
            ]);

            $productType->load('category:id,name');
            $productType->loadCount('products');

            $this->activityLogService->create(
                module: 'product_types',
                action: 'create',
                referenceId: $productType->id,
                newData: $productType->toArray()
            );

            broadcast(new ProductTypeCreated($productType));

            $this->clearAllListCache();

            return $productType;
        });
    }

    public function update(int $id, array $data, ?UploadedFile $image = null): ProductType
    {
        return DB::transaction(function () use ($id, $data, $image) {
            $productType = ProductType::findOrFail($id);

            if (isset($data['category_id']) && $data['category_id'] !== $productType->category_id) {
                $this->validateCategoryExists($data['category_id']);
            }

            $categoryId = $data['category_id'] ?? $productType->category_id;
            if (isset($data['name']) && $data['name'] !== $productType->name) {
                $this->validateNameUniqueness($data['name'], $categoryId, $id);
            }

            $oldData = $productType->toArray();
            $oldImagePath = $productType->image;

            $imagePath = $oldImagePath;
            if ($image) {
                $imagePath = $this->imageService->replace(
                    $image,
                    self::IMAGE_FOLDER,
                    $oldImagePath
                );
            }

            $productType->update([
                'category_id' => $data['category_id'] ?? $productType->category_id,
                'name' => $data['name'] ?? $productType->name,
                'slug' => $data['slug'] ?? ($productType->isDirty('name') ? Str::slug($data['name']) : $productType->slug),
                'description' => $data['description'] ?? $productType->description,
                'image' => $imagePath,
                'sort_order' => $data['sort_order'] ?? $productType->sort_order,
                'is_active' => $data['is_active'] ?? $productType->is_active,
            ]);

            $productType = $productType->fresh();
            $productType->load('category:id,name');
            $productType->loadCount('products');

            $this->activityLogService->create(
                module: 'product_types',
                action: 'update',
                referenceId: $productType->id,
                oldData: $oldData,
                newData: $productType->toArray()
            );

            broadcast(new ProductTypeUpdated($productType));

            $this->clearProductTypeCache($id);

            return $productType;
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $productType = ProductType::with('category:id,name')->findOrFail($id);

            $productCount = $productType->products()->count();

            if ($productCount > 0) {
                throw ValidationException::withMessages([
                    'id' => ["Jenis produk tidak dapat dihapus karena masih memiliki {$productCount} produk."]
                ]);
            }

            $oldData = $productType->toArray();
            $productTypeName = $productType->name;
            $categoryName = $productType->category?->name;
            $imagePath = $productType->image;

            $this->activityLogService->create(
                module: 'product_types',
                action: 'delete',
                referenceId: $productType->id,
                oldData: $oldData
            );

            broadcast(new ProductTypeDeleted($id, $productTypeName, $categoryName));

            if ($imagePath) {
                $this->imageService->delete($imagePath);
            }

            $productType->delete();

            $this->clearProductTypeCache($id);
        });
    }

    public function toggleActive(int $id): ProductType
    {
        return DB::transaction(function () use ($id) {
            $productType = ProductType::findOrFail($id);

            $oldData = $productType->toArray();

            $productType->update([
                'is_active' => !$productType->is_active,
            ]);

            $productType = $productType->fresh();
            $productType->load('category:id,name');
            $productType->loadCount('products');

            $this->activityLogService->create(
                module: 'product_types',
                action: $productType->is_active ? 'activate' : 'deactivate',
                referenceId: $productType->id,
                oldData: $oldData,
                newData: $productType->toArray()
            );

            broadcast(new ProductTypeUpdated($productType));

            $this->clearProductTypeCache($id);

            return $productType;
        });
    }

    private function validateCategoryExists(int $categoryId): void
    {
        $exists = \App\Models\ProductCategory::where('id', $categoryId)->exists();

        if (!$exists) {
            throw ValidationException::withMessages([
                'category_id' => ['Kategori tidak ditemukan.']
            ]);
        }
    }

    private function validateNameUniqueness(string $name, int $categoryId, ?int $excludeId = null): void
    {
        $query = ProductType::where('name', $name)
            ->where('category_id', $categoryId);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'name' => ['Nama jenis produk sudah digunakan di kategori ini.']
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

        $this->clearCacheByPattern(self::CACHE_KEY_DROPDOWN . '*');
        $this->clearCacheByPattern(self::CACHE_KEY_STATISTICS . '*');
    }

    private function clearProductTypeCache(int $productTypeId): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . $productTypeId);
        $this->clearAllListCache();
    }

    private function clearCacheByPattern(string $pattern): void
    {
        $registry = $this->getListCacheRegistry();
        foreach ($registry as $cacheKey) {
            if (str_contains($cacheKey, $pattern)) {
                Cache::forget($cacheKey);
            }
        }
    }

    public function clearCache(): void
    {
        $this->clearAllListCache();
    }
}