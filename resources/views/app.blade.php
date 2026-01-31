<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- PWA Manifest -->
        <link rel="manifest" href="/build/manifest.webmanifest">

        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#f97316">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="application-name" content="CPE Repair">
        
        <!-- Apple/iOS Meta Tags -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="CPE Repair">
        
        <!-- Apple Touch Icons -->
        <link rel="apple-touch-icon" href="/icons/ios/180.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/ios/152.png">
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/ios/167.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/ios/180.png">
        
        <!-- Apple Splash Screens -->
        <link rel="apple-touch-startup-image" href="/icons/windows11/SplashScreen.scale-200.png">

        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/ios/32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/ios/16.png">

        <!-- Microsoft Tiles -->
        <meta name="msapplication-TileColor" content="#f97316">
        <meta name="msapplication-TileImage" content="/icons/windows11/Square150x150Logo.scale-200.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/build/sw.js', { scope: '/' })
                        .then(reg => console.log('SW registered:', reg.scope))
                        .catch(err => console.log('SW registration failed:', err));
                });
            }
        </script>
    </body>
</html>

