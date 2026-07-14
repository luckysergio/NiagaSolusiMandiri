<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $service
    ) {}

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->stats(),
        ]);
    }

    public function transactionChart(Request $request): JsonResponse
    {
        $period = $request->input('period', 'monthly');

        if (!in_array($period, ['monthly', 'weekly'])) {
            return response()->json([
                'success' => false,
                'message' => 'Period harus "monthly" atau "weekly"',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->transactionChart($period),
        ]);
    }

    public function topProducts(Request $request): JsonResponse
    {
        $limit = (int) $request->input('limit', 5);

        return response()->json([
            'success' => true,
            'data' => $this->service->topProducts(min($limit, 10)),
        ]);
    }

    public function recentTransactions(Request $request): JsonResponse
    {
        $limit = (int) $request->input('limit', 5);

        return response()->json([
            'success' => true,
            'data' => $this->service->recentTransactions(min($limit, 10)),
        ]);
    }

    public function loginLogs(Request $request): JsonResponse
    {
        $filters = $request->only(['email', 'status', 'ip', 'user_id', 'date_from', 'date_to']);
        $perPage = (int) $request->input('per_page', 20);

        $logs = $this->service->loginLogs(filters: $filters, perPage: $perPage);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'meta' => [
                'current_page' => $logs->currentPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'last_page' => $logs->lastPage(),
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
            ]
        ]);
    }

    public function showLoginLog(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->showLoginLog($id)
        ]);
    }

    public function activityLogs(Request $request): JsonResponse
    {
        $filters = $request->only(['module', 'action', 'user_id', 'reference_id', 'date_from', 'date_to']);
        $perPage = (int) $request->input('per_page', 20);

        $logs = $this->service->activityLogs(filters: $filters, perPage: $perPage);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'meta' => [
                'current_page' => $logs->currentPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'last_page' => $logs->lastPage(),
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
            ]
        ]);
    }

    public function showActivityLog(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->showActivityLog($id)
        ]);
    }

    public function blockedIps(Request $request): JsonResponse
    {
        $filters = $request->only(['active_only', 'ip', 'block_type', 'is_active']);
        $perPage = (int) $request->input('per_page', 20);

        $ips = $this->service->blockedIps(filters: $filters, perPage: $perPage);

        return response()->json([
            'success' => true,
            'data' => $ips,
            'meta' => [
                'current_page' => $ips->currentPage(),
                'per_page' => $ips->perPage(),
                'total' => $ips->total(),
                'last_page' => $ips->lastPage(),
                'from' => $ips->firstItem(),
                'to' => $ips->lastItem(),
            ]
        ]);
    }

    public function showBlockedIp(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->showBlockedIp($id)
        ]);
    }

    public function securityAlerts(Request $request): JsonResponse
    {
        $filters = $request->only(['unresolved_only', 'severity', 'type', 'user_id', 'resolved']);
        $perPage = (int) $request->input('per_page', 20);

        $alerts = $this->service->securityAlerts(filters: $filters, perPage: $perPage);

        return response()->json([
            'success' => true,
            'data' => $alerts,
            'meta' => [
                'current_page' => $alerts->currentPage(),
                'per_page' => $alerts->perPage(),
                'total' => $alerts->total(),
                'last_page' => $alerts->lastPage(),
                'from' => $alerts->firstItem(),
                'to' => $alerts->lastItem(),
            ]
        ]);
    }

    public function showSecurityAlert(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->showSecurityAlert($id)
        ]);
    }
}