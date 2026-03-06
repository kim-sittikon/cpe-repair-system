<h1 align="center">
  🔧 ระบบแจ้งซ่อมและร้องเรียน ภาควิชาวิศวกรรมคอมพิวเตอร์<br>
  CPE Repair & Complaint Management System
</h1>

<p align="center">
  <strong>โครงงานวิศวกรรมคอมพิวเตอร์ (04-620-402)</strong><br>
  ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์<br>
  มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white" alt="Laravel 12">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18">
  <img src="https://img.shields.io/badge/Inertia.js-2.0-9553E9?logo=inertia&logoColor=white" alt="Inertia.js">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa&logoColor=white" alt="PWA">
</p>

<p align="center">
  <a href="https://cpe-repair.rmutt.ac.th">🌐 Production</a> •
  <a href="#ฟีเจอร์หลัก">✨ ฟีเจอร์</a> •
  <a href="#สถาปัตยกรรมระบบ">🏗️ สถาปัตยกรรม</a> •
  <a href="#การติดตั้ง">🚀 ติดตั้ง</a> •
  <a href="#โครงสร้างฐานข้อมูล">🗄️ ฐานข้อมูล</a>
</p>

---

## 📋 บทคัดย่อ

ระบบแจ้งซ่อมและร้องเรียนสำหรับภาควิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี พัฒนาขึ้นเพื่อแก้ปัญหาการจัดการคำร้องแจ้งซ่อมและข้อร้องเรียนที่ยังอาศัยกระบวนการแบบ manual ระบบสนับสนุนการทำงานผ่านเว็บแอปพลิเคชันแบบ Progressive Web App (PWA) ที่สามารถติดตั้งและใช้งานผ่านอุปกรณ์มือถือได้ พร้อมระบบแจ้งเตือนแบบ Real-time ผ่าน Push Notification

## ✨ ฟีเจอร์หลัก

### 📝 ระบบแจ้งซ่อม & ร้องเรียน
- ส่งคำร้องแจ้งซ่อม/ร้องเรียนพร้อมแนบรูปภาพ
- ระบุตำแหน่ง (อาคาร/ห้อง) ของปัญหา
- ติดตามสถานะคำร้องแบบ Real-time
- ระบบให้คะแนนเครดิตผู้แจ้ง

### 🔧 ระบบใบงาน (Job Workflow)
- สร้างใบงานจากคำร้องแจ้งซ่อมที่เกี่ยวข้อง
- แบ่งงานเป็นขั้นตอน (Job Steps) พร้อมกำหนดผู้รับผิดชอบ
- ระบบ Actor/Approver สำหรับแต่ละขั้นตอน
- แนบไฟล์หลักฐานการซ่อมเสร็จ

### 🔍 ระบบตรวจจับคำสำคัญ (Keyword Detection)
- ตั้งค่า Keywords ระดับ Global (admin) และ Personal (ผู้ใช้)
- ตรวจจับอัตโนมัติเมื่อมีคำร้องใหม่ตรงกับ keyword
- ส่ง Push Notification แจ้งเตือนทันที

### 👥 ระบบจัดการผู้ใช้
- ลงทะเบียนด้วย OTP ผ่านอีเมล
- ระบบเชิญผู้ใช้ (Invitation System) พร้อม Bulk Import CSV
- สิทธิ์แบบ Role-based: ผู้ดูแลระบบ / เจ้าหน้าที่ซ่อม / เจ้าหน้าที่ร้องเรียน / นักศึกษา
- ระงับบัญชีแบบชั่วคราว/ถาวร พร้อมบันทึก Log

### 🔔 ระบบแจ้งเตือน
- Push Notification ผ่าน Firebase Cloud Messaging (FCM)
- Email Notification ผ่าน Brevo HTTP API
- App Badge แสดงจำนวนรายการรอดำเนินการ

### 📊 แดชบอร์ดและรายงาน
- แดชบอร์ดสรุปสถิติสำหรับทุก Role
- กราฟแสดงข้อมูลด้วย Recharts
- Admin Dashboard สำหรับภาพรวมระบบ

---

