<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductCategoryController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\RoleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Struktur route:
| - Public routes (tanpa auth)
| - Authenticated user routes (auth:api)
| - Admin routes (auth:api + role:super_admin)
|
*/

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1');
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATED USER ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:api', 'force.logout'])->group(function () {

    /*
    |----------------------------
    | Auth Session
    |----------------------------
    */
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh'])
            ->middleware('throttle:5,1');
    });

    /*
    |----------------------------
    | User Profile
    |----------------------------
    */
    Route::prefix('user')->group(function () {
        Route::get('/me', [UserProfileController::class, 'me']);
        Route::put('/profile', [UserProfileController::class, 'update']);
        Route::post('/change-password', [UserProfileController::class, 'changePassword']);
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (Super Admin Only)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['auth:api', 'force.logout', 'role:super_admin'])
    ->group(function () {

        /*
        |----------------------------
        | Dashboard & Statistics
        |----------------------------
        */
        Route::get('/stats', [DashboardController::class, 'stats']);

        /*
        |----------------------------
        | Login Logs
        |----------------------------
        */
        Route::prefix('login-logs')->group(function () {
            Route::get('/', [DashboardController::class, 'loginLogs']);
            Route::get('/{id}', [DashboardController::class, 'showLoginLog']);
        });

        /*
        |----------------------------
        | Activity Logs
        |----------------------------
        */
        Route::prefix('activity-logs')->group(function () {
            Route::get('/', [DashboardController::class, 'activityLogs']);
            Route::get('/{id}', [DashboardController::class, 'showActivityLog']);
        });

        /*
        |----------------------------
        | Blocked IPs
        |----------------------------
        */
        Route::prefix('blocked-ips')->group(function () {
            Route::get('/', [DashboardController::class, 'blockedIps']);
            Route::get('/{id}', [DashboardController::class, 'showBlockedIp']);
        });

        /*
        |----------------------------
        | Security Alerts
        |----------------------------
        */
        Route::prefix('security-alerts')->group(function () {
            Route::get('/', [DashboardController::class, 'securityAlerts']);
            Route::get('/{id}', [DashboardController::class, 'showSecurityAlert']);
        });

        Route::prefix('product-categories')->group(function () {
            Route::get('/dropdown', [ProductCategoryController::class, 'dropdown']);
            Route::get('/statistics', [ProductCategoryController::class, 'statistics']);

            Route::get('/', [ProductCategoryController::class, 'index']);
            Route::post('/', [ProductCategoryController::class, 'store']);
            Route::get('/{id}', [ProductCategoryController::class, 'show']);
            Route::put('/{id}', [ProductCategoryController::class, 'update']);
            Route::delete('/{id}', [ProductCategoryController::class, 'destroy']);

            Route::patch('/{id}/toggle-active', [ProductCategoryController::class, 'toggleActive']);
        });

        /*
        |----------------------------
        | Roles Management
        |----------------------------
        */
        Route::prefix('roles')->group(function () {
            // Static routes (HARUS sebelum route dengan parameter)
            Route::get('/dropdown', [RoleController::class, 'dropdown']);
            Route::get('/statistics', [RoleController::class, 'statistics']);

            // Resource routes
            Route::get('/', [RoleController::class, 'index']);
            Route::post('/', [RoleController::class, 'store']);
            Route::get('/{id}', [RoleController::class, 'show']);
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });

        /*
        |----------------------------
        | Users Management
        |----------------------------
        */
        Route::prefix('users')->group(function () {
            // Static routes (HARUS sebelum route dengan parameter)
            Route::get('/roles', [UserController::class, 'getRoles']);
            Route::get('/statistics', [UserController::class, 'getStatistics']);

            // Resource routes
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::delete('/{id}', [UserController::class, 'destroy']);

            // Action routes
            Route::patch('/{id}/activate', [UserController::class, 'activate']);
            Route::patch('/{id}/deactivate', [UserController::class, 'deactivate']);
            Route::patch('/{id}/force-logout', [UserController::class, 'forceLogout']);
            Route::patch('/{id}/reset-lock', [UserController::class, 'resetLock']);
        });
    });
