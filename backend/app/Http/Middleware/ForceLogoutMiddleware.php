<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class ForceLogoutMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        $user = Auth::guard('api')->user();

        if (!$user) {
            return $next($request);
        }

        if ($user->force_logout_at) {

            try {

                $token = JWTAuth::getToken();

                if ($token) {
                    JWTAuth::invalidate($token);
                }

            } catch (\Throwable $e) {
                report($e);
            }

            return response()->json([
                'message' => 'Anda telah dikeluarkan dari sistem'
            ], 403);
        }

        return $next($request);
    }
}