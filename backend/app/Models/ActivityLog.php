<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'module',
        'action',
        'reference_id',
        'old_data',
        'new_data',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_data' => 'array',
        'new_data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByModule(Builder $query, string $module): Builder
    {
        return $query->where('module', $module);
    }

    public function scopeByAction(Builder $query, string $action): Builder
    {
        return $query->where('action', $action);
    }

    public function scopeByModuleAndAction(Builder $query, string $module, string $action): Builder
    {
        return $query->where('module', $module)
            ->where('action', $action);
    }

    public function scopeByReference(Builder $query, string $module, int $referenceId): Builder
    {
        return $query->where('module', $module)
            ->where('reference_id', $referenceId);
    }

    public function scopeRecent(Builder $query, int $days = 7): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', today());
    }

    public static function getUserActivities(int $userId, int $limit = 50): \Illuminate\Support\Collection
    {
        return self::with('user:id,name,email')
            ->byUser($userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public static function getModuleActivities(string $module, int $limit = 50): \Illuminate\Support\Collection
    {
        return self::with('user:id,name,email')
            ->byModule($module)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public static function getReferenceHistory(string $module, int $referenceId): \Illuminate\Support\Collection
    {
        return self::with('user:id,name,email')
            ->byReference($module, $referenceId)
            ->orderByDesc('created_at')
            ->get();
    }
}