## 🏗️ สถาปัตยกรรมระบบ

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser/PWA)                  │
│              React 18 + Tailwind CSS 3                  │
│              Lucide Icons + Recharts                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Inertia.js v2
┌──────────────────────▼──────────────────────────────────┐
│                  Laravel 12 (PHP 8.2)                   │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │Controllers│  │  Services │  │   Queue Workers      │  │
│  │  (15+9)  │  │ Brevo/FCM │  │ OTP/Email/Keywords   │  │
│  └──────────┘  └───────────┘  └──────────────────────┘  │
└──┬──────────────────┬───────────────────┬───────────────┘
   │                  │                   │
┌──▼───┐         ┌────▼────┐         ┌───▼────┐
│MySQL │         │  Redis  │         │Firebase│
│ 8.0  │         │(Cache/  │         │  FCM   │
│      │         │Queue/   │         │        │
│      │         │Session) │         │        │
└──────┘         └─────────┘         └────────┘
```

### Infrastructure

| Component | Technology |
|-----------|-----------|
| **Server** | DigitalOcean Droplet (2 vCPU / 4GB RAM / Ubuntu 24.04) |
| **Web Server** | Nginx 1.28 + PHP-FPM 8.2 |
| **CDN/Security** | Cloudflare Proxy + Cloudflare Tunnel |
| **Email** | Brevo HTTP API |
| **Push Notification** | Firebase Cloud Messaging |
| **Queue/Cache/Session** | Redis 7.0 |

---

## 📁 โครงสร้างโปรเจค

```
cpe-repair-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/         # 15 Controllers หลัก + 9 Auth Controllers
│   │   │   ├── ReportController.php
│   │   │   ├── RepairController.php
│   │   │   ├── ComplaintController.php
│   │   │   ├── JobController.php
│   │   │   ├── AdminUserController.php
│   │   │   └── ...
│   │   └── Middleware/          # CacheHeaders, CheckAccountSuspended
│   ├── Jobs/                    # Queue Jobs
│   │   ├── SendOtpJob.php
│   │   ├── SendEmailJob.php
│   │   ├── SendInvitationJob.php
│   │   ├── SendPasswordResetJob.php
│   │   └── ProcessKeywordDetection.php
│   ├── Models/                  # 19 Eloquent Models
│   │   ├── Account.php          # ผู้ใช้หลัก (role, credit, suspension, FCM)
│   │   ├── RequestRepair.php    # คำร้องแจ้งซ่อม
│   │   ├── RequestComplaint.php # คำร้องร้องเรียน
│   │   ├── Job.php              # ใบงาน
│   │   ├── JobStep.php          # ขั้นตอนงาน
│   │   └── ...
│   ├── Services/                # Business Logic
│   │   ├── BrevoService.php     # Brevo HTTP API สำหรับส่งอีเมล
│   │   ├── EmailService.php     # OTP, Password Reset, Invitation
│   │   └── FCMService.php       # Firebase Push Notification
│   └── Notifications/          # Keyword Detection Alerts
├── resources/js/
│   ├── Pages/                   # React Pages (Inertia)
│   │   ├── Admin/               # Dashboard, UserList, ManageKeywords, ManageLocations
│   │   ├── Auth/                # Login, Register (OTP), ForgotPassword
│   │   ├── Repair/              # Dashboard, Index, Status
│   │   ├── Complaint/           # Dashboard, Index, Status
│   │   ├── Jobs/                # Create, Index, MyJobs, Show
│   │   ├── Report/              # Create, History
│   │   └── ...
│   ├── Components/
│   │   ├── UI/                  # Navbar, BottomNavbar, Modal, Buttons, etc.
│   │   ├── CameraCapture.jsx    # ถ่ายรูปจากกล้อง
│   │   ├── InstallPWA.jsx       # ติดตั้ง PWA
│   │   └── NotificationToggle.jsx
│   └── Layouts/                 # AuthenticatedLayout, GuestLayout
├── database/
│   └── migrations/              # 35 Migration Files
├── routes/
│   ├── web.php                  # Route หลัก (206 lines)
│   └── auth.php                 # Route Authentication
├── docs/                        # เอกสารระบบ
│   ├── infrastructure/          # Server overview, Audit report
│   ├── EMAIL_SYSTEM.md
│   ├── PWA_IMPLEMENTATION_GUIDE.md
│   └── ...
└── config/
    └── brevo.php                # Brevo API Configuration
