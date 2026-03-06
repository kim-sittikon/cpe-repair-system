# ระบบแจ้งซ่อม CPE - ภาพรวมโครงสร้างระบบ

> **อัปเดตล่าสุด**: 4 กุมภาพันธ์ 2569  
> **สภาพแวดล้อม**: Production  
> **โดเมน**: cpe-repair.rmutt.ac.th / cperepair.app

---

## 🖥️ โครงสร้างเซิร์ฟเวอร์

### ผู้ให้บริการ Hosting
| รายการ | ค่า |
|--------|-----|
| **ผู้ให้บริการ** | DigitalOcean |
| **ชื่อ Droplet** | ubuntu-s-2vcpu-4gb-sgp1-01 |
| **ภูมิภาค** | สิงคโปร์ (SGP1) |
| **ระบบปฏิบัติการ** | Ubuntu 24.04 LTS (x64) |
| **vCPU** | 2 คอร์ |
| **RAM** | 4 GB |
| **Disk** | 50 GB SSD |
| **Public IP** | 165.22.99.107 |
| **Private IP** | 10.104.0.2 |

### การใช้งานทรัพยากรปัจจุบัน
| ทรัพยากร | ใช้งาน | เหลือ | เปอร์เซ็นต์ |
|----------|--------|-------|-------------|
| Disk | 4.6 GB | 43 GB | 10% |
| หน่วยความจำ | 1.6 GB | 2.2 GB | ~42% |
| Swap | 0 B | 0 B | ไม่มี swap |

---

## 🌐 การตั้งค่า DNS และ CDN

### การตั้งค่า Cloudflare
| การตั้งค่า | ค่า |
|------------|-----|
| **โดเมน** | cperepair.app |
| **DNS Setup** | Full |
| **สถานะ Proxy** | Proxied (ไอคอนสีส้ม) |
| **โหมด SSL** | Flexible/Full (Cloudflare) |

### รายการ DNS Records
| ประเภท | ชื่อ | เนื้อหา | สถานะ Proxy |
|--------|------|---------|-------------|
| CNAME | brevo1._domainkey | b1.cperepair-app.dkim.brev... | DNS only |
| CNAME | brevo2._domainkey | b2.cperepair-app.dkim.bre... | DNS only |
| CNAME | cperepair.app | d3200cb1-3552-40d8-a2d... | **Proxied** |
| NS | cperepair.app | ns4fmw.name.com | DNS only |
| NS | cperepair.app | ns3fgh.name.com | DNS only |
| NS | cperepair.app | ns2hkt.name.com | DNS only |
| NS | cperepair.app | ns1kpv.name.com | DNS only |
| TXT | cperepair.app | v=spf1 include:spf.brevo.c... | DNS only |
| TXT | cperepair.app | brevo-code:a14ac043893... | DNS only |
| TXT | _dmarc | v=DMARC1; p=none; rua=... | DNS only |

---

## ⚙️ ซอฟต์แวร์ที่ใช้งาน

### เวอร์ชันของ Runtime
| ส่วนประกอบ | เวอร์ชัน |
|------------|----------|
| **PHP** | 8.2.30 (NTS) พร้อม Zend OPcache |
| **MySQL** | 8.0.44-0ubuntu0.24.04.2 |
| **Nginx** | 1.28.1 |
| **Node.js** | 20.20.0 |
| **NPM** | 10.8.2 |
| **Redis** | ทำงานอยู่ (สำหรับ cache/session/queue) |

### PHP Extensions ที่ติดตั้ง
```
bcmath, calendar, Core, ctype, curl, date, dom, exif, FFI, fileinfo,
filter, ftp, gd, gettext, hash, iconv, igbinary, intl, json, libxml,
mbstring, mysqli, mysqlnd, openssl, pcntl, pcre, PDO, pdo_mysql, Phar,
redis, xml, xmlreader, xmlwriter, zip
```

### สถานะ Services ของระบบ
| Service | สถานะ |
|---------|--------|
| nginx.service | ✅ ทำงาน |
| php8.2-fpm.service | ✅ ทำงาน |
| mysql.service | ✅ ทำงาน |
| redis-server | ✅ ทำงาน |

---

## 📦 โครงสร้างแอปพลิเคชัน

