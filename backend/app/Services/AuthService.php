<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\LoginLog;
use App\Models\BlockedIp;
use App\Models\SecurityAlert;
use App\Events\LoginLogCreated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        protected RecaptchaService $recaptchaService,
        protected SecurityService $securityService,
        protected DashboardService $dashboardService
    ) {}

    public function login(
        array $credentials,
        string $ip,
        ?string $recaptchaToken,
        ?string $deviceId = null
    ): array {

        if ($this->securityService->isIpBlocked($ip)) {
            throw ValidationException::withMessages([
                'email' => ['IP anda sedang diblokir sementara.']
            ]);
        }

        $this->recaptchaService->verify($recaptchaToken, $ip);

        $email = strtolower($credentials['email']);

        $ipRateKey = "login:ip:{$ip}";
        if (RateLimiter::tooManyAttempts($ipRateKey, 20)) {
            $this->securityService->autoBanIp($ip, 'Rate limit exceeded (IP)');

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

            $loginLog = LoginLog::create([
                'email' => $credentials['email'],
                'ip_address' => $ip,
                'user_agent' => request()->userAgent(),
                'device_id' => $deviceId,
                'status' => 'failed',
                'message' => 'Invalid credentials',
            ]);

            broadcast(new LoginLogCreated($loginLog));
            $this->dashboardService->broadcastStatsUpdate();

            $this->securityService->handleFailedLogin($ip, $credentials['email']);

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

        $this->securityService->performSecurityChecks($user, $ip, $deviceId);

        DB::transaction(function () use ($user, $ip, $deviceId): void {
            $user->update([
                'failed_login_attempts' => 0,
                'last_login_at' => now(),
                'last_login_ip' => $ip,
                'force_logout_at' => null,
            ]);

            $loginLog = LoginLog::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => $ip,
                'user_agent' => request()->userAgent(),
                'device_id' => $deviceId,
                'status' => 'success',
                'message' => 'Login success',
            ]);

            broadcast(new LoginLogCreated($loginLog));
        });

        $this->securityService->resetFailedAttempts($ip);

        $this->dashboardService->broadcastStatsUpdate();

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
            $loginLog = LoginLog::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'device_id' => request()->header('X-DEVICE-ID'),
                'status' => 'logout',
                'message' => 'Logout success',
            ]);

            broadcast(new LoginLogCreated($loginLog));
            $this->dashboardService->broadcastStatsUpdate();
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

            $loginLog = LoginLog::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'device_id' => request()->header('X-DEVICE-ID'),
                'status' => 'refresh',
                'message' => 'Token refreshed',
            ]);

            broadcast(new LoginLogCreated($loginLog));
        }

        return $this->tokenResponse($token, $user);
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