<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class SecurityAlert extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'severity',
        'ip_address',
        'payload',
        'resolved',
        'resolved_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeBySeverity(Builder $query, string $severity): Builder
    {
        return $query->where('severity', $severity);
    }

    public function scopeUnresolved(Builder $query): Builder
    {
        return $query->where('resolved', false);
    }

    public function scopeResolved(Builder $query): Builder
    {
        return $query->where('resolved', true);
    }

    public function scopeCritical(Builder $query): Builder
    {
        return $query->where('severity', 'critical');
    }

    public function scopeHigh(Builder $query): Builder
    {
        return $query->where('severity', 'high');
    }

    public function scopeBySeverityAndStatus(Builder $query, string $severity, bool $resolved = false): Builder
    {
        return $query->where('severity', $severity)
            ->where('resolved', $resolved);
    }

    public function scopeRecent(Builder $query, int $days = 7): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', today());
    }

    public function resolve(): void
    {
        $this->update([
            'resolved' => true,
            'resolved_at' => now(),
        ]);
    }

    public function isCritical(): bool
    {
        return $this->severity === 'critical';
    }

    public function isHigh(): bool
    {
        return $this->severity === 'high';
    }

    public static function getUnresolvedAlerts(int $limit = 50): \Illuminate\Support\Collection
    {
        return self::with('user:id,name,email')
            ->unresolved()
            ->orderByDesc('severity')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public static function getUserAlerts(int $userId, int $limit = 50): \Illuminate\Support\Collection
    {
        return self::byUser($userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public static function getCriticalAlerts(int $limit = 50): \Illuminate\Support\Collection
    {
        return self::with('user:id,name,email')
            ->critical()
            ->unresolved()
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public static function countUnresolvedBySeverity(): array
    {
        return self::unresolved()
            ->selectRaw('severity, COUNT(*) as count')
            ->groupBy('severity')
            ->pluck('count', 'severity')
            ->toArray();
    }
}