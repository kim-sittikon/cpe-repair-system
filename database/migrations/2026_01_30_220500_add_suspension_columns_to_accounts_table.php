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
        Schema::table('accounts', function (Blueprint $table) {
            // Only add suspended_by since other suspension columns already exist
            if (!Schema::hasColumn('accounts', 'suspended_by')) {
                $table->unsignedBigInteger('suspended_by')->nullable()->after('suspension_end');
                $table->foreign('suspended_by')->references('account_id')->on('accounts')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            if (Schema::hasColumn('accounts', 'suspended_by')) {
                $table->dropForeign(['suspended_by']);
                $table->dropColumn('suspended_by');
            }
        });
    }
};
