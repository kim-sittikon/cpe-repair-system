# PWA Implementation Guide - ระบบแจ้งปัญหา CPE

คู่มือการพัฒนา Progressive Web App (PWA) แบบมืออาชีพขั้นสูงสุด

---

## 📋 สารบัญ

1. [Phase 1: Core PWA](#phase-1-core-pwa) ✅ เสร็จแล้ว
2. [Phase 2: Push Notifications](#phase-2-push-notifications) ✅ เสร็จแล้ว
3. [Phase 3: Advanced Native Features](#phase-3-advanced-native-features) ⚡ บางส่วน (Camera, Geolocation, Badging)
4. [Phase 4: Performance & Polish](#phase-4-performance--polish)

---


# Phase 1: Core PWA ✅

**สถานะ:** เสร็จสมบูรณ์  
**เวลาที่ใช้:** ~30 นาที

## 1.1 Icons และ Assets

### สิ่งที่ทำ
- ย้ายโฟลเดอร์ `PWAIcon/` → `public/icons/`
- รองรับทุก platform: Android, iOS, Windows 11

### โครงสร้างไฟล์
```
public/icons/
├── android/
│   ├── android-launchericon-48-48.png
│   ├── android-launchericon-72-72.png
│   ├── android-launchericon-96-96.png
│   ├── android-launchericon-144-144.png
│   ├── android-launchericon-192-192.png
│   └── android-launchericon-512-512.png
├── ios/
│   ├── 16.png ~ 1024.png (หลายขนาด)
└── windows11/
    ├── SmallTile, LargeTile, SplashScreen
```

---

## 1.2 Web App Manifest

### ไฟล์: `vite.config.js`

```javascript
VitePWA({
    manifest: {
        name: 'ระบบแจ้งปัญหา CPE',
        short_name: 'CPE Repair',
        description: 'ระบบรับแจ้งปัญหาและร้องเรียน',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',      // ซ่อน browser bar
        orientation: 'portrait',    // ล็อคแนวตั้ง
        start_url: '/',
        scope: '/',
    }
})
```

### คุณสมบัติ
| Property | ค่า | ผลลัพธ์ |
|----------|-----|---------|
| display: standalone | ซ่อน URL bar | ดูเหมือน Native App |
| orientation: portrait | ล็อคแนวตั้ง | ไม่หมุนจอ |
| theme_color | #f97316 (ส้ม) | Status bar สีส้ม |

---

## 1.3 App Shortcuts

### การตั้งค่าใน Manifest
```javascript
shortcuts: [
    {
        name: 'แจ้งซ่อม',
        short_name: 'แจ้งซ่อม',
        url: '/report/create',
        icons: [{ src: '/icons/android/android-launchericon-96-96.png', sizes: '96x96' }]
    },
    {
        name: 'ร้องเรียน',
        short_name: 'ร้องเรียน',
        url: '/complaint/create',
        icons: [...]
    },
    {
        name: 'ตรวจสอบสถานะ',
        short_name: 'สถานะ',
        url: '/my-reports',
        icons: [...]
    }
]
```

### วิธีใช้งาน
1. กดค้างที่ icon บน Home Screen
2. เมนูลัดจะปรากฏขึ้น
3. เลือกเมนูที่ต้องการ

---

## 1.4 Service Worker (Workbox)

### Caching Strategies

| ประเภท | Strategy | เหตุผล |
|---------|----------|--------|
| Fonts (Google/Bunny) | CacheFirst | โหลดครั้งเดียว ใช้ได้ตลอด |
| Images (.png, .jpg, .svg) | StaleWhileRevalidate | โชว์เร็ว แอบอัพเดท |
| API (/api/*) | NetworkFirst | ข้อมูลใหม่เสมอ |
| Pages (HTML) | Offline Fallback | แสดง offline.html |

### การตั้งค่าใน `vite.config.js`
```javascript
workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    navigateFallback: '/offline.html',
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'images-cache',
                expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 } // 30 วัน
            }
        },
        {
            urlPattern: /\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10
            }
        }
    ]
}
```

---

## 1.5 Offline Page

### ไฟล์: `public/offline.html`

**คุณสมบัติ:**
- Design สวยงาม gradient background
- Icon WiFi ขีดฆ่า
- ปุ่ม "ลองอีกครั้ง" 
- Tips แก้ปัญหาเครือข่าย
- ภาษาไทย

---

## 1.6 Custom Install Prompt

### ไฟล์: `resources/js/Components/InstallPWA.jsx`

**คุณสมบัติ:**
- ดัก `beforeinstallprompt` event
- แสดง popup สวยๆ หลัง 30 วินาที
- มีปุ่ม "ติดตั้ง" และ "ไว้ทีหลัง"
- จำสถานะ dismiss ไว้ 24 ชั่วโมง
- สามารถแสดงในหน้า Settings ได้

### การใช้งาน
```jsx
// Floating popup (แสดงอัตโนมัติ)
<InstallPWA />

// ปุ่มใน Settings
<InstallPWA showInSettings={true} />
```

---

## 1.7 Meta Tags

### ไฟล์: `resources/views/app.blade.php`

```html
<!-- PWA Meta Tags -->
<meta name="theme-color" content="#f97316">
<meta name="mobile-web-app-capable" content="yes">
<meta name="application-name" content="CPE Repair">

<!-- Apple/iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="CPE Repair">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/ios/180.png">

<!-- Microsoft -->
<meta name="msapplication-TileColor" content="#f97316">
<meta name="msapplication-TileImage" content="/icons/windows11/Square150x150Logo.scale-200.png">
```

---

# Phase 2: Push Notifications ✅

**สถานะ:** เสร็จสมบูรณ์  
**เวลาที่ใช้:** ~2 ชั่วโมง

## 2.1 Firebase Setup

### ขั้นตอนที่ 1: สร้าง Firebase Project
1. เข้า https://console.firebase.google.com
2. คลิก "Add project"
3. ตั้งชื่อ "cpe-repair-system"
4. เปิด/ปิด Google Analytics ตามต้องการ
5. คลิก "Create project"

### ขั้นตอนที่ 2: เพิ่ม Web App
1. ไปที่ Project Overview
2. คลิก icon Web (</>)
3. ตั้งชื่อ "CPE Repair Web"
4. เลือก "Also set up Firebase Hosting" (optional)
5. จด Firebase Config:
```javascript
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "cpe-repair-system.firebaseapp.com",
    projectId: "cpe-repair-system",
    storageBucket: "cpe-repair-system.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### ขั้นตอนที่ 3: สร้าง Server Key
1. ไปที่ Project Settings → Cloud Messaging
2. สร้าง "Server key" (Legacy) หรือใช้ Service Account
3. เก็บ key ไว้ใช้ใน Laravel

---

## 2.2 Laravel Backend Setup

### ขั้นตอนที่ 1: ติดตั้ง Package
```bash
composer require kreait/laravel-firebase
```

### ขั้นตอนที่ 2: Publish Config
```bash
php artisan vendor:publish --provider="Kreait\Laravel\Firebase\ServiceProvider" --tag=config
```

### ขั้นตอนที่ 3: ตั้งค่า .env
```env
FIREBASE_CREDENTIALS=storage/app/firebase-credentials.json
```

### ขั้นตอนที่ 4: วาง Service Account Key
1. ไป Firebase Console → Project Settings → Service Accounts
2. คลิก "Generate new private key"
3. ดาวน์โหลดไฟล์ JSON
4. วางไว้ที่ `storage/app/firebase-credentials.json`

---

## 2.3 Database Migration

### สร้าง Migration
```bash
php artisan make:migration add_fcm_token_to_accounts_table
```

### ไฟล์ Migration
```php
public function up(): void
{
    Schema::table('accounts', function (Blueprint $table) {
        $table->string('fcm_token')->nullable()->after('remember_token');
        $table->timestamp('fcm_token_updated_at')->nullable();
    });
}
```

---

## 2.4 Frontend: Firebase SDK

### ขั้นตอนที่ 1: ติดตั้ง
```bash
npm install firebase
```

### ขั้นตอนที่ 2: สร้าง Firebase Config
**ไฟล์: `resources/js/firebase.js`**
```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });
            return token;
        }
        return null;
    } catch (error) {
        console.error('Notification permission error:', error);
        return null;
    }
}

export function onMessageListener() {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
}
```

### ขั้นตอนที่ 3: สร้าง Firebase Messaging SW
**ไฟล์: `public/firebase-messaging-sw.js`**
```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/android/android-launchericon-192-192.png',
        badge: '/icons/android/android-launchericon-96-96.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
});
```

---

## 2.5 Notification Permission Flow

### สร้าง Component
**ไฟล์: `resources/js/Components/NotificationPermission.jsx`**
```jsx
import { useState, useEffect } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { requestNotificationPermission } from '@/firebase';
import axios from 'axios';

export default function NotificationPermission() {
    const [permission, setPermission] = useState(Notification.permission);
    const [loading, setLoading] = useState(false);

    const handleEnable = async () => {
        setLoading(true);
        const token = await requestNotificationPermission();
        
        if (token) {
            // ส่ง token ไปเก็บใน database
            await axios.post('/api/fcm-token', { token });
            setPermission('granted');
        }
        setLoading(false);
    };

    if (permission === 'granted') {
        return (
            <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span>เปิดการแจ้งเตือนแล้ว</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleEnable}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
            <Bell className="w-5 h-5" />
            {loading ? 'กำลังเปิด...' : 'เปิดการแจ้งเตือน'}
        </button>
    );
}
```

---

## 2.6 Laravel API Endpoints

### สร้าง Controller
```bash
php artisan make:controller FCMController
```

### ไฟล์: `app/Http/Controllers/FCMController.php`
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FCMController extends Controller
{
    public function storeToken(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        
        $user = auth()->user();
        $user->update([
            'fcm_token' => $request->token,
            'fcm_token_updated_at' => now(),
        ]);

        return response()->json(['message' => 'Token saved']);
    }

    public function removeToken(Request $request)
    {
        auth()->user()->update([
            'fcm_token' => null,
            'fcm_token_updated_at' => null,
        ]);

        return response()->json(['message' => 'Token removed']);
    }
}
```

### สร้าง Routes
**ไฟล์: `routes/api.php`**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/fcm-token', [FCMController::class, 'storeToken']);
    Route::delete('/fcm-token', [FCMController::class, 'removeToken']);
});
```

---

## 2.7 Sending Notifications

### สร้าง Service Class
**ไฟล์: `app/Services/FCMService.php`**
```php
<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FCMService
{
    protected $messaging;

    public function __construct()
    {
        $factory = (new Factory)->withServiceAccount(
            storage_path('app/firebase-credentials.json')
        );
        $this->messaging = $factory->createMessaging();
    }

    public function sendToUser($user, string $title, string $body, array $data = [])
    {
        if (!$user->fcm_token) {
            return false;
        }

        $message = CloudMessage::withTarget('token', $user->fcm_token)
            ->withNotification(Notification::create($title, $body))
            ->withData($data);

        try {
            $this->messaging->send($message);
            return true;
        } catch (\Exception $e) {
            // Token หมดอายุ ลบออก
            if (str_contains($e->getMessage(), 'not-registered')) {
                $user->update(['fcm_token' => null]);
            }
            return false;
        }
    }

    public function sendToMultiple(array $tokens, string $title, string $body, array $data = [])
    {
        $message = CloudMessage::new()
            ->withNotification(Notification::create($title, $body))
            ->withData($data);

        $this->messaging->sendMulticast($message, $tokens);
    }
}
```

---

## 2.8 Notification Events

### เมื่อสถานะงานเปลี่ยน
**แก้ไข Controller ที่อัพเดทสถานะ:**
```php
use App\Services\FCMService;

public function updateStatus(Request $request, Repair $repair)
{
    $repair->update(['status' => $request->status]);

    // ส่ง notification ไปหาผู้แจ้ง
    $fcm = new FCMService();
    $fcm->sendToUser(
        $repair->reporter,
        'สถานะงานอัพเดท',
        "งาน #{$repair->id} เปลี่ยนสถานะเป็น: {$request->status}",
        ['url' => "/repairs/{$repair->id}"]
    );

    return back()->with('success', 'อัพเดทสถานะสำเร็จ');
}
```

### เมื่อมีงานใหม่ assign
```php
public function assignTechnician(Repair $repair, Account $technician)
{
    $repair->update(['assigned_to' => $technician->account_id]);

    $fcm = new FCMService();
    $fcm->sendToUser(
        $technician,
        'คุณได้รับมอบหมายงานใหม่',
        "งาน #{$repair->id}: {$repair->title}",
        ['url' => "/repairs/{$repair->id}"]
    );
}
```

---

# Phase 3: Advanced Native Features

**สถานะ:** ยังไม่ทำ  
**เวลาประมาณ:** 3-4 ชั่วโมง

## 3.1 Camera API (ถ่ายรูปในแอป)

### Component
```jsx
import { useRef, useState } from 'react';
import { Camera, X, Check } from 'lucide-react';

export default function CameraCapture({ onCapture }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);

    const startCamera = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // กล้องหลัง
        });
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
    };

    const takePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(dataUrl);
        stopCamera();
    };

    const stopCamera = () => {
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
    };

    const confirmPhoto = () => {
        onCapture(photo);
        setPhoto(null);
    };

    return (
        <div className="relative">
            {!photo && (
                <>
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
                    <button onClick={takePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <Camera className="w-12 h-12 text-white" />
                    </button>
                </>
            )}
            {photo && (
                <>
                    <img src={photo} className="w-full rounded-xl" />
                    <div className="flex gap-4 mt-4">
                        <button onClick={() => setPhoto(null)}><X /></button>
                        <button onClick={confirmPhoto}><Check /></button>
                    </div>
                </>
            )}
            {!stream && !photo && (
                <button onClick={startCamera}>เปิดกล้อง</button>
            )}
        </div>
    );
}
```

---

## 3.2 Geolocation (จับพิกัด)

### Hook
```jsx
import { useState, useEffect } from 'react';

export function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation ไม่รองรับ');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return { location, error, loading, getLocation };
}
```

### การใช้งานในฟอร์มแจ้งซ่อม
```jsx
const { location, getLocation, loading } = useGeolocation();

// ใน useEffect ตอนโหลดหน้า
useEffect(() => {
    getLocation();
}, []);

// เพิ่มใน form data
const handleSubmit = () => {
    const formData = {
        ...data,
        latitude: location?.lat,
        longitude: location?.lng
    };
    // submit...
};
```

---

## 3.3 Background Sync (ส่งฟอร์มออฟไลน์)

### Service Worker
```javascript
// ใน sw.js
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-repairs') {
        event.waitUntil(syncRepairs());
    }
});

async function syncRepairs() {
    const cache = await caches.open('pending-repairs');
    const requests = await cache.keys();
    
    for (const request of requests) {
        const response = await cache.match(request);
        const data = await response.json();
        
        try {
            await fetch('/api/repairs', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            await cache.delete(request);
        } catch (e) {
            // ยังไม่มีเน็ต รอ sync รอบหน้า
        }
    }
}
```

### Frontend
```javascript
async function submitRepair(data) {
    if (navigator.onLine) {
        // ส่งปกติ
        await fetch('/api/repairs', { method: 'POST', body: JSON.stringify(data) });
    } else {
        // เก็บไว้ sync ทีหลัง
        const cache = await caches.open('pending-repairs');
        await cache.put(`/pending/${Date.now()}`, new Response(JSON.stringify(data)));
        
        // ลงทะเบียน sync
        await navigator.serviceWorker.ready;
        await registration.sync.register('sync-repairs');
        
        alert('บันทึกไว้แล้ว จะส่งอัตโนมัติเมื่อมีเน็ต');
    }
}
```

---

## 3.4 Badging API (แสดง badge บน icon)

```javascript
// แสดงจำนวนงานใหม่
async function updateBadge() {
    if ('setAppBadge' in navigator) {
        const response = await fetch('/api/pending-jobs/count');
        const { count } = await response.json();
        
        if (count > 0) {
            navigator.setAppBadge(count);
        } else {
            navigator.clearAppBadge();
        }
    }
}

// เรียกเมื่อมี notification ใหม่
updateBadge();
```

---

## 3.5 Share Target (รับ share)

### เพิ่มใน Manifest
```json
{
    "share_target": {
        "action": "/report/create",
        "method": "POST",
        "enctype": "multipart/form-data",
        "params": {
            "title": "title",
            "text": "description",
            "files": [
                {
                    "name": "images",
                    "accept": ["image/*"]
                }
            ]
        }
    }
}
```

---

# Phase 4: Performance & Polish

**สถานะ:** ยังไม่ทำ  
**เวลาประมาณ:** 2-3 ชั่วโมง

## 4.1 Performance Optimization

### Lazy Loading Components
```jsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HeavyChart />
        </Suspense>
    );
}
```

### Image Optimization
- ใช้ WebP format
- Lazy load images
- Responsive images with srcset

---

## 4.2 Analytics

### ติดตาม Install Rate
```javascript
window.addEventListener('appinstalled', () => {
    // ส่งไป Google Analytics
    gtag('event', 'pwa_installed', {
        event_category: 'PWA',
        event_label: 'Install'
    });
});
```

### ติดตาม Offline Usage
```javascript
window.addEventListener('online', () => {
    gtag('event', 'connection_restored');
});

window.addEventListener('offline', () => {
    gtag('event', 'went_offline');
});
```

---

## 4.3 Security Headers

### เพิ่มใน Laravel Middleware
```php
// Content Security Policy
$response->headers->set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.bunny.net;"
);

// Other security headers
$response->headers->set('X-Content-Type-Options', 'nosniff');
$response->headers->set('X-Frame-Options', 'DENY');
$response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

---

# วิธีทดสอบ PWA

## Lighthouse Audit
1. เปิด Chrome DevTools (F12)
2. ไปที่ tab "Lighthouse"
3. เลือก "Progressive Web App"
4. คลิก "Analyze page load"
5. ควรได้ 100 คะแนน

## ทดสอบ Install
1. เปิดเว็บบน Chrome (Android) หรือ Safari (iOS)
2. รอ 30 วินาที → เห็น Install Prompt
3. กด "ติดตั้ง"
4. ตรวจสอบ icon บน Home Screen

## ทดสอบ Offline
1. เปิดแอปจาก Home Screen
2. เปิด Airplane Mode
3. ควรเห็นหน้า Offline สวยๆ

## ทดสอบ App Shortcuts (Android)
1. กดค้างที่ icon บน Home Screen
2. ควรเห็นเมนูลัด 3 รายการ

---

# สรุป Phases

| Phase | Features | เวลา | สถานะ |
|-------|----------|------|-------|
| 1 | Core PWA, Manifest, SW, Offline | 30 นาที | ✅ เสร็จ |
| 2 | Push Notifications (FCM) | 2-3 ชม. | ⏳ รอทำ |
| 3 | Camera, GPS, Background Sync, Badge | 3-4 ชม. | ⏳ รอทำ |
| 4 | Performance, Analytics, Security | 2-3 ชม. | ⏳ รอทำ |

**รวมเวลาทั้งหมด:** ~8-10 ชั่วโมง สำหรับ PWA ระดับมืออาชีพ
