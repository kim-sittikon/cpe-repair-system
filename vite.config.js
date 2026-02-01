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
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'icons/**/*'],
            // Fix scope issue
            outDir: 'public',
            srcDir: 'public',
            filename: 'sw.js',
            injectRegister: null,
            scope: '/',
            base: '/',
            manifest: {
                name: 'ระบบแจ้งปัญหา CPE',
                short_name: 'CPE Repair',
                description: 'ระบบรับแจ้งปัญหาและร้องเรียน ภาควิชาวิศวกรรมคอมพิวเตอร์',
                theme_color: '#f97316',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                categories: ['utilities', 'productivity'],
                icons: [
                    {
                        src: '/icons/android/android-launchericon-48-48.png',
                        sizes: '48x48',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/android/android-launchericon-72-72.png',
                        sizes: '72x72',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/android/android-launchericon-96-96.png',
                        sizes: '96x96',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/android/android-launchericon-144-144.png',
                        sizes: '144x144',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/android/android-launchericon-192-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/icons/android/android-launchericon-512-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ],
                shortcuts: [
                    {
                        name: 'แจ้งซ่อม',
                        short_name: 'แจ้งซ่อม',
                        description: 'แจ้งปัญหาการซ่อมบำรุง',
                        url: '/report/create',
                        icons: [{ src: '/icons/android/android-launchericon-96-96.png', sizes: '96x96' }]
                    },
                    {
                        name: 'ร้องเรียน',
                        short_name: 'ร้องเรียน',
                        description: 'แจ้งปัญหาร้องเรียน',
                        url: '/complaint/create',
                        icons: [{ src: '/icons/android/android-launchericon-96-96.png', sizes: '96x96' }]
                    },
                    {
                        name: 'ตรวจสอบสถานะ',
                        short_name: 'สถานะ',
                        description: 'ตรวจสอบสถานะการแจ้ง',
                        url: '/my-reports',
                        icons: [{ src: '/icons/android/android-launchericon-96-96.png', sizes: '96x96' }]
                    }
                ],
                screenshots: [
                    {
                        src: '/icons/windows11/SplashScreen.scale-200.png',
                        sizes: '1240x600',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'ระบบแจ้งปัญหา CPE'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                // 🔴 CRITICAL: ปิด NavigationRoute เพราะ Laravel ไม่ใช่ SPA
                // Vite PWA default จะสร้าง NavigationRoute → index.html ซึ่งไม่มีใน Laravel
                // ทำให้ SW redirect ไป index.html → ไม่เจอ → แสดงหน้า offline
                navigateFallback: null,
                runtimeCaching: [
                    // Navigation requests - ใช้ NetworkFirst เพื่อให้ลอง network ก่อน
                    {
                        urlPattern: ({ request }) => request.mode === 'navigate',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pages-cache',
                            networkTimeoutSeconds: 10,
                            plugins: []
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.bunny\.net\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'bunny-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /\/api\/.*/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            networkTimeoutSeconds: 10,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        },
    },
});
