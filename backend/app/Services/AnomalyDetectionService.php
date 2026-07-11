<?php

namespace App\Services;

use App\Models\LoginLog;
use Carbon\Carbon;

class AnomalyDetectionService
{
    public function detect(array $context): array
    {
        $flags = [];

        $ip = $context['ip'];
        $userId = $context['user_id'] ?? null;
        $deviceId = $context['device_id'] ?? null;

        // 1. NEW IP DETECTION
        $oldIp = LoginLog::where('user_id', $userId)
            ->where('status', 'success')
            ->latest()
            ->value('ip_address');

        if ($oldIp && $oldIp !== $ip) {
            $flags[] = 'NEW_IP_DETECTED';
        }

        // 2. NIGHT LOGIN DETECTION
        $hour = Carbon::now()->hour;
        if ($hour >= 2 && $hour <= 5) {
            $flags[] = 'UNUSUAL_TIME_LOGIN';
        }

        // 3. DEVICE CHANGE
        $oldDevice = LoginLog::where('user_id', $userId)
            ->whereNotNull('device_id')
            ->latest()
            ->value('device_id');

        if ($oldDevice && $deviceId && $oldDevice !== $deviceId) {
            $flags[] = 'DEVICE_CHANGED';
        }

        // 4. HIGH FREQUENCY LOGIN (1 menit)
        $count = LoginLog::where('ip_address', $ip)
            ->where('created_at', '>=', now()->subMinute())
            ->count();

        if ($count > 5) {
            $flags[] = 'HIGH_FREQUENCY';
        }

        return $flags;
    }

    public function riskScore(array $flags): int
    {
        $score = 0;

        foreach ($flags as $flag) {
            $score += match ($flag) {
                'NEW_IP_DETECTED' => 20,
                'UNUSUAL_TIME_LOGIN' => 15,
                'DEVICE_CHANGED' => 25,
                'HIGH_FREQUENCY' => 40,
                default => 0,
            };
        }

        return $score;
    }

    public function isHighRisk(int $score): bool
    {
        return $score >= 60;
    }
}