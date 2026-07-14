<?php

namespace App\Services;

use App\Models\User;
use App\Models\LoginLog;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Enums\TransactionStatus;
use App\Events\StatsUpdated;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DashboardService
{
    private const CACHE_KEY_STATS = 'dashboard.stats';
    private const CACHE_KEY_TRANSACTION_STATS = 'dashboard.transaction_stats';
    private const CACHE_KEY_TRANSACTION_CHART = 'dashboard.transaction_chart';
    private const CACHE_KEY_TOP_PRODUCTS = 'dashboard.top_products';
    private const CACHE_KEY_RECENT_TRANSACTIONS = 'dashboard.recent_transactions';
    private const CACHE_KEY_PREFIX = 'dashboard.detail:';

    private const CACHE_TTL_STATS = 60;
    private const CACHE_TTL_TRANSACTION = 120;
    private const CACHE_TTL_CHART = 300;
    private const CACHE_TTL_DETAIL = 300;

    public function stats(): array
    {
        return Cache::remember(self::CACHE_KEY_STATS, self::CACHE_TTL_STATS, function () {
            return array_merge(
                $this->calculateUserStats(),
                $this->calculateTransactionStats()
            );
        });
    }

    private function calculateUserStats(): array
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

    private function calculateTransactionStats(): array
    {
        $today = today();
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $totalRevenue = (float) Transaction::sum('total_transaction');
        $totalExpense = (float) Transaction::sum('total_expense');
        $totalProfit = $totalRevenue - $totalExpense;

        $revenueThisMonth = (float) Transaction::where('transaction_date', '>=', $thisMonth)
            ->sum('total_transaction');
        $expenseThisMonth = (float) Transaction::where('transaction_date', '>=', $thisMonth)
            ->sum('total_expense');
        $profitThisMonth = $revenueThisMonth - $expenseThisMonth;

        $revenueLastMonth = (float) Transaction::whereBetween('transaction_date', [
                $lastMonth,
                $thisMonth->copy()->subDay()
            ])
            ->sum('total_transaction');

        $transactionCountThisMonth = Transaction::where('transaction_date', '>=', $thisMonth)->count();
        $transactionCountLastMonth = Transaction::whereBetween('transaction_date', [
                $lastMonth,
                $thisMonth->copy()->subDay()
            ])
            ->count();

        $revenueChange = $revenueLastMonth > 0 
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 2) 
            : 0;
        $transactionChange = $transactionCountLastMonth > 0 
            ? round((($transactionCountThisMonth - $transactionCountLastMonth) / $transactionCountLastMonth) * 100, 2) 
            : 0;

        $statusBreakdown = Transaction::select('status', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_transaction) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [
                    $item->status->value => [
                        'count' => $item->count,
                        'total' => (float) $item->total,
                        'label' => $item->status->label(),
                    ]
                ];
            })
            ->toArray();

        $todayRevenue = (float) Transaction::whereDate('transaction_date', $today)->sum('total_transaction');
        $todayTransactions = Transaction::whereDate('transaction_date', $today)->count();

        return [
            'transactions' => [
                'total_revenue' => $totalRevenue,
                'total_expense' => $totalExpense,
                'total_profit' => $totalProfit,
                'profit_margin' => $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 2) : 0,
                'total_count' => Transaction::count(),

                'this_month' => [
                    'revenue' => $revenueThisMonth,
                    'expense' => $expenseThisMonth,
                    'profit' => $profitThisMonth,
                    'count' => $transactionCountThisMonth,
                ],

                'today' => [
                    'revenue' => $todayRevenue,
                    'count' => $todayTransactions,
                ],

                'trend' => [
                    'revenue_change' => $revenueChange,
                    'transaction_change' => $transactionChange,
                ],

                'status_breakdown' => $statusBreakdown,
            ],
        ];
    }

    public function transactionChart(string $period = 'monthly'): array
    {
        return Cache::remember(
            self::CACHE_KEY_TRANSACTION_CHART . ":{$period}",
            self::CACHE_TTL_CHART,
            function () use ($period) {
                return $period === 'weekly' 
                    ? $this->getWeeklyChartData() 
                    : $this->getMonthlyChartData();
            }
        );
    }

    // ✅ DIPERBAIKI: Menggunakan TO_CHAR khusus PostgreSQL (bukan DATE_FORMAT MySQL)
    private function getMonthlyChartData(): array
    {
        $bulanIndo = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];

        $data = Transaction::select(
                DB::raw("TO_CHAR(transaction_date, 'YYYY-MM') as period"),
                DB::raw('SUM(total_transaction) as revenue'),
                DB::raw('SUM(total_expense) as expense'),
                DB::raw('SUM(total_transaction) - SUM(total_expense) as profit'),
                DB::raw('COUNT(*) as count')
            )
            ->whereNotNull('transaction_date')
            ->where('transaction_date', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy(DB::raw("TO_CHAR(transaction_date, 'YYYY-MM')"))
            ->orderBy('period')
            ->get()
            ->map(function ($item) use ($bulanIndo) {
                $parts = explode('-', $item->period);
                $year = $parts[0];
                $month = (int) $parts[1];
                $label = $bulanIndo[$month] . ' ' . $year;

                return [
                    'period' => $item->period,
                    'label' => $label,
                    'revenue' => (float) $item->revenue,
                    'expense' => (float) $item->expense,
                    'profit' => (float) $item->profit,
                    'count' => (int) $item->count,
                ];
            })
            ->toArray();

        return ['period' => 'monthly', 'data' => $data];
    }

    // ✅ DIPERBAIKI: Menambahkan array manual agar tidak bergantung pada php-intl
    private function getWeeklyChartData(): array
    {
        $hariIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        $data = Transaction::select(
                DB::raw('DATE(transaction_date) as period'),
                DB::raw('SUM(total_transaction) as revenue'),
                DB::raw('SUM(total_expense) as expense'),
                DB::raw('SUM(total_transaction) - SUM(total_expense) as profit'),
                DB::raw('COUNT(*) as count')
            )
            ->whereNotNull('transaction_date')
            ->where('transaction_date', '>=', now()->subDays(6))
            ->groupBy(DB::raw('DATE(transaction_date)'))
            ->orderBy('period')
            ->get()
            ->map(function ($item) use ($hariIndo, $bulanIndo) {
                $date = \Carbon\Carbon::parse($item->period);
                $label = $hariIndo[$date->dayOfWeek] . ', ' . $date->day . ' ' . $bulanIndo[$date->month - 1];

                return [
                    'period' => $item->period,
                    'label' => $label,
                    'revenue' => (float) $item->revenue,
                    'expense' => (float) $item->expense,
                    'profit' => (float) $item->profit,
                    'count' => (int) $item->count,
                ];
            })
            ->toArray();

        return ['period' => 'weekly', 'data' => $data];
    }

    public function topProducts(int $limit = 5): array
    {
        return Cache::remember(
            self::CACHE_KEY_TOP_PRODUCTS . ":{$limit}",
            self::CACHE_TTL_CHART,
            function () use ($limit) {
                return TransactionDetail::select(
                        'product_id',
                        DB::raw('SUM(qty) as total_qty'),
                        DB::raw('SUM(total_price) as total_revenue')
                    )
                    ->with('product:id,name,code,unit')
                    ->whereHas('transaction', function ($q) {
                        $q->where('transaction_date', '>=', now()->startOfMonth());
                    })
                    ->groupBy('product_id')
                    ->orderByDesc('total_qty')
                    ->limit($limit)
                    ->get()
                    ->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
                            'product_name' => $item->product->name ?? 'Produk Dihapus',
                            'product_code' => $item->product->code ?? '-',
                            'unit' => $item->product->unit ?? 'unit',
                            'total_qty' => (float) $item->total_qty,
                            'total_revenue' => (float) $item->total_revenue,
                        ];
                    })
                    ->toArray();
            }
        );
    }

    public function recentTransactions(int $limit = 5): array
    {
        return Cache::remember(
            self::CACHE_KEY_RECENT_TRANSACTIONS . ":{$limit}",
            self::CACHE_TTL_TRANSACTION,
            function () use ($limit) {
                return Transaction::select([
                        'id', 'invoice', 'customer_name', 'project_name',
                        'status', 'total_transaction', 'transaction_date',
                        'created_at',
                    ])
                    ->with('user:id,name')
                    ->orderByDesc('created_at')
                    ->limit($limit)
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'invoice' => $item->invoice,
                            'customer_name' => $item->customer_name,
                            'project_name' => $item->project_name,
                            'status' => [
                                'value' => $item->status->value,
                                'label' => $item->status->label(),
                            ],
                            'total_transaction' => (float) $item->total_transaction,
                            'transaction_date' => $item->transaction_date?->format('Y-m-d'),
                            'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                            'created_by' => $item->user->name ?? 'System',
                        ];
                    })
                    ->toArray();
            }
        );
    }

    public function broadcastStatsUpdate(): void
    {
        Cache::forget(self::CACHE_KEY_STATS);
        Cache::forget(self::CACHE_KEY_TRANSACTION_STATS);
        Cache::forget(self::CACHE_KEY_TRANSACTION_CHART . ':monthly');
        Cache::forget(self::CACHE_KEY_TRANSACTION_CHART . ':weekly');
        Cache::forget(self::CACHE_KEY_TOP_PRODUCTS . ':5');
        Cache::forget(self::CACHE_KEY_RECENT_TRANSACTIONS . ':5');

        $stats = $this->stats();

        broadcast(new StatsUpdated($stats));
    }

    public function loginLogs(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return LoginLog::query()
            ->select(['id', 'user_id', 'email', 'ip_address', 'user_agent', 'device_id', 'status', 'message', 'created_at', 'updated_at'])
            ->with('user:id,name,email,role_id')
            ->when(!empty($filters['email']), fn($q) => $q->where('email', 'like', "%{$filters['email']}%"))
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(!empty($filters['ip']), fn($q) => $q->where('ip_address', $filters['ip']))
            ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
            ->when(!empty($filters['date_from']), fn($q) => $q->whereDate('created_at', '>=', $filters['date_from']))
            ->when(!empty($filters['date_to']), fn($q) => $q->whereDate('created_at', '<=', $filters['date_to']))
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showLoginLog(int $id): LoginLog
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "login_log:{$id}";
        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return LoginLog::with('user:id,name,email,role_id')->findOrFail($id);
        });
    }

    public function activityLogs(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ActivityLog::query()
            ->select(['id', 'user_id', 'module', 'action', 'reference_id', 'ip_address', 'user_agent', 'created_at', 'updated_at'])
            ->with('user:id,name,email,role_id')
            ->when(!empty($filters['module']), fn($q) => $q->where('module', $filters['module']))
            ->when(!empty($filters['action']), fn($q) => $q->where('action', $filters['action']))
            ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
            ->when(!empty($filters['reference_id']), fn($q) => $q->where('reference_id', $filters['reference_id']))
            ->when(!empty($filters['date_from']), fn($q) => $q->whereDate('created_at', '>=', $filters['date_from']))
            ->when(!empty($filters['date_to']), fn($q) => $q->whereDate('created_at', '<=', $filters['date_to']))
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showActivityLog(int $id): ActivityLog
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "activity_log:{$id}";
        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return ActivityLog::with('user:id,name,email,role_id')->findOrFail($id);
        });
    }

    public function blockedIps(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return BlockedIp::query()
            ->select(['id', 'ip_address', 'attempts', 'is_active', 'last_attempt_at', 'blocked_until', 'block_type', 'reason', 'created_at', 'updated_at'])
            ->when(!empty($filters['active_only']) && $filters['active_only'], fn($q) => $q->currentlyBlocked())
            ->when(!empty($filters['ip']), fn($q) => $q->where('ip_address', 'like', "%{$filters['ip']}%"))
            ->when(!empty($filters['block_type']), fn($q) => $q->where('block_type', $filters['block_type']))
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', fn($q) => $q->where('is_active', (bool) $filters['is_active']))
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showBlockedIp(int $id): BlockedIp
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "blocked_ip:{$id}";
        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return BlockedIp::findOrFail($id);
        });
    }

    public function securityAlerts(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return SecurityAlert::query()
            ->select(['id', 'user_id', 'type', 'severity', 'ip_address', 'resolved', 'resolved_at', 'created_at', 'updated_at'])
            ->with('user:id,name,email,role_id')
            ->when(!empty($filters['unresolved_only']) && $filters['unresolved_only'], fn($q) => $q->unresolved())
            ->when(!empty($filters['severity']), fn($q) => $q->where('severity', $filters['severity']))
            ->when(!empty($filters['type']), fn($q) => $q->where('type', $filters['type']))
            ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
            ->when(isset($filters['resolved']) && $filters['resolved'] !== '', fn($q) => $q->where('resolved', (bool) $filters['resolved']))
            ->latest()
            ->paginate(min($perPage, 100));
    }

    public function showSecurityAlert(int $id): SecurityAlert
    {
        $cacheKey = self::CACHE_KEY_PREFIX . "security_alert:{$id}";
        return Cache::remember($cacheKey, self::CACHE_TTL_DETAIL, function () use ($id) {
            return SecurityAlert::with('user:id,name,email,role_id')->findOrFail($id);
        });
    }

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
        Cache::forget(self::CACHE_KEY_TRANSACTION_STATS);
        Cache::forget(self::CACHE_KEY_TRANSACTION_CHART . ':monthly');
        Cache::forget(self::CACHE_KEY_TRANSACTION_CHART . ':weekly');
        Cache::forget(self::CACHE_KEY_TOP_PRODUCTS . ':5');
        Cache::forget(self::CACHE_KEY_RECENT_TRANSACTIONS . ':5');
    }
}