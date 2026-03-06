# 📧 Email System Documentation

**ระบบส่ง Email - CPE Repair System**

> อัปเดตล่าสุด: 2026-02-04

---

## 🛠 Technology Stack

| Component | Technology | Status |
|-----------|------------|--------|
| **Email API** | Brevo HTTP API (port 443) | ✅ Active |
| **Fallback** | SMTP blocked (port 25/465/587) | ❌ ไม่ใช้ |
| **Sender** | `no-reply@cperepair.app` | ✅ Verified |
| **Queue System** | Laravel Queue (Redis) | ✅ |
| **Worker** | Supervisor (auto-start) | ✅ |

---

## ⚡ สำคัญ: Brevo HTTP API

> **เหตุผลที่ใช้ HTTP API แทน SMTP:**
> - Server block SMTP ports (25, 465, 587)
> - HTTP API ใช้ port 443 (HTTPS) ไม่ถูก block
> - เร็วกว่า SMTP (~200ms vs 2-3s)

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

## 📬 Email Jobs (ทั้งหมดใช้ Brevo HTTP API)

| Email | Job | Queue | Status |
|-------|-----|-------|--------|
| **OTP (สมัครสมาชิก)** | `SendOtpJob` | `otp-high` | ✅ Brevo API |
| **Password Reset** | `SendPasswordResetJob` | `otp-high` | ✅ Brevo API |
| **User Invitation** | `SendInvitationJob` | `default` | ✅ Brevo API |
| **General Email** | `SendEmailJob` | `emails` | ✅ Brevo API |

---

## 📁 Related Files

```
app/
├── Services/
│   ├── BrevoService.php         # 🌟 Brevo HTTP API client
│   └── EmailService.php         # Central email service
└── Jobs/
    ├── SendOtpJob.php           # OTP via Brevo API
    ├── SendPasswordResetJob.php # Password reset via Brevo API
    ├── SendInvitationJob.php    # Invitation via Brevo API
    └── SendEmailJob.php         # General email via Brevo API

config/
├── mail.php                     # Laravel Mail config (fallback)
└── brevo.php                    # Brevo API config

resources/views/emails/
├── otp.blade.php                # OTP template
├── password-reset.blade.php     # Password reset template
└── invitation-html.blade.php    # Invitation template
```

---

## ⚡ Queue Worker Configuration (Production)

### Supervisor Config (`/etc/supervisor/conf.d/cpe-worker.conf`)

```ini
[program:cpe-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/cpe-repair-system/artisan queue:work --queue=otp-high,default,emails --sleep=2 --tries=3 --timeout=120 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stopwaitsecs=3600
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/cpe-repair-system/storage/logs/worker.log
```

### Queue Priority Order
1. `otp-high` - OTP และ Password Reset (ความสำคัญสูงสุด)
2. `default` - Invitation และงานทั่วไป
3. `emails` - General emails

---

## 🔧 Environment Configuration (.env)

```env
# Mail (fallback - ไม่ได้ใช้จริง เพราะใช้ Brevo API)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="no-reply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"

# Brevo HTTP API (ใช้จริง)
BREVO_KEY=xkeysib-your-api-key

# Queue (Redis)
QUEUE_CONNECTION=redis
```

> ⚠️ **สำคัญ:** `MAIL_MAILER=log` ไม่ใช่ `brevo` เพราะระบบใช้ Brevo HTTP API โดยตรงผ่าน `BrevoService`

---

## 🚀 System Boot - Auto-Start Services

หลังเปิดเครื่อง services ต่อไปนี้จะ start อัตโนมัติ:

| Service | Command | Status |
|---------|---------|--------|
| Nginx | `systemctl` | ✅ enabled |
| MySQL | `systemctl` | ✅ enabled |
| PHP-FPM | `systemctl` | ✅ enabled |
| Redis | `systemctl` | ✅ enabled |
| Supervisor | `systemctl` | ✅ enabled |
| Queue Workers | via Supervisor | ✅ 2 processes |

### ตรวจสอบสถานะ

```bash
# Check services
systemctl is-active nginx mysql php8.2-fpm redis-server supervisor

# Check queue workers
sudo supervisorctl status

# Check worker processes
ps aux | grep "queue:work"
```

---

## ✅ Completed Improvements

| Date | Improvement | Impact |
|------|-------------|--------|
| 2026-02-04 | **SendEmailJob ใช้ Brevo API** | All jobs use HTTP API |
| 2026-02-04 | **Fix MAIL_MAILER config** | ป้องกัน "Mailer [brevo] not defined" |
| 2026-02-04 | **Supervisor auto-start** | Workers รันอัตโนมัติหลัง reboot |
| 2026-02-04 | **SendPasswordResetJob** | Password reset ผ่าน Brevo API |
| 2026-02-04 | **SendInvitationJob** | Invitation ผ่าน Brevo API |
| 2026-02-02 | **Brevo HTTP API Integration** | ส่ง email ได้แม้ SMTP ถูก block |
| 2026-02-01 | **Async OTP with Polling** | กดปุ๊บเห็นทันที + polling status |
| 2026-01-31 | DNS Authentication (SPF/DKIM/DMARC) | ป้องกัน spam |

---

## 🧪 Testing & Monitoring

### Test Brevo API Connection
```bash
php artisan tinker --execute="
\$brevo = app(\App\Services\BrevoService::class);
print_r(\$brevo->testConnection());
"
```

### Check Queue Status
```bash
php artisan queue:failed
```

### View Worker Logs
```bash
tail -f storage/logs/worker.log
```

### View Email Logs
```bash
tail -f storage/logs/email.log
```

---

## 📊 Limits & Quotas

| Provider | Free Tier | Limit |
|----------|-----------|-------|
| Brevo | 300 emails/day | ✅ เพียงพอ |

---

## 🔴 Troubleshooting

### ปัญหา: "Mailer [brevo] is not defined"
**สาเหตุ:** `.env` ตั้ง `MAIL_MAILER=brevo` แต่ไม่มี config ใน `mail.php`
**แก้ไข:** 
```bash
sed -i 's/MAIL_MAILER=brevo/MAIL_MAILER=log/' .env
php artisan config:clear && php artisan cache:clear
```

### ปัญหา: Email ไม่ส่ง หลัง reboot
**สาเหตุ:** Queue workers ไม่ start
**ตรวจสอบ:**
```bash
sudo supervisorctl status
# ถ้าไม่รัน:
sudo supervisorctl start cpe-worker:*
```

### ปัญหา: Redis Connection refused
**สาเหตุ:** Redis ยังไม่พร้อมตอน boot
**แก้ไข:** รอสักครู่หรือ restart workers
```bash
sudo supervisorctl restart cpe-worker:*
```

---

## 📖 References

- [Brevo API Documentation](https://developers.brevo.com/reference/sendtransacemail)
- [Laravel Queues](https://laravel.com/docs/queues)
- [Supervisor Documentation](http://supervisord.org/)

