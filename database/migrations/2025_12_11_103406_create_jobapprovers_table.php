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
        Schema::create('jobapprover', function (Blueprint $table) {
            // Primary Key also Foreign Key
            $table->unsignedBigInteger('jobstep_id')->primary();
            $table->foreign('jobstep_id')->references('jobstep_id')->on('jobstep')->onDelete('cascade');

            $table->text('text')->nullable();
            $table->string('action')->nullable(); // e.g. "approved", "rejected"

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobapprover');
    }
};
