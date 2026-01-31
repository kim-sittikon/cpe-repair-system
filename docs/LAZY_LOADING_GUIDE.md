# Lazy Loading Implementation Guide

คู่มือการทำ Lazy Loading สำหรับ React + Inertia.js แบบละเอียด

**อัพเดทล่าสุด:** 31 มกราคม 2569  
**โปรเจค:** ระบบแจ้งปัญหา CPE (cperepair.app)

---

## 📋 สารบัญ

1. [Lazy Loading คืออะไร?](#-lazy-loading-คืออะไร)
2. [วิเคราะห์ Bundle Size ปัจจุบัน](#-วิเคราะห์-bundle-size-ปัจจุบัน)
3. [หน้าที่ควร Lazy Load](#-หน้าที่ควร-lazy-load)
4. [วิธีทำ Lazy Loading](#️-วิธีทำ-lazy-loading-step-by-step)
5. [Image Lazy Loading](#️-image-lazy-loading)
6. [Code Splitting ขั้นสูง](#-code-splitting-ขั้นสูง)
7. [การทดสอบ](#-การทดสอบ)
8. [Checklist](#-checklist)

---

## 🎯 Lazy Loading คืออะไร?

**Lazy Loading** = โหลดเฉพาะสิ่งที่จำเป็นเมื่อต้องใช้งาน

### ปัญหาที่พบ (Before)
```
เข้าหน้าแรก → โหลดทุกหน้า (724 KB) → ช้า!
```

### หลัง Lazy Loading (After)
```
เข้าหน้าแรก → โหลดเฉพาะหน้าแรก (376 KB) → เร็ว!
เข้า Dashboard → โหลด Dashboard (+348 KB) → ตอนที่ต้องใช้
```

### ประโยชน์
- ⚡ **เว็บโหลดเร็วขึ้น** - ลด initial bundle size
- 📱 **ดีสำหรับ 3G/4G** - ประหยัด data
- 🔋 **ประหยัดแบต** - โหลดน้อยลง
- 📈 **Lighthouse Score สูงขึ้น** - Performance ดีขึ้น

---

## 📊 วิเคราะห์ Bundle Size ปัจจุบัน

### คำสั่งเช็ค Bundle Size

```bash
# ดู build output
docker compose exec laravel.test npm run build

# ดูขนาดไฟล์ที่ build แล้ว
du -sh public/build/assets/*.js | sort -h | tail -15

# ดูขนาดไฟล์ source
find resources/js -name "*.jsx" | xargs wc -l | sort -n | tail -20
```

### ผลลัพธ์ Bundle Size ปัจจุบัน

| ไฟล์ Build | ขนาด | ปัญหา |
|------------|------|-------|
| `app-*.js` | **376 KB** | Main bundle ใหญ่ |
| `AreaChart-*.js` | **348 KB** | ⚠️ **Recharts - ตัวใหญ่สุด!** |
| `AuthenticatedLayout-*.js` | 68 KB | Layout หลัก |
| `Create-*.js` (Jobs) | 36 KB | หน้าสร้าง Job |
| `PrivacyPolicy-*.js` | 36 KB | นโยบาย |
| `Dashboard-*.js` | 32 KB | Dashboard pages |
| `Index-*.js` | 32 KB | Index pages |
| `Register-*.js` | 32 KB | หน้าลงทะเบียน |
| `Modal-*.js` | 32 KB | Modal component |
| `Welcome-*.js` | 20 KB | หน้าแรก |

> [!IMPORTANT]
> **ปัญหาหลัก:** Recharts library มีขนาด **348 KB** แต่ใช้แค่ **3 หน้า**!
> ทำให้ทุกครั้งที่เข้าเว็บต้องโหลด 348 KB ทั้งที่ไม่ได้ใช้

### รวม Bundle ที่โหลดตอนเข้าเว็บครั้งแรก

| รายการ | ขนาด |
|--------|------|
| Main bundle (`app-*.js`) | 376 KB |
| Recharts (`AreaChart-*.js`) | 348 KB |
| **รวม Initial Load** | **~724 KB** |

---

## 📁 หน้าที่ควร Lazy Load

### Priority 1: หน้าที่ใช้ Recharts (ผลกระทบสูงสุด)

| หน้า | ไฟล์ | บรรทัด | เหตุผล |
|------|------|--------|--------|
| Admin Dashboard | `Pages/Admin/Dashboard.jsx` | 433 | มี Recharts |
| Repair Dashboard | `Pages/Repair/Dashboard.jsx` | 433 | มี Recharts |
| Complaint Dashboard | `Pages/Complaint/Dashboard.jsx` | 496 | มี Recharts |

**Recharts imports ที่ใช้:**
```jsx
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend, 
    AreaChart, Area 
} from 'recharts';
```

### Priority 2: หน้า Admin (เฉพาะ Admin ใช้)

| หน้า | ไฟล์ | บรรทัด | เหตุผล |
|------|------|--------|--------|
| Admin ManageUser | `Pages/Admin/ManageUser.jsx` | 592 | จัดการผู้ใช้ |
| Admin UserList | `Pages/Admin/UserList.jsx` | 497 | รายชื่อผู้ใช้ |
| Admin ManageKeywords | `Pages/Admin/ManageKeywords.jsx` | 411 | จัดการคีย์เวิร์ด |
| Admin InviteUser | `Pages/Admin/InviteUser.jsx` | 411 | เชิญผู้ใช้ |

### Priority 3: หน้าสร้าง/แก้ไข (ใช้ไม่บ่อย)

| หน้า | ไฟล์ | บรรทัด | เหตุผล |
|------|------|--------|--------|
| Jobs Create | `Pages/Jobs/Create.jsx` | 813 | ซับซ้อนที่สุด |
| Announcement Create | `Pages/Announcement/Create.jsx` | 794 | ซับซ้อน |
| Jobs Show | `Pages/Jobs/Show.jsx` | 453 | แสดง Job |
| Jobs MyJobs | `Pages/Jobs/MyJobs.jsx` | 508 | งานของฉัน |

### Priority 4: หน้า Index (มีข้อมูลมาก)

| หน้า | ไฟล์ | บรรทัด | เหตุผล |
|------|------|--------|--------|
| Repair Index | `Pages/Repair/Index.jsx` | 704 | รายการซ่อมทั้งหมด |
| Complaint Index | `Pages/Complaint/Index.jsx` | 559 | รายการร้องเรียน |

### Priority 5: หน้าอื่นๆ

| หน้า | ไฟล์ | บรรทัด | เหตุผล |
|------|------|--------|--------|
| PrivacyPolicy | `Pages/Legal/PrivacyPolicy.jsx` | 501 | ใช้ไม่บ่อย |
| Keywords Personal | `Pages/Keywords/PersonalIndex.jsx` | 433 | ตั้งค่าคีย์เวิร์ด |

### ❌ ไม่ควร Lazy Load

| หน้า | ไฟล์ | เหตุผล |
|------|------|--------|
| Welcome | `Pages/Welcome.jsx` | หน้าแรก - ต้องโหลดเร็ว |
| Login | `Pages/Auth/Login.jsx` | หน้าสำคัญ |
| Register | `Pages/Auth/Register.jsx` | หน้าสำคัญ |
| Navbar | `Components/UI/Navbar.jsx` | ใช้ทุกหน้า |
| BottomNavbar | `Components/UI/BottomNavbar.jsx` | ใช้ทุกหน้า |

---

## 🛠️ วิธีทำ Lazy Loading (Step-by-Step)

### Step 1: สร้าง Loading Component

```jsx
// resources/js/Components/UI/PageLoader.jsx

export default function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            {/* Spinner */}
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 absolute top-0 left-0"></div>
            </div>
            
            {/* Text */}
            <p className="text-gray-500 text-sm">กำลังโหลด...</p>
        </div>
    );
}
```

### Step 2: Lazy Load Dashboard Pages (Recharts)

**ปัญหา:** Inertia.js ไม่รองรับ React.lazy() โดยตรง

**วิธีแก้:** ใช้ Dynamic import ใน `app.jsx`

```jsx
// resources/js/app.jsx

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#f97316', // สีส้ม
        showSpinner: true,
    },
});
```

> [!NOTE]
> Inertia.js + Vite จะทำ code splitting โดยอัตโนมัติผ่าน `import.meta.glob`
> แต่ยังมีปัญหากับ library ใหญ่อย่าง Recharts

### Step 3: แยก Recharts ออกจาก Main Bundle

**แก้ไข `vite.config.js`:**

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            // ... PWA config
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // แยก Recharts เป็น chunk ของมันเอง
                    'recharts': ['recharts'],
                    // แยก vendor อื่นๆ
                    'vendor': [
                        'react',
                        'react-dom',
                        '@inertiajs/react',
                    ],
                },
            },
        },
    },
});
```

### Step 4: Lazy Import Recharts ใน Dashboard

**แก้ไข Dashboard pages:**

```jsx
// resources/js/Pages/Admin/Dashboard.jsx

import { useState, useEffect, lazy, Suspense } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Lazy load Recharts components
const LazyCharts = lazy(() => import('@/Components/Charts/DashboardCharts'));

export default function Dashboard({ auth, stats, chartData }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="แดชบอร์ด" />
            
            {/* Stats cards - โหลดทันที */}
            <div className="grid grid-cols-4 gap-4">
                {/* ... stats cards ... */}
            </div>
            
            {/* Charts - Lazy load */}
            <Suspense fallback={<ChartSkeleton />}>
                <LazyCharts data={chartData} />
            </Suspense>
        </AuthenticatedLayout>
    );
}

// Skeleton loader for charts
function ChartSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
    );
}
```

**สร้าง Charts component:**

```jsx
// resources/js/Components/Charts/DashboardCharts.jsx

