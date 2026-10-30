<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bulk_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->nullable()
                ->constrained('products')
                ->nullOnDelete();
            $table->string('variant_details')->nullable();
            $table->string('client_name');
            $table->string('organization_name')->nullable();
            $table->string('email');
            $table->string('phone', 20);
            $table->integer('quantity');
            $table->string('delivery_city', 100)->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'contacted', 'quoted', 'closed'])
                ->default('pending')
                ->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulk_inquiries');
    }
};

