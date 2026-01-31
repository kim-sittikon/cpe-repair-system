import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let messaging = null;

/**
 * Initialize Firebase (only if config is available)
 */
async function initializeFirebase() {
    if (messaging) return messaging;

    // Check if Firebase config is available
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.log('Firebase config not available');
        return null;
    }

    // Check if messaging is supported in this browser
    const supported = await isSupported();
    if (!supported) {
        console.log('Firebase messaging not supported in this browser');
        return null;
    }

    try {
        app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);
        return messaging;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return null;
    }
}

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export async function requestNotificationPermission() {
    try {
        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return null;
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return null;
        }

        // Initialize Firebase
        const msg = await initializeFirebase();
        if (!msg) return null;

        // Get VAPID key from environment
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error('VAPID key not configured');
            return null;
        }

        // Get FCM token
        const token = await getToken(msg, { vapidKey });

        if (token) {
            console.log('FCM token obtained successfully');
            return token;
        } else {
            console.log('No FCM token available');
            return null;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
    }
}

/**
 * Listen for foreground messages
 * @param {Function} callback - Function to call when message received
 * @returns {Function|null} Unsubscribe function or null
 */
export async function onMessageListener(callback) {
    const msg = await initializeFirebase();
    if (!msg) return null;

    return onMessage(msg, (payload) => {
        console.log('Foreground message received:', payload);
        callback(payload);
    });
}

/**
 * Check if notifications are currently supported and enabled
 * @returns {Object} Status object with support and permission info
 */
export function getNotificationStatus() {
    const supported = 'Notification' in window;
    const permission = supported ? Notification.permission : 'unsupported';

    return {
        supported,
        permission,
        isGranted: permission === 'granted',
        isDenied: permission === 'denied',
        isDefault: permission === 'default'
    };
}

/**
 * Check if Firebase is properly configured
 * @returns {boolean}
 */
export function isFirebaseConfigured() {
    return !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId);
}

export { messaging };
