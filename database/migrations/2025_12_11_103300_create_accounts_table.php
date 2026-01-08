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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id('account_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->enum('role', ['admin', 'student', 'staff', 'teacher']); // Added teacher
            $table->string('otp_code')->nullable();
            $table->timestamp('otp_expires')->nullable();

            // Credit Score
            $table->integer('credit')->default(0);

            // Status Flags
            $table->boolean('verified')->default(false);
            $table->string('status')->default('active'); // e.g., active, suspended
            $table->boolean('job_repair')->default(false);
            $table->boolean('job_admin')->default(false);
            $table->boolean('job_complaint')->default(false);

            $table->rememberToken(); // Standard Laravel auth
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
