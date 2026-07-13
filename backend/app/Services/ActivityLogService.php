<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

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
        return $this->create('users', $action, $userId, $oldData, $newData);
    }

    public function logRoleAction(
        string $action,
        int $roleId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('roles', $action, $roleId, $oldData, $newData);
    }

    public function logProfileAction(
        string $action,
        int $userId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('profile', $action, $userId, $oldData, $newData);
    }

    public function logProductCategoryAction(
        string $action,
        int $categoryId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('product_categories', $action, $categoryId, $oldData, $newData);
    }

    public function logProductTypeAction(
        string $action,
        int $typeId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('product_types', $action, $typeId, $oldData, $newData);
    }

    public function logProductAction(
        string $action,
        int $productId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('products', $action, $productId, $oldData, $newData);
    }

    public function logSupplierAction(
        string $action,
        int $supplierId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('suppliers', $action, $supplierId, $oldData, $newData);
    }

    public function logTransactionAction(
        string $action,
        int $transactionId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('transactions', $action, $transactionId, $oldData, $newData);
    }

    public function logTransactionDetailAction(
        string $action,
        int $detailId,
        ?array $oldData = null,
        ?array $newData = null
    ): ActivityLog {
        return $this->create('transaction_details', $action, $detailId, $oldData, $newData);
    }

    private function sanitize(array $data): array
    {
        foreach (self::SENSITIVE_FIELDS as $field) {
            unset($data[$field]);
        }
        return $data;
    }
}