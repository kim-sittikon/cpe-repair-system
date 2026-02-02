# 📧 Email System Documentation

**ระบบส่ง Email - CPE Repair System**

> อัปเดตล่าสุด: 2026-02-01

---

## 🛠 Technology Stack

| Component | Technology | Status |
|-----------|------------|--------|
| **SMTP Provider** | Brevo (Sendinblue) | ✅ Active |
| **SMTP Host** | `smtp-relay.brevo.com:587` | ✅ |
| **Encryption** | TLS | ✅ |
| **Sender** | `no-reply@cperepair.app` | ✅ Verified |
| **Queue System** | Laravel Queue (Database driver) | ✅ |
| **Worker** | Docker container (auto-start) | ✅ |

---

## 📋 DNS Authentication (Cloudflare)

| Record | Type | Status |
|--------|------|--------|
| SPF | TXT `v=spf1 include:spf.brevo.com ~all` | ✅ |
| DKIM 1 | CNAME `brevo1._domainkey` | ✅ |
| DKIM 2 | CNAME `brevo2._domainkey` | ✅ |
| DMARC | TXT `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | ✅ |
| Brevo Code | TXT | ✅ |

**Deliverability Rating: ✅ Excellent**

---

## 📬 Email Types

| Email | Method | File | Speed |
|-------|--------|------|-------|
| **OTP (สมัครสมาชิก)** | Queue ✅ | `SendOtpJob.php` | ทันที (async) |
| **Password Reset** | Queue ✅ | `ResetPasswordNotification.php` | ทันที |
| **User Invitation** | Queue | `UserInvitationMail.php` | ทันที |
| **Keyword Alert** | Queue | `KeywordDetectedNotification.php` | ทันที |

---

## 📁 Related Files

```
app/
├── Mail/
│   ├── OtpMail.php              # OTP email template
│   └── UserInvitationMail.php   # Invitation (queue)
├── Notifications/
│   ├── ResetPasswordNotification.php    # Reset password (queue)
│   ├── KeywordDetectedNotification.php  # Keyword alert
│   └── PersonalKeywordDetectedNotification.php
├── Services/
│   └── EmailService.php         # Central email service
└── Jobs/
    ├── SendEmailJob.php         # General queue job
    └── SendOtpJob.php           # 🆕 Async OTP job

resources/views/emails/
└── otp.blade.php                # OTP email template (custom HTML)

config/
└── mail.php                     # Mail configuration

storage/logs/
└── email-*.log                  # Email logs
```

---

## 🚀 Async OTP System (2026-02-01)

### Features

| Feature | Description |
|---------|-------------|
| ✅ **Async Sending** | ส่ง OTP ผ่าน Queue ไม่ block request |
| ✅ **Polling UI** | Frontend poll status ทุก 800ms |
| ✅ **Rate Limiting** | 60 วินาที cooldown ต่อ email |
| ✅ **Status Tracking** | pending → sent / failed |
| ✅ **Security Binding** | requestId ผูกกับ email |
| ✅ **Retry 3x** | Backoff: 5s, 10s, 30s |

### New Files

| File | Description |
|------|-------------|
| `app/Jobs/SendOtpJob.php` | Queue job with retry logic |
| `routes/web.php` → `/otp-status/{id}` | Status check endpoint |

### Modified Files

| File | Changes |
|------|---------|
| `app/Services/EmailService.php` | + `sendOtpAsync()`, `getOtpStatus()`, `canSendOtp()` |
| `app/Http/Controllers/Auth/RegisteredUserController.php` | ใช้ async + rate limit |
| `resources/js/Pages/Auth/Register.jsx` | Polling UI + status colors |
| `compose.yaml` | เพิ่ม `otp-high` queue |

### Logs

```log
[15:26:19] 📨 OTP requested {"email":"test@mail.rmutt.ac.th","request_id":"..."}
[15:26:19] 🚀 OTP job started {attempt:1}
[15:26:20] ✅ OTP sent successfully {duration_ms: 583}
```

---

## ⚡ Queue Worker Configuration

### Docker Compose (Auto-start)

```yaml
queue-worker:
    restart: always
    image: sail-8.5/app
    entrypoint: ["php", "/var/www/html/artisan", "queue:work", 
                 "--queue=otp-high,default,emails", "--sleep=3", "--tries=3"]
    depends_on:
        - laravel.test
        - mysql
        - redis
```

### Manual (Development)

```bash
docker compose exec laravel.test php artisan queue:work --queue=default,emails &
```

---

## 🔧 Environment Configuration (.env)

```env
# Email (Brevo SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-brevo-email@smtp-brevo.com
MAIL_PASSWORD=xsmtpsib-your-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"

# Queue (for email)
QUEUE_CONNECTION=database
```

---

## ✅ Completed Improvements

| Date | Improvement | Impact |
|------|-------------|--------|
| 2026-02-01 | **Async OTP with Polling** | กดปุ๊บเห็นทันที + polling status |
| 2026-02-01 | Queue Password Reset | กดปุ๊บเห็นข้อความทันที |
| 2026-02-01 | Auto-start Queue Worker | รันอัตโนมัติพร้อม Docker |
| 2026-01-31 | Brevo SMTP Integration | 99% deliverability |
| 2026-01-31 | DNS Authentication (SPF/DKIM/DMARC) | ป้องกัน spam |

---

## 🚧 Pending Improvements

| Priority | Improvement | Effort | Benefit |
|----------|-------------|--------|---------|
| 🟢 LOW | Custom Reset Password template | 2 hrs | Branding สม่ำเสมอ |
| ⚪ OPTIONAL | Dedicated IP (Brevo) | $12/mo | Deliverability สูงขึ้น |

---

## 🧪 Testing & Monitoring

### Test Email Configuration
```bash
docker compose exec laravel.test php artisan tinker --execute="
print_r(\App\Services\EmailService::getConfigSummary());
"
```

### Check Queue Status
```bash
docker compose exec laravel.test php artisan tinker --execute="
echo 'Pending: ' . DB::table('jobs')->count();
echo ', Failed: ' . DB::table('failed_jobs')->count();
"
```

### View Email Logs
```bash
docker compose exec laravel.test tail -f storage/logs/email-*.log
```

### View Queue Worker Logs
```bash
docker compose logs queue-worker --tail 20
```

---

## 📊 Limits & Quotas

| Provider | Free Tier | Limit |
|----------|-----------|-------|
| Brevo | 300 emails/day | ✅ เพียงพอ |

---

## 📖 References

- [Brevo Documentation](https://developers.brevo.com/)
- [Laravel Mail](https://laravel.com/docs/mail)
- [Laravel Queues](https://laravel.com/docs/queues)
