<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\RoleController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1');
});

Route::middleware([
    'auth:api',
    'force.logout',
])->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh'])
            ->middleware('throttle:5,1');
    });

    Route::prefix('user')->group(function () {
        Route::get('/me', [UserProfileController::class, 'me']);
        Route::put('/profile', [UserProfileController::class, 'update']);
        Route::post('/change-password', [UserProfileController::class, 'changePassword']);
    });
});

Route::prefix('admin')
    ->middleware([
        'auth:api',
        'force.logout',
        'role:super_admin'
    ])
    ->group(function () {

        Route::get('/stats', [DashboardController::class, 'stats']);

        Route::prefix('login-logs')->group(function () {
            Route::get('/', [DashboardController::class, 'loginLogs']);
            Route::get('/{id}', [DashboardController::class, 'showLoginLog']);
        });

        Route::prefix('activity-logs')->group(function () {
            Route::get('/', [DashboardController::class, 'activityLogs']);
            Route::get('/{id}', [DashboardController::class, 'showActivityLog']);
        });

        Route::prefix('blocked-ips')->group(function () {
            Route::get('/', [DashboardController::class, 'blockedIps']);
            Route::get('/{id}', [DashboardController::class, 'showBlockedIp']);
        });

        Route::prefix('security-alerts')->group(function () {
            Route::get('/', [DashboardController::class, 'securityAlerts']);
            Route::get('/{id}', [DashboardController::class, 'showSecurityAlert']);
        });

        Route::prefix('roles')->group(function () {
            Route::get('/dropdown', [RoleController::class, 'dropdown']);
            Route::get('/statistics', [RoleController::class, 'statistics']);

            Route::get('/', [RoleController::class, 'index']);
            Route::post('/', [RoleController::class, 'store']);
            Route::get('/{id}', [RoleController::class, 'show']);
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });

        Route::prefix('users')->group(function () {

            Route::get('/roles', [UserController::class, 'getRoles']);
            Route::get('/statistics', [UserController::class, 'getStatistics']);

            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);

            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::delete('/{id}', [UserController::class, 'destroy']);

            Route::patch('/{id}/activate', [UserController::class, 'activate']);
            Route::patch('/{id}/deactivate', [UserController::class, 'deactivate']);
            Route::patch('/{id}/force-logout', [UserController::class, 'forceLogout']);
            Route::patch('/{id}/reset-lock', [UserController::class, 'resetLock']);
        });
    });
