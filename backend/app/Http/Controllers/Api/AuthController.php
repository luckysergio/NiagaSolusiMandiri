<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(Request $request): JsonResponse
    {
        $controllerRateKey = 'auth_controller:' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($controllerRateKey, 30)) {
            return response()->json([
                'success' => false,
                'message' => 'Terlalu banyak request. Silakan coba lagi nanti.'
            ], 429);
        }

        RateLimiter::hit($controllerRateKey, 60);

        $validator = Validator::make(
            $request->all(),
            [
                'email' => ['required', 'email', 'max:150'],
                'password' => ['required', 'string', 'min:6'],
                'recaptcha_token' => ['required', 'string'],
                'device_id' => ['nullable', 'string', 'max:255']
            ],
            [
                'email.required' => 'Email wajib diisi',
                'email.email' => 'Format email tidak valid',
                'password.required' => 'Password wajib diisi',
                'password.min' => 'Password minimal 6 karakter',
                'recaptcha_token.required' => 'Verifikasi reCAPTCHA wajib dilakukan',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // Sanitize email
            $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

            $result = $this->authService->login(
                credentials: [
                    'email' => $email,
                    'password' => $data['password'],
                ],
                ip: $request->ip(),
                recaptchaToken: $data['recaptcha_token'],
                deviceId: $data['device_id'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'data' => $result
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);

        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.'
            ], 500);
        }
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->me();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'role_id' => $user->role_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role?->name,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'last_login_ip' => $user->last_login_ip,
            ]
        ]);
    }

    public function logout(): JsonResponse
    {
        try {
            $this->authService->logout();

            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil'
            ]);

        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Gagal logout'
            ], 500);
        }
    }

    public function refresh(): JsonResponse
    {
        try {
            $result = $this->authService->refresh();

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Gagal refresh token'
            ], 500);
        }
    }
}