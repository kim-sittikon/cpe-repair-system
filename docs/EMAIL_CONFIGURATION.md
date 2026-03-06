# 📧 คู่มือการตั้งค่าระบบส่ง Email - CPE Repair System

> อัปเดตล่าสุด: 2026-02-04

## 🎯 สถานะปัจจุบัน

| รายการ | สถานะ |
|--------|-------|
| **Provider** | Brevo HTTP API |
| **Method** | HTTP API (port 443) |
| **Free Quota** | 300 emails/วัน |
| **Deliverability** | 99% |
| **Queue System** | ✅ Redis + Supervisor |

> ⚠️ **สำคัญ:** ระบบใช้ **Brevo HTTP API** ไม่ใช่ SMTP เพราะ server block SMTP ports

---

## 🔧 Environment Configuration (.env)

```env
# Laravel Mail (fallback - ไม่ได้ใช้จริง)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="no-reply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"

# ⚡ Brevo HTTP API (ใช้จริง)
BREVO_KEY=xkeysib-your-api-key-here

# Queue
QUEUE_CONNECTION=redis
```

> ❌ **อย่าใช้** `MAIL_MAILER=brevo` เพราะ Laravel ไม่รู้จัก mailer นี้  
> ✅ **ใช้** `MAIL_MAILER=log` แทน เพราะเราใช้ Brevo HTTP API โดยตรง

---

## 📁 ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|--------|
| `app/Services/BrevoService.php` | 🌟 Brevo HTTP API client |
| `app/Services/EmailService.php` | ศูนย์กลางการส่ง email |
| `app/Jobs/SendOtpJob.php` | ส่ง OTP |
| `app/Jobs/SendPasswordResetJob.php` | ส่ง Password Reset |
| `app/Jobs/SendInvitationJob.php` | ส่ง Invitation |
| `app/Jobs/SendEmailJob.php` | ส่ง General Email |
| `config/brevo.php` | Brevo config |

---

## 🔧 การใช้งาน

### ส่ง OTP (async)
```php
use App\Services\EmailService;

$requestId = EmailService::sendOtpAsync($email, $otp);
```

### ส่ง Invitation (async)
```php
use App\Services\EmailService;

EmailService::sendInvitation($email, $url, $role);
```

### ส่ง General Email (async)
```php
use App\Services\EmailService;

EmailService::sendQueued($to, $subject, $htmlContent, 'email-type', ['tag1', 'tag2']);
```

### ส่งผ่าน BrevoService โดยตรง
```php
$brevoService = app(\App\Services\BrevoService::class);

// OTP
$response = $brevoService->sendOtpEmail($email, $otp);

// Password Reset
$response = $brevoService->sendPasswordResetEmail($email, $resetUrl);

// Invitation
$response = $brevoService->sendInvitationEmail($email, $inviteUrl, $role);

// Custom Email
$response = $brevoService->sendTransactionalEmail([
    'to' => [['email' => $email]],
    'subject' => 'Test',
    'htmlContent' => '<h1>Hello</h1>',
    'tags' => ['test'],
]);

if ($response->success) {
    echo "Sent! Message ID: {$response->messageId}";
} else {
    echo "Failed: {$response->error}";
}
```

---

## 🚀 Production Setup (Supervisor)

### Config: `/etc/supervisor/conf.d/cpe-worker.conf`

```ini
[program:cpe-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/cpe-repair-system/artisan queue:work --queue=otp-high,default,emails --sleep=2 --tries=3 --timeout=120 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/cpe-repair-system/storage/logs/worker.log
```

### Commands

```bash
# ดูสถานะ
sudo supervisorctl status

# Restart workers
sudo supervisorctl restart cpe-worker:*

# Reload config
sudo supervisorctl reread
sudo supervisorctl update
```

---

## 📊 ดู Logs

```bash
# Worker logs
tail -f storage/logs/worker.log

# Email logs
tail -f storage/logs/email.log

# Laravel logs
tail -f storage/logs/laravel.log
```

---

## 🧪 ทดสอบ

### Test Brevo API Connection
```bash
php artisan tinker --execute="
\$brevo = app(\App\Services\BrevoService::class);
print_r(\$brevo->testConnection());
"
```

### Check Failed Jobs
```bash
php artisan queue:failed
```

### Clear Failed Jobs
```bash
php artisan queue:flush
```

---

## 🔴 Troubleshooting

### ❌ "Mailer [brevo] is not defined"
```bash
# แก้ไข .env
sed -i 's/MAIL_MAILER=brevo/MAIL_MAILER=log/' .env
php artisan config:clear && php artisan cache:clear
```

### ❌ Queue Workers ไม่รัน
```bash
sudo supervisorctl start cpe-worker:*
```

### ❌ Redis Connection refused
```bash
# ตรวจสอบ Redis
systemctl status redis-server

# Restart workers
sudo supervisorctl restart cpe-worker:*
```

---

## 📖 References

- [Brevo API Documentation](https://developers.brevo.com/reference/sendtransacemail)
- [Supervisor Documentation](http://supervisord.org/)
- [Laravel Queues](https://laravel.com/docs/queues)

