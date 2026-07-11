<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\LoginLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        protected RecaptchaService $recaptchaService
    ) {}

    public function login(
        array $credentials,
        string $ip,
        ?string $recaptchaToken,
        ?string $deviceId = null
    ): array {

        if (BlockedIp::isIpBlocked($ip)) {
            throw ValidationException::withMessages([
                'email' => ['IP anda sedang diblokir sementara.']
            ]);
        }

        $this->recaptchaService->verify($recaptchaToken, $ip);

        $email = strtolower($credentials['email']);

        $ipRateKey = "login:ip:{$ip}";
        if (RateLimiter::tooManyAttempts($ipRateKey, 20)) {
            $this->autoBlockIp($ip, 'Rate limit exceeded (IP)');

            throw ValidationException::withMessages([
                'email' => ['Terlalu banyak percobaan login dari IP ini.']
            ]);
        }

        $emailRateKey = "login:email:{$email}";
        if (RateLimiter::tooManyAttempts($emailRateKey, 5)) {
            throw ValidationException::withMessages([
                'email' => ['Terlalu banyak percobaan login untuk email ini.']
            ]);
        }

        $token = JWTAuth::attempt($credentials);

        if (!$token) {
            RateLimiter::hit($ipRateKey, 600);
            RateLimiter::hit($emailRateKey, 600);

            LoginLog::create([
                'email' => $credentials['email'],
                'ip_address' => $ip,
                'user_agent' => request()->userAgent(),
                'device_id' => $deviceId,
                'status' => 'failed',
                'message' => 'Invalid credentials',
            ]);

            $this->handleFailedLogin($ip, $credentials['email']);

            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.']
            ]);
        }

        RateLimiter::clear($ipRateKey);
        RateLimiter::clear($emailRateKey);

        /** @var User|null $user */
        $user = Auth::guard('api')->user();

        if (!$user) {
            JWTAuth::invalidate($token);

            throw ValidationException::withMessages([
                'email' => ['User tidak ditemukan.']
            ]);
        }

        $user->load('role');

        if (!$user->is_active) {
            JWTAuth::invalidate($token);

            throw ValidationException::withMessages([
                'email' => ['Akun dinonaktifkan.']
            ]);
        }

        if ($user->isLocked()) {
            JWTAuth::invalidate($token);

            throw ValidationException::withMessages([
                'email' => ['Akun sedang terkunci.']
            ]);
        }

        $this->performSecurityChecks($user, $ip, $deviceId);

        DB::transaction(function () use ($user, $ip, $deviceId): void {
            $user->update([
                'failed_login_attempts' => 0,
                'last_login_at' => now(),
                'last_login_ip' => $ip,
                'force_logout_at' => null,
            ]);

            LoginLog::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => $ip,
                'user_agent' => request()->userAgent(),
                'device_id' => $deviceId,
                'status' => 'success',
                'message' => 'Login success',
            ]);
        });

        return $this->tokenResponse($token, $user);
    }

    public function me(): ?User
    {
        /** @var User|null $user */
        $user = Auth::guard('api')->user();

        if ($user instanceof User) {
            $user->load('role');
        }

        return $user;
    }

    public function logout(): void
    {
        /** @var User|null $user */
        $user = Auth::guard('api')->user();

        if ($user instanceof User) {
            LoginLog::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'device_id' => request()->header('X-DEVICE-ID'),
                'status' => 'logout',
                'message' => 'Logout success',
            ]);
        }

        JWTAuth::invalidate(JWTAuth::getToken());
    }

    public function refresh(): array
    {
        $token = JWTAuth::refresh();

        /** @var User|null $user */
        $user = Auth::guard('api')->user();

        if ($user instanceof User) {
            $user->load('role');

            if (!$user->is_active) {
                JWTAuth::invalidate($token);
                throw ValidationException::withMessages([
                    'email' => ['Akun dinonaktifkan.']
                ]);
            }

            if ($user->isLocked()) {
                JWTAuth::invalidate($token);
                throw ValidationException::withMessages([
                    'email' => ['Akun sedang terkunci.']
                ]);
            }

            LoginLog::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'device_id' => request()->header('X-DEVICE-ID'),
                'status' => 'refresh',
                'message' => 'Token refreshed',
            ]);
        }

        return $this->tokenResponse($token, $user);
    }

    private function performSecurityChecks(
        User $user,
        string $ip,
        ?string $deviceId
    ): void {
        $alerts = [];

        if (
            !empty($user->registered_device_id) &&
            !empty($deviceId) &&
            $user->registered_device_id !== $deviceId
        ) {
            $alerts[] = [
                'user_id' => $user->id,
                'type' => 'unknown_device',
                'severity' => 'medium',
                'ip_address' => $ip,
                'payload' => [
                    'registered_device' => $user->registered_device_id,
                    'current_device' => $deviceId,
                ]
            ];
        }

        if (
            !empty($user->last_login_ip) &&
            $user->last_login_ip !== $ip
        ) {
            $alerts[] = [
                'user_id' => $user->id,
                'type' => 'ip_changed',
                'severity' => 'low',
                'ip_address' => $ip,
                'payload' => [
                    'old_ip' => $user->last_login_ip,
                    'new_ip' => $ip,
                ]
            ];
        }

        if (!empty($alerts)) {
            foreach ($alerts as $alert) {
                $exists = SecurityAlert::where('user_id', $alert['user_id'])
                    ->where('type', $alert['type'])
                    ->where('created_at', '>=', now()->subHour())
                    ->exists();

                if (!$exists) {
                    SecurityAlert::create($alert);
                }
            }
        }
    }

    private function handleFailedLogin(string $ip, string $email): void
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

        $ipFailedKey = "failed_attempts:ip:{$ip}";
        $failedCount = Cache::increment($ipFailedKey);

        if ($failedCount === 1) {
            Cache::put($ipFailedKey, 1, 3600);
        }

        if ($failedCount >= 10) {
            $this->autoBlockIp($ip, '10 failed login attempts from IP');
            Cache::forget($ipFailedKey);
        }
    }

    private function autoBlockIp(string $ip, string $reason): void
    {
        BlockedIp::updateOrCreate(
            ['ip_address' => $ip],
            [
                'attempts' => DB::raw('attempts + 1'),
                'is_active' => true,
                'last_attempt_at' => now(),
                'blocked_until' => now()->addHours(24),
                'block_type' => 'auto',
                'reason' => $reason,
            ]
        );

        SecurityAlert::create([
            'user_id' => null,
            'type' => 'ip_blocked',
            'severity' => 'critical',
            'ip_address' => $ip,
            'payload' => [
                'reason' => $reason,
                'blocked_until' => now()->addHours(24)->toIso8601String(),
            ]
        ]);
    }

    private function tokenResponse(string $token, ?User $user): array
    {
        if (!$user instanceof User) {
            return [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => null,
            ];
        }

        $roles = Cache::remember('roles.all', 3600, function () {
            return Role::all()->keyBy('id')->toArray();
        });

        $roleData = $roles[$user->role_id] ?? null;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'role_id' => $user->role_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleData['name'] ?? null,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'last_login_ip' => $user->last_login_ip,
            ]
        ];
    }
}