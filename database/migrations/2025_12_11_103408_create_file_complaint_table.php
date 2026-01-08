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
        Schema::create('file_complaint', function (Blueprint $table) {
            $table->id('file_id');
            $table->string('file_path');

            // Foreign Key
            $table->unsignedBigInteger('complaint_id');
            $table->foreign('complaint_id')->references('complaint_id')->on('requests_complaint')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_complaint');
    }
};