### Framework และ Libraries
| ชั้น | เทคโนโลยี | เวอร์ชัน |
|------|-----------|----------|
| **Backend** | Laravel | ^12.0 |
| **Frontend** | React | ^18.2.0 |
| **เชื่อมต่อ** | Inertia.js | ^2.0 |
| **Styling** | Tailwind CSS | ^3.2.1 |
| **Build Tool** | Vite | ^7.0.7 |
| **ไอคอน** | Lucide React | ^0.560.0 |
| **กราฟ** | Recharts | ^3.5.1 |
| **UI Components** | Headless UI | ^2.0.0 |
| **PWA** | vite-plugin-pwa | ^1.2.0 |

### Laravel Packages หลัก
| Package | วัตถุประสงค์ |
|---------|-------------|
| inertiajs/inertia-laravel | เชื่อมต่อ Frontend |
| intervention/image | ประมวลผลรูปภาพ |
| kreait/laravel-firebase | Push notifications |
| laravel/sanctum | API authentication |
| tightenco/ziggy | แชร์ Routes |

### Frontend Dependencies หลัก
| Package | วัตถุประสงค์ |
|---------|-------------|
| firebase | Push notifications |
| date-fns | จัดการวันที่ |
| class-variance-authority | Component variants |
| tailwind-merge | รวม Tailwind class |

---

## 🗄️ โครงสร้างฐานข้อมูล

### การตั้งค่าฐานข้อมูล
| การตั้งค่า | ค่า |
|------------|-----|
| **Connection** | MySQL |
| **Host** | 127.0.0.1 |
| **Port** | 3306 |
| **Database** | cpe_repair |
| **Username** | cpe_user |

### Models (19 Models)
| Model | คำอธิบาย |
|-------|----------|
| Account | จัดการบัญชีผู้ใช้ |
| Announcement | ประกาศของระบบ |
| Building | ข้อมูลอาคาร |
| FileComplaint | ไฟล์แนบข้อร้องเรียน |
| FileJob | ไฟล์แนบงาน |
| FileRepair | ไฟล์แนบแจ้งซ่อม |
| Job | ใบสั่งงาน/งาน |
| JobActor | ผู้ปฏิบัติงาน |
| JobApprover | ผู้อนุมัติงาน |
| JobStep | ขั้นตอนการทำงาน |
| Keyword | คำค้นหา |
| KeywordMatch | การจับคู่คำค้นหา |
| RequestComplaint | คำร้องข้อร้องเรียน |
| RequestJobMap | แมปคำร้องกับงาน |
| RequestRepair | คำร้องแจ้งซ่อม |
| Room | ข้อมูลห้อง |
| SuspensionLog | บันทึกการระงับบัญชี |
| User | ผู้ใช้ระบบ |
| UserInvitation | ระบบเชิญผู้ใช้ |

### จำนวน Migrations
- **รวม Migrations**: 34 ไฟล์
- **ช่วงวันที่**: ธ.ค. 2568 ถึง ก.พ. 2569

---

## 🔧 การตั้งค่า Nginx

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name cpe-repair.rmutt.ac.th;
    root /var/www/cpe-repair-system/public;
    client_max_body_size 64M;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 📧 การตั้งค่าอีเมล

| การตั้งค่า | ค่า |
|------------|-----|
| **ผู้ให้บริการ** | Brevo (เดิมชื่อ Sendinblue) |
| **วิธีการส่ง** | ✅ HTTP API (ไม่ใช้ SMTP เนื่องจาก Port ถูก Block) |
| **API Endpoint** | https://api.brevo.com/v3/smtp/email |
| **From Address** | no-reply@cperepair.app |
| **From Name** | ระบบแจ้งซ่อม CPE |
| **Service File** | `app/Services/BrevoService.php` |

### DNS Records สำหรับอีเมล
- SPF: `v=spf1 include:spf.brevo.com`
- DKIM: ตั้งค่าผ่าน CNAME records
- DMARC: `v=DMARC1; p=none`

---

## 🔔 การตั้งค่า Firebase

| การตั้งค่า | ค่า |
|------------|-----|
| **Project ID** | cpe-repair-system |
| **Auth Domain** | cpe-repair-system.firebaseapp.com |
| **Storage Bucket** | cpe-repair-system.firebasestorage.app |
| **Credentials Path** | storage/app/firebase-credentials.json |

---

## 📁 โครงสร้างโปรเจค

