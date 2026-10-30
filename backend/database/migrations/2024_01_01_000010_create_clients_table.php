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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['university_colleges', 'schools', 'corporate_banks', 'others'])->default('others')->index();
            $table->string('location')->nullable();
            $table->text('project_details')->nullable();
            $table->string('established', 20)->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};

