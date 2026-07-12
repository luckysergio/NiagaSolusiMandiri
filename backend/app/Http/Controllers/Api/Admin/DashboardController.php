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

    public function loginLogs(Request $request): JsonResponse
    {
        $filters = $request->only([
            'email',
            'status',
            'ip',
            'user_id',
            'date_from',
            'date_to',
        ]);

        $perPage = (int) $request->input('per_page', 20);

        $logs = $this->service->loginLogs(
            filters: $filters,
            perPage: $perPage
        );

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
        $log = $this->service->showLoginLog($id);

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    public function activityLogs(Request $request): JsonResponse
    {
        $filters = $request->only([
            'module',
            'action',
            'user_id',
            'reference_id',
            'date_from',
            'date_to',
        ]);

        $perPage = (int) $request->input('per_page', 20);

        $logs = $this->service->activityLogs(
            filters: $filters,
            perPage: $perPage
        );

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
        $log = $this->service->showActivityLog($id);

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    public function blockedIps(Request $request): JsonResponse
    {
        $filters = $request->only([
            'active_only',
            'ip',
            'block_type',
            'is_active',
        ]);

        $perPage = (int) $request->input('per_page', 20);

        $ips = $this->service->blockedIps(
            filters: $filters,
            perPage: $perPage
        );

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
        $ip = $this->service->showBlockedIp($id);

        return response()->json([
            'success' => true,
            'data' => $ip
        ]);
    }

    public function securityAlerts(Request $request): JsonResponse
    {
        $filters = $request->only([
            'unresolved_only',
            'severity',
            'type',
            'user_id',
            'resolved',
        ]);

        $perPage = (int) $request->input('per_page', 20);

        $alerts = $this->service->securityAlerts(
            filters: $filters,
            perPage: $perPage
        );

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
        $alert = $this->service->showSecurityAlert($id);

        return response()->json([
            'success' => true,
            'data' => $alert
        ]);
    }
}