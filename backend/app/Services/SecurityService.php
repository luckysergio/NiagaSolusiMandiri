<?php

namespace App\Services;

use App\Models\User;
use App\Models\LoginLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class SecurityService
{
    /*
    |--------------------------------------------------------------------------
    | Cache Keys
    |--------------------------------------------------------------------------
    */

    private const CACHE_KEY_RISK_SCORE = 'security:risk_score:';
    private const CACHE_KEY_FAILED_ATTEMPTS = 'failed_attempts:ip:';
    private const CACHE_TTL_RISK = 300; // 5 menit
    private const CACHE_TTL_FAILED = 3600; // 1 jam

    /*
    |--------------------------------------------------------------------------
    | Failed Login Spike Detection
    |--------------------------------------------------------------------------
    */

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

        // Prevent duplicate alerts in 1 hour
        $exists = SecurityAlert::query()
            ->where('type', 'failed_login_spike')
            ->where('ip_address', $ip)
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        if ($exists) {
            return;
        }

        DB::transaction(function () use ($ip, $count): void {
            SecurityAlert::create([
                'type' => 'failed_login_spike',
                'severity' => $count >= 30 ? 'critical' : 'high',
                'ip_address' => $ip,
                'payload' => [
                    'attempts' => $count,
                    'detected_at' => now()->toIso8601String(),
                ],
            ]);

            // Auto-ban jika >= 20 attempts
            if ($count >= 20) {
                $this->autoBanIp($ip, 'Bruteforce attack detected');
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Handle Failed Login (Dipanggil dari AuthService)
    |--------------------------------------------------------------------------
    */

    public function handleFailedLogin(string $ip, string $email): void
    {
        $user = User::where('email', $email)->first();

        if ($user instanceof User) {
            $user->increment('failed_login_attempts');

            if ($user->failed_login_attempts >= 5) {
                $user->update([
                    'locked_until' => now()->addMinutes(30)
                ]);

                SecurityAlert::create([
                    'user_id' => $user->id,
                    'type' => 'account_locked',
                    'severity' => 'high',
                    'ip_address' => $ip,
                    'payload' => [
                        'failed_attempts' => $user->failed_login_attempts,
                        'locked_until' => $user->locked_until?->toIso8601String(),
                    ]
                ]);
            }
        }

        // Track failed attempts per IP
        $this->registerFailedAttempt($ip);

        // Detect failed login spike
        $this->detectFailedLoginSpike($ip);
    }

    /*
    |--------------------------------------------------------------------------
    | Perform Security Checks (Dipanggil dari AuthService)
    |--------------------------------------------------------------------------
    */

    public function performSecurityChecks(
        User $user,
        string $ip,
        ?string $deviceId
    ): void {
        // Detect unknown device
        if (!empty($deviceId)) {
            $this->detectUnknownDevice($user, $deviceId);
        }

        // Detect IP changed
        $this->detectIpChanged($user, $ip);

        // Detect anomalies
        $flags = $this->detectAnomalies([
            'ip' => $ip,
            'user_id' => $user->id,
            'device_id' => $deviceId,
        ]);

        // Create anomaly alert if high risk
        if (!empty($flags)) {
            $riskScore = $this->calculateAnomalyRiskScore($flags);

            if ($this->isHighRisk($riskScore)) {
                $exists = SecurityAlert::where('user_id', $user->id)
                    ->where('type', 'anomaly_detected')
                    ->where('created_at', '>=', now()->subHour())
                    ->exists();

                if (!$exists) {
                    SecurityAlert::create([
                        'user_id' => $user->id,
                        'type' => 'anomaly_detected',
                        'severity' => 'high',
                        'ip_address' => $ip,
                        'payload' => [
                            'flags' => $flags,
                            'risk_score' => $riskScore,
                        ],
                    ]);
                }
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Unknown Device Detection
    |--------------------------------------------------------------------------
    */

    public function detectUnknownDevice(User $user, string $deviceId): void
    {
        if (empty($user->registered_device_id) || $user->registered_device_id === $deviceId) {
            return;
        }

        // Prevent duplicate alerts in 1 hour
        $exists = SecurityAlert::query()
            ->where('user_id', $user->id)
            ->where('type', 'unknown_device')
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        if ($exists) {
            return;
        }

        SecurityAlert::create([
            'user_id' => $user->id,
            'type' => 'unknown_device',
            'severity' => 'medium',
            'payload' => [
                'registered_device' => $user->registered_device_id,
                'incoming_device' => $deviceId,
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IP Changed Detection
    |--------------------------------------------------------------------------
    */

    public function detectIpChanged(User $user, string $newIp): void
    {
        if (empty($user->last_login_ip) || $user->last_login_ip === $newIp) {
            return;
        }

        // Prevent duplicate alerts in 1 hour
        $exists = SecurityAlert::query()
            ->where('user_id', $user->id)
            ->where('type', 'ip_changed')
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        if ($exists) {
            return;
        }

        SecurityAlert::create([
            'user_id' => $user->id,
            'type' => 'ip_changed',
            'severity' => 'low',
            'ip_address' => $newIp,
            'payload' => [
                'old_ip' => $user->last_login_ip,
                'new_ip' => $newIp,
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Anomaly Detection (Multi-factor)
    |--------------------------------------------------------------------------
    */

    public function detectAnomalies(array $context): array
    {
        $flags = [];
        $ip = $context['ip'] ?? null;
        $userId = $context['user_id'] ?? null;
        $deviceId = $context['device_id'] ?? null;

        // Check unusual time (2 AM - 5 AM)
        $hour = Carbon::now()->hour;
        if ($hour >= 2 && $hour <= 5) {
            $flags[] = 'UNUSUAL_TIME_LOGIN';
        }

        // Check high frequency (5+ logins in 1 minute from same IP)
        if ($ip) {
            $count = LoginLog::where('ip_address', $ip)
                ->where('created_at', '>=', now()->subMinute())
                ->count();

            if ($count > 5) {
                $flags[] = 'HIGH_FREQUENCY';
            }
        }

        // Check device change
        if ($userId && $deviceId) {
            $oldDevice = LoginLog::where('user_id', $userId)
                ->whereNotNull('device_id')
                ->latest()
                ->value('device_id');

            if ($oldDevice && $oldDevice !== $deviceId) {
                $flags[] = 'DEVICE_CHANGED';
            }
        }

        // Check new IP
        if ($userId && $ip) {
            $oldIp = LoginLog::where('user_id', $userId)
                ->where('status', 'success')
                ->latest()
                ->value('ip_address');

            if ($oldIp && $oldIp !== $ip) {
                $flags[] = 'NEW_IP_DETECTED';
            }
        }

        return $flags;
    }

    /*
    |--------------------------------------------------------------------------
    | Risk Score Calculation
    |--------------------------------------------------------------------------
    */

    public function calculateRiskScore(string $ip): int
    {
        $cacheKey = self::CACHE_KEY_RISK_SCORE . md5($ip);

        return Cache::remember($cacheKey, self::CACHE_TTL_RISK, function () use ($ip) {
            $failedAttempts = LoginLog::query()
                ->where('ip_address', $ip)
                ->where('status', 'failed')
                ->where('created_at', '>=', now()->subDay())
                ->count();

            return min(100, $failedAttempts * 5);
        });
    }

    public function calculateAnomalyRiskScore(array $flags): int
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

    /*
    |--------------------------------------------------------------------------
    | Auto Ban IP
    |--------------------------------------------------------------------------
    */

    public function autoBanIp(string $ip, string $reason): void
    {
        // Check if already blocked
        if (BlockedIp::isIpBlocked($ip)) {
            return;
        }

        DB::transaction(function () use ($ip, $reason): void {
            BlockedIp::updateOrCreate(
                ['ip_address' => $ip],
                [
                    'attempts' => 10,
                    'is_active' => true,
                    'reason' => $reason,
                    'blocked_until' => now()->addDay(),
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
                    'blocked_until' => now()->addDay()->toIso8601String(),
                ],
            ]);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Register Failed Attempt (Auto-ban after threshold)
    |--------------------------------------------------------------------------
    */

    public function registerFailedAttempt(string $ip): void
    {
        $cacheKey = self::CACHE_KEY_FAILED_ATTEMPTS . $ip;
        $failedCount = Cache::increment($cacheKey);

        // Set expiry if first increment
        if ($failedCount === 1) {
            Cache::put($cacheKey, 1, self::CACHE_TTL_FAILED);
        }

        // Auto-ban after 10 attempts
        if ($failedCount >= 10) {
            $this->autoBanIp($ip, '10 failed login attempts from IP');
            Cache::forget($cacheKey);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | IP Block Check
    |--------------------------------------------------------------------------
    */

    public function isIpBlocked(string $ip): bool
    {
        return BlockedIp::isIpBlocked($ip);
    }

    /*
    |--------------------------------------------------------------------------
    | Reset Failed Attempts
    |--------------------------------------------------------------------------
    */

    public function resetFailedAttempts(string $ip): void
    {
        $cacheKey = self::CACHE_KEY_FAILED_ATTEMPTS . $ip;
        Cache::forget($cacheKey);

        BlockedIp::where('ip_address', $ip)
            ->update([
                'attempts' => 0,
                'is_active' => false,
                'blocked_until' => null,
            ]);

        BlockedIp::clearIpCache($ip);
    }

    /*
    |--------------------------------------------------------------------------
    | Clear Risk Score Cache
    |--------------------------------------------------------------------------
    */

    public function clearRiskScoreCache(string $ip): void
    {
        Cache::forget(self::CACHE_KEY_RISK_SCORE . md5($ip));
    }
}