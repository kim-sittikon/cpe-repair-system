<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

/**
 * Brevo HTTP API Service
 * 
 * Enterprise-grade email service ผ่าน Brevo HTTP API
 * ใช้แทน SMTP เพื่อหลีกเลี่ยงปัญหา port block
 * 
 * Features:
 * - HTTP API (port 443) ไม่โดน block
 * - Built-in retry mechanism
 * - Comprehensive logging
 * - Type-safe responses
 * 
 * @see https://developers.brevo.com/reference/sendtransacemail
 */
class BrevoService
{
    private string $apiKey;
    private string $apiUrl;
    private array $sender;
    private int $timeout;
    private array $retryConfig;
    private string $logChannel;

    public function __construct()
    {
        $this->apiKey = config('brevo.api_key', '');
        $this->apiUrl = config('brevo.api_url', 'https://api.brevo.com/v3/smtp/email');
        $this->sender = config('brevo.sender', [
            'email' => config('mail.from.address'),
            'name' => config('mail.from.name'),
        ]);
        $this->timeout = config('brevo.timeout', 30);
        $this->retryConfig = config('brevo.retry', ['times' => 2, 'sleep_ms' => 100]);
        $this->logChannel = config('brevo.log_channel', 'email');
    }

    /**
     * ส่ง OTP Email ผ่าน Brevo API
     * 
     * @param string $email Email ผู้รับ
     * @param string $otp รหัส OTP 6 หลัก
     * @return BrevoResponse
     */
    public function sendOtpEmail(string $email, string $otp): BrevoResponse
    {
        $htmlContent = $this->renderOtpTemplate($otp);
        
        return $this->sendTransactionalEmail([
            'to' => [['email' => $email]],
            'subject' => 'รหัส OTP สำหรับยืนยันตัวตน CPE Repair System',
            'htmlContent' => $htmlContent,
            'tags' => ['otp', 'registration'],
        ]);
    }

    /**
     * ส่ง Password Reset Email ผ่าน Brevo API
     * 
     * @param string $email Email ผู้รับ
     * @param string $resetUrl URL สำหรับรีเซ็ตรหัสผ่าน
     * @return BrevoResponse
     */
    public function sendPasswordResetEmail(string $email, string $resetUrl): BrevoResponse
    {
        $htmlContent = $this->renderPasswordResetTemplate($resetUrl);
        
        return $this->sendTransactionalEmail([
            'to' => [['email' => $email]],
            'subject' => '🔐 CPE Repair System รีเซ็ตรหัสผ่าน',
            'htmlContent' => $htmlContent,
            'tags' => ['password-reset'],
        ]);
    }

    /**
     * ส่ง Invitation Email ผ่าน Brevo API
     * 
     * @param string $email Email ผู้รับ
     * @param string $inviteUrl URL สำหรับ activate account
     * @param string $role Role ที่ได้รับเชิญ
     * @return BrevoResponse
     */
    public function sendInvitationEmail(string $email, string $inviteUrl, string $role): BrevoResponse
    {
        $htmlContent = $this->renderInvitationTemplate($inviteUrl, $role);
        
        return $this->sendTransactionalEmail([
            'to' => [['email' => $email]],
            'subject' => '📧 คำเชิญเข้าร่วมระบบ CPE Repair System',
            'htmlContent' => $htmlContent,
            'tags' => ['invitation', 'user-onboarding'],
        ]);
    }

