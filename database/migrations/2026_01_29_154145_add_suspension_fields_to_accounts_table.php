<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->timestamp('suspension_start')->nullable();
            $table->timestamp('suspension_end')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->unsignedBigInteger('suspended_by')->nullable();
            $table->foreign('suspended_by')->references('account_id')->on('accounts')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['suspended_by']);
            $table->dropColumn(['suspension_start', 'suspension_end', 'suspension_reason', 'suspended_by']);
        });
    }
};
