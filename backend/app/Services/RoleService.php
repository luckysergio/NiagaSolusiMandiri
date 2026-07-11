<?php

namespace App\Services;

use App\Models\Role;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class RoleService
{
    private const CACHE_KEY_ROLES_LIST = 'roles.list';
    private const CACHE_KEY_LIST_REGISTRY = 'roles.list.registry';
    private const CACHE_KEY_ROLE_PREFIX = 'role:';
    private const CACHE_KEY_STATISTICS = 'roles.statistics';
    private const CACHE_KEY_DROPDOWN = 'roles.dropdown';

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
            return Role::query()
                ->select(['id', 'name', 'display_name', 'created_at', 'updated_at'])
                ->withUserCount()
                ->search($filters['search'] ?? null)
                ->latest()
                ->paginate(min($perPage, 100));
        });
    }

    public function find(int $id): Role
    {
        $cacheKey = self::CACHE_KEY_ROLE_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_STATIC, function () use ($id) {
            return Role::withUserCount()->findOrFail($id);
        });
    }

    public function getRolesForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL_STATIC, function () {
            return Role::select('id', 'name', 'display_name')
                ->orderBy('display_name')
                ->get()
                ->toArray();
        });
    }

    public function getStatistics(): array
    {
        return Cache::remember(self::CACHE_KEY_STATISTICS, self::CACHE_TTL_LIST, function () {
            return [
                'total' => Role::count(),
                'with_users' => Role::has('users')->count(),
                'without_users' => Role::doesntHave('users')->count(),
            ];
        });
    }

    public function create(array $data): Role
    {
        $this->validateNameUniqueness($data['name']);

        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'name' => $data['name'],
                'display_name' => $data['display_name'],
            ]);

            $role->loadCount('users');

            $this->logActivity(
                action: 'create',
                referenceId: $role->id,
                newData: $role->toArray()
            );

            $this->clearAllListCache();

            return $role;
        });
    }

    public function update(int $id, array $data): Role
    {
        return DB::transaction(function () use ($id, $data) {
            $role = Role::findOrFail($id);

            if (isset($data['name']) && $data['name'] !== $role->name) {
                $this->validateNameUniqueness($data['name'], $id);
            }

            $oldData = $role->toArray();

            $role->update([
                'name' => $data['name'],
                'display_name' => $data['display_name'],
            ]);

            $role = $role->fresh();
            $role->loadCount('users');

            $this->logActivity(
                action: 'update',
                referenceId: $role->id,
                oldData: $oldData,
                newData: $role->toArray()
            );

            $this->clearRoleAndListCache($id);

            return $role;
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $role = Role::findOrFail($id);

            $userCount = $role->users()->count();

            if ($userCount > 0) {
                throw ValidationException::withMessages([
                    'id' => ["Role tidak dapat dihapus karena masih digunakan oleh {$userCount} user."]
                ]);
            }

            if ($role->users()->exists()) {
                throw ValidationException::withMessages([
                    'id' => ['Role masih memiliki user terkait.']
                ]);
            }

            $oldData = $role->toArray();

            $this->logActivity(
                action: 'delete',
                referenceId: $role->id,
                oldData: $oldData
            );

            $role->delete();

            $this->clearRoleAndListCache($id);
        });
    }

    private function logActivity(
        string $action,
        int $referenceId,
        ?array $oldData = null,
        ?array $newData = null
    ): void {
        try {
            ActivityLog::create([
                'user_id' => Auth::id(),
                'module' => 'roles',
                'action' => $action,
                'reference_id' => $referenceId,
                'old_data' => $oldData,
                'new_data' => $newData,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private function validateNameUniqueness(string $name, ?int $excludeId = null): void
    {
        $query = Role::where('name', $name);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'name' => ['Nama role sudah digunakan.']
            ]);
        }
    }

    private function buildCacheKey(array $filters, int $perPage): string
    {
        $filterHash = md5(json_encode($filters));
        return sprintf('%s:%s:%d', self::CACHE_KEY_ROLES_LIST, $filterHash, $perPage);
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

        Cache::forget(self::CACHE_KEY_STATISTICS);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
    }

    private function clearRoleAndListCache(int $roleId): void
    {
        Cache::forget(self::CACHE_KEY_ROLE_PREFIX . $roleId);

        $this->clearAllListCache();
    }

    public function clearAllCache(): void
    {
        $this->clearAllListCache();
    }
}