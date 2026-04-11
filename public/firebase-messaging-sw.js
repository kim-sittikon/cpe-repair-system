// Firebase Messaging Service Worker
// This file handles background push notifications

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase configuration from Firebase Console
const firebaseConfig = {
    apiKey: 'AIzaSyA0kRXESeGizZhIf0qhWUiw7VHdp4K1MPQ',
    authDomain: 'cpe-repair-system.firebaseapp.com',
    projectId: 'cpe-repair-system',
    storageBucket: 'cpe-repair-system.firebasestorage.app',
    messagingSenderId: '264610360192',
    appId: '1:264610360192:web:290e329c316e8376b0ef65'
};

// Initialize Firebase only if config is valid
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message:', payload);

        const notificationTitle = payload.notification?.title || 'แจ้งเตือนใหม่';
        const notificationOptions = {
            body: payload.notification?.body || '',
            icon: '/icons/android/android-launchericon-192-192.png',
            badge: '/icons/android/android-launchericon-96-96.png',
            tag: payload.data?.type || 'default',
            data: payload.data,
            vibrate: [100, 50, 100],
            actions: [
                {
                    action: 'open',
                    title: 'เปิดดู'
                },
                {
                    action: 'close',
                    title: 'ปิด'
                }
            ]
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click:', event);

    event.notification.close();

    // Handle action buttons
    if (event.action === 'close') {
        return;
    }

    // Get URL from notification data
    const url = event.notification.data?.url || '/dashboard';
    const fullUrl = new URL(url, self.location.origin).href;

    // Open or focus the app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if app is already open
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(fullUrl);
                    return;
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(fullUrl);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[firebase-messaging-sw.js] Notification closed:', event);
});

// Handle push events directly (fallback)
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Push event received');

    if (event.data) {
        try {
            const payload = event.data.json();
            console.log('[firebase-messaging-sw.js] Push data:', payload);
        } catch (e) {
            console.log('[firebase-messaging-sw.js] Push data (text):', event.data.text());
        }
    }
});

console.log('[firebase-messaging-sw.js] Service worker loaded');
