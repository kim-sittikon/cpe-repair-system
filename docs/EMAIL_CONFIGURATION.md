# 📧 คู่มือการตั้งค่าระบบส่ง Email - CPE Repair System

## 🎯 สถานะปัจจุบัน

| รายการ | สถานะ |
|--------|-------|
| **Provider** | Brevo (ฟรี) |
| **Free Quota** | 300 emails/วัน |
| **Deliverability** | 99% |
| **Queue System** | ✅ พร้อมใช้งาน |

---

## 🚀 Quick Setup (3 ขั้นตอน)

### Step 1: สมัคร Brevo
1. ไปที่ [brevo.com](https://www.brevo.com)
2. สมัครบัญชีฟรี (ใช้ email มหาวิทยาลัยได้)
3. ยืนยัน email

### Step 2: Get SMTP Credentials
1. Login เข้า Brevo Dashboard
2. ไปที่ **Settings** (⚙️) → **SMTP & API**
3. Copy ค่า:
   - **SMTP Server:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Login:** (email ที่สมัคร)
   - **SMTP Key:** (กด Generate ถ้ายังไม่มี)

### Step 3: อัพเดต .env

```env
# แก้ไขส่วน Email ใน .env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=YOUR_BREVO_SMTP_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"

# เปิดใช้ Queue
QUEUE_CONNECTION=database
```

```bash
# Clear cache และ start queue worker
docker compose exec laravel.test php artisan config:clear
docker compose exec laravel.test php artisan queue:work --queue=emails &
```

---

## 📁 ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|--------|
| `app/Services/EmailService.php` | ศูนย์กลางการส่ง email |
| `app/Jobs/SendEmailJob.php` | Queue job พร้อม retry |
| `.env.brevo.example` | Template config สำหรับ Brevo |

---

## 🔧 การใช้งาน EmailService

```php
use App\Services\EmailService;

// ส่ง OTP (sync - ทันที)
EmailService::sendOtp($email, $otp);

// ส่ง Invitation (async - queue)
EmailService::sendInvitation($email, $url, $role);
```

---

## 📊 ดู Email Logs

```bash
docker compose exec laravel.test tail -f storage/logs/email.log
```

---

## 🧪 ทดสอบส่ง Email

```bash
docker compose exec laravel.test php artisan tinker --execute="
\App\Services\EmailService::sendOtp('your-email@mail.rmutt.ac.th', '123456');
echo 'Test email sent!';
"
```

---

## ⚡ Optional: เพิ่ม DNS Records (เพิ่ม Deliverability)

ถ้าต้องการ deliverability สูงสุด เพิ่ม DNS ใน Cloudflare:

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `v=spf1 include:sendinblue.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

(Brevo จะแจ้ง DKIM ใน Dashboard ถ้าต้องการ)
