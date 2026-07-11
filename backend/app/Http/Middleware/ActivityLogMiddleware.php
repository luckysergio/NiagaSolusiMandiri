<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ActivityLogMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        $response = $next($request);

        /*
        |--------------------------------------------------------------------------
        | Skip Request
        |--------------------------------------------------------------------------
        */

        if (
            in_array(
                $request->method(),
                ['GET', 'HEAD', 'OPTIONS'],
                true
            )
        ) {
            return $response;
        }

        if (str_contains($request->path(), 'auth')) {
            return $response;
        }

        try {

            $user = Auth::guard('api')->user();

            if (!$user) {
                return $response;
            }

            ActivityLog::create([
                'user_id' => $user->id,
                'module' => $this->getModule($request),
                'action' => $request->method(),
                'reference_id' => $this->getReferenceId($request),
                'old_data' => null,
                'new_data' => $this->sanitize(
                    $request->except([
                        'password',
                        'password_confirmation',
                        'token',
                        'access_token',
                        'refresh_token',
                        'recaptcha_token',
                    ])
                ),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

        } catch (\Throwable $e) {

            report($e);
        }

        return $response;
    }

    private function getModule(
        Request $request
    ): string {

        $path = explode(
            '/',
            trim($request->path(), '/')
        );

        return $path[1] ?? $path[0] ?? 'system';
    }

    private function getReferenceId(
        Request $request
    ): ?int {

        $id = $request->route('id');

        return is_numeric($id)
            ? (int) $id
            : null;
    }

    private function sanitize(
        array $data
    ): array {

        unset(
            $data['password'],
            $data['password_confirmation'],
            $data['token'],
            $data['access_token'],
            $data['refresh_token'],
            $data['recaptcha_token']
        );

        return $data;
    }
}