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
        Schema::create('announcement', function (Blueprint $table) {
            $table->id('announcement_id');
            $table->string('title');
            $table->text('detail');
            $table->boolean('is_urgent')->default(false);
            $table->string('file')->nullable(); // File path

            // Foreign Keys
            $table->unsignedBigInteger('account_id');
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');

            $table->unsignedBigInteger('building_id')->nullable();
            $table->foreign('building_id')->references('building_id')->on('building')->onDelete('set null');

            $table->unsignedBigInteger('room_id')->nullable();
            $table->foreign('room_id')->references('room_id')->on('room')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement');
    }
};
