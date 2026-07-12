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
    private const CACHE_KEY_STATS = 'dashboard.stats';
    private const CACHE_KEY_LOGIN_LOGS = 'dashboard.login_logs';
    private const CACHE_KEY_ACTIVITY_LOGS = 'dashboard.activity_logs';
    private const CACHE_KEY_BLOCKED_IPS = 'dashboard.blocked_ips';
    private const CACHE_KEY_SECURITY_ALERTS = 'dashboard.security_alerts';
    private const CACHE_KEY_LIST_REGISTRY = 'dashboard.list.registry';
    private const CACHE_KEY_PREFIX = 'dashboard.detail:';
    private const CACHE_TTL_STATS = 60;        // 1 menit
    private const CACHE_TTL_LIST = 300;        // 5 menit
    private const CACHE_TTL_DETAIL = 300;      // 5 menit
    private const CACHE_TTL_REGISTRY = 86400;  // 24 jam


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

    public function broadcastStatsUpdate(): void
    {
        Cache::forget(self::CACHE_KEY_STATS);

        $stats = $this->calculateStats();

        broadcast(new StatsUpdated($stats));
    }

    public function loginLogs(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey(self::CACHE_KEY_LOGIN_LOGS, $filters, $perPage);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
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
        });
    }

    public function showLoginLog(int $id): LoginLog
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "login_log:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return LoginLog::with('user:id,name,email,role_id')
                ->findOrFail($id);
        });
    }

    public function activityLogs(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey(self::CACHE_KEY_ACTIVITY_LOGS, $filters, $perPage);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
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
        });
    }

    public function showActivityLog(int $id): ActivityLog
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "activity_log:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return ActivityLog::with('user:id,name,email,role_id')
                ->findOrFail($id);
        });
    }

    public function blockedIps(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey(self::CACHE_KEY_BLOCKED_IPS, $filters, $perPage);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
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
        });
    }

    public function showBlockedIp(int $id): BlockedIp
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "blocked_ip:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return BlockedIp::findOrFail($id);
        });
    }

    public function securityAlerts(
        array $filters = [],
        int $perPage = 20
    ): LengthAwarePaginator {

        $cacheKey = $this->buildCacheKey(self::CACHE_KEY_SECURITY_ALERTS, $filters, $perPage);
        $this->registerListCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL_LIST, function () use ($filters, $perPage) {
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
        });
    }

    public function showSecurityAlert(int $id): SecurityAlert
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "security_alert:{$id}";

        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return SecurityAlert::with('user:id,name,email,role_id')
                ->findOrFail($id);
        });
    }

    private function buildCacheKey(string $prefix, array $filters, int $perPage): string
    {
        $filterHash = md5(json_encode($filters));
        return sprintf('%s:%s:%d', $prefix, $filterHash, $perPage);
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

    public function clearStatsCache(): void
    {
        Cache::forget(self::CACHE_KEY_STATS);
    }

    public function clearAllListCache(): void
    {
        $registry = $this->getListCacheRegistry();
        foreach ($registry as $cacheKey) {
            Cache::forget($cacheKey);
        }

        Cache::forget(self::CACHE_KEY_LIST_REGISTRY);
        Cache::forget(self::CACHE_KEY_STATS);
    }

    public function clearDetailCache(string $type, int $id): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . "{$type}:{$id}");
    }

    public function clearAllCache(): void
    {
        $this->clearAllListCache();
    }
}