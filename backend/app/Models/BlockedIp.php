<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class BlockedIp extends Model
{
    protected $fillable = [
        'ip_address',
        'attempts',
        'is_active',
        'last_attempt_at',
        'blocked_until',
        'block_type',
        'reason',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_attempt_at' => 'datetime',
        'blocked_until' => 'datetime',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeCurrentlyBlocked(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q) {
                $q->whereNull('blocked_until')
                    ->orWhere('blocked_until', '>', now());
            });
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->whereNotNull('blocked_until')
            ->where('blocked_until', '<=', now());
    }

    public function scopeByIp(Builder $query, string $ipAddress): Builder
    {
        return $query->where('ip_address', $ipAddress);
    }

    public function scopeAutoBlocked(Builder $query): Builder
    {
        return $query->where('block_type', 'auto');
    }

    public function scopeManuallyBlocked(Builder $query): Builder
    {
        return $query->where('block_type', 'manual');
    }

    public function isBlocked(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->blocked_until === null) {
            return true;
        }

        return now()->lt($this->blocked_until);
    }

    public function block(int $minutes = 60, ?string $reason = null, string $type = 'auto'): void
    {
        $this->update([
            'is_active' => true,
            'blocked_until' => now()->addMinutes($minutes),
            'block_type' => $type,
            'reason' => $reason,
            'last_attempt_at' => now(),
        ]);
    }

    public function unblock(): void
    {
        $this->update([
            'is_active' => false,
            'blocked_until' => null,
        ]);
    }

    public function incrementAttempts(): void
    {
        $this->increment('attempts');
        $this->update(['last_attempt_at' => now()]);
    }

    public static function isIpBlocked(string $ipAddress): bool
    {
        $cacheKey = "blocked_ip:{$ipAddress}";
        
        return Cache::remember($cacheKey, 300, function () use ($ipAddress) {
            $blockedIp = self::byIp($ipAddress)
                ->currentlyBlocked()
                ->first();

            return $blockedIp !== null;
        });
    }

    public static function getBlockedIp(string $ipAddress): ?self
    {
        return self::byIp($ipAddress)->first();
    }

    public static function clearIpCache(string $ipAddress): void
    {
        Cache::forget("blocked_ip:{$ipAddress}");
    }

    public static function getExpiredBlocks(): Builder
    {
        return self::expired();
    }

    public static function cleanupExpiredBlocks(): int
    {
        return self::expired()->update([
            'is_active' => false,
            'blocked_until' => null,
        ]);
    }

    protected static function booted(): void
    {
        static::saved(function ($blockedIp) {
            self::clearIpCache($blockedIp->ip_address);
        });

        static::deleted(function ($blockedIp) {
            self::clearIpCache($blockedIp->ip_address);
        });
    }
}