    /**
     * ส่ง Transactional Email ผ่าน Brevo API
     * 
     * @param array $data Email data
     * @return BrevoResponse
     */
    public function sendTransactionalEmail(array $data): BrevoResponse
    {
        $startTime = microtime(true);
        
        // Validate API key
        if (empty($this->apiKey)) {
            $this->log('error', '❌ Brevo API key not configured');
            return new BrevoResponse(
                success: false,
                messageId: null,
                error: 'Brevo API key not configured',
                durationMs: 0
            );
        }

        // Build payload
        $payload = array_merge([
            'sender' => $this->sender,
        ], $data);

        $this->log('info', '📤 Sending email via Brevo API', [
            'to' => $data['to'][0]['email'] ?? 'unknown',
            'subject' => $data['subject'] ?? 'no-subject',
        ]);

        try {
            $response = Http::withHeaders([
                    'api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->timeout($this->timeout)
                ->retry(
                    $this->retryConfig['times'],
                    $this->retryConfig['sleep_ms'],
                    fn($exception, $request) => $this->shouldRetry($exception)
                )
                ->post($this->apiUrl, $payload);

            $durationMs = round((microtime(true) - $startTime) * 1000, 2);

            if ($response->successful()) {
                $messageId = $response->json('messageId');
                
                $this->log('info', '✅ Email sent via Brevo API', [
                    'to' => $data['to'][0]['email'] ?? 'unknown',
                    'message_id' => $messageId,
                    'duration_ms' => $durationMs,
                ]);

                return new BrevoResponse(
                    success: true,
                    messageId: $messageId,
                    error: null,
                    durationMs: $durationMs
                );
            }

            // API returned error
            $errorMessage = $response->json('message') ?? $response->body();
            $errorCode = $response->json('code') ?? $response->status();
            
            $this->log('error', '❌ Brevo API error', [
                'to' => $data['to'][0]['email'] ?? 'unknown',
                'status' => $response->status(),
                'error' => $errorMessage,
                'code' => $errorCode,
                'duration_ms' => $durationMs,
            ]);

            return new BrevoResponse(
                success: false,
                messageId: null,
                error: "Brevo API error [{$errorCode}]: {$errorMessage}",
                durationMs: $durationMs
            );

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            
            $this->log('error', '❌ Brevo connection failed', [
                'to' => $data['to'][0]['email'] ?? 'unknown',
                'error' => $e->getMessage(),
                'duration_ms' => $durationMs,
            ]);

            return new BrevoResponse(
                success: false,
                messageId: null,
                error: 'Connection failed: ' . $e->getMessage(),
                durationMs: $durationMs
            );

        } catch (\Throwable $e) {
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            
            $this->log('error', '❌ Brevo unexpected error', [
                'to' => $data['to'][0]['email'] ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'duration_ms' => $durationMs,
            ]);

            return new BrevoResponse(
                success: false,
                messageId: null,
                error: 'Unexpected error: ' . $e->getMessage(),
                durationMs: $durationMs
            );
        }
    }

    /**
     * ทดสอบการเชื่อมต่อ Brevo API
     * 
     * @return array
     */
    public function testConnection(): array
    {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'error' => 'API key not configured',
            ];
        }

        try {
            // ใช้ endpoint account เพื่อทดสอบ API key
            $response = Http::withHeaders([
                    'api-key' => $this->apiKey,
                    'Accept' => 'application/json',
                ])
                ->timeout(10)
                ->get('https://api.brevo.com/v3/account');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'email' => $response->json('email'),
                    'plan' => $response->json('plan')[0]['type'] ?? 'unknown',
                    'credits' => $response->json('plan')[0]['credits'] ?? 0,
                ];
            }

            return [
                'success' => false,
                'error' => $response->json('message') ?? 'Unknown error',
                'status' => $response->status(),
            ];

        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Render OTP email template เป็น HTML
     */
    private function renderOtpTemplate(string $otp): string
    {
        // ใช้ blade template ที่มีอยู่
        try {
            return View::make('emails.otp', ['otp' => $otp])->render();
        } catch (\Throwable $e) {
            // Fallback: inline HTML template
            return $this->getOtpFallbackTemplate($otp);
        }
    }

    /**
     * Render Password Reset email template เป็น HTML
     */
    private function renderPasswordResetTemplate(string $resetUrl): string
    {
        try {
            return View::make('emails.password-reset', ['resetUrl' => $resetUrl])->render();
        } catch (\Throwable $e) {
            // Fallback: inline HTML template
            return $this->getPasswordResetFallbackTemplate($resetUrl);
        }
    }

    /**
     * Render Invitation email template เป็น HTML
     */
    private function renderInvitationTemplate(string $inviteUrl, string $role): string
    {
        try {
            return View::make('emails.invitation-html', [
                'url' => $inviteUrl, 
                'role' => $role
            ])->render();
        } catch (\Throwable $e) {
            // Fallback: inline HTML template
            return $this->getInvitationFallbackTemplate($inviteUrl, $role);
        }
    }

