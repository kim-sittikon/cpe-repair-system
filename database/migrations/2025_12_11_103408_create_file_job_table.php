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
        Schema::create('file_job', function (Blueprint $table) {
            $table->id('file_id');
            $table->string('file_path');

            // Foreign Key
            $table->unsignedBigInteger('jobstep_id');
            $table->foreign('jobstep_id')->references('jobstep_id')->on('jobstep')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_job');
    }
};
