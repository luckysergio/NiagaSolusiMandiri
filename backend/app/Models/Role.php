<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereHas('users', fn($q) => $q->where('is_active', true));
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('display_name', 'like', "%{$search}%");
        });
    }

    public function scopeWithUserCount(Builder $query): Builder
    {
        return $query->withCount('users');
    }

    public function hasUsers(): bool
    {
        return $this->users()->exists();
    }

    public function getUserCount(): int
    {
        return $this->users_count ?? $this->users()->count();
    }
}