<?php

declare(strict_types=1);

/**
 * Brevo API Configuration
 * 
 * ใช้ hofmannsven/laravel-brevo package สำหรับส่ง email ผ่าน API
 * 
 * @see https://github.com/hofmannsven/laravel-brevo
 */

return [

    /*
     * ----------------------------------------------------
     * Brevo API Key
     * ----------------------------------------------------
     *
     * Getting started with the Brevo API:
     * https://developers.brevo.com/docs/getting-started#quick-start
     *
     * Get your API key:
     * https://app.brevo.com/settings/keys/api
     */

    'api_key' => env('BREVO_KEY', null),

    'partner_key' => env('BREVO_PARTNER_KEY', null),

    /*
     * ----------------------------------------------------
     * API Endpoint
     * ----------------------------------------------------
     *
     * Brevo transactional email endpoint
     */
    'api_url' => env('BREVO_API_URL', 'https://api.brevo.com/v3/smtp/email'),

    /*
     * ----------------------------------------------------
     * Default Sender
     * ----------------------------------------------------
     *
     * ใช้ค่าจาก MAIL_FROM_* ที่มีอยู่ เพื่อความ consistent
     */
    'sender' => [
        'email' => env('MAIL_FROM_ADDRESS', 'no-reply@cpe-repair.rmutt.ac.th'),
        'name' => env('MAIL_FROM_NAME', 'CPE Service System'),
    ],

    /*
     * ----------------------------------------------------
     * HTTP Client Settings
     * ----------------------------------------------------
     */
    'timeout' => env('BREVO_TIMEOUT', 30),
    
    'retry' => [
        'times' => env('BREVO_RETRY_TIMES', 2),
        'sleep_ms' => env('BREVO_RETRY_SLEEP', 100),
    ],

    /*
     * ----------------------------------------------------
     * Logging
     * ----------------------------------------------------
     */
    'log_channel' => env('BREVO_LOG_CHANNEL', 'email'),
];