    /**
     * Fallback Password Reset template (ใช้กรณี view render ล้มเหลว)
     */
    private function getPasswordResetFallbackTemplate(string $resetUrl): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รีเซ็ตรหัสผ่าน - CPE Repair System</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#e11d48,#be123c);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;">🔐 CPE Repair System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="margin:0 0 20px;color:#64748b;font-size:15px;">คุณได้รับอีเมลนี้เพราะมีคำขอรีเซ็ตรหัสผ่าน</p>
                <a href="{$resetUrl}" style="display:inline-block;background:#1e3a5f;color:#ffffff;padding:16px 40px;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;margin:16px 0;border:2px solid #152d4a;letter-spacing:0.5px;">🔑 ตั้งรหัสผ่านใหม่</a>
                <p style="margin:20px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">⏰ ลิงก์นี้จะหมดอายุใน <strong>60 นาที</strong></p>
                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">🔒 หากคุณไม่ได้ส่งคำขอนี้ ไม่ต้องดำเนินการใดๆ</p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;">CPE Repair System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี</p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * Fallback Invitation template (ใช้กรณี view render ล้มเหลว)
     */
    private function getInvitationFallbackTemplate(string $inviteUrl, string $role): string
    {
        $roleDisplay = ucfirst($role);
        return <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>คำเชิญเข้าร่วมระบบ - CPE Repair System</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;">📧 CPE Repair System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <h2 style="margin:0 0 16px;color:#1f2937;font-size:18px;">ยินดีต้อนรับสู่ระบบ!</h2>
                <p style="margin:0 0 20px;color:#64748b;font-size:15px;">คุณได้รับเชิญให้เข้าร่วมระบบในตำแหน่ง <strong style="color:#f59e0b;">{$roleDisplay}</strong></p>
                <a href="{$inviteUrl}" style="display:inline-block;background:#1e3a5f;color:#ffffff;padding:16px 40px;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;margin:16px 0;border:2px solid #152d4a;letter-spacing:0.5px;">🔑 ตั้งรหัสผ่านและเข้าใช้งาน</a>
                <p style="margin:20px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">⏰ ลิงก์นี้มีอายุ <strong>24 ชั่วโมง</strong></p>
                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">🔒 หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยอีเมลฉบับนี้</p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;">CPE Repair System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี</p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * Fallback OTP template (ใช้กรณี view render ล้มเหลว)
     */
    private function getOtpFallbackTemplate(string $otp): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP - CPE Service</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <div style="display:none;">รหัส OTP: {$otp} (หมดอายุใน 5 นาที)</div>
    
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#e11d48,#be123c);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;">🔐 CPE Service System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="margin:0 0 20px;color:#64748b;font-size:15px;">รหัส OTP สำหรับยืนยันตัวตน</p>
                
                <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:20px;display:inline-block;">
                    <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#dc2626;font-family:'Courier New',monospace;">{$otp}</span>
                </div>
                
                <p style="margin:20px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">
                    ⏰ รหัสนี้จะหมดอายุใน <strong>5 นาที</strong>
                </p>
                
                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">
                    🔒 อย่าแชร์รหัสนี้กับผู้อื่น
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;">
                    CPE Service System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * ตรวจสอบว่าควร retry หรือไม่
     */
    private function shouldRetry(\Throwable $exception): bool
    {
        // Retry สำหรับ connection errors และ 5xx errors
        if ($exception instanceof \Illuminate\Http\Client\ConnectionException) {
            return true;
        }
        
        if ($exception instanceof \Illuminate\Http\Client\RequestException) {
            $status = $exception->response->status();
            return $status >= 500 && $status < 600;
        }

        return false;
    }

    /**
     * Log helper
     */
    private function log(string $level, string $message, array $context = []): void
    {
        Log::channel($this->logChannel)->{$level}($message, $context);
    }

    /**
     * Get current configuration (for debugging)
     */
    public function getConfig(): array
    {
        return [
            'api_url' => $this->apiUrl,
            'sender' => $this->sender,
            'timeout' => $this->timeout,
            'retry' => $this->retryConfig,
            'api_key_configured' => !empty($this->apiKey),
            'api_key_prefix' => !empty($this->apiKey) ? substr($this->apiKey, 0, 10) . '...' : null,
        ];
    }
}

/**
 * Brevo API Response DTO
 */
class BrevoResponse
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $messageId,
        public readonly ?string $error,
        public readonly float $durationMs,
    ) {}

    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'message_id' => $this->messageId,
            'error' => $this->error,
            'duration_ms' => $this->durationMs,
        ];
    }
}
