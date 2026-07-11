<?php

namespace App\Services;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserProfileService
{
    private const SENSITIVE_FIELDS = [
        'password',
        'remember_token',
    ];

    public function me(): User
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            throw ValidationException::withMessages([
                'user' => ['User tidak ditemukan.']
            ]);
        }

        return User::with('role:id,name,display_name')
            ->findOrFail($user->id);
    }

    public function updateProfile(array $data): User
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();

        if (!$user) {
            throw ValidationException::withMessages([
                'user' => ['User tidak ditemukan.']
            ]);
        }

        return DB::transaction(function () use ($user, $data) {
            $user = User::findOrFail($user->id);
            $oldData = $this->sanitizeForLog($user->toArray());

            $updateData = [];

            if (isset($data['name']) && $data['name'] !== $user->name) {
                $updateData['name'] = $data['name'];
            }

            if (isset($data['email']) && $data['email'] !== $user->email) {
                $this->validateEmailUniqueness($data['email'], $user->id);
                $updateData['email'] = $data['email'];
            }

            if (!empty($data['password'])) {
                $updateData['password'] = $data['password'];
            }

            if (!empty($updateData)) {
                $user->update($updateData);
            }

            $user = $user->fresh();
            $user->load('role:id,name,display_name');

            if (!empty($updateData)) {
                $this->logActivity(
                    action: 'update_profile',
                    referenceId: $user->id,
                    oldData: $oldData,
                    newData: $this->sanitizeForLog($user->toArray())
                );
            }

            return $user;
        });
    }

    public function changePassword(array $data): void
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();

        if (!$user) {
            throw ValidationException::withMessages([
                'user' => ['User tidak ditemukan.']
            ]);
        }

        $user = User::findOrFail($user->id);

        if (!password_verify($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password lama tidak sesuai.']
            ]);
        }

        if (password_verify($data['new_password'], $user->password)) {
            throw ValidationException::withMessages([
                'new_password' => ['Password baru tidak boleh sama dengan password lama.']
            ]);
        }

        DB::transaction(function () use ($user, $data): void {
            $user->update([
                'password' => $data['new_password'],
            ]);

            $this->logActivity(
                action: 'change_password',
                referenceId: $user->id,
                newData: ['changed_at' => now()->toIso8601String()]
            );
        });
    }

    private function logActivity(
        string $action,
        int $referenceId,
        ?array $oldData = null,
        ?array $newData = null
    ): void {
        try {
            ActivityLog::create([
                'user_id' => Auth::id(),
                'module' => 'profile',
                'action' => $action,
                'reference_id' => $referenceId,
                'old_data' => $oldData,
                'new_data' => $newData,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private function sanitizeForLog(array $data): array
    {
        foreach (self::SENSITIVE_FIELDS as $field) {
            unset($data[$field]);
        }
        return $data;
    }

    private function validateEmailUniqueness(string $email, int $excludeId): void
    {
        $exists = User::where('email', $email)
            ->where('id', '!=', $excludeId)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'email' => ['Email sudah digunakan oleh user lain.']
            ]);
        }
    }
}