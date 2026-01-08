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
        Schema::create('request_job_map', function (Blueprint $table) {
            $table->id('map_id');

            // Foreign Keys
            $table->unsignedBigInteger('job_id');
            $table->foreign('job_id')->references('job_id')->on('job')->onDelete('cascade');

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
        Schema::dropIfExists('request_job_map');
    }
};
