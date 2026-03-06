<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('file_job', function (Blueprint $table) {
            $table->unsignedBigInteger('repair_file_id')->nullable()->after('jobstep_id');
            $table->foreign('repair_file_id')->references('file_id')->on('file_repair')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('file_job', function (Blueprint $table) {
            $table->dropForeign(['repair_file_id']);
            $table->dropColumn('repair_file_id');
        });
    }
};
