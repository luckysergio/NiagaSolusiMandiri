<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductCategoryController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\ProductTypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\SupplierController;
use App\Http\Controllers\Api\Admin\TransactionController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1');
});

Route::middleware(['auth:api', 'force.logout'])->group(function () {

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
    ->middleware(['auth:api', 'force.logout', 'role:super_admin,admin,sales'])
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
        Route::prefix('dashboard')->group(function () {
            Route::get('/transaction-chart', [DashboardController::class, 'transactionChart']);
            Route::get('/top-products', [DashboardController::class, 'topProducts']);
            Route::get('/recent-transactions', [DashboardController::class, 'recentTransactions']);
        });

        Route::prefix('product-categories')->group(function () {
            Route::get('/dropdown', [ProductCategoryController::class, 'dropdown']);
            Route::get('/statistics', [ProductCategoryController::class, 'statistics']);
            Route::get('/next-sort-order', [ProductCategoryController::class, 'nextSortOrder']);
            Route::get('/', [ProductCategoryController::class, 'index']);
            Route::post('/', [ProductCategoryController::class, 'store']);
            Route::get('/{id}', [ProductCategoryController::class, 'show']);
            Route::put('/{id}', [ProductCategoryController::class, 'update']);
            Route::delete('/{id}', [ProductCategoryController::class, 'destroy']);
            Route::patch('/{id}/toggle-active', [ProductCategoryController::class, 'toggleActive']);
        });

        Route::prefix('product-types')->group(function () {
            Route::get('/dropdown', [ProductTypeController::class, 'dropdown']);
            Route::get('/statistics', [ProductTypeController::class, 'statistics']);
            Route::get('/next-sort-order', [ProductTypeController::class, 'nextSortOrder']);
            Route::get('/', [ProductTypeController::class, 'index']);
            Route::post('/', [ProductTypeController::class, 'store']);
            Route::get('/{id}', [ProductTypeController::class, 'show']);
            Route::put('/{id}', [ProductTypeController::class, 'update']);
            Route::delete('/{id}', [ProductTypeController::class, 'destroy']);
            Route::patch('/{id}/toggle-active', [ProductTypeController::class, 'toggleActive']);
        });

        Route::prefix('products')->group(function () {
            Route::get('/dropdown', [ProductController::class, 'dropdown']);
            Route::get('/statistics', [ProductController::class, 'statistics']);
            Route::get('/next-sort-order', [ProductController::class, 'nextSortOrder']);
            Route::get('/generate-code', [ProductController::class, 'generateCode']);

            Route::get('/', [ProductController::class, 'index']);
            Route::post('/', [ProductController::class, 'store']);
            Route::get('/{id}', [ProductController::class, 'show']);
            Route::put('/{id}', [ProductController::class, 'update']);
            Route::delete('/{id}', [ProductController::class, 'destroy']);

            Route::patch('/{id}/toggle-active', [ProductController::class, 'toggleActive']);
            Route::patch('/{id}/toggle-featured', [ProductController::class, 'toggleFeatured']);
        });

        Route::prefix('suppliers')->group(function () {
            Route::get('/dropdown', [SupplierController::class, 'dropdown']);
            Route::get('/statistics', [SupplierController::class, 'statistics']);
            Route::get('/', [SupplierController::class, 'index']);
            Route::post('/', [SupplierController::class, 'store']);
            Route::get('/{id}', [SupplierController::class, 'show']);
            Route::put('/{id}', [SupplierController::class, 'update']);
            Route::delete('/{id}', [SupplierController::class, 'destroy']);
            Route::patch('/{id}/toggle-active', [SupplierController::class, 'toggleActive']);
        });

        Route::prefix('transactions')->group(function () {
            Route::get('/dropdown', [TransactionController::class, 'dropdown']);
            Route::get('/statistics', [TransactionController::class, 'statistics']);
            Route::get('/export-excel', [TransactionController::class, 'exportExcel']);

            Route::get('/', [TransactionController::class, 'index']);
            Route::post('/', [TransactionController::class, 'store']);
            Route::get('/{id}', [TransactionController::class, 'show']);
            Route::put('/{id}', [TransactionController::class, 'update']);
            Route::delete('/{id}', [TransactionController::class, 'destroy']);
            Route::patch('/{id}/change-status', [TransactionController::class, 'changeStatus']);
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
