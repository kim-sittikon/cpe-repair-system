<?php

namespace App\Services;

use App\Jobs\SendEmailJob;
use App\Mail\OtpMail;
use App\Mail\UserInvitationMail;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Enterprise Email Service
 * 
 * รวมศูนย์การส่ง email ทั้งหมดของระบบ
 * รองรับทั้งแบบ sync (OTP) และ async (queue)
 * 
 * Features:
 * - Sync sending สำหรับ email ที่ต้องส่งทันที (OTP)
 * - Async sending ผ่าน queue สำหรับ email ทั่วไป
 * - Comprehensive logging
 * - Retry mechanism (ผ่าน queue)
 */
class EmailService
{
    /**
     * ส่ง email แบบ sync (สำหรับ email ที่ต้องส่งทันที เช่น OTP)
     * 
     * ⚠️ ใช้เฉพาะกรณีจำเป็น เพราะจะ block request
     */
    public static function sendNow(string $to, Mailable $mailable): bool
    {
        $startTime = microtime(true);
        $emailType = class_basename($mailable);
        
        try {
            Mail::to($to)->send($mailable);
            
            $duration = round((microtime(true) - $startTime) * 1000, 2);
            
            Log::channel('email')->info('✅ Email sent (sync)', [
                'to' => $to,
                'type' => $emailType,
                'duration_ms' => $duration,
            ]);
            
            return true;
            
        } catch (\Exception $e) {
            Log::channel('email')->error('❌ Email failed (sync)', [
                'to' => $to,
                'type' => $emailType,
                'error' => $e->getMessage(),
            ]);
            
            return false;
        }
    }

    /**
     * ส่ง email แบบ async ผ่าน queue
     * 
     * ✅ แนะนำสำหรับ email ทั่วไป - ไม่ block request
     * จะ retry อัตโนมัติถ้าล้มเหลว
     */
    public static function sendQueued(string $to, Mailable $mailable, ?string $emailType = null): void
    {
        SendEmailJob::dispatch($to, $mailable, $emailType);
        
        Log::channel('email')->debug('📤 Email queued', [
            'to' => $to,
            'type' => $emailType ?? class_basename($mailable),
        ]);
    }

    // ========================================
    // Convenience Methods สำหรับ Email แต่ละประเภท
    // ========================================

    /**
     * ส่ง OTP email (sync - ต้องรวดเร็ว)
     * 
     * @param string $email Email ผู้รับ
     * @param string $otp รหัส OTP
     * @return bool สำเร็จหรือไม่
     */
    public static function sendOtp(string $email, string $otp): bool
    {
        return self::sendNow($email, new OtpMail($otp));
    }

    /**
     * ส่ง Invitation email (queued - ไม่เร่งด่วน)
     * 
     * @param string $email Email ผู้รับ
     * @param string $url URL สำหรับ activate account
     * @param string $role Role ที่ได้รับเชิญ
     */
    public static function sendInvitation(string $email, string $url, string $role): void
    {
        self::sendQueued($email, new UserInvitationMail($url, $role), 'invitation');
    }

    // ========================================
    // Utility Methods
    // ========================================

    /**
     * ตรวจสอบว่า email service พร้อมใช้งานหรือไม่
     */
    public static function isReady(): bool
    {
        try {
            $mailer = config('mail.default');
            $host = config('mail.mailers.' . $mailer . '.host');
            
            return !empty($host) && $host !== '127.0.0.1';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get email configuration summary (for debugging)
     */
    public static function getConfigSummary(): array
    {
        return [
            'mailer' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'queue_connection' => config('queue.default'),
        ];
    }

    // ========================================
    // Async OTP Methods (Enterprise-Grade)
    // ========================================

    /**
     * ส่ง OTP email แบบ async (ไม่ block request)
     * 
     * @param string $email Email ผู้รับ
     * @param string $otp รหัส OTP
     * @return string requestId สำหรับ polling status
     */
    public static function sendOtpAsync(string $email, string $otp): string
    {
        $requestId = \Illuminate\Support\Str::uuid()->toString();
        
        // Log: OTP requested
        Log::channel('email')->info('📨 OTP requested', [
            'email' => $email,
            'request_id' => $requestId,
        ]);

        // Mark as pending in cache (ผูก requestId กับ email สำหรับ security)
        $cacheKey = "otp_status_{$requestId}";
        \Illuminate\Support\Facades\Cache::put($cacheKey, [
            'status' => 'pending',
            'email' => $email,
            'created_at' => now()->toIso8601String(),
        ], now()->addMinutes(10));

        // Mark last sent time for rate limiting
        $rateLimitKey = "otp_last_sent_{$email}";
        \Illuminate\Support\Facades\Cache::put($rateLimitKey, now()->timestamp, now()->addMinutes(2));

        // Dispatch to queue
        \App\Jobs\SendOtpJob::dispatch($email, $otp, $requestId);

        return $requestId;
    }

    /**
     * ตรวจสอบสถานะการส่ง OTP
     * 
     * @param string $requestId Request ID จาก sendOtpAsync
     * @param string|null $email Email สำหรับ security check
     * @return array ['status' => 'pending'|'sent'|'failed'|'unknown']
     */
    public static function getOtpStatus(string $requestId, ?string $email = null): array
    {
        $cacheKey = "otp_status_{$requestId}";
        $data = \Illuminate\Support\Facades\Cache::get($cacheKey);

        if (!$data) {
            return ['status' => 'unknown'];
        }

        // Security: ตรวจสอบว่า requestId เป็นของ email ที่ส่งมา
        if ($email && isset($data['email']) && $data['email'] !== $email) {
            Log::channel('email')->warning('⚠️ OTP status check mismatch', [
                'request_id' => $requestId,
                'expected_email' => $data['email'],
                'provided_email' => $email,
            ]);
            return ['status' => 'unknown'];
        }

        return [
            'status' => $data['status'] ?? 'unknown',
            'updated_at' => $data['updated_at'] ?? null,
        ];
    }

    /**
     * ตรวจสอบว่าสามารถส่ง OTP ได้หรือไม่ (rate limiting)
     * 
     * @param string $email Email ที่จะส่ง
     * @return array ['allowed' => bool, 'wait_seconds' => int]
     */
    public static function canSendOtp(string $email): array
    {
        $rateLimitKey = "otp_last_sent_{$email}";
        $lastSent = \Illuminate\Support\Facades\Cache::get($rateLimitKey);
        
        if (!$lastSent) {
            return ['allowed' => true, 'wait_seconds' => 0];
        }

        $elapsed = now()->timestamp - $lastSent;
        $cooldown = 60; // 60 วินาที

        if ($elapsed < $cooldown) {
            return [
                'allowed' => false,
                'wait_seconds' => $cooldown - $elapsed,
            ];
        }

        return ['allowed' => true, 'wait_seconds' => 0];
    }
}