```

---

## 🗄️ โครงสร้างฐานข้อมูล

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌────────────┐
│   accounts   │───1:N─│  requests_repair │──N:1──│  building  │
│──────────────│       │──────────────────│       │────────────│
│ account_id   │       │ repair_id        │       │ building_id│
│ first_name   │       │ title            │       │ building_  │
│ last_name    │       │ description      │       │   name     │
│ email        │       │ status           │──N:1──│            │
│ role         │       │ priority         │   │   └────────────┘
│ credit       │       │ building_id      │   │   ┌────────────┐
│ job_repair   │       │ room_id          │   └───│    room    │
│ job_complaint│       │ completion_notes │       │────────────│
│ job_admin    │       │ completed_at     │       │ room_id    │
│ fcm_token    │       └────────┬─────────┘       │ room_name  │
│ suspended_at │                │                  │ building_id│
└──────┬───────┘        ┌───────▼────────┐        └────────────┘
       │                │request_job_map │
       │           N:M  │────────────────│
       │                │ repair_id      │
       │                │ job_id         │
       │                └───────┬────────┘
       │                ┌───────▼────────┐
       │───1:N──────────│      job       │
       │                │────────────────│
       │                │ job_id         │
       │                │ name           │
       │                │ created_by     │
       │                └───────┬────────┘
       │                ┌───────▼────────┐
       │                │    jobstep     │
       │                │────────────────│
       │                │ jobstep_id     │
       │                │ step_name      │
       │                │ step_number    │
       │                │ status         │
       │                │ due_date       │
       │                │ assigned_      │
       │                │  account_id    │
       │                └────────────────┘
       │
       │          ┌──────────────────────┐
       └───1:N────│ requests_complaint   │
                  │──────────────────────│
                  │ complaint_id         │
                  │ title, description   │
                  │ status, priority     │
                  └──────────────────────┘
```

### รายการ Models ทั้งหมด (19 Models)

| Model | Table | คำอธิบาย |
|-------|-------|---------|
| `Account` | accounts | บัญชีผู้ใช้ (PK: account_id) |
| `RequestRepair` | requests_repair | คำร้องแจ้งซ่อม |
| `RequestComplaint` | requests_complaint | คำร้องร้องเรียน |
| `Job` | job | ใบงาน |
| `JobStep` | jobstep | ขั้นตอนงาน |
| `JobActor` | jobactors | ผู้ดำเนินงาน |
| `JobApprover` | jobapprovers | ผู้อนุมัติงาน |
| `Building` | building | อาคาร |
| `Room` | room | ห้อง |
| `FileRepair` | file_repair | ไฟล์แนบคำร้องซ่อม |
| `FileComplaint` | file_complaint | ไฟล์แนบคำร้องร้องเรียน |
| `FileJob` | file_job | ไฟล์แนบใบงาน |
| `RequestJobMap` | request_job_map | Pivot เชื่อม Repair ↔ Job |
| `Keyword` | keywords | คำสำคัญ (global/personal) |
| `KeywordMatch` | keyword_matches | บันทึกการจับคู่ keyword |
| `Announcement` | announcements | ข่าวประกาศ |
| `UserInvitation` | user_invitations | ระบบเชิญผู้ใช้ |
| `SuspensionLog` | suspension_logs | บันทึกการระงับบัญชี |
| `User` | users | Laravel default user |

---

## 🚀 การติดตั้ง

### ความต้องการของระบบ (Prerequisites)

- PHP ≥ 8.2 (พร้อม extensions: gd, intl, mbstring, pdo_mysql, redis, zip)
- MySQL 8.0+
- Redis 7.0+
- Node.js 20+ & NPM
- Composer 2+

### ขั้นตอนติดตั้ง

```bash
# 1. Clone โปรเจค
git clone https://github.com/kim-sittikon/cpe-repair-system.git
cd cpe-repair-system

# 2. ติดตั้ง Dependencies
composer install
npm install

# 3. ตั้งค่า Environment
cp .env.example .env
php artisan key:generate

# 4. ตั้งค่าฐานข้อมูลใน .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=cpe_repair
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# 5. สร้างฐานข้อมูล
php artisan migrate

# 6. Import ข้อมูลตัวอย่าง (ถ้ามี)
mysql -u your_username -p cpe_repair < cpe_repair_database.sql

# 7. Build Frontend
npm run build

# 8. รันเซิร์ฟเวอร์ (Development)
composer dev
```

