<?php

namespace App\Jobs;

use App\Services\BrevoService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job สำหรับส่ง Password Reset Email แบบ Async ผ่าน Brevo HTTP API
 * 
 * ⚡ Enterprise-Grade Features:
 * - ใช้ HTTP API (port 443) ไม่โดน block
 * - Response เร็ว ~200ms (เทียบกับ SMTP 2-3s)
 * - Built-in retry ใน BrevoService
 * - Priority Queue: otp-high (ใช้ร่วมกับ OTP)
 * 
 * @see App\Services\BrevoService
 */
class SendPasswordResetJob implements ShouldQueue
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
        public string $resetUrl
    ) {
        $this->onQueue('otp-high');
    }

    /**
     * Execute the job.
     */
    public function handle(BrevoService $brevoService): void
    {
        Log::channel('email')->info('🔐 Password reset job started (Brevo API)', [
            'email' => $this->email,
            'attempt' => $this->attempts(),
        ]);

        // ส่ง Password Reset ผ่าน Brevo HTTP API
        $response = $brevoService->sendPasswordResetEmail($this->email, $this->resetUrl);

        if ($response->success) {
            Log::channel('email')->info('✅ Password reset email sent via Brevo API', [
                'email' => $this->email,
                'message_id' => $response->messageId,
                'duration_ms' => $response->durationMs,
            ]);
        } else {
            Log::channel('email')->error('❌ Password reset job failed (Brevo API)', [
                'email' => $this->email,
                'attempt' => $this->attempts(),
                'error' => $response->error,
                'duration_ms' => $response->durationMs,
            ]);

            // Throw exception เพื่อให้ queue retry
            throw new \Exception("Brevo API failed: {$response->error}");
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?\Throwable $exception): void
    {
        Log::channel('email')->error('💀 Password reset job permanently failed', [
            'email' => $this->email,
            'error' => $exception?->getMessage(),
        ]);
    }
}
