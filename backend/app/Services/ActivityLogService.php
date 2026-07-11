<?php

namespace App\Services;

use App\Models\ActivityLog;

class ActivityLogService
{
    public function create(array $data): void
    {
        ActivityLog::create($data);
    }
}