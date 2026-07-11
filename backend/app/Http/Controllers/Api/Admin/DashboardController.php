<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
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

    public function loginLogs(
        Request $request
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $this->service->loginLogs(
                filters: $request->only([
                    'email',
                    'status',
                    'ip'
                ]),
                perPage: (int) $request->input(
                    'per_page',
                    20
                )
            )
        ]);
    }

    public function showLoginLog(
        int $id
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => LoginLog::with('user')
                ->findOrFail($id)
        ]);
    }

    public function activityLogs(
        Request $request
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $this->service->activityLogs(
                filters: $request->only([
                    'module',
                    'action',
                    'user_id'
                ]),
                perPage: (int) $request->input(
                    'per_page',
                    20
                )
            )
        ]);
    }

    public function showActivityLog(
        int $id
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => ActivityLog::with('user')
                ->findOrFail($id)
        ]);
    }

    public function blockedIps(
        Request $request
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $this->service->blockedIps(
                activeOnly: $request->boolean(
                    'active_only'
                ),
                perPage: (int) $request->input(
                    'per_page',
                    20
                )
            )
        ]);
    }

    public function showBlockedIp(
        int $id
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => BlockedIp::findOrFail($id)
        ]);
    }

    public function securityAlerts(
        Request $request
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => $this->service->securityAlerts(
                unresolvedOnly: $request->boolean(
                    'unresolved_only'
                ),
                perPage: (int) $request->input(
                    'per_page',
                    20
                )
            )
        ]);
    }

    public function showSecurityAlert(
        int $id
    ): JsonResponse {

        return response()->json([
            'success' => true,
            'data' => SecurityAlert::with('user')
                ->findOrFail($id)
        ]);
    }
}
