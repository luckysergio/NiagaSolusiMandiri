<?php

namespace App\Providers;

use App\Models\ActivityLog;
use App\Observers\ActivityLogObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ActivityLog::observe(ActivityLogObserver::class);
    }
}