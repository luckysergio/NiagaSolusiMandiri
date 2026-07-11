<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class ForceLogoutMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $authUser = Auth::guard('api')->user();

        if (!$authUser) {
            return $next($request);
        }

        if (!($authUser instanceof User)) {
            return $next($request);
        }

        $freshUser = $authUser->fresh();

        if (!$freshUser) {
            $this->invalidateToken();

            return response()->json([
                'success' => false,
                'message' => 'Akun tidak ditemukan.'
            ], 401);
        }

        if (!$freshUser->is_active) {
            $this->invalidateToken();

            return response()->json([
                'success' => false,
                'message' => 'Akun Anda dinonaktifkan. Hubungi administrator.'
            ], 401);
        }

        if ($freshUser->force_logout_at !== null) {
            try {
                $token = JWTAuth::getToken();

                if ($token) {
                    $payload = JWTAuth::getPayload($token);
                    $issuedAt = $payload->get('iat');

                    if ($freshUser->isForceLoggedOutAfter($issuedAt)) {
                        $this->invalidateToken();

                        return response()->json([
                            'success' => false,
                            'message' => 'Anda telah dikeluarkan dari sistem. Silakan login kembali.'
                        ], 401);
                    }
                }
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $next($request);
    }

    private function invalidateToken(): void
    {
        try {
            $token = JWTAuth::getToken();
            if ($token) {
                JWTAuth::invalidate($token);
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }
}