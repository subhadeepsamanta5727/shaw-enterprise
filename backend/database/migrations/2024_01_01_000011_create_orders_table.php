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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('phone', 25);
            $table->string('email')->nullable();
            $table->text('delivery_address');
            $table->string('city', 100)->default('Kolkata');
            $table->string('pincode', 20)->nullable();
            $table->json('items');
            $table->decimal('total_amount', 12, 2);
            $table->string('payment_method')->default('COD');
            $table->enum('payment_status', ['Pending', 'Paid', 'Failed', 'Refunded'])->default('Pending');
            $table->enum('order_status', ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'])->default('Pending');
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

