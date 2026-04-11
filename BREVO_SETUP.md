# 📧 คู่มือตั้งค่า Brevo สำหรับระบบอีเมล

## ทำไมต้อง Brevo?

ระบบ CPE Repair System ใช้ **Brevo** (เดิมชื่อ Sendinblue) ส่งอีเมลสำหรับ:
- 🔑 **OTP** — รหัสยืนยันตัวตนเมื่อ Login
- ✉️ **เชิญผู้ใช้** — ส่งลิงก์เชิญนักศึกษาเข้าระบบ
- 🔒 **รีเซ็ตรหัสผ่าน** — ส่งลิงก์ตั้งรหัสผ่านใหม่

> **ถ้าไม่ตั้งค่า Brevo** → ระบบยังทำงานได้ แต่ส่งอีเมลไม่ได้
> OTP จะอยู่ใน log แทน (ดูด้วยคำสั่ง Docker)

---

## ขั้นตอนที่ 1: สมัครบัญชี Brevo (ฟรี)

1. เปิดเว็บ: **https://www.brevo.com**
2. กด **Sign up free**
3. กรอก Email + Password
4. ยืนยัน Email (เปิด inbox กด Confirm)
5. กรอกข้อมูลบริษัท (ใส่ชื่อมหาวิทยาลัยได้):
   - Company name: `RMUTT - CPE Department`
   - Website: ใส่ URL ของระบบ หรือ `https://www.rmutt.ac.th`

> **แผนฟรีได้ 300 อีเมล/วัน** — เพียงพอสำหรับระบบซ่อมภายในคณะ

---

## ขั้นตอนที่ 2: สร้าง API Key

1. Login เข้า Brevo แล้วไปที่:
   **https://app.brevo.com/settings/keys/api**

   หรือกดตาม: **ชื่อบัญชี (มุมขวาบน)** → **SMTP & API** → **API Keys**

2. กด **Generate a new API key**
3. ตั้งชื่อ: `CPE Repair System`
4. กด **Generate**
5. **คัดลอก API Key ทันที!** (จะแสดงแค่ครั้งเดียว)

   API Key จะมีหน้าตาแบบนี้:
   ```
   xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
   ```

---

## ขั้นตอนที่ 3: สร้าง SMTP Key

1. ยังอยู่ในหน้า **SMTP & API** → กดที่แท็บ **SMTP**
2. กด **Generate a new SMTP key**
3. ตั้งชื่อ: `CPE Repair SMTP`
4. กด **Generate**
5. คัดลอก:
   - **Login**: (Email ที่สมัคร Brevo)
   - **SMTP Key/Password**: จะเป็นรหัสยาวๆ ที่ generate มา

---

## ขั้นตอนที่ 4: ใส่ค่าในไฟล์ .env

เปิดไฟล์ `.env` แล้วแก้ค่าตรงส่วน Email:

```env
# เปลี่ยนจาก log เป็น smtp
MAIL_MAILER=smtp

# ค่าเหล่านี้ใช้ค่านี้ได้เลย (ไม่ต้องแก้)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=465
MAIL_ENCRYPTION=ssl

# ← แก้ตรงนี้: ใส่ค่าจากขั้นตอนที่ 3
MAIL_USERNAME=email-ที่สมัคร-brevo@example.com
MAIL_PASSWORD=smtp-key-ที่-generate-มา

# ← แก้ตรงนี้: ใส่ค่าจากขั้นตอนที่ 2
BREVO_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxx
```

---

## ขั้นตอนที่ 5: Restart ระบบ

```bash
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d
```

---

## ทดสอบว่าทำงานได้

1. เปิดเว็บระบบ
2. กด **Login** → ใส่ Email
3. ระบบจะส่ง OTP ไปที่ Email จริง
4. ตรวจสอบ inbox → ต้องได้รับรหัส OTP

---

## Troubleshooting

### ไม่ได้รับ Email?

```bash
# ดู log ว่ามี error อะไร
docker compose -f docker-compose.production.yml logs app | grep -i mail
docker compose -f docker-compose.production.yml logs app | grep -i brevo
docker compose -f docker-compose.production.yml logs app | grep -i error
```

### Email อยู่ใน Spam?
- ตรวจสอบโฟลเดอร์ Spam/Junk ใน Email
- Brevo แผนฟรีอาจถูก filter โดยบาง Email provider

### ยังใช้ OTP จาก log ได้ (ถ้ายังตั้งค่าไม่เสร็จ)
```bash
docker compose -f docker-compose.production.yml logs app | grep -i otp
```

---

## สรุป

| ค่า | จะเอามาจากไหน |
|-----|---------------|
| `BREVO_KEY` | SMTP & API → API Keys → Generate |
| `MAIL_USERNAME` | Email ที่ใช้สมัคร Brevo |
| `MAIL_PASSWORD` | SMTP & API → SMTP → Generate SMTP key |
