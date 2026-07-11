<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'password',
        'is_active',
        'failed_login_attempts',
        'locked_until',
        'last_login_at',
        'last_login_ip',
        'registered_device_id',
        'force_logout_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'locked_until' => 'datetime',
        'last_login_at' => 'datetime',
        'force_logout_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = [
        'is_locked',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function loginLogs(): HasMany
    {
        return $this->hasMany(LoginLog::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function securityAlerts(): HasMany
    {
        return $this->hasMany(SecurityAlert::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeActiveByRole(Builder $query, int $roleId): Builder
    {
        return $query->where('role_id', $roleId)
            ->where('is_active', true);
    }

    public function scopeLocked(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where('locked_until', '>', now());
    }

    public function scopeNotLocked(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->whereNull('locked_until')
                ->orWhere('locked_until', '<=', now());
        });
    }

    public function scopeWithEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    public function scopeActiveWithEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email)
            ->where('is_active', true);
    }

    public function hasRole(string $role): bool
    {
        return $this->role?->name === $role;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isLocked(): bool
    {
        return $this->locked_until !== null
            && now()->lt($this->locked_until);
    }

    public function getIsLockedAttribute(): bool
    {
        return $this->isLocked();
    }

    public function lock(int $minutes = 30): void
    {
        $this->update([
            'locked_until' => now()->addMinutes($minutes),
        ]);
    }

    public function unlock(): void
    {
        $this->update([
            'locked_until' => null,
            'failed_login_attempts' => 0,
        ]);
    }

    public function incrementFailedAttempts(): void
    {
        $this->increment('failed_login_attempts');
    }

    public function resetFailedAttempts(): void
    {
        $this->update(['failed_login_attempts' => 0]);
    }

    public function recordLogin(string $ip): void
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);
    }

    public function forceLogout(): void
    {
        $this->update([
            'force_logout_at' => now(),
        ]);
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->role?->name,
        ];
    }
    
    public static function findByEmailWithRole(string $email): ?self
    {
        return self::with('role')
            ->where('email', $email)
            ->first();
    }

    public static function findActiveByEmail(string $email): ?self
    {
        return self::with('role')
            ->where('email', $email)
            ->where('is_active', true)
            ->first();
    }

    public static function getLockedUsers(): Builder
    {
        return self::with('role')
            ->where('is_active', true)
            ->where('locked_until', '>', now());
    }
}