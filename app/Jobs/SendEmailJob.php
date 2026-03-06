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
 * Job สำหรับส่ง Email แบบ Queue ผ่าน Brevo HTTP API (Enterprise-level)
 * 
 * ⚡ Enterprise-Grade Features:
 * - ใช้ HTTP API (port 443) ไม่โดน block
 * - Response เร็ว ~200ms
 * - Built-in retry mechanism
 * - Priority Queue: emails
 * 
 * @see App\Services\BrevoService
 */
class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * จำนวนครั้งที่จะลอง retry ถ้าล้มเหลว
     */
    public int $tries = 3;

    /**
     * Backoff times (วินาที) ระหว่าง retry
     */
    public array $backoff = [5, 15, 30];

    /**
     * Timeout ต่อครั้ง (วินาที)
     */
    public int $timeout = 30;

    /**
     * Delete job if model not found
     */
    public bool $deleteWhenMissingModels = true;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $to,
        public string $subject,
        public string $htmlContent,
        public ?string $emailType = 'general',
        public array $tags = []
    ) {
        // ใช้ queue เฉพาะสำหรับ email
        $this->onQueue('emails');
    }

    /**
     * Execute the job.
     */
    public function handle(BrevoService $brevoService): void
    {
        Log::channel('email')->info('📧 SendEmailJob started (Brevo API)', [
            'to' => $this->to,
            'subject' => $this->subject,
            'type' => $this->emailType,
            'attempt' => $this->attempts(),
        ]);

        // ส่ง email ผ่าน Brevo HTTP API
        $response = $brevoService->sendTransactionalEmail([
            'to' => [['email' => $this->to]],
            'subject' => $this->subject,
            'htmlContent' => $this->htmlContent,
            'tags' => array_merge(['general'], $this->tags),
        ]);

        if ($response->success) {
            Log::channel('email')->info('✅ Email sent via Brevo API', [
                'to' => $this->to,
                'type' => $this->emailType,
                'message_id' => $response->messageId,
                'duration_ms' => $response->durationMs,
                'attempt' => $this->attempts(),
            ]);
        } else {
            Log::channel('email')->error('❌ Email failed (Brevo API)', [
                'to' => $this->to,
                'type' => $this->emailType,
                'attempt' => $this->attempts(),
                'error' => $response->error,
                'duration_ms' => $response->durationMs,
            ]);

            // Throw exception เพื่อให้ queue retry
            throw new \Exception("Brevo API failed: {$response->error}");
        }
    }

    /**
     * Handle a job failure (หลังจาก retry หมดแล้ว)
     */
    public function failed(\Throwable $exception): void
    {
        Log::channel('email')->critical('🚨 Email permanently failed after all retries', [
            'to' => $this->to,
            'subject' => $this->subject,
            'type' => $this->emailType,
            'total_attempts' => $this->attempts(),
            'error' => $exception->getMessage(),
        ]);
    }

    /**
     * Get the tags for the job (สำหรับ Laravel Horizon)
     */
    public function tags(): array
    {
        return [
            'email',
            'type:' . $this->emailType,
            'to:' . $this->to,
        ];
    }
}
