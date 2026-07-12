<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Events\ActivityLogCreated;
use App\Services\DashboardService;

class ActivityLogObserver
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function created(ActivityLog $activityLog): void
    {
        $activityLog->load('user:id,name,email');

        broadcast(new ActivityLogCreated($activityLog));

        $this->dashboardService->broadcastStatsUpdate();
    }
}