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
        Schema::table('suspension_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('account_id')->after('id');
            $table->string('action')->after('account_id'); // 'suspend', 'unsuspend'
            $table->string('type')->nullable()->after('action'); // 'temporary', 'permanent'
            $table->text('reason')->after('type');
            $table->unsignedBigInteger('performed_by')->after('reason');
            $table->string('ip_address')->nullable()->after('performed_by');
            $table->text('user_agent')->nullable()->after('ip_address');

            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');
            $table->foreign('performed_by')->references('account_id')->on('accounts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suspension_logs', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropForeign(['performed_by']);
            $table->dropColumn([
                'account_id',
                'action',
                'type',
                'reason',
                'performed_by',
                'ip_address',
                'user_agent',
            ]);
        });
    }
};
