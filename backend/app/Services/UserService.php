<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class UserService
{
    private const CACHE_KEY_ROLES = 'roles.all';
    private const CACHE_KEY_USERS_LIST = 'users.list';
    private const CACHE_KEY_LIST_REGISTRY = 'users.list.registry';
    private const CACHE_KEY_USER_PREFIX = 'user:';
    private const CACHE_KEY_STATISTICS = 'users.statistics';

    private const CACHE_TTL_ROLES = 3600;
    private const CACHE_TTL_USERS = 300;
    private const CACHE_TTL_REGISTRY = 86400;

    private const SENSITIVE_FIELDS = [
        'password',
        'remember_token',
        'locked_until',
        'force_logout_at',
    ];

    public function paginate(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey($filters, $perPage);

        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_USERS, function () use ($filters, $perPage) {
            return User::query()
                ->select([
                    'id',
                    'role_id',
                    'name',
                    'email',
                    'is_active',
                    'failed_login_attempts',
                    'locked_until',
                    'last_login_at',
                    'last_login_ip',
                    'created_at',
                    'updated_at',
                ])
                ->with('role:id,name,display_name')
                ->when(
                    !empty($filters['search']),
                    fn($q) => $q->where(function ($query) use ($filters) {
                        $search = $filters['search'];
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                )
                ->when(
                    !empty($filters['role_id']),
                    fn($q) => $q->where('role_id', $filters['role_id'])
                )
                ->when(
                    isset($filters['is_active']) && $filters['is_active'] !== '',
                    fn($q) => $q->where('is_active', (bool) $filters['is_active'])
                )
                ->when(
                    !empty($filters['status']) && $filters['status'] === 'locked',
                    fn($q) => $q->locked()
                )
                ->when(
                    !empty($filters['status']) && $filters['status'] === 'active',
                    fn($q) => $q->active()->notLocked()
                )
                ->latest()
                ->paginate(min($perPage, 100));
        });
    }

    public function find(int $id): User
    {
        $cacheKey = self::CACHE_KEY_USER_PREFIX . $id;

        return Cache::remember($cacheKey, self::CACHE_TTL_USERS, function () use ($id) {
            return User::with('role:id,name,display_name')
                ->findOrFail($id);
        });
    }

    public function create(array $data): User
    {
        $this->validateEmailUniqueness($data['email']);

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'role_id' => $data['role_id'],
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $user->load('role:id,name,display_name');

            $this->logActivity(
                action: 'create',
                referenceId: $user->id,
                newData: $this->sanitizeForLog($user->toArray())
            );

            $this->clearAllListCache();

            return $user;
        });
    }

    public function update(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::findOrFail($id);

            if (isset($data['email']) && $data['email'] !== $user->email) {
                $this->validateEmailUniqueness($data['email'], $id);
            }

            $oldData = $this->sanitizeForLog($user->toArray());

            $payload = [
                'role_id' => $data['role_id'],
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (!empty($data['password'])) {
                $payload['password'] = $data['password'];
            }

            $user->update($payload);
            $user->load('role:id,name,display_name');

            $this->logActivity(
                action: 'update',
                referenceId: $user->id,
                oldData: $oldData,
                newData: $this->sanitizeForLog($user->fresh()->toArray())
            );

            $this->clearUserAndListCache($id);

            return $user;
        });
    }

    public function delete(int $id): void
    {
        $this->preventSelfDeletion($id);

        DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            $this->preventSuperAdminDeletion($user);

            $oldData = $this->sanitizeForLog($user->toArray());

            $this->logActivity(
                action: 'delete',
                referenceId: $user->id,
                oldData: $oldData
            );

            $user->delete();

            $this->clearUserAndListCache($id);
        });
    }

    public function activate(int $id): User
    {
        return DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            $oldData = $this->sanitizeForLog($user->toArray());

            $user->update(['is_active' => true]);
            $user->load('role:id,name,display_name');

            $this->logActivity(
                action: 'activate',
                referenceId: $user->id,
                oldData: $oldData,
                newData: $this->sanitizeForLog($user->fresh()->toArray())
            );

            $this->clearUserAndListCache($id);

            return $user;
        });
    }

    public function deactivate(int $id): User
    {
        return DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            $this->preventSelfDeactivation($id);

            $oldData = $this->sanitizeForLog($user->toArray());

            $user->update(['is_active' => false]);
            $user->load('role:id,name,display_name');

            $this->logActivity(
                action: 'deactivate',
                referenceId: $user->id,
                oldData: $oldData,
                newData: $this->sanitizeForLog($user->fresh()->toArray())
            );

            $this->clearUserAndListCache($id);

            return $user;
        });
    }

    public function forceLogout(int $id): User
    {
        return DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            $oldData = $this->sanitizeForLog($user->toArray());

            $user->forceLogout();
            $user->load('role:id,name,display_name');

            $this->logActivity(
                action: 'force_logout',
                referenceId: $user->id,
                oldData: $oldData,
                newData: $this->sanitizeForLog($user->fresh()->toArray())
            );

            $this->clearUserAndListCache($id);

            return $user;
        });
    }

    public function resetLock(int $id): User
    {
        return DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            $oldData = $this->sanitizeForLog($user->toArray());

            $user->unlock();
            $user->load('role:id,name,display_name');

            $this->logActivity(
                action: 'reset_lock',
                referenceId: $user->id,
                oldData: $oldData,
                newData: $this->sanitizeForLog($user->fresh()->toArray())
            );

            $this->clearUserAndListCache($id);

            return $user;
        });
    }

    public function getRolesForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_ROLES, self::CACHE_TTL_ROLES, function () {
            return Role::select('id', 'name', 'display_name')
                ->orderBy('display_name')
                ->get()
                ->toArray();
        });
    }

    public function getStatistics(): array
    {
        return Cache::remember(self::CACHE_KEY_STATISTICS, self::CACHE_TTL_USERS, function () {
            return [
                'total' => User::count(),
                'active' => User::active()->count(),
                'inactive' => User::inactive()->count(),
                'locked' => User::locked()->count(),
            ];
        });
    }

    private function logActivity(
        string $action,
        int $referenceId,
        ?array $oldData = null,
        ?array $newData = null
    ): void {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'module' => 'users',
            'action' => $action,
            'reference_id' => $referenceId,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    private function sanitizeForLog(array $data): array
    {
        foreach (self::SENSITIVE_FIELDS as $field) {
            unset($data[$field]);
        }
        return $data;
    }

    private function validateEmailUniqueness(string $email, ?int $excludeId = null): void
    {
        $query = User::where('email', $email);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'email' => ['Email sudah digunakan.']
            ]);
        }
    }

    private function preventSelfDeletion(int $id): void
    {
        if (Auth::id() === $id) {
            throw ValidationException::withMessages([
                'id' => ['Anda tidak dapat menghapus akun sendiri.']
            ]);
        }
    }

    private function preventSelfDeactivation(int $id): void
    {
        if (Auth::id() === $id) {
            throw ValidationException::withMessages([
                'id' => ['Anda tidak dapat menonaktifkan akun sendiri.']
            ]);
        }
    }

    private function preventSuperAdminDeletion(User $user): void
    {
        if ($user->isSuperAdmin()) {
            throw ValidationException::withMessages([
                'id' => ['Tidak dapat menghapus akun super admin.']
            ]);
        }
    }

    private function buildCacheKey(array $filters, int $perPage): string
    {
        $filterHash = md5(json_encode($filters));
        return sprintf('%s:%s:%d', self::CACHE_KEY_USERS_LIST, $filterHash, $perPage);
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
    }

    private function clearUserAndListCache(int $userId): void
    {
        Cache::forget(self::CACHE_KEY_USER_PREFIX . $userId);

        $this->clearAllListCache();
    }

    public function clearAllCache(): void
    {
        Cache::forget(self::CACHE_KEY_ROLES);
        $this->clearAllListCache();
    }
}