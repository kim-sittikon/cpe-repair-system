# 🔧 Service Worker Troubleshooting Guide

**Last Updated:** 2026-02-01

---

## 📋 สารบัญ

1. [ปัญหาที่พบ](#ปัญหาที่พบ)
2. [สาเหตุ](#สาเหตุ)
3. [วิธีแก้ไข](#วิธีแก้ไข)
4. [วิธี Clear Cache](#วิธี-clear-cache)
5. [Configuration ที่ถูกต้อง](#configuration-ที่ถูกต้อง)

---

## ปัญหาที่พบ

| อาการ | คำอธิบาย |
|-------|---------|
| **"ไม่มีการเชื่อมต่ออินเทอร์เน็ต"** | แสดงหน้า offline ทั้งที่มี internet |
| **Unregister แล้วกลับมา** | ลบ SW แล้วยังกลับมาลงทะเบียนใหม่ |
| **Cache เก่าไม่หาย** | หน้าเว็บแสดงข้อมูลเก่า |

---

## สาเหตุ

### 1. `navigateFallback` ตั้งค่าผิด

```javascript
// ❌ ปัญหา: ทุก navigation ที่ fetch ช้า → ไปหน้า offline
workbox: {
    navigateFallback: '/offline.html',
}
```

**ทำไมเป็นปัญหา?**
- `navigateFallback` จะ redirect ไป offline.html **ทุกครั้ง** ที่ fetch ล้มเหลว
- อาจเกิดจาก timing issue, slow network, หรือ server busy
- ไม่ใช่ offline จริงๆ แต่ SW คิดว่า offline

### 2. Double Registration

```javascript
// ❌ ปัญหา: ลงทะเบียนซ้ำซ้อน
// vite.config.js มี registerType: 'autoUpdate'
// + app.jsx ก็ลงทะเบียนเอง
navigator.serviceWorker.register('/sw.js');
```

---

## วิธีแก้ไข

### 1. ใช้ NetworkFirst Strategy แทน navigateFallback

```javascript
// ✅ วิธีถูกต้อง: ลอง network ก่อน
workbox: {
    // ลบ navigateFallback
    runtimeCaching: [
        {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 10,
            }
        }
    ]
}
```

**ทำไมดีกว่า?**
- ลอง fetch จาก network ก่อน (รอ 10 วินาที)
- ถ้า timeout จริงๆ ค่อยใช้ cache
- ไม่ redirect ไป offline.html ทันที

### 2. ตั้งค่า injectRegister

```javascript
// ✅ ให้ Vite PWA จัดการ registration
VitePWA({
    injectRegister: 'auto', // หรือ 'script'
    registerType: 'autoUpdate',
})

// แล้วลบ manual registration ใน app.jsx
```

---

## วิธี Clear Cache

### วิธี 1: ใช้ DevTools

1. กด **F12** เปิด DevTools
2. ไปที่ **Application** → **Service Workers**
3. กด **Unregister** ทุก SW
4. ไปที่ **Storage** → กด **Clear site data**
5. **ปิดแท็บ** แล้วเปิดใหม่

### วิธี 2: ใช้ clear-cache.html

เปิด URL: **`https://cperepair.app/clear-cache.html`**

### วิธี 3: Hard Refresh

- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

---

## Configuration ที่ถูกต้อง

### vite.config.js (Recommended)

```javascript
VitePWA({
    registerType: 'autoUpdate',
    injectRegister: null, // หรือ 'auto'
    scope: '/',
    base: '/',
    workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // ไม่ใช้ navigateFallback
        runtimeCaching: [
            // Navigation - NetworkFirst
            {
                urlPattern: ({ request }) => request.mode === 'navigate',
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'pages-cache',
                    networkTimeoutSeconds: 10,
                }
            },
            // Fonts - CacheFirst
            {
                urlPattern: /^https:\/\/fonts\.(googleapis|bunny)\.net\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'fonts-cache',
                    expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
                }
            },
            // Images - StaleWhileRevalidate
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'images-cache',
                    expiration: { maxEntries: 100 }
                }
            },
            // API - NetworkFirst
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
})
```

---

## สรุป

| ปัญหา | วิธีแก้ |
|-------|--------|
| แสดงหน้า offline ผิด | ลบ `navigateFallback`, ใช้ NetworkFirst |
| Cache เก่า | Clear site data + Hard refresh |
| SW ลงทะเบียนซ้ำ | ใช้ injectRegister: 'auto' |

---

## Related Files

| File | Description |
|------|-------------|
| [vite.config.js](file:///home/kim/cpe_repair_system/vite.config.js) | PWA configuration |
| [public/sw.js](file:///home/kim/cpe_repair_system/public/sw.js) | Generated Service Worker |
| [public/clear-cache.html](file:///home/kim/cpe_repair_system/public/clear-cache.html) | Cache clearing utility |
| [resources/js/app.jsx](file:///home/kim/cpe_repair_system/resources/js/app.jsx) | SW registration |
