<?php

namespace App\Services;

use App\Models\BlockedIp;
use Illuminate\Support\Carbon;

class AutoBanService
{
    public function registerFailedAttempt(string $ip): void
    {
        $record = BlockedIp::firstOrCreate(
            ['ip_address' => $ip],
            [
                'attempts' => 0,
                'is_active' => true,
                'block_type' => 'auto',
                'risk_level' => 'medium',
            ]
        );

        $record->increment('attempts');

        $record->update([
            'last_attempt_at' => now(),
        ]);

        if ($record->attempts >= 10) {
            $record->update([
                'is_active' => true,
                'risk_level' => 'high',
                'reason' => 'Too many failed login attempts',
                'blocked_until' => Carbon::now()->addHours(6),
            ]);
        }
    }

    public function isBlocked(string $ip): bool
    {
        return BlockedIp::currentlyBlocked()
            ->where('ip_address', $ip)
            ->exists();
    }

    public function reset(string $ip): void
    {
        BlockedIp::where('ip_address', $ip)
            ->update([
                'attempts' => 0,
                'is_active' => false,
                'unblocked_at' => now(),
                'blocked_until' => null,
            ]);
    }
}