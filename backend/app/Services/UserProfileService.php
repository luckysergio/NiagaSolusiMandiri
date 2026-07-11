<?php

namespace App\Services;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserProfileService
{
    public function me(): User
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            throw new \Exception('User tidak ditemukan');
        }

        return User::with('role')
            ->findOrFail($user->id);
    }

    public function updateProfile(array $data): User
    {
        /** @var User $user */
        $user = User::findOrFail(Auth::guard('api')->id());

        $oldData = [
            'name' => $user->name,
            'email' => $user->email,
        ];

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['email'])) {
            // Cek email sudah digunakan oleh user lain
            $existingUser = User::where('email', $data['email'])
                ->where('id', '!=', $user->id)
                ->first();

            if ($existingUser) {
                throw new \Exception('Email sudah digunakan oleh user lain');
            }

            $updateData['email'] = $data['email'];
        }

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        $user = User::with('role')->findOrFail($user->id);

        $this->logActivity($user, $oldData);

        return $user;
    }

    public function changePassword(array $data): void
    {
        /** @var User $user */
        $user = User::findOrFail(Auth::guard('api')->id());

        if (!Hash::check($data['current_password'], $user->password)) {
            throw new \Exception('Password lama tidak sesuai');
        }

        $user->update([
            'password' => Hash::make($data['new_password']),
            'password_changed_at' => now(),
        ]);

        $this->logActivity($user, [
            'action' => 'CHANGE_PASSWORD'
        ]);
    }

    private function logActivity(User $user, array $oldData = []): void
    {
        try {
            ActivityLog::create([
                'user_id' => $user->id,
                'module' => 'profile',
                'action' => 'UPDATE',
                'reference_id' => $user->id,
                'old_data' => !empty($oldData) ? $oldData : null,
                'new_data' => [
                    'updated_at' => now()->toDateTimeString()
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'description' => 'User memperbarui profile',
                'status' => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log activity: ' . $e->getMessage());
        }
    }
}