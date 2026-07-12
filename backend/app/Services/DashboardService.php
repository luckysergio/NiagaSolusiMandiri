<?php

namespace App\Services;

use App\Models\User;
use App\Models\LoginLog;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
use App\Events\StatsUpdated;
use Illuminate\Support\Facades\Cache;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DashboardService
{
    /*
    |--------------------------------------------------------------------------
    | Cache Keys
    |--------------------------------------------------------------------------
    */

    private const CACHE_KEY_STATS = 'dashboard.stats';
    private const CACHE_KEY_PREFIX = 'dashboard.detail:';

    /*
    |--------------------------------------------------------------------------
    | Cache TTL
    |--------------------------------------------------------------------------
    | Stats: 60 detik (1 menit)
    | Detail: 300 detik (5 menit)
    | List: TIDAK DI-CACHE (real-time)
    */

    private const CACHE_TTL_STATS = 60;
    private const CACHE_TTL_DETAIL = 300;

    /*
    |--------------------------------------------------------------------------
    | Statistics (CACHED - 1 menit)
    |--------------------------------------------------------------------------
    */

    public function stats(): array
    {
        return Cache::remember(self::CACHE_KEY_STATS, self::CACHE_TTL_STATS, function () {
            return $this->calculateStats();
        });
    }

    private function calculateStats(): array
    {
        return [
            'users_total' => User::count(),
            'users_active' => User::active()->count(),
            'users_inactive' => User::inactive()->count(),
            'users_locked' => User::locked()->count(),

            'login_success_today' => LoginLog::where('status', 'success')
                ->whereDate('created_at', today())
                ->count(),
            'login_failed_today' => LoginLog::where('status', 'failed')
                ->whereDate('created_at', today())
                ->count(),

            'blocked_ips' => BlockedIp::currentlyBlocked()->count(),
            'security_alerts_open' => SecurityAlert::unresolved()->count(),
            'security_alerts_critical' => SecurityAlert::unresolved()
                ->critical()
                ->count(),

            'activity_today' => ActivityLog::whereDate('created_at', today())->count(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Broadcast Stats Update
    |--------------------------------------------------------------------------
    */

    public function broadcastStatsUpdate(): void
    {
        // Clear cache stats
        Cache::forget(self::CACHE_KEY_STATS);

        // Calculate fresh stats
        $stats = $this->calculateStats();

        // BroadcastNow
        broadcast(new StatsUpdated($stats));
    }

    /*
    |--------------------------------------------------------------------------
    | Login Logs (NO CACHE - Real-time)
    |--------------------------------------------------------------------------
    | ✅ FIX: Hapus Cache::remember() untuk list data
    | List data harus selalu fresh untuk real-time dashboard
    */

    public function loginLogs(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        // ✅ NO CACHE - langsung query database
        return LoginLog::query()
            ->select([
                'id',
                'user_id',
                'email',
                'ip_address',
                'user_agent',
                'device_id',
                'status',
                'message',
                'created_at',
                'updated_at',
            ])
            ->with('user:id,name,email,role_id')
            ->when(
                !empty($filters['email']),
                fn($q) => $q->where('email', 'like', "%{$filters['email']}%")
            )
            ->when(
                !empty($filters['status']),
                fn($q) => $q->where('status', $filters['status'])
            )
            ->when(
                !empty($filters['ip']),
                fn($q) => $q->where('ip_address', $filters['ip'])
            )
            ->when(
                !empty($filters['user_id']),
                fn($q) => $q->where('user_id', $filters['user_id'])
            )
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showLoginLog(int $id): LoginLog
    {
        // ✅ Detail masih di-cache (5 menit)
        $cacheKey = self::CACHE_KEY_PREFIX . "login_log:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return LoginLog::with('user:id,name,email,role_id')
                ->findOrFail($id);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Activity Logs (NO CACHE - Real-time)
    |--------------------------------------------------------------------------
    */

    public function activityLogs(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        // ✅ NO CACHE - langsung query database
        return ActivityLog::query()
            ->select([
                'id',
                'user_id',
                'module',
                'action',
                'reference_id',
                'ip_address',
                'user_agent',
                'created_at',
                'updated_at',
            ])
            ->with('user:id,name,email,role_id')
            ->when(
                !empty($filters['module']),
                fn($q) => $q->where('module', $filters['module'])
            )
            ->when(
                !empty($filters['action']),
                fn($q) => $q->where('action', $filters['action'])
            )
            ->when(
                !empty($filters['user_id']),
                fn($q) => $q->where('user_id', $filters['user_id'])
            )
            ->when(
                !empty($filters['reference_id']),
                fn($q) => $q->where('reference_id', $filters['reference_id'])
            )
            ->when(
                !empty($filters['date_from']),
                fn($q) => $q->whereDate('created_at', '>=', $filters['date_from'])
            )
            ->when(
                !empty($filters['date_to']),
                fn($q) => $q->whereDate('created_at', '<=', $filters['date_to'])
            )
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showActivityLog(int $id): ActivityLog
    {
        // ✅ Detail masih di-cache (5 menit)
        $cacheKey = self::CACHE_KEY_PREFIX . "activity_log:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return ActivityLog::with('user:id,name,email,role_id')
                ->findOrFail($id);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Blocked IPs (NO CACHE - Real-time)
    |--------------------------------------------------------------------------
    */

    public function blockedIps(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        // ✅ NO CACHE - langsung query database
        return BlockedIp::query()
            ->select([
                'id',
                'ip_address',
                'attempts',
                'is_active',
                'last_attempt_at',
                'blocked_until',
                'block_type',
                'reason',
                'created_at',
                'updated_at',
            ])
            ->when(
                !empty($filters['active_only']) && $filters['active_only'],
                fn($q) => $q->currentlyBlocked()
            )
            ->when(
                !empty($filters['ip']),
                fn($q) => $q->where('ip_address', 'like', "%{$filters['ip']}%")
            )
            ->when(
                !empty($filters['block_type']),
                fn($q) => $q->where('block_type', $filters['block_type'])
            )
            ->when(
                isset($filters['is_active']) && $filters['is_active'] !== '',
                fn($q) => $q->where('is_active', (bool) $filters['is_active'])
            )
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showBlockedIp(int $id): BlockedIp
    {
        // ✅ Detail masih di-cache (5 menit)
        $cacheKey = self::CACHE_KEY_PREFIX . "blocked_ip:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return BlockedIp::findOrFail($id);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Security Alerts (NO CACHE - Real-time)
    |--------------------------------------------------------------------------
    */

    public function securityAlerts(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        // ✅ NO CACHE - langsung query database
        return SecurityAlert::query()
            ->select([
                'id',
                'user_id',
                'type',
                'severity',
                'ip_address',
                'resolved',
                'resolved_at',
                'created_at',
                'updated_at',
            ])
            ->with('user:id,name,email,role_id')
            ->when(
                !empty($filters['unresolved_only']) && $filters['unresolved_only'],
                fn($q) => $q->unresolved()
            )
            ->when(
                !empty($filters['severity']),
                fn($q) => $q->where('severity', $filters['severity'])
            )
            ->when(
                !empty($filters['type']),
                fn($q) => $q->where('type', $filters['type'])
            )
            ->when(
                !empty($filters['user_id']),
                fn($q) => $q->where('user_id', $filters['user_id'])
            )
            ->when(
                isset($filters['resolved']) && $filters['resolved'] !== '',
                fn($q) => $q->where('resolved', (bool) $filters['resolved'])
            )
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showSecurityAlert(int $id): SecurityAlert
    {
        // ✅ Detail masih di-cache (5 menit)
        $cacheKey = self::CACHE_KEY_PREFIX . "security_alert:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return SecurityAlert::with('user:id,name,email,role_id')
                ->findOrFail($id);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Cache Clear Methods
    |--------------------------------------------------------------------------
    */

    public function clearStatsCache(): void
    {
        Cache::forget(self::CACHE_KEY_STATS);
    }

    public function clearDetailCache(string $type, int $id): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . "{$type}:{$id}");
    }

    public function clearAllCache(): void
    {
        Cache::forget(self::CACHE_KEY_STATS);
    }
}