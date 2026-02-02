<?php

namespace App\Jobs;

use App\Mail\OtpMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Job สำหรับส่ง OTP Email แบบ Async
 * 
 * Features:
 * - Retry 3 ครั้ง (backoff: 5s, 10s, 30s)
 * - Status tracking: pending → sent / failed
 * - Logging สำหรับ debug production
 */
class SendOtpJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * จำนวนครั้งที่ retry
     */
    public int $tries = 3;

    /**
     * Backoff time (seconds) สำหรับแต่ละ retry
     */
    public array $backoff = [5, 10, 30];

    /**
     * Timeout สำหรับ job (seconds)
     */
    public int $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $email,
        public string $otp,
        public string $requestId
    ) {
        // ใช้ queue priority สูงสำหรับ OTP
        $this->onQueue('otp-high');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::channel('email')->info('🚀 OTP job started', [
            'email' => $this->email,
            'request_id' => $this->requestId,
            'attempt' => $this->attempts(),
        ]);

        $startTime = microtime(true);

        try {
            Mail::to($this->email)->send(new OtpMail($this->otp));
            
            $duration = round((microtime(true) - $startTime) * 1000, 2);

            // Mark as sent
            $this->updateStatus('sent');

            Log::channel('email')->info('✅ OTP sent successfully', [
                'email' => $this->email,
                'request_id' => $this->requestId,
                'duration_ms' => $duration,
            ]);

        } catch (\Throwable $e) {
            Log::channel('email')->error('❌ OTP job failed', [
                'email' => $this->email,
                'request_id' => $this->requestId,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
            ]);

            // ถ้าเป็น attempt สุดท้าย ให้ mark เป็น failed
            if ($this->attempts() >= $this->tries) {
                $this->updateStatus('failed');
            }

            throw $e; // Re-throw เพื่อให้ queue retry
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
