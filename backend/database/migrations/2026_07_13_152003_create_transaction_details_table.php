<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')
                ->constrained('transactions')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('unit', 20)->default('unit');
            $table->decimal('product_price', 15, 2)->default(0);
            $table->decimal('qty', 15, 2)->default(0);
            $table->decimal('total_price', 15, 2)->default(0);
            $table->foreignId('supplier_id')
                ->nullable()
                ->constrained('suppliers')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->decimal('expense', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('transaction_id');
            $table->index('product_id');
            $table->index('supplier_id');
            $table->index(['transaction_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
    }
};