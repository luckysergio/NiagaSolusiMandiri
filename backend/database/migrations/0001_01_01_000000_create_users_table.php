<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('role_id')
                ->constrained('roles')
                ->restrictOnDelete();

            $table->string('name', 150);
            $table->string('email', 150)->unique();
            $table->string('password');
            
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('failed_login_attempts')->default(0);
            
            $table->timestamp('locked_until')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->string('registered_device_id')->nullable();
            $table->timestamp('force_logout_at')->nullable();
            
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['role_id', 'is_active']);
            
            $table->index(['email', 'is_active']);
            
            $table->index(['is_active', 'locked_until']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};