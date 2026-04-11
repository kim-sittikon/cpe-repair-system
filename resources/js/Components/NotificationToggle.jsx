import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { requestNotificationPermission, getNotificationStatus, isFirebaseConfigured } from '@/firebase';
import axios from 'axios';

/**
 * NotificationToggle Component
 * 
 * A toggle switch for enabling/disabling push notifications
 * Designed for mobile hamburger menu and desktop dropdown
 * 
 * @param {boolean} compact - If true, renders a more compact version for desktop
 */
export default function NotificationToggle({ compact = false }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('checking'); // checking, enabled, disabled, unsupported

    useEffect(() => {
        checkStatus();

        // Listen for custom event when notification status changes
        const handleNotificationChange = () => {
            checkStatus();
        };

        // Re-check when page becomes visible (user switches tabs)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkStatus();
            }
        };

        window.addEventListener('notificationStatusChanged', handleNotificationChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('notificationStatusChanged', handleNotificationChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const checkStatus = async () => {
        setLoading(true);

        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
            setStatus('unsupported');
            setLoading(false);
            return;
        }

        const notifStatus = getNotificationStatus();

        if (!notifStatus.supported) {
            setStatus('unsupported');
            setLoading(false);
            return;
        }

        if (notifStatus.isDenied) {
            setIsEnabled(false);
            setStatus('denied');
            setLoading(false);
            return;
        }

        // Check backend status - if user has token saved
        try {
            const response = await axios.get('/fcm/status');
            if (response.data.has_token) {
                setIsEnabled(true);
                setStatus('enabled');
            } else {
                setIsEnabled(false);
                setStatus('disabled');
            }
        } catch (err) {
            // Fallback to browser permission only
            if (notifStatus.isGranted) {
                setIsEnabled(false); // Permission granted but no token
                setStatus('disabled');
            } else {
                setIsEnabled(false);
                setStatus('disabled');
            }
        }

        setLoading(false);
    };


    const handleToggle = async () => {
        if (loading) return;

        setLoading(true);

        if (!isEnabled) {
            // Try to enable notifications
            try {
                const token = await requestNotificationPermission();

                if (token) {
                    // Send token to backend
                    await axios.post('/fcm/token', { token });
                    setIsEnabled(true);
                    setStatus('enabled');
                    console.log('FCM token saved successfully');
                    // Notify other components
                    window.dispatchEvent(new CustomEvent('notificationStatusChanged'));
                } else {
                    // Permission was denied
                    const newStatus = getNotificationStatus();
                    if (newStatus.isDenied) {
                        setStatus('denied');
                    }
                    setIsEnabled(false);
                    // Notify other components
                    window.dispatchEvent(new CustomEvent('notificationStatusChanged'));
                }
            } catch (err) {
                console.error('Error enabling notifications:', err);
                setIsEnabled(false);
            }
        } else {
            // Disable notifications - remove token from backend
            try {
                await axios.delete('/fcm/token');
                console.log('FCM token removed from backend');
            } catch (err) {
                console.error('Error removing token:', err);
            }
            setStatus('disabled');
            setIsEnabled(false);
            // Notify other components
            window.dispatchEvent(new CustomEvent('notificationStatusChanged'));
        }

        setLoading(false);
    };


    // Don't render if unsupported
    if (status === 'unsupported') {
        return null;
    }

    // Compact version for desktop dropdown
    if (compact) {
        return (
            <div className="flex items-center justify-between w-full py-2 px-2">
                <div className="flex items-center gap-2">
                    {isEnabled ? (
                        <Bell className="w-4 h-4 text-green-600" />
                    ) : (
                        <BellOff className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">
                        การแจ้งเตือน
                        {status === 'denied' && (
                            <span className="text-xs text-red-500 ml-1">(blocked)</span>
                        )}
                    </span>
                </div>

                {/* Toggle Switch - Smaller */}
                <button
                    onClick={handleToggle}
                    disabled={loading || status === 'denied'}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isEnabled ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                >
                    <span className="sr-only">Toggle notifications</span>
                    <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                    >
                        {loading && (
                            <Loader2 className="w-3 h-3 animate-spin text-gray-400 m-0.5" />
                        )}
                    </span>
                </button>
            </div>
        );
    }

    // Full version for mobile hamburger menu
    return (
        <div className="flex items-center justify-between w-full py-3 px-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {isEnabled ? (
                        <Bell className="w-5 h-5 text-green-600" />
                    ) : (
                        <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-700 font-medium text-sm">การแจ้งเตือน</span>
                    <span className="text-xs text-gray-500">
                        {status === 'enabled' && 'เปิดอยู่'}
                        {status === 'disabled' && 'ปิดอยู่'}
                        {status === 'denied' && 'ถูกบล็อก (ต้องเปิดใน Settings)'}
                        {status === 'checking' && 'กำลังตรวจสอบ...'}
                    </span>
                </div>
            </div>

            {/* Toggle Switch */}
            <button
                onClick={handleToggle}
                disabled={loading || status === 'denied'}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isEnabled ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
            >
                <span className="sr-only">Toggle notifications</span>
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                >
                    {loading && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 m-0.5" />
                    )}
                </span>
            </button>
        </div>
    );
}
