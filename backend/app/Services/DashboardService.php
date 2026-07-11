<?php

namespace App\Services;

use App\Models\User;
use App\Models\LoginLog;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function stats(): array
    {
        return Cache::remember(
            'dashboard_stats',
            now()->addSeconds(30),
            function () {

                return [

                    'users_total' => User::count(),

                    'users_active' => User::where(
                        'is_active',
                        true
                    )->count(),

                    'users_inactive' => User::where(
                        'is_active',
                        false
                    )->count(),

                    'login_success_today' => LoginLog::where(
                        'status',
                        'success'
                    )
                        ->whereDate(
                            'created_at',
                            today()
                        )
                        ->count(),

                    'login_failed_today' => LoginLog::where(
                        'status',
                        'failed'
                    )
                        ->whereDate(
                            'created_at',
                            today()
                        )
                        ->count(),

                    'blocked_ips' => BlockedIp::currentlyBlocked()
                        ->count(),

                    'security_alerts_open' => SecurityAlert::where(
                        'resolved',
                        false
                    )->count(),

                    'activity_today' => ActivityLog::whereDate(
                        'created_at',
                        today()
                    )->count(),
                ];
            }
        );
    }

    public function loginLogs(
        array $filters = [],
        int $perPage = 20
    ) {
        return LoginLog::query()
            ->with('user:id,name,email,role_id')
            ->when(
                !empty($filters['email']),
                fn ($q) => $q->where(
                    'email',
                    'like',
                    '%' . $filters['email'] . '%'
                )
            )
            ->when(
                !empty($filters['status']),
                fn ($q) => $q->where(
                    'status',
                    $filters['status']
                )
            )
            ->when(
                !empty($filters['ip']),
                fn ($q) => $q->where(
                    'ip_address',
                    $filters['ip']
                )
            )
            ->latest()
            ->paginate(
                min($perPage, 100)
            );
    }

    public function activityLogs(
        array $filters = [],
        int $perPage = 20
    ) {
        return ActivityLog::query()
            ->with('user:id,name,email,role_id')
            ->when(
                !empty($filters['module']),
                fn ($q) => $q->where(
                    'module',
                    $filters['module']
                )
            )
            ->when(
                !empty($filters['action']),
                fn ($q) => $q->where(
                    'action',
                    $filters['action']
                )
            )
            ->when(
                !empty($filters['user_id']),
                fn ($q) => $q->where(
                    'user_id',
                    $filters['user_id']
                )
            )
            ->latest()
            ->paginate(
                min($perPage, 100)
            );
    }

    public function blockedIps(
        bool $activeOnly = false,
        int $perPage = 20
    ) {
        return BlockedIp::query()
            ->when(
                $activeOnly,
                fn ($q) => $q->currentlyBlocked()
            )
            ->latest()
            ->paginate(
                min($perPage, 100)
            );
    }

    public function securityAlerts(
        bool $unresolvedOnly = false,
        int $perPage = 20
    ) {
        return SecurityAlert::query()
            ->with('user:id,name,email')
            ->when(
                $unresolvedOnly,
                fn ($q) => $q->where(
                    'resolved',
                    false
                )
            )
            ->latest()
            ->paginate(
                min($perPage, 100)
            );
    }
}