import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

export default function DashboardCharts({ data }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data?.line || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" fill="#f97316" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="bg-white rounded-xl p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data?.pie || []} dataKey="value" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
```

---

## 🖼️ Image Lazy Loading

### วิธี 1: Native Lazy Loading (ง่ายที่สุด)

```jsx
// เพิ่ม loading="lazy" ให้ทุก <img>
<img 
    src={imageUrl} 
    loading="lazy" 
    alt="รูปภาพ"
    className="w-full h-auto"
/>
```

**Browser Support:** Chrome 77+, Firefox 75+, Safari 15.4+

### วิธี 2: Lazy Loading with Placeholder

```jsx
// resources/js/Components/UI/LazyImage.jsx

import { useState } from 'react';

export default function LazyImage({ src, alt, className, placeholder }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    
    return (
        <div className={`relative ${className}`}>
            {/* Placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
            )}
            
            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">ไม่สามารถโหลดรูปได้</span>
                </div>
            )}
            
            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
}
```

### วิธี 3: Intersection Observer (Advanced)

```jsx
// resources/js/hooks/useLazyImage.js

import { useEffect, useRef, useState } from 'react';

export function useLazyImage(src) {
    const imgRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setImageSrc(src);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // โหลดล่วงหน้า 100px
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [src]);

    return { imgRef, imageSrc, isVisible };
}

// การใช้งาน
function MyComponent() {
    const { imgRef, imageSrc, isVisible } = useLazyImage('/images/photo.jpg');
    
    return (
        <div ref={imgRef}>
            {isVisible && <img src={imageSrc} alt="Photo" />}
        </div>
    );
}
```

---

## 🔧 Code Splitting ขั้นสูง

### Route-based Code Splitting

```jsx
// resources/js/app.jsx

import { createInertiaApp } from '@inertiajs/react';

createInertiaApp({
    resolve: async (name) => {
        // Dynamic import with code splitting
        const pages = import.meta.glob('./Pages/**/*.jsx');
        const page = await pages[`./Pages/${name}.jsx`]();
        return page.default;
    },
    // ...
});
```

### Component-based Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// Heavy components
const HeavyEditor = lazy(() => import('./Components/HeavyEditor'));
const ComplexChart = lazy(() => import('./Components/ComplexChart'));
const DataTable = lazy(() => import('./Components/DataTable'));

function MyPage() {
    return (
        <div>
            {/* Light content loads first */}
            <h1>Page Title</h1>
            
            {/* Heavy components lazy loaded */}
            <Suspense fallback={<Skeleton />}>
                <HeavyEditor />
            </Suspense>
        </div>
    );
}
```

### Prefetching (โหลดล่วงหน้า)

```jsx
import { router } from '@inertiajs/react';

// Prefetch เมื่อ hover
function NavLink({ href, children }) {
    return (
        <a
            href={href}
            onMouseEnter={() => router.prefetch(href)}
            onClick={(e) => {
                e.preventDefault();
                router.visit(href);
            }}
        >
            {children}
        </a>
    );
}
```

---

## 🧪 การทดสอบ

### 1. เช็ค Bundle Size หลัง Build

```bash
# Build production
docker compose exec laravel.test npm run build

# ดูขนาดไฟล์
du -sh public/build/assets/*.js | sort -h

# เปรียบเทียบก่อน/หลัง
```

### 2. เช็คด้วย Chrome DevTools

1. เปิด DevTools (F12)
2. ไปที่ **Network** tab
3. Filter เฉพาะ **JS**
4. Reload หน้า (Ctrl+Shift+R)
5. ดูว่าไฟล์ไหนโหลดตอนไหน

### 3. เช็ค Coverage (Unused JS)

1. เปิด DevTools (F12)
2. กด `Ctrl+Shift+P` → พิมพ์ "Coverage"
3. คลิก **Start instrumenting coverage**
4. Reload หน้าและใช้งาน
5. ดูว่ามี JS ส่วนไหนไม่ได้ใช้

### 4. Lighthouse Performance

1. เปิด Lighthouse tab
2. รัน audit
3. ดู "Reduce unused JavaScript" suggestion

---

## 📈 ผลลัพธ์ที่คาดหวัง

| Metric | ก่อนทำ | หลังทำ | ประหยัด |
|--------|--------|--------|---------|
| Initial Bundle | ~724 KB | ~376 KB | **348 KB (48%)** |
| First Contentful Paint | ~2-3s | ~1-1.5s | ~1s |
| Time to Interactive | ~3-4s | ~2s | ~1-2s |
| Lighthouse Performance | ~70-80 | ~90+ | +10-20 |

---

## ⏱️ เวลาประมาณ

| Task | เวลา |
|------|------|
| สร้าง PageLoader component | 10 นาที |
| แก้ไข vite.config.js (manualChunks) | 15 นาที |
| Lazy load Dashboard pages | 30 นาที |
| Lazy load Admin pages | 20 นาที |
| Image Lazy Loading | 15 นาที |
| Testing | 20 นาที |
| **รวม** | **~2 ชม.** |

---

## 📋 Checklist

### Core Setup
- [ ] สร้าง `Components/UI/PageLoader.jsx`
- [ ] แก้ไข `vite.config.js` - เพิ่ม manualChunks

### Dashboard Pages (Recharts)
- [ ] แยก Charts เป็น component แยก
- [ ] Lazy load `Pages/Admin/Dashboard.jsx`
- [ ] Lazy load `Pages/Repair/Dashboard.jsx`
- [ ] Lazy load `Pages/Complaint/Dashboard.jsx`

### Admin Pages
- [ ] Lazy load `Pages/Admin/ManageUser.jsx`
- [ ] Lazy load `Pages/Admin/ManageKeywords.jsx`
- [ ] Lazy load `Pages/Admin/InviteUser.jsx`
- [ ] Lazy load `Pages/Admin/UserList.jsx`

### Jobs Pages
- [ ] Lazy load `Pages/Jobs/Create.jsx`
- [ ] Lazy load `Pages/Jobs/Show.jsx`
- [ ] Lazy load `Pages/Jobs/MyJobs.jsx`

### Other Pages
- [ ] Lazy load `Pages/Announcement/Create.jsx`
- [ ] Lazy load `Pages/Legal/PrivacyPolicy.jsx`

### Image Lazy Loading
- [ ] เพิ่ม `loading="lazy"` ให้ทุก `<img>`
- [ ] สร้าง `LazyImage` component (optional)

### Testing
- [ ] Build และเช็ค bundle size
- [ ] Test ว่า pages ยังทำงานปกติ
- [ ] เช็ค Network tab ใน DevTools
- [ ] รัน Lighthouse audit
