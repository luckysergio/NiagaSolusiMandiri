<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_type_id')
                ->constrained('product_types')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('code', 30)->unique();
            $table->string('name', 150);
            $table->text('description')->nullable();
            
            $table->decimal('price', 15, 2)->default(0);
            $table->string('unit', 20)->default('unit');
            $table->decimal('minimum_order', 15, 2)->default(1);
            
            $table->json('specifications')->nullable();
            
            $table->unsignedInteger('sort_order')->default(0);
            
            $table->boolean('featured')->default(false);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('product_type_id');
            $table->index('name');
            $table->index('code');
            $table->index('is_active');
            $table->index('featured');
            
            $table->index(['product_type_id', 'is_active']);
            $table->index(['product_type_id', 'is_active', 'sort_order']);
            $table->index(['is_active', 'featured']);
            $table->index(['is_active', 'price']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};