<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requests_complaint', function (Blueprint $table) {
            $table->id('complaint_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->tinyInteger('priority')->default(1);

            // Foreign Keys
            $table->unsignedBigInteger('account_id');
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');

            // Location Masters (Nullable for complaints)
            $table->unsignedBigInteger('building_id')->nullable();
            $table->foreign('building_id')->references('building_id')->on('building')->onDelete('set null');

            $table->unsignedBigInteger('room_id')->nullable();
            $table->foreign('room_id')->references('room_id')->on('room')->onDelete('set null');

            $table->boolean('credited')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests_complaint');
    }
};
