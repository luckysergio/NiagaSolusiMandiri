<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice', 50)->unique();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->date('transaction_date');
            $table->string('customer_name', 150);
            $table->string('project_name', 200)->nullable();
            $table->text('project_address')->nullable();
            $table->string('status', 20)->default('dipesan');
            $table->decimal('total_transaction', 15, 2)->default(0);
            $table->decimal('total_expense', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('invoice');
            $table->index('user_id');
            $table->index('transaction_date');
            $table->index('status');
            $table->index('customer_name');
            $table->index(['transaction_date', 'status']);
            $table->index(['user_id', 'transaction_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};