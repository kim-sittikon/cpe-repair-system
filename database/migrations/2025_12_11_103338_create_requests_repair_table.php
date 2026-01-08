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
        Schema::create('requests_repair', function (Blueprint $table) {
            $table->id('repair_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->tinyInteger('priority')->default(1);

            // Foreign Keys
            $table->unsignedBigInteger('account_id');
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');

            $table->unsignedBigInteger('building_id');
            $table->foreign('building_id')->references('building_id')->on('building')->onDelete('cascade');

            $table->unsignedBigInteger('room_id');
            $table->foreign('room_id')->references('room_id')->on('room')->onDelete('cascade');

            $table->boolean('credited')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests_repair');
    }
};
