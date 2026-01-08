<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PersonalKeywordDetectedNotification extends Notification
{
    use Queueable;

    protected $keyword;
    protected $requestModel;

    /**
     * Create a new notification instance.
     */
    public function __construct($keyword, $requestModel)
    {
        $this->keyword = $keyword;
        $this->requestModel = $requestModel;
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
        $title = $this->requestModel->title;
        $id = $this->requestModel->repair_id ?? $this->requestModel->complaint_id;

        return (new MailMessage)
            ->subject('🔔 แจ้งเตือน: พบคีย์เวิร์ด "' . $this->keyword . '" ในรายการใหม่')
            ->greeting('เรียน คุณ ' . ($notifiable->name ?? 'ผู้ใช้งาน'))
            ->line('ระบบตรวจพบรายการแจ้งปัญหาใหม่ที่มี "คีย์เวิร์ด" ที่คุณกำลังติดตามอยู่')
            ->line('')
            ->line('📌 **คีย์เวิร์ดที่พบ:** ' . $this->keyword)
            ->line('📝 **หัวข้อเรื่อง:** ' . $title)
            ->line('')
            ->line('คุณสามารถเข้าไปตรวจสอบรายละเอียดเพิ่มเติมได้ที่ระบบจัดการ')
            ->action('ดูรายละเอียด', url('/dashboard'))
            ->line('ขอบคุณครับ')
            ->salutation('ระบบรับเรื่องแจ้งปัญหา ภาควิชาวิศวกรรมคอมพิวเตอร์');
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
