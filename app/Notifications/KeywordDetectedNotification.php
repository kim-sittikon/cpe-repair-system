<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KeywordDetectedNotification extends Notification
{
    use Queueable;

    protected $requestModel;
    protected $keywords;

    /**
     * Create a new notification instance.
     */
    public function __construct($requestModel, $keywords)
    {
        $this->requestModel = $requestModel;
        $this->keywords = $keywords;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $id = $this->requestModel->repair_id ?? $this->requestModel->complaint_id;
        $title = $this->requestModel->title;
        $url = url('/dashboard');

        return (new MailMessage)
            ->subject('🚨 แจ้งเตือนด่วน: ตรวจพบคำต้องห้ามในรายการที่ #' . $id)
            ->greeting('เรียน เจ้าหน้าที่ผู้รับผิดชอบ')
            ->line('ระบบได้ตรวจพบการใช้ "คำต้องห้าม" หรือคำที่มีความเสี่ยงสูงในรายการแจ้งปัญหาใหม่ตามรายละเอียดดังนี้:')
            ->line('')
            ->line('📝 **หัวข้อเรื่อง:** ' . $title)
            ->line('⚠️ **คีย์เวิร์ดที่ตรวจพบ:** ' . implode(', ', $this->keywords))
            ->line('')
            ->line('⛔ **การดำเนินการของระบบ:** ระบบได้ปรับระดับความสำคัญของรายการนี้เป็น "CRITICAL" (เร่งด่วนที่สุด) เรียบร้อยแล้ว')
            ->line('กรุณาตรวจสอบและดำเนินการแก้ไขโดยเร็วที่สุด')
            ->action('ตรวจสอบรายการแจ้งปัญหา', $url)
            ->line('ขอบคุณครับ')
            ->salutation('ระบบรับเรื่องแจ้งปัญหา ภาควิศวกรรมคอมพิวเตอร์');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
