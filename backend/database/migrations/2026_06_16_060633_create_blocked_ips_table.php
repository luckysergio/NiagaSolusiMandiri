<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blocked_ips', function (Blueprint $table) {
            $table->id();
            
            $table->string('ip_address', 45)->unique();
            $table->unsignedInteger('attempts')->default(0);
            $table->boolean('is_active')->default(true);
            
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('blocked_until')->nullable();
            
            $table->enum('block_type', [
                'auto',
                'manual'
            ])->default('auto');
            
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'blocked_until']);
            
            $table->index(['blocked_until', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocked_ips');
    }
};