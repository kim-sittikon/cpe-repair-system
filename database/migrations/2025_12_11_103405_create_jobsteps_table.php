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
        Schema::create('jobstep', function (Blueprint $table) {
            $table->id('jobstep_id');
            $table->string('step_name');
            $table->integer('step_number');
            $table->enum('action', ['act', 'app']);
            $table->string('status')->default('pending');
            $table->text('step_details')->nullable();
            $table->dateTime('completeDT')->nullable();

            // Foreign Keys
            $table->unsignedBigInteger('assigned_account_id')->nullable();
            $table->foreign('assigned_account_id')->references('account_id')->on('accounts')->onDelete('set null');

            $table->unsignedBigInteger('job_id');
            $table->foreign('job_id')->references('job_id')->on('job')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobstep');
    }
};
