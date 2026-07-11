<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_alerts', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('type');
            
            $table->enum('severity', [
                'low',
                'medium',
                'high',
                'critical'
            ])->default('low');
            
            $table->string('ip_address', 45)->nullable();
            $table->json('payload')->nullable();
            
            $table->boolean('resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'resolved', 'created_at']);
            
            $table->index(['severity', 'resolved', 'created_at']);
            
            $table->index(['type', 'created_at']);
            
            $table->index(['resolved', 'severity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_alerts');
    }
};