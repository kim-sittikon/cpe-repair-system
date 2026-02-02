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
        // Add completion fields to requests_repair table
        Schema::table('requests_repair', function (Blueprint $table) {
            $table->text('completion_notes')->nullable()->after('credited');
            $table->timestamp('completed_at')->nullable()->after('completion_notes');
            $table->unsignedBigInteger('completed_by')->nullable()->after('completed_at');
            $table->foreign('completed_by')->references('account_id')->on('accounts')->onDelete('set null');
        });

        // Add file_type to file_repair table to distinguish request vs completion files
        Schema::table('file_repair', function (Blueprint $table) {
            $table->string('file_type')->default('request')->after('file_path');
            // 'request' = files from reporter, 'completion' = files from staff when completing
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests_repair', function (Blueprint $table) {
            $table->dropForeign(['completed_by']);
            $table->dropColumn(['completion_notes', 'completed_at', 'completed_by']);
        });

        Schema::table('file_repair', function (Blueprint $table) {
            $table->dropColumn('file_type');
        });
    }
};
