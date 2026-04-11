import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, Loader2, AlertCircle, Settings } from 'lucide-react';
import { requestNotificationPermission, getNotificationStatus, isFirebaseConfigured } from '@/firebase';
import axios from 'axios';

/**
 * NotificationPermission Component
 * 
 * Handles requesting and managing push notification permissions
 * Can be used as a floating prompt or settings button
 * 
 * @param {boolean} showInSettings - If true, renders as a settings-style button
 * @param {boolean} compact - If true, renders a compact version
 */
export default function NotificationPermission({ showInSettings = false, compact = false }) {
    const [status, setStatus] = useState('loading'); // loading, granted, denied, default, unsupported, not-configured
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
            setStatus('not-configured');
            return;
        }

        const notifStatus = getNotificationStatus();

        if (!notifStatus.supported) {
            setStatus('unsupported');
            return;
        }

        setStatus(notifStatus.permission);
    };

    const handleEnable = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = await requestNotificationPermission();

            if (token) {
                // Send token to backend
                await axios.post('/fcm/token', { token });
                setStatus('granted');
                // Notify other components (like NotificationToggle)
                window.dispatchEvent(new CustomEvent('notificationStatusChanged'));
            } else {
                // Permission was denied or failed
                const newStatus = getNotificationStatus();
                setStatus(newStatus.permission);
                // Notify other components
                window.dispatchEvent(new CustomEvent('notificationStatusChanged'));

                if (newStatus.isDenied) {
                    setError('กรุณาเปิด permission ใน browser settings');
                }
            }
        } catch (err) {
            console.error('Error enabling notifications:', err);
            setError('เกิดข้อผัดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    const handleTest = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/fcm/test');
            if (response.data.success) {
                // Show a local notification as feedback
                if ('Notification' in window && Notification.permission === 'granted') {
                    // The push notification should arrive from server
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'ไม่สามารถส่งทดสอบได้');
        } finally {
            setLoading(false);
        }
    };

    // Not configured - don't render
    if (status === 'not-configured' && !showInSettings) {
        return null;
    }

    // Unsupported browser
    if (status === 'unsupported') {
        if (!showInSettings) return null;

        return (
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg text-gray-500">
                <BellOff className="w-5 h-5" />
                <span className="text-sm">เบราว์เซอร์ไม่รองรับการแจ้งเตือน</span>
            </div>
        );
    }

    // Already granted - show success state in settings
    if (status === 'granted' && showInSettings) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <span className="text-green-700 font-medium">เปิดการแจ้งเตือนแล้ว</span>
                            <p className="text-green-600 text-sm">คุณจะได้รับแจ้งเตือนเมื่อมีอัพเดท</p>
                        </div>
                    </div>
                    <button
                        onClick={handleTest}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ทดสอบ'}
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </p>
                )}
            </div>
        );
    }

    // Already granted - hide floating prompt
    if (status === 'granted' && !showInSettings) {
        return null;
    }

    // Denied - show info in settings only
    if (status === 'denied') {
        if (!showInSettings) return null;

        return (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <BellOff className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                    <span className="text-red-700 font-medium">การแจ้งเตือนถูกปิด</span>
                    <p className="text-red-600 text-sm">
                        กรุณาเปิด permission ใน browser settings แล้วรีเฟรชหน้า
                    </p>
                </div>
                <Settings className="w-5 h-5 text-red-400" />
            </div>
        );
    }

    // Not configured - show message in settings
    if (status === 'not-configured' && showInSettings) {
        return (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                    <span className="text-gray-700 font-medium">ยังไม่ได้ตั้งค่า</span>
                    <p className="text-gray-500 text-sm">ระบบแจ้งเตือนยังไม่พร้อมใช้งาน</p>
                </div>
            </div>
        );
    }

    // Loading state
    if (status === 'loading') {
        return showInSettings ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                <span className="text-gray-500">กำลังตรวจสอบ...</span>
            </div>
        ) : null;
    }

    // Default state (not asked yet) - Show enable button

    // Settings version
    if (showInSettings) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Bell className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <span className="text-orange-700 font-medium">เปิดการแจ้งเตือน</span>
                            <p className="text-orange-600 text-sm">รับการแจ้งเตือนเมื่อมีอัพเดทงาน</p>
                        </div>
                    </div>
                    <button
                        onClick={handleEnable}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Bell className="w-4 h-4" />
                                เปิด
                            </>
                        )}
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </p>
                )}
            </div>
        );
    }

    // Compact floating version
    if (compact) {
        return (
            <button
                onClick={handleEnable}
                disabled={loading}
                className="fixed bottom-24 right-4 z-50 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 disabled:opacity-50 animate-bounce"
                title="เปิดการแจ้งเตือน"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Bell className="w-6 h-6" />
                )}
            </button>
        );
    }

    // Full floating prompt version
    return (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-slide-up">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">เปิดการแจ้งเตือน</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        รับการแจ้งเตือนเมื่อมีอัพเดทสถานะงานของคุณ
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleEnable}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Bell className="w-5 h-5" />
                            เปิด
                        </>
                    )}
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {error}
                </p>
            )}
        </div>
    );
}
