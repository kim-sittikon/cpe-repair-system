<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 2. เพิ่มโค้ดบังคับให้ทุกอย่างเป็น HTTPS เมื่อรันผ่าน Ngrok
        if (config('app.env') !== 'local' || env('APP_URL') !== 'http://localhost') {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);
    }
}
