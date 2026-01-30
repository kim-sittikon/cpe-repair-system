# คู่มือการตั้งค่าระบบส่ง Email สำหรับ CPE Repair System

## 🔴 ปัญหาปัจจุบัน

ระบบใช้ **Gmail SMTP** ส่ง email แต่มีปัญหา:

| ปัญหา | สาเหตุ |
|-------|--------|
| Email ไม่เข้า @mail.rmutt.ac.th | Microsoft Outlook/Office 365 บล็อก email จาก Gmail SMTP |
| Email เข้า Junk/Spam | ไม่มี SPF/DKIM records ที่ match กับ domain |
| Rate limiting | Gmail จำกัดจำนวน email ที่ส่งได้ต่อวัน |

---

## ✅ ทางเลือกที่แนะนำ

### 1. Brevo (Sendinblue) - **แนะนำสำหรับโปรเจคนี้**

**ข้อดี:**
- ✅ Free 300 emails/day (เพียงพอสำหรับ OTP)
- ✅ Reputation ดี ส่งเข้า Microsoft 365 ได้
- ✅ ตั้งค่าง่าย ใช้ SMTP เหมือนเดิม
- ✅ มี Dashboard ดู statistics

**ขั้นตอนการสมัคร:**
1. ไปที่ [brevo.com](https://www.brevo.com)
2. สมัครบัญชี Free (ใช้ email มหาวิทยาลัยได้)
3. ไปที่ **Settings > SMTP & API**
4. Copy ค่า SMTP credentials

**การตั้งค่า .env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-smtp-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"
```

---

## 🎓 GitHub Student Developer Pack (แนะนำ!)

ถ้าคุณมี **GitHub Education** สามารถใช้บริการ email ฟรีได้หลายตัว:

| Service | สิทธิ์ฟรี | ระยะเวลา |
|---------|----------|----------|
| **Mailgun** | 20,000 emails/month | 12 เดือน |
| **SendGrid** | 15,000 emails/month | ตลอดที่เป็นนักศึกษา |
| **Namecheap** | Free .me domain + Email | 1 ปี |

**วิธีรับสิทธิ์:**
1. ไปที่ [education.github.com/pack](https://education.github.com/pack)
2. หา **Mailgun** หรือ **SendGrid** แล้วกด "Get access"
3. เชื่อมต่อ GitHub Account
4. จะได้รับ coupon code หรือ link สมัครพิเศษ

> **แนะนำ:** ใช้ **Mailgun ผ่าน GitHub Education** เพราะได้ 20,000 emails/month ฟรี ไม่ต้องใช้ Credit Card!

---

### 2. Mailgun - **แนะนำถ้ามี GitHub Education** ⭐

**ข้อดี:**
- ✅ **20,000 emails/month ฟรี** (ถ้าใช้ GitHub Education)
- ✅ ไม่ต้อง Credit Card (ผ่าน GitHub Education)
- ✅ Deliverability สูงมาก ส่งเข้า Microsoft 365 ได้
- ✅ รองรับ Custom Domain (cperepair.app)

**ข้อเสีย (ถ้าไม่มี GitHub Education):**
- ❌ ต้องมี Credit Card สำหรับ verify
- ❌ หลัง trial ต้องจ่ายเงิน

**ขั้นตอนการสมัคร:**
1. ไปที่ [mailgun.com](https://www.mailgun.com)
2. สมัคร Free Account
3. Add และ Verify Domain
4. ไปที่ **Sending > Domain settings > SMTP credentials**

**การตั้งค่า .env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@your-domain.mailgun.org
MAIL_PASSWORD=your-mailgun-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"
```

---

### 3. Amazon SES - ราคาถูกที่สุด

**ข้อดี:**
- ✅ $0.10 per 1,000 emails (ถูกมาก)
- ✅ Scalable ไม่จำกัด
- ✅ Deliverability สูง

**ข้อเสีย:**
- ❌ ตั้งค่าซับซ้อน
- ❌ ต้องมี AWS Account + Credit Card
- ❌ ต้อง verify email/domain ก่อนใช้

**การตั้งค่า .env:**
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=ap-southeast-1
MAIL_FROM_ADDRESS="noreply@cperepair.app"
MAIL_FROM_NAME="CPE Service System"
```

---

### 4. SMTP มหาวิทยาลัย - ถ้ามี

**ข้อดี:**
- ✅ ส่งเข้า @mail.rmutt.ac.th ได้แน่นอน
- ✅ ฟรี ไม่มีค่าใช้จ่าย
- ✅ Reputation ดีเพราะมาจาก domain มหาวิทยาลัย

**ข้อเสีย:**
- ❌ ต้องติดต่อ IT เพื่อขอ credentials
- ❌ อาจมี rate limit หรือข้อจำกัด

**ขั้นตอน:**
1. ติดต่อศูนย์คอมพิวเตอร์ RMUTT
2. ขอ SMTP credentials สำหรับระบบ
3. ถาม port และ encryption settings

---

## 📊 เปรียบเทียบทางเลือก

| Feature | Gmail | Brevo | Mailgun | Amazon SES | RMUTT SMTP |
|---------|-------|-------|---------|------------|------------|
| **ราคา** | ฟรี | ฟรี 300/day | ฟรี 5K/mo | $0.10/1K | ฟรี |
| **ส่งเข้า Outlook** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **ตั้งค่าง่าย** | ✅ | ✅ | ⚠️ | ❌ | ⚠️ |
| **Credit Card** | ไม่ต้อง | ไม่ต้อง | ต้อง | ต้อง | ไม่ต้อง |
| **แนะนำ** | ❌ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐ |

---

## 🛠️ ขั้นตอนการเปลี่ยนแปลง (เมื่อได้ credentials แล้ว)

### Step 1: แก้ไข .env
```bash
# เปิดไฟล์ .env
nano /home/kim/cpe_repair_system/.env

# แก้ไขส่วน Email ตาม provider ที่เลือก
```

### Step 2: Clear Config Cache
```bash
docker compose exec laravel.test php artisan config:clear
```

### Step 3: ทดสอบส่ง Email
```bash
docker compose exec laravel.test php artisan tinker --execute="
\Illuminate\Support\Facades\Mail::raw('Test email from CPE System', function(\$m) {
    \$m->to('your-test-email@mail.rmutt.ac.th')->subject('Test Email');
});
echo 'Email sent!';
"
```

### Step 4: ตรวจสอบ Log
```bash
docker compose exec laravel.test tail -f storage/logs/laravel.log
```

---

## 🎯 คำแนะนำสุดท้าย

1. **สำหรับ Production:** แนะนำ **Brevo** เพราะฟรี ตั้งค่าง่าย และส่งเข้า Microsoft 365 ได้

2. **ถ้าต้องการความน่าเชื่อถือสูงสุด:** ลองติดต่อ IT มหาวิทยาลัยขอ SMTP ก่อน

3. **หลังเปลี่ยน:** อย่าลืมทดสอบส่ง email ไปที่ @mail.rmutt.ac.th ก่อน deploy

---

## 📝 หมายเหตุ

> **สำคัญ:** หลังจากเปลี่ยน email provider แล้ว ต้อง **clear config cache** ทุกครั้ง มิฉะนั้นระบบจะยังใช้ค่าเดิมอยู่

> **Tip:** ถ้าใช้ Brevo หรือ Mailgun สามารถเพิ่ม SPF/DKIM records ใน DNS ของ cperepair.app เพื่อเพิ่ม deliverability ได้อีก
