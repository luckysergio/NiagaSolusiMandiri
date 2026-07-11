<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DeviceValidationMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        $user = Auth::guard('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $deviceId = trim(
            (string) $request->header('X-DEVICE-ID')
        );

        if ($deviceId === '') {
            return response()->json([
                'message' => 'Device ID required'
            ], 400);
        }

        if (
            $user->registered_device_id &&
            $user->registered_device_id !== $deviceId
        ) {
            return response()->json([
                'message' => 'Device tidak dikenali'
            ], 403);
        }

        return $next($request);
    }
}