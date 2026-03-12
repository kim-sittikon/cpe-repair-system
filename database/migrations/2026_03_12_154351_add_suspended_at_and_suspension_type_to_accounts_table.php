<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->timestamp('suspended_at')->nullable()->after('suspended_by');
            $table->string('suspension_type')->nullable()->after('suspended_at'); // 'temporary' or 'permanent'
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn(['suspended_at', 'suspension_type']);
        });
    }
};
