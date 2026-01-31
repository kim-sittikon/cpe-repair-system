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
}