```
/var/www/cpe-repair-system/
├── app/                    # โค้ดหลักแอปพลิเคชัน Laravel
│   ├── Http/              # Controllers, Middleware, Requests
│   ├── Jobs/              # Queue jobs
│   ├── Mail/              # Email templates
│   ├── Models/            # Eloquent models (19 ไฟล์)
│   ├── Notifications/     # Notification classes
│   ├── Providers/         # Service providers
│   ├── Services/          # Business logic services
│   └── Traits/            # Reusable traits
├── bootstrap/             # ไฟล์ bootstrap ของ Laravel
├── config/                # ไฟล์ตั้งค่า (10 ไฟล์)
├── database/
│   ├── factories/         # Model factories
│   ├── migrations/        # Database migrations (34 ไฟล์)
│   └── seeders/           # Database seeders
├── docs/                  # เอกสาร
│   ├── infrastructure/    # เอกสารโครงสร้างระบบ
│   ├── EMAIL_*.md         # เอกสารระบบอีเมล
│   ├── LAZY_LOADING_GUIDE.md
│   ├── LIGHTHOUSE_AUDIT_GUIDE.md
│   ├── PWA_IMPLEMENTATION_GUIDE.md
│   └── SERVICE_WORKER_GUIDE.md
├── monitoring/            # การตั้งค่า monitoring (13 ไฟล์)
├── public/                # Web root (23 ไฟล์)
├── resources/             # Views, JS, CSS (71 ไฟล์)
├── routes/                # Route definitions (3 ไฟล์)
├── scripts/               # สคริปต์อรรถประโยชน์
├── storage/               # พื้นที่จัดเก็บ (logs, cache, uploads)
├── tests/                 # ไฟล์ทดสอบ (10 ไฟล์)
└── vendor/                # Composer dependencies
```

---

## 🔄 การตั้งค่า Cache และ Session

| การตั้งค่า | Driver |
|------------|--------|
| **Cache** | Redis |
| **Session** | Redis |
| **Queue** | Redis |
| **Broadcast** | Log |
| **Filesystem** | Local |

### การตั้งค่า Session
| การตั้งค่า | ค่า |
|------------|-----|
| Session Lifetime | 120 นาที |
| Session Encrypt | เปิดใช้งาน |
| Session Path | / |

---

## 🚀 บันทึกการ Deploy

### การตั้งค่าเดิม (WSL/Docker)
- รันบน WSL Ubuntu ในเครื่องคอมพิวเตอร์
- ใช้ Docker containers

### การตั้งค่าปัจจุบัน (Native)
- DigitalOcean Droplet
- ติดตั้งแบบ native (ไม่ใช้ Docker)
- Cloudflare proxy สำหรับ CDN/ป้องกัน DDoS
- จัดการ Services ผ่าน systemd

### Paths สำคัญ
| รายการ | Path |
|--------|------|
| Web Root | /var/www/cpe-repair-system/public |
| Nginx Config | /etc/nginx/sites-enabled/ |
| PHP-FPM Socket | /var/run/php/php8.2-fpm.sock |
| Logs | /var/www/cpe-repair-system/storage/logs |

---

## 📊 ฟีเจอร์ของแอปพลิเคชัน

จากโครงสร้าง Models และระบบ แอปพลิเคชันนี้รองรับ:

1. **การจัดการแจ้งซ่อม** - ส่งและติดตามคำร้องแจ้งซ่อม
2. **ระบบร้องเรียน** - ยื่นและจัดการข้อร้องเรียน
3. **ติดตามใบสั่งงาน** - Workflow หลายขั้นตอน
4. **จัดการผู้ใช้** - บัญชี, การเชิญ, การระงับ
5. **จัดการอาคาร/ห้อง** - ติดตามตำแหน่ง
6. **ประกาศ** - การแจ้งเตือนทั้งระบบ
7. **Push Notifications** - ผ่าน Firebase
8. **Email Notifications** - ผ่าน Brevo SMTP
9. **รองรับ PWA** - Progressive Web App
10. **ไฟล์แนบ** - สำหรับแจ้งซ่อม, ร้องเรียน, และงาน

---

## ⚠️ หมายเหตุสำคัญ

> [!IMPORTANT]
> - ไม่มี swap ตั้งค่าไว้ - ควรพิจารณาเพิ่มเพื่อความเสถียร
> - SSL จัดการโดย Cloudflare (Flexible/Full mode)
> - Nginx listen port 80 เท่านั้น (Cloudflare จัดการ HTTPS)

> [!TIP]
> - ตรวจสอบการใช้หน่วยความจำ Redis เนื่องจากเป็น driver ของ queue/session
> - แนะนำให้สำรองฐานข้อมูลเป็นประจำ
> - ตรวจสอบ Laravel logs ที่ `storage/logs/`
