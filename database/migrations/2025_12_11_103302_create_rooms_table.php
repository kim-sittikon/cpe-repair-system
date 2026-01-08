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
        Schema::create('room', function (Blueprint $table) {
            $table->id('room_id');
            $table->string('room_name');

            // Foreign Keys
            $table->unsignedBigInteger('building_id');
            $table->foreign('building_id')->references('building_id')->on('building')->onDelete('cascade');

            $table->unsignedBigInteger('account_id'); // created_by
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room');
    }
};
