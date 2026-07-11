<?php

namespace App\Services;

use App\Models\User;
use App\Models\LoginLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;

class SecurityService
{
    public function detectFailedLoginSpike(string $ip): void
    {
        $count = LoginLog::query()
            ->where('ip_address', $ip)
            ->where('status', 'failed')
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($count < 10) {
            return;
        }

        $exists = SecurityAlert::query()
            ->where('type', 'failed_login_spike')
            ->where('ip_address', $ip)
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        if ($exists) {
            return;
        }

        SecurityAlert::create([
            'type' => 'failed_login_spike',
            'severity' => $count >= 30 ? 'critical' : 'high',
            'ip_address' => $ip,
            'payload' => [
                'attempts' => $count,
            ],
        ]);

        if ($count >= 20) {
            $this->autoBan($ip, 'Bruteforce attack detected');
        }
    }

    public function detectImpossibleTravel(User $user, string $country): void
    {
        $last = LoginLog::query()
            ->where('user_id', $user->id)
            ->whereNotNull('country')
            ->latest()
            ->first();

        if (!$last) {
            return;
        }

        if ($last->country === $country) {
            return;
        }

        SecurityAlert::create([
            'user_id' => $user->id,
            'type' => 'impossible_travel',
            'severity' => 'critical',
            'payload' => [
                'from' => $last->country,
                'to' => $country,
            ],
        ]);
    }

    public function detectUnknownDevice(User $user, string $deviceId): void
    {
        if (!$user->registered_device_id || $user->registered_device_id === $deviceId) {
            return;
        }

        SecurityAlert::create([
            'user_id' => $user->id,
            'type' => 'unknown_device',
            'severity' => 'high',
            'payload' => [
                'registered_device' => $user->registered_device_id,
                'incoming_device' => $deviceId,
            ],
        ]);
    }

    public function calculateRiskScore(string $ip): int
    {
        $failedAttempts = LoginLog::query()
            ->where('ip_address', $ip)
            ->where('status', 'failed')
            ->where('created_at', '>=', now()->subDay())
            ->count();

        return min(100, $failedAttempts * 5);
    }

    public function autoBan(string $ip, string $reason): void
    {
        $blocked = BlockedIp::query()
            ->where('ip_address', $ip)
            ->where('is_active', true)
            ->exists();

        if ($blocked) {
            return;
        }

        BlockedIp::updateOrCreate(
            ['ip_address' => $ip],
            [
                'attempts' => 10,
                'risk_level' => 'high',
                'reason' => $reason,
                'blocked_until' => now()->addDay(),
                'is_active' => true,
                'last_attempt_at' => now(),
                'block_type' => 'auto',
            ]
        );

        SecurityAlert::create([
            'type' => 'ip_auto_banned',
            'severity' => 'critical',
            'ip_address' => $ip,
            'payload' => [
                'reason' => $reason,
                'blocked_until' => now()->addDay(),
            ],
        ]);
    }

    public function isIpBlocked(string $ip): bool
    {
        return BlockedIp::query()
            ->where('ip_address', $ip)
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('blocked_until')
                  ->orWhere('blocked_until', '>', now());
            })
            ->exists();
    }
}