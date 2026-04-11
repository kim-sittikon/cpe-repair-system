<?php

namespace App\Jobs;

use App\Services\BrevoService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Job สำหรับส่ง OTP Email แบบ Async ผ่าน Brevo HTTP API
 * 
 * ⚡ Enterprise-Grade Features:
 * - ใช้ HTTP API (port 443) ไม่โดน block
 * - Response เร็ว ~200ms (เทียบกับ SMTP 2-3s)
 * - Built-in retry ใน BrevoService
 * - Priority Queue: otp-high
 * 
 * @see App\Services\BrevoService
 */
class SendOtpJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * จำนวนครั้งที่ retry
     */
    public int $tries = 2;

    /**
     * Backoff time (seconds)
     */
    public array $backoff = [2, 5];

    /**
     * Timeout สำหรับ job (seconds)
     */
    public int $timeout = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $email,
        public string $otp,
        public string $requestId
    ) {
        $this->onQueue('otp-high');
    }

    /**
     * Execute the job.
     */
    public function handle(BrevoService $brevoService): void
    {
        Log::channel('email')->info('🚀 OTP job started (Brevo API)', [
            'email' => $this->email,
            'request_id' => $this->requestId,
            'attempt' => $this->attempts(),
        ]);

        // ส่ง OTP ผ่าน Brevo HTTP API
        $response = $brevoService->sendOtpEmail($this->email, $this->otp);

        if ($response->success) {
            $this->updateStatus('sent');

            Log::channel('email')->info('✅ OTP sent via Brevo API', [
                'email' => $this->email,
                'request_id' => $this->requestId,
                'message_id' => $response->messageId,
                'duration_ms' => $response->durationMs,
            ]);
        } else {
            Log::channel('email')->error('❌ OTP job failed (Brevo API)', [
                'email' => $this->email,
                'request_id' => $this->requestId,
                'attempt' => $this->attempts(),
                'error' => $response->error,
                'duration_ms' => $response->durationMs,
            ]);

            // ถ้าเป็น attempt สุดท้าย ให้ mark เป็น failed
            if ($this->attempts() >= $this->tries) {
                $this->updateStatus('failed');
            }

            // Throw exception เพื่อให้ queue retry
            throw new \Exception("Brevo API failed: {$response->error}");
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        $this->updateStatus('failed');

        Log::channel('email')->error('💀 OTP job permanently failed', [
            'email' => $this->email,
            'request_id' => $this->requestId,
            'error' => $exception?->getMessage(),
        ]);
    }

    /**
     * Update status ใน cache
     */
    private function updateStatus(string $status): void
    {
        $cacheKey = "otp_status_{$this->requestId}";
        Cache::put($cacheKey, [
            'status' => $status,
            'email' => $this->email,
            'updated_at' => now()->toIso8601String(),
        ], now()->addMinutes(10));
    }
}
