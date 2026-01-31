<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Job สำหรับส่ง Email แบบ Queue (Enterprise-level)
 * 
 * Features:
 * - Retry 3 ครั้งถ้าล้มเหลว
 * - Exponential backoff (30s, 60s, 120s)
 * - Logging ทุก success/failure
 * - Separate queue สำหรับ email
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
    public array $backoff = [30, 60, 120];

    /**
     * Timeout ต่อครั้ง (วินาที)
     */
    public int $timeout = 30;

    /**
     * Delete job if model not found
     */
    public bool $deleteWhenMissingModels = true;

    protected string $to;
    protected Mailable $mailable;
    protected ?string $emailType;

    /**
     * Create a new job instance.
     */
    public function __construct(string $to, Mailable $mailable, ?string $emailType = null)
    {
        $this->to = $to;
        $this->mailable = $mailable;
        $this->emailType = $emailType ?? class_basename($mailable);
        
        // ใช้ queue เฉพาะสำหรับ email
        $this->onQueue('emails');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $startTime = microtime(true);
        
        try {
            Mail::to($this->to)->send($this->mailable);
            
            $duration = round((microtime(true) - $startTime) * 1000, 2);
            
            Log::channel('email')->info('✅ Email sent successfully', [
                'to' => $this->to,
                'type' => $this->emailType,
                'duration_ms' => $duration,
                'attempt' => $this->attempts(),
            ]);
            
        } catch (\Exception $e) {
            Log::channel('email')->error('❌ Email failed (will retry)', [
                'to' => $this->to,
                'type' => $this->emailType,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
            ]);
            
            throw $e; // Re-throw เพื่อให้ queue retry
        }
    }

    /**
     * Handle a job failure (หลังจาก retry หมดแล้ว)
     */
    public function failed(\Throwable $exception): void
    {
        Log::channel('email')->critical('🚨 Email permanently failed after all retries', [
            'to' => $this->to,
            'type' => $this->emailType,
            'total_attempts' => $this->attempts(),
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
        
        // TODO: อาจเพิ่ม notification ให้ admin ทราบ
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
