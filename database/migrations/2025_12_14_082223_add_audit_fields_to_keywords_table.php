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
        Schema::table('keywords', function (Blueprint $table) {
            // Audit columns for tracking who created, edited, and deleted
            $table->unsignedBigInteger('creator_id')->nullable()->after('keyword');
            $table->unsignedBigInteger('editor_id')->nullable()->after('creator_id');
            $table->unsignedBigInteger('deleter_id')->nullable()->after('editor_id');

            // Soft deletes
            $table->softDeletes()->after('deleter_id');

            // Foreign key constraints (pointing to accounts table with account_id)
            $table->foreign('creator_id')->references('account_id')->on('accounts')->onDelete('set null');
            $table->foreign('editor_id')->references('account_id')->on('accounts')->onDelete('set null');
            $table->foreign('deleter_id')->references('account_id')->on('accounts')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('keywords', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['creator_id']);
            $table->dropForeign(['editor_id']);
            $table->dropForeign(['deleter_id']);

            // Drop columns
            $table->dropColumn(['creator_id', 'editor_id', 'deleter_id', 'deleted_at']);
        });
    }
};
