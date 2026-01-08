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
        Schema::create('file_repair', function (Blueprint $table) {
            $table->id('file_id');
            $table->string('file_path');

            // Foreign Key
            $table->unsignedBigInteger('repair_id');
            $table->foreign('repair_id')->references('repair_id')->on('requests_repair')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_repair');
    }
};
