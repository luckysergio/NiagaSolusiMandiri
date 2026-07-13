<?php

namespace App\Services;

use App\Models\ProductCategory;
use App\Events\ProductCategoryCreated;
use App\Events\ProductCategoryUpdated;
use App\Events\ProductCategoryDeleted;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductCategoryService
{
    /*
    |--------------------------------------------------------------------------
    | Constructor
    |--------------------------------------------------------------------------
    */

    public function __construct(
        protected ActivityLogService $activityLogService
    ) {}

    /*
    |--------------------------------------------------------------------------
    | Cache Keys
    |--------------------------------------------------------------------------
    */

    private const CACHE_KEY_LIST = 'product_categories.list';
    private const CACHE_KEY_LIST_REGISTRY = 'product_categories.list.registry';
    private const CACHE_KEY_DROPDOWN = 'product_categories.dropdown';
    private const CACHE_KEY_STATISTICS = 'product_categories.statistics';
    private const CACHE_KEY_PREFIX = 'product_category:';

    /*
    |--------------------------------------------------------------------------
    | Cache TTL
    |--------------------------------------------------------------------------
    */

    private const CACHE_TTL_LIST = 300;
    private const CACHE_TTL_REGISTRY = 86400;
    private const CACHE_TTL_STATIC = 3600;

    /*
    |--------------------------------------------------------------------------
    | Paginate
    |--------------------------------------------------------------------------
    */

    public function paginate(
        array $filters = [],
        int $perPage = 10
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey($filters, $perPage);

        // ✅ Register cache key ke registry
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
            return ProductCategory::query()
                ->select([
                    'id',
                    'name',
                    'slug',
                    'description',
                    'sort_order',
                    'is_active',
                    'created_at',
                    'updated_at',
                ])
                ->withCount('productTypes')
                ->search($filters['search'] ?? null)
                ->when(
                    isset($filters['is_active']) && $filters['is_active'] !== '',
                    fn($q) => $q->where('is_active', (bool) $filters['is_active'])
                )
                ->ordered()
                ->paginate(min($perPage, 100));
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Find
    |--------------------------------------------------------------------------
    */

    public function find(int $id): ProductCategory
    {
        $cacheKey = self::CACHE_KEY_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($id) {
            return ProductCategory::withCount('productTypes')
                ->findOrFail($id);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Dropdown
    |--------------------------------------------------------------------------
    */

    public function getCategoriesForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL_STATIC, function () {
            return ProductCategory::select('id', 'name', 'slug')
                ->active()
                ->ordered()
                ->get()
                ->toArray();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    public function getStatistics(): array
    {
        return Cache::remember(self::CACHE_KEY_STATISTICS, self::CACHE_TTL_LIST, function () {
            return [
                'total' => ProductCategory::count(),
                'active' => ProductCategory::active()->count(),
                'inactive' => ProductCategory::inactive()->count(),
                'with_types' => ProductCategory::has('productTypes')->count(),
                'without_types' => ProductCategory::doesntHave('productTypes')->count(),
            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    public function create(array $data): ProductCategory
    {
        $this->validateNameUniqueness($data['name']);

        return DB::transaction(function () use ($data) {
            $category = ProductCategory::create([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'description' => $data['description'] ?? null,
                'sort_order' => $data['sort_order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            $category->loadCount('productTypes');

            $this->activityLogService->create(
                module: 'product_categories',
                action: 'create',
                referenceId: $category->id,
                newData: $category->toArray()
            );

            broadcast(new ProductCategoryCreated($category));

            // ✅ Clear semua cache list
            $this->clearAllListCache();

            return $category;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(int $id, array $data): ProductCategory
    {
        return DB::transaction(function () use ($id, $data) {
            $category = ProductCategory::findOrFail($id);

            if (isset($data['name']) && $data['name'] !== $category->name) {
                $this->validateNameUniqueness($data['name'], $id);
            }

            $oldData = $category->toArray();

            $category->update([
                'name' => $data['name'] ?? $category->name,
                'slug' => $data['slug'] ?? ($category->isDirty('name') ? Str::slug($data['name']) : $category->slug),
                'description' => $data['description'] ?? $category->description,
                'sort_order' => $data['sort_order'] ?? $category->sort_order,
                'is_active' => $data['is_active'] ?? $category->is_active,
            ]);

            $category = $category->fresh();
            $category->loadCount('productTypes');

            $this->activityLogService->create(
                module: 'product_categories',
                action: 'update',
                referenceId: $category->id,
                oldData: $oldData,
                newData: $category->toArray()
            );

            broadcast(new ProductCategoryUpdated($category));

            // ✅ Clear cache
            $this->clearCategoryCache($id);

            return $category;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $category = ProductCategory::findOrFail($id);

            $typeCount = $category->productTypes()->count();

            if ($typeCount > 0) {
                throw ValidationException::withMessages([
                    'id' => ["Kategori tidak dapat dihapus karena masih memiliki {$typeCount} jenis produk."]
                ]);
            }

            $oldData = $category->toArray();
            $categoryName = $category->name;

            $this->activityLogService->create(
                module: 'product_categories',
                action: 'delete',
                referenceId: $category->id,
                oldData: $oldData
            );

            broadcast(new ProductCategoryDeleted($id, $categoryName));

            $category->delete();

            // ✅ Clear cache
            $this->clearCategoryCache($id);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Toggle Active
    |--------------------------------------------------------------------------
    */

    public function toggleActive(int $id): ProductCategory
    {
        return DB::transaction(function () use ($id) {
            $category = ProductCategory::findOrFail($id);

            $oldData = $category->toArray();

            $category->update([
                'is_active' => !$category->is_active,
            ]);

            $category = $category->fresh();
            $category->loadCount('productTypes');

            $this->activityLogService->create(
                module: 'product_categories',
                action: $category->is_active ? 'activate' : 'deactivate',
                referenceId: $category->id,
                oldData: $oldData,
                newData: $category->toArray()
            );

            broadcast(new ProductCategoryUpdated($category));

            // ✅ Clear cache
            $this->clearCategoryCache($id);

            return $category;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    private function validateNameUniqueness(string $name, ?int $excludeId = null): void
    {
        $query = ProductCategory::where('name', $name);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'name' => ['Nama kategori sudah digunakan.']
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Cache Registry System
    |--------------------------------------------------------------------------
    | ✅ FIX: Pakai registry pattern seperti UserService
    | Semua cache key yang dibuat akan di-register, lalu di-clear semua
    */

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

    private function clearCategoryCache(int $categoryId): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . $categoryId);
        $this->clearAllListCache();
    }

    public function clearCache(): void
    {
        $this->clearAllListCache();
    }
}