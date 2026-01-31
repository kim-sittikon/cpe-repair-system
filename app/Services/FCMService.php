<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Firebase\Exception\MessagingException;

class FCMService
{
    protected $messaging;
    protected $isEnabled = false;

    public function __construct()
    {
        $credentialsPath = storage_path('app/firebase-credentials.json');
        
        if (file_exists($credentialsPath)) {
            try {
                $factory = (new Factory)->withServiceAccount($credentialsPath);
                $this->messaging = $factory->createMessaging();
                $this->isEnabled = true;
            } catch (\Exception $e) {
                \Log::warning('Firebase initialization failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * Check if FCM is properly configured
     */
    public function isEnabled(): bool
    {
        return $this->isEnabled;
    }

    /**
     * Send notification to a single user
     */
    public function sendToUser($user, string $title, string $body, array $data = []): bool
    {
        if (!$this->isEnabled || !$user->fcm_token) {
            return false;
        }

        return $this->sendToToken($user->fcm_token, $title, $body, $data, $user);
    }

    /**
     * Send notification to a specific token
     */
    public function sendToToken(string $token, string $title, string $body, array $data = [], $user = null): bool
    {
        if (!$this->isEnabled) {
            return false;
        }

        try {
            $message = CloudMessage::withTarget('token', $token)
                ->withNotification(Notification::create($title, $body))
                ->withData($data);

            $this->messaging->send($message);
            
            \Log::info('FCM notification sent', [
                'title' => $title,
                'token' => substr($token, 0, 20) . '...'
            ]);
            
            return true;
        } catch (MessagingException $e) {
            // Token is invalid or expired - remove it
            if (str_contains($e->getMessage(), 'not-registered') || 
                str_contains($e->getMessage(), 'invalid-registration-token')) {
                if ($user) {
                    $user->update(['fcm_token' => null, 'fcm_token_updated_at' => null]);
                    \Log::info('Invalid FCM token removed for user: ' . $user->account_id);
                }
            }
            
            \Log::error('FCM send failed', [
                'error' => $e->getMessage(),
                'token' => substr($token, 0, 20) . '...'
            ]);
            
            return false;
        } catch (\Exception $e) {
            \Log::error('FCM unexpected error', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Send notification to multiple users
     */
    public function sendToMultiple(array $tokens, string $title, string $body, array $data = []): array
    {
        if (!$this->isEnabled || empty($tokens)) {
            return ['success' => 0, 'failure' => count($tokens)];
        }

        try {
            $message = CloudMessage::new()
                ->withNotification(Notification::create($title, $body))
                ->withData($data);

            $report = $this->messaging->sendMulticast($message, $tokens);
            
            return [
                'success' => $report->successes()->count(),
                'failure' => $report->failures()->count(),
                'invalid_tokens' => $report->invalidTokens()
            ];
        } catch (\Exception $e) {
            \Log::error('FCM multicast failed', ['error' => $e->getMessage()]);
            return ['success' => 0, 'failure' => count($tokens)];
        }
    }

    /**
     * Send notification when a repair is assigned to a technician
     */
    public function notifyRepairAssigned($technician, $repair): bool
    {
        return $this->sendToUser(
            $technician,
            'งานใหม่มอบหมายให้คุณ',
            "งาน #RP" . str_pad($repair->repair_id, 4, '0', STR_PAD_LEFT) . ": " . mb_substr($repair->title, 0, 50),
            [
                'type' => 'repair_assigned',
                'repair_id' => (string) $repair->repair_id,
                'url' => "/repairs/status?ids={$repair->repair_id}"
            ]
        );
    }

    /**
     * Send notification when repair status changes
     */
    public function notifyRepairStatusChanged($reporter, $repair, string $newStatus): bool
    {
        $statusMap = [
            'รับเรื่อง' => 'ได้รับการรับเรื่องแล้ว',
            'กำลังดำเนินการ' => 'กำลังดำเนินการซ่อม',
            'เสร็จสิ้น' => 'ซ่อมเสร็จเรียบร้อยแล้ว',
            'ยกเลิก' => 'ถูกยกเลิก'
        ];

        $statusText = $statusMap[$newStatus] ?? $newStatus;
        $repairCode = 'RP' . str_pad($repair->repair_id, 4, '0', STR_PAD_LEFT);

        return $this->sendToUser(
            $reporter,
            'สถานะงานซ่อมอัพเดท',
            "งาน #{$repairCode} {$statusText}",
            [
                'type' => 'repair_status_changed',
                'repair_id' => (string) $repair->repair_id,
                'status' => $newStatus,
                'url' => "/my-reports"
            ]
        );
    }

    /**
     * Send notification when complaint status changes
     */
    public function notifyComplaintStatusChanged($reporter, $complaint, string $newStatus): bool
    {
        $statusMap = [
            'รับเรื่อง' => 'ได้รับการรับเรื่องแล้ว',
            'กำลังดำเนินการ' => 'กำลังตรวจสอบ',
            'เสร็จสิ้น' => 'ดำเนินการเรียบร้อยแล้ว',
            'ยกเลิก' => 'ถูกยกเลิก'
        ];

        $statusText = $statusMap[$newStatus] ?? $newStatus;
        $complaintCode = 'CM' . str_pad($complaint->complaint_id, 4, '0', STR_PAD_LEFT);

        return $this->sendToUser(
            $reporter,
            'สถานะเรื่องร้องเรียนอัพเดท',
            "เรื่อง #{$complaintCode} {$statusText}",
            [
                'type' => 'complaint_status_changed',
                'complaint_id' => (string) $complaint->complaint_id,
                'status' => $newStatus,
                'url' => "/my-reports"
            ]
        );
    }

    /**
     * Send notification to all repair staff when new repair is created
     */
    public function notifyRepairStaff($repair): array
    {
        // Get all users with job_repair = true and have FCM token
        $repairStaff = \App\Models\Account::where('job_repair', true)
            ->whereNotNull('fcm_token')
            ->get();

        if ($repairStaff->isEmpty()) {
            \Log::info('No repair staff with FCM tokens found');
            return ['success' => 0, 'failure' => 0, 'total_staff' => 0];
        }

        $tokens = $repairStaff->pluck('fcm_token')->toArray();
        $repairCode = 'RP' . str_pad($repair->repair_id, 4, '0', STR_PAD_LEFT);
        
        $title = '🔧 แจ้งซ่อมใหม่';
        $body = "#{$repairCode}: " . mb_substr($repair->title, 0, 50);
        
        $result = $this->sendToMultiple($tokens, $title, $body, [
            'type' => 'new_repair',
            'repair_id' => (string) $repair->repair_id,
            'url' => "/repairs/list"
        ]);

        $result['total_staff'] = count($repairStaff);
        
        \Log::info('Notified repair staff', $result);
        
        return $result;
    }

    /**
     * Send notification to all complaint staff when new complaint is created
     */
    public function notifyComplaintStaff($complaint): array
    {
        // Get all users with job_complaint = true and have FCM token
        $complaintStaff = \App\Models\Account::where('job_complaint', true)
            ->whereNotNull('fcm_token')
            ->get();

        if ($complaintStaff->isEmpty()) {
            \Log::info('No complaint staff with FCM tokens found');
            return ['success' => 0, 'failure' => 0, 'total_staff' => 0];
        }

        $tokens = $complaintStaff->pluck('fcm_token')->toArray();
        $complaintCode = 'CM' . str_pad($complaint->complaint_id, 4, '0', STR_PAD_LEFT);
        
        $title = '📋 ร้องเรียนใหม่';
        $body = "#{$complaintCode}: " . mb_substr($complaint->title, 0, 50);
        
        $result = $this->sendToMultiple($tokens, $title, $body, [
            'type' => 'new_complaint',
            'complaint_id' => (string) $complaint->complaint_id,
            'url' => "/complaints/list"
        ]);

        $result['total_staff'] = count($complaintStaff);
        
        \Log::info('Notified complaint staff', $result);
        
        return $result;
    }
}

