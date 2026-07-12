<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ActivityLogService
{
    private const SENSITIVE_FIELDS = [
        'password',
        'remember_token',
        'locked_until',
        'force_logout_at',
    ];

    public function create(
        string $module,
        string $action,
        int $referenceId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => Auth::id(),
            'module' => $module,
            'action' => $action,
            'reference_id' => $referenceId,
            'old_data' => $oldData ? $this->sanitize($oldData) : null,
            'new_data' => $newData ? $this->sanitize($newData) : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function logUserAction(
        string $action,
        int $userId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create(
            module: 'users',
            action: $action,
            referenceId: $userId,
            oldData: $oldData,
            newData: $newData
        );
    }

    public function logRoleAction(
        string $action,
        int $roleId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create(
            module: 'roles',
            action: $action,
            referenceId: $roleId,
            oldData: $oldData,
            newData: $newData
        );
    }

    public function logProfileAction(
        string $action,
        int $userId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create(
            module: 'profile',
            action: $action,
            referenceId: $userId,
            oldData: $oldData,
            newData: $newData
        );
    }

    private function sanitize(array $data): array
    {
        foreach (self::SENSITIVE_FIELDS as $field) {
            unset($data[$field]);
        }
        return $data;
    }
}