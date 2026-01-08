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
        Schema::create('keyword_matches', function (Blueprint $table) {
            $table->id();
            $table->string('request_type'); // 'repair' or 'complaint'
            $table->unsignedBigInteger('request_id');
            $table->string('keyword');
            $table->string('scope')->default('global'); // 'global' or 'personal'
            $table->unsignedBigInteger('owner_id')->nullable(); // For personal keywords
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keyword_matches');
    }
};
