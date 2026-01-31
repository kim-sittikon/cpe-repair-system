# Lighthouse Audit Guide

คู่มือการรัน Lighthouse และปรับปรุง PWA Score แบบละเอียด

**อัพเดทล่าสุด:** 31 มกราคม 2569  
**โปรเจค:** ระบบแจ้งปัญหา CPE (cperepair.app)

---

## 📋 สารบัญ

1. [Lighthouse คืออะไร?](#-lighthouse-คืออะไร)
2. [วิธีรัน Lighthouse](#-วิธีรัน-lighthouse)
3. [PWA Checklist](#-pwa-checklist)
4. [Performance Metrics](#-performance-metrics)
5. [Issues ที่มักพบและวิธีแก้](#️-issues-ที่มักพบและวิธีแก้)
6. [Accessibility Guide](#-accessibility-guide)
7. [SEO Best Practices](#-seo-best-practices)
8. [Best Practices](#-best-practices)
9. [การวิเคราะห์ผลลัพธ์](#-การวิเคราะห์ผลลัพธ์)
10. [Checklist](#-checklist)

---

## 🔍 Lighthouse คืออะไร?

**Lighthouse** = เครื่องมือ audit เว็บไซต์จาก Google

### ตรวจสอบ 5 หมวด:

| หมวด | ตรวจสอบอะไร |
|------|-------------|
| **Performance** | ความเร็วในการโหลด, ขนาดไฟล์ |
| **Progressive Web App** | PWA requirements ครบหรือไม่ |
| **Accessibility** | เข้าถึงได้สำหรับทุกคน |
| **Best Practices** | Security, modern standards |
| **SEO** | Search engine friendly |

### เป้าหมาย Score:

| หมวด | เป้าหมาย | Priority |
|------|----------|----------|
| PWA | **100** | 🔴 สูงสุด |
| Performance | **90+** | 🔴 สูง |
| Accessibility | **95+** | 🟡 กลาง |
| Best Practices | **100** | 🟡 กลาง |
| SEO | **100** | 🟢 ต่ำ |

---

## 🔧 วิธีรัน Lighthouse

### วิธี 1: Chrome DevTools (แนะนำ)

1. เปิด Chrome → ไปที่ https://cperepair.app
2. กด `F12` หรือ `Ctrl+Shift+I` เปิด DevTools
3. คลิก tab **Lighthouse**
4. เลือก Categories ที่ต้องการ:
   - ✅ Performance
   - ✅ Progressive Web App
   - ✅ Best Practices
   - ✅ Accessibility
   - ✅ SEO
5. เลือก Device: **Mobile** (ยากกว่า Desktop)
6. คลิก **Analyze page load**
7. รอ 30-60 วินาที

> [!TIP]
> **เคล็ดลับ:** ใช้ Incognito mode เพื่อหลีกเลี่ยง extensions ที่อาจกระทบผล

### วิธี 2: Command Line (สำหรับ CI/CD)

```bash
# ติดตั้ง Lighthouse CLI
npm install -g lighthouse

# รัน audit ทั้งหมด
lighthouse https://cperepair.app \
    --output=html \
    --output-path=./reports/lighthouse-report.html

# รันเฉพาะ PWA
lighthouse https://cperepair.app \
    --only-categories=pwa \
    --output=json \
    --output-path=./reports/pwa-audit.json

# รัน headless (ไม่เปิด browser)
lighthouse https://cperepair.app \
    --chrome-flags="--headless" \
    --output=html

# รันหลาย URL
for url in "/" "/dashboard" "/report/create"; do
    lighthouse "https://cperepair.app$url" \
        --output=html \
        --output-path="./reports/lighthouse-$url.html"
done
```

### วิธี 3: Web-based Tools

| เครื่องมือ | URL | หมายเหตุ |
|-----------|-----|----------|
| **PageSpeed Insights** | https://pagespeed.web.dev | Google official |
| **web.dev Measure** | https://web.dev/measure | Detailed report |
| **GTmetrix** | https://gtmetrix.com | Alternative |
| **WebPageTest** | https://webpagetest.org | Advanced |

### วิธี 4: Lighthouse CI (GitHub Actions)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://cperepair.app
            https://cperepair.app/dashboard
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

## 📋 PWA Checklist

### Installable Requirements (ติดตั้งได้)

| Item | สถานะ | ตรวจสอบ |
|------|-------|---------|
| **HTTPS enabled** | ✅ | Cloudflare SSL |
| **manifest.json** exists | ✅ | vite.config.js สร้างให้ |
| **Service Worker** registered | ✅ | Workbox |
| **start_url** defined | ✅ | "/" |
| **name** or **short_name** | ✅ | "ระบบแจ้งปัญหา CPE" |
| **display** mode | ✅ | standalone |
| **Icons 192x192** | ✅ | /icons/android/ |
| **Icons 512x512** | ✅ | /icons/android/ |

### PWA Optimized (เพิ่มเติม)

| Item | สถานะ | ตรวจสอบ |
|------|-------|---------|
| **Redirects HTTP to HTTPS** | ✅ | Cloudflare |
| **Content sized for viewport** | ✅ | Responsive CSS |
| **Has meta viewport** | ✅ | app.blade.php |
| **Has theme-color** | ✅ | #f97316 |
| **Maskable icon** | ✅ | 512x512 maskable |
| **Offline page** works | ✅ | /offline.html |
| **Screenshots** for install | ✅ | /screenshots/ |

### ตรวจสอบ Manifest

**ตำแหน่ง:** `public/manifest.webmanifest` (auto-generated)

```bash
# ดู manifest
curl https://cperepair.app/manifest.webmanifest | jq
```

**ต้องมี fields เหล่านี้:**
```json
{
    "name": "ระบบแจ้งปัญหา CPE",
    "short_name": "CPE Repair",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#f97316",
    "icons": [
        { "src": "/icons/android/..192.png", "sizes": "192x192" },
        { "src": "/icons/android/..512.png", "sizes": "512x512", "purpose": "maskable" }
    ]
}
```

### ตรวจสอบ Service Worker

```javascript
// ใน Console ของ browser
navigator.serviceWorker.getRegistrations().then(console.log);

// ควรได้ผลลัพธ์แบบนี้:
// [ServiceWorkerRegistration { ... scope: "https://cperepair.app/" }]
```

---

## 📈 Performance Metrics

### Core Web Vitals (สำคัญมาก!)

| Metric | ชื่อเต็ม | เป้าหมาย | คำอธิบาย |
|--------|----------|----------|----------|
| **LCP** | Largest Contentful Paint | < 2.5s | เวลาแสดงเนื้อหาใหญ่สุด |
| **FID** | First Input Delay | < 100ms | เวลาตอบสนอง interaction แรก |
| **CLS** | Cumulative Layout Shift | < 0.1 | ความเสถียรของ layout |

### Other Metrics

| Metric | ชื่อเต็ม | เป้าหมาย | คำอธิบาย |
|--------|----------|----------|----------|
| **FCP** | First Contentful Paint | < 1.8s | เวลาแสดงเนื้อหาแรก |
| **SI** | Speed Index | < 3.4s | ความเร็วในการแสดงผล |
| **TBT** | Total Blocking Time | < 200ms | เวลา main thread ถูก block |
| **TTI** | Time to Interactive | < 3.8s | เวลาที่ใช้งานได้ |

### วิธีปรับปรุง Performance

#### 1. ลด JavaScript Bundle

```javascript
// vite.config.js - Code splitting
build: {
    rollupOptions: {
        output: {
            manualChunks: {
                'recharts': ['recharts'],
                'vendor': ['react', 'react-dom'],
            },
        },
    },
},
```

#### 2. Lazy Loading Images

```jsx
<img src={url} loading="lazy" alt="..." />
```

#### 3. Preload Critical Assets

```html
<!-- app.blade.php -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin>
<link rel="preconnect" href="https://fonts.bunny.net">
```

#### 4. Optimize Images

```bash
# ใช้ WebP format
cwebp input.png -o output.webp -q 80

# Resize images
convert input.jpg -resize 800x600 output.jpg
```

---

## ⚠️ Issues ที่มักพบและวิธีแก้

### Performance Issues

| Issue | สาเหตุ | วิธีแก้ |
|-------|--------|--------|
| **Reduce unused JavaScript** | Bundle ใหญ่เกินไป | [Lazy Loading](./LAZY_LOADING_GUIDE.md) |
| **Eliminate render-blocking resources** | CSS/JS block render | `async`, `defer`, inline critical CSS |
| **Properly size images** | รูปใหญ่เกินไป | Resize, srcset |
| **Serve images in next-gen formats** | ใช้ JPEG/PNG | WebP, AVIF |
| **Avoid large layout shifts** | CLS สูง | กำหนด width/height ให้ img |
| **Reduce server response time** | TTFB สูง | Caching, CDN |
| **Avoid enormous network payloads** | ดาวน์โหลดมากเกินไป | Compression, lazy load |

#### ตัวอย่างแก้ Render-blocking

**ก่อน:**
```html
<link rel="stylesheet" href="/css/app.css">
<script src="/js/app.js"></script>
```

**หลัง:**
```html
<!-- Critical CSS inline -->
<style>
    /* Above-the-fold styles */
    body { font-family: sans-serif; }
    .header { background: #f97316; }
</style>

<!-- Non-critical CSS deferred -->
<link rel="preload" href="/css/app.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Scripts deferred -->
<script src="/js/app.js" defer></script>
```

#### ตัวอย่างแก้ Layout Shift

**ก่อน:**
```jsx
<img src={url} alt="Photo" />
```

**หลัง:**
```jsx
<img 
    src={url} 
    alt="Photo"
    width="800"
    height="600"
    className="w-full h-auto"
/>
```

---

## ♿ Accessibility Guide

### Common Issues และวิธีแก้

| Issue | วิธีแก้ | ตัวอย่าง |
|-------|--------|----------|
| **Missing alt text** | เพิ่ม alt ให้ img | `<img alt="รูปภาพ" />` |
| **Low contrast** | ปรับสี | Contrast ratio 4.5:1 |
| **Missing form labels** | เพิ่ม label | `<label for="email">` |
| **No focus indicators** | CSS :focus | `outline: 2px solid blue` |
| **Missing lang attribute** | เพิ่มใน html | `<html lang="th">` |
| **Interactive elements too small** | เพิ่มขนาด | min 44x44px |
| **Missing skip link** | เพิ่ม skip link | Link ไปยัง main content |

### ตรวจสอบ Contrast Ratio

```css
/* ❌ ไม่ผ่าน - contrast ต่ำ */
.bad {
    color: #aaa;
    background: #fff;
}

/* ✅ ผ่าน - contrast 4.5:1+ */
.good {
    color: #333;
    background: #fff;
}
```

**เครื่องมือตรวจสอบ:**
- https://webaim.org/resources/contrastchecker/
- Chrome DevTools → Inspect element → Color picker

### Form Accessibility

```jsx
// ❌ ไม่ดี
<input type="email" placeholder="Email" />

// ✅ ดี
<div>
    <label htmlFor="email" className="block text-sm font-medium">
        อีเมล
    </label>
    <input 
        type="email" 
        id="email"
        name="email"
        aria-describedby="email-hint"
        required
    />
    <p id="email-hint" className="text-sm text-gray-500">
        ใช้อีเมลมหาวิทยาลัย
    </p>
</div>
```

### Skip Link

```jsx
// ใน Layout
<a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 z-50"
>
    ข้ามไปยังเนื้อหาหลัก
</a>

<main id="main-content">
    {/* content */}
</main>
```

---

## 🔍 SEO Best Practices

### Meta Tags ที่ต้องมี

```html
<!-- app.blade.php -->
<head>
    <!-- Basic -->
    <title>ระบบแจ้งปัญหา CPE | cperepair.app</title>
    <meta name="description" content="ระบบรับแจ้งปัญหาและร้องเรียนของคณะวิศวกรรมคอมพิวเตอร์">
    
    <!-- Viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Open Graph -->
    <meta property="og:title" content="ระบบแจ้งปัญหา CPE">
    <meta property="og:description" content="ระบบรับแจ้งปัญหาและร้องเรียน">
    <meta property="og:image" content="/images/og-image.png">
    <meta property="og:url" content="https://cperepair.app">
    <meta property="og:type" content="website">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="ระบบแจ้งปัญหา CPE">
    <meta name="twitter:description" content="ระบบรับแจ้งปัญหาและร้องเรียน">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://cperepair.app">
    
    <!-- Language -->
    <html lang="th">
</head>
```

### Inertia.js SEO

```jsx
// ทุกหน้าต้องมี Head
import { Head } from '@inertiajs/react';

export default function MyPage() {
    return (
        <>
            <Head>
                <title>หน้าแจ้งซ่อม</title>
                <meta name="description" content="แจ้งซ่อมอุปกรณ์..." />
            </Head>
            {/* content */}
        </>
    );
}
```

### Robots.txt

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://cperepair.app/sitemap.xml
```

---

## 🛡️ Best Practices

### Security Headers

```php
// app/Http/Middleware/SecurityHeaders.php
public function handle($request, $next)
{
    $response = $next($request);
    
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->headers->set('Permissions-Policy', 'geolocation=(self), camera=(self)');
    
    return $response;
}
```

### HTTPS Enforcement

```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    if (config('app.env') === 'production') {
        URL::forceScheme('https');
    }
}
```

### Console Errors

```javascript
// ตรวจสอบ Console errors
// ไม่ควรมี error ใดๆ ใน Console
```

### ✅ Best Practices Checklist

- [ ] ใช้ HTTPS ทุก requests
- [ ] ไม่มี mixed content (HTTP on HTTPS)
- [ ] ไม่มี console errors
- [ ] ไม่ใช้ deprecated APIs
- [ ] มี valid source maps
- [ ] ไม่มี vulnerable libraries

---

## 📊 การวิเคราะห์ผลลัพธ์

### อ่าน Lighthouse Report

#### Performance Section

```
Performance Score: 85
├── First Contentful Paint: 1.2s ✅
├── Largest Contentful Paint: 2.8s ⚠️ (เกิน 2.5s)
├── Total Blocking Time: 150ms ✅
├── Cumulative Layout Shift: 0.05 ✅
└── Speed Index: 2.1s ✅
```

**สิ่งที่ต้องแก้:** LCP > 2.5s → ต้อง optimize รูปภาพหลักหรือ lazy load

#### Opportunities Section

```
Opportunities (ประหยัดได้):
├── Reduce unused JavaScript: 2.5s (348 KB)
├── Properly size images: 0.8s
└── Serve images in next-gen formats: 0.3s
```

**Priority:** แก้ตามลำดับความสำคัญ (ประหยัดเวลามากที่สุดก่อน)

#### Diagnostics Section

```
Diagnostics:
├── Avoid large layout shifts ⚠️
├── Minimize main-thread work ⚠️
└── Reduce JavaScript execution time ⚠️
```

### Export และ Track

```bash
# Export JSON สำหรับ tracking
lighthouse https://cperepair.app \
    --output=json \
    --output-path="./reports/$(date +%Y%m%d).json"

# เปรียบเทียบกับครั้งก่อน
npx lighthouse-ci diff \
    --from=./reports/20260130.json \
    --to=./reports/20260131.json
```

---

## ⏱️ เวลาประมาณ

| Task | เวลา |
|------|------|
| รัน Lighthouse ครั้งแรก | 5 นาที |
| วิเคราะห์ผลลัพธ์ | 15 นาที |
| แก้ไข Performance issues | 30-60 นาที |
| แก้ไข Accessibility issues | 30 นาที |
| แก้ไข Best Practices issues | 15 นาที |
| แก้ไข SEO issues | 15 นาที |
| รัน Lighthouse อีกครั้ง | 5 นาที |
| **รวม** | **~2-2.5 ชม.** |

---

## 📋 Checklist

### Before Audit
- [ ] Deploy ไป production
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Close other tabs
- [ ] ใช้ Incognito mode
- [ ] ปิด Chrome extensions

### During Audit
- [ ] เลือก Mobile device
- [ ] เลือกทุก categories
- [ ] รอให้ audit เสร็จสมบูรณ์
- [ ] บันทึก screenshot ของ scores

### After Audit
- [ ] Export HTML report
- [ ] สร้าง issue list จาก failures
- [ ] Fix issues ตามลำดับ priority
- [ ] Re-run audit หลังแก้ไข
- [ ] อัพเดทตาราง tracking ด้านล่าง

### PWA Score 100 Requirements
- [ ] HTTPS enabled
- [ ] manifest.json valid
- [ ] Service Worker registered
- [ ] Icons 192x192 and 512x512
- [ ] Maskable icon
- [ ] start_url defined
- [ ] display: standalone
- [ ] theme-color defined
- [ ] Offline page working
- [ ] Screenshots for install

### Performance 90+ Requirements
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] TBT < 200ms
- [ ] No unused JavaScript > 2s
- [ ] Images optimized
- [ ] Lazy loading implemented

---

## 📝 รายงาน Lighthouse

### History

| วันที่ | PWA | Performance | Accessibility | Best Practices | SEO | หมายเหตุ |
|--------|-----|-------------|---------------|----------------|-----|----------|
| - | - | - | - | - | - | ยังไม่ได้รัน |

> อัพเดทตารางนี้หลังรัน Lighthouse แต่ละครั้ง

### Action Items

| Priority | Issue | Status | วันที่แก้ไข |
|----------|-------|--------|------------|
| 🔴 High | - | - | - |
| 🟡 Medium | - | - | - |
| 🟢 Low | - | - | - |

---

## 🔗 Resources

### Official Documentation
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [web.dev](https://web.dev)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools
- [PageSpeed Insights](https://pagespeed.web.dev)
- [WebPageTest](https://webpagetest.org)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

### Learning
- [PWA Training](https://web.dev/learn/pwa/)
- [Accessibility Guide](https://web.dev/accessibility/)
- [Performance Guide](https://web.dev/performance/)