> **หมายเหตุ**: คำสั่ง `composer dev` จะรัน Laravel Server, Queue Worker, Log Viewer, และ Vite Dev Server พร้อมกัน

### ตั้งค่าเพิ่มเติม (Production)

```bash
# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue Worker (ใช้ Supervisor)
# ดู scripts/cpe-otp-worker.conf สำหรับ config ตัวอย่าง
```

---

## 🔐 ระบบ Authentication

| ฟีเจอร์ | คำอธิบาย |
|---------|---------|
| ลงทะเบียน | ยืนยันตัวตนด้วย OTP ผ่านอีเมล |
| เข้าสู่ระบบ | Email + Password |
| ลืมรหัสผ่าน | ส่งลิงก์ Reset ผ่านอีเมล |
| ระบบเชิญ | Admin เชิญผ่าน Email/CSV + กำหนด Role |
| ระงับบัญชี | ชั่วคราว (auto-unsuspend) / ถาวร |

---

## 👥 บทบาทผู้ใช้ (User Roles)

| Role | สิทธิ์การใช้งาน |
|------|----------------|
| **นักศึกษา** | แจ้งซ่อม, ร้องเรียน, ดูสถานะ, ตั้ง Personal Keywords |
| **เจ้าหน้าที่ซ่อม** (`job_repair`) | จัดการคำร้องซ่อม, สร้างใบงาน, อัปเดตสถานะ |
| **เจ้าหน้าที่ร้องเรียน** (`job_complaint`) | จัดการคำร้องร้องเรียน, อัปเดตสถานะ |
| **ผู้ดูแลระบบ** (`job_admin`) | จัดการผู้ใช้, อาคาร/ห้อง, Keywords, ดูแดชบอร์ด Admin |

---

## 📧 ระบบ External Services

| Service | Provider | วัตถุประสงค์ |
|---------|----------|-------------|
| **Email API** | Brevo (HTTP API) | ส่ง OTP, Password Reset, Invitation Email |
| **Push Notification** | Firebase Cloud Messaging | แจ้งเตือนผู้ใช้แบบ Real-time |
| **CDN/Security** | Cloudflare | Proxy, DDoS Protection, Tunnel |

---

## 🧪 การทดสอบ

```bash
# รัน Unit Tests
php artisan test

# หรือ
composer test
```

---

## 📖 เอกสารเพิ่มเติม

| เอกสาร | คำอธิบาย |
|--------|---------|
| [SYSTEM_OVERVIEW.md](docs/infrastructure/SYSTEM_OVERVIEW.md) | ภาพรวมโครงสร้างเซิร์ฟเวอร์และระบบ |
| [SERVER_AUDIT_REPORT.md](docs/infrastructure/SERVER_AUDIT_REPORT.md) | รายงานตรวจสอบเซิร์ฟเวอร์ |
| [EMAIL_SYSTEM.md](docs/EMAIL_SYSTEM.md) | ระบบอีเมลทั้งหมด |
| [PWA_IMPLEMENTATION_GUIDE.md](docs/PWA_IMPLEMENTATION_GUIDE.md) | คู่มือ Progressive Web App |
| [LAZY_LOADING_GUIDE.md](docs/LAZY_LOADING_GUIDE.md) | คู่มือ Lazy Loading |

---

## 🛠️ เครื่องมือที่ใช้ในการพัฒนา

| ประเภท | เครื่องมือ |
|--------|-----------|
| **IDE** | Visual Studio Code |
| **Version Control** | Git + GitHub |
| **API Testing** | Browser DevTools |
| **Deployment** | DigitalOcean + Cloudflare |
| **Monitoring** | UptimeRobot |

---

## 👨‍💻 ผู้พัฒนา

**โครงงานวิศวกรรมคอมพิวเตอร์ (Computer Engineering Project)**  
ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์  
มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี  
ภาคเรียนที่ 2/2568

---

<p align="center">
  Made with ❤️ by CPE RMUTT Students
</p>
