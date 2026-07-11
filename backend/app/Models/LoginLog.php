<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class LoginLog extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'ip_address',
        'user_agent',
        'status',
        'device_id',
        'message',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeFailed(Builder $query): Builder
    {
        return $query->where('status', 'failed');
    }

    public function scopeSuccess(Builder $query): Builder
    {
        return $query->where('status', 'success');
    }

    public function scopeByUserAndStatus(Builder $query, int $userId, string $status): Builder
    {
        return $query->where('user_id', $userId)
            ->where('status', $status);
    }

    public function scopeByEmailAndStatus(Builder $query, string $email, string $status): Builder
    {
        return $query->where('email', $email)
            ->where('status', $status);
    }

    public function scopeByIp(Builder $query, string $ipAddress): Builder
    {
        return $query->where('ip_address', $ipAddress);
    }

    public function scopeRecent(Builder $query, int $minutes = 60): Builder
    {
        return $query->where('created_at', '>=', now()->subMinutes($minutes));
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', today());
    }

    public static function getRecentFailedAttempts(int $userId, int $minutes = 30): int
    {
        return self::byUserAndStatus($userId, 'failed')
            ->recent($minutes)
            ->count();
    }

    public static function getRecentFailedAttemptsByEmail(string $email, int $minutes = 30): int
    {
        return self::byEmailAndStatus($email, 'failed')
            ->recent($minutes)
            ->count();
    }

    public static function getRecentFailedAttemptsByIp(string $ipAddress, int $minutes = 30): int
    {
        return self::byIp($ipAddress)
            ->failed()
            ->recent($minutes)
            ->count();
    }

    public static function getUserLoginHistory(int $userId, int $limit = 50): \Illuminate\Support\Collection
    {
        return self::with('user:id,name,email')
            ->byUser($userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}