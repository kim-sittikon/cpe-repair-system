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
 * Job สำหรับส่ง Invitation Email แบบ Async ผ่าน Brevo HTTP API
 * 
 * ⚡ Enterprise-Grade Features:
 * - ใช้ HTTP API (port 443) ไม่โดน block
 * - Response เร็ว ~200ms
 * - Built-in retry ใน BrevoService
 * - Priority Queue: emails
 * 
 * @see App\Services\BrevoService
 */
class SendInvitationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * จำนวนครั้งที่ retry
     */
    public int $tries = 3;

    /**
     * Backoff time (seconds)
     */
    public array $backoff = [5, 15, 30];

    /**
     * Timeout สำหรับ job (seconds)
     */
    public int $timeout = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $email,
        public string $inviteUrl,
        public string $role
    ) {
        // ใช้ default queue เพราะ system config ไม่มี 'emails' queue
        $this->onQueue('default');
    }

    /**
     * Execute the job.
     */
    public function handle(BrevoService $brevoService): void
    {
        Log::channel('email')->info('📧 Invitation job started (Brevo API)', [
            'email' => $this->email,
            'role' => $this->role,
            'attempt' => $this->attempts(),
        ]);

        // ส่ง Invitation ผ่าน Brevo HTTP API
        $response = $brevoService->sendInvitationEmail($this->email, $this->inviteUrl, $this->role);

        if ($response->success) {
            Log::channel('email')->info('✅ Invitation email sent via Brevo API', [
                'email' => $this->email,
                'role' => $this->role,
                'message_id' => $response->messageId,
                'duration_ms' => $response->durationMs,
            ]);
        } else {
            Log::channel('email')->error('❌ Invitation job failed (Brevo API)', [
                'email' => $this->email,
                'role' => $this->role,
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
        Log::channel('email')->error('💀 Invitation job permanently failed', [
            'email' => $this->email,
            'role' => $this->role,
            'error' => $exception?->getMessage(),
        ]);
    }
}
