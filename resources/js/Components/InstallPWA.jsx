import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

export default function InstallPWA({ showInSettings = false }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if dismissed recently (24 hours)
        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedAt) {
            const hoursAgo = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
            if (hoursAgo < 24) {
                setDismissed(true);
            }
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after 30 seconds if not dismissed
            if (!dismissed && !showInSettings) {
                setTimeout(() => setShowPrompt(true), 30000);
            }
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [dismissed, showInSettings]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setDismissed(true);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    // Settings button style
    if (showInSettings) {
        if (isInstalled) {
            return (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">ติดตั้งแอปแล้ว</span>
                </div>
            );
        }

        if (!deferredPrompt) {
            return (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-500 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                    <span>ไม่รองรับการติดตั้งบนอุปกรณ์นี้</span>
                </div>
            );
        }

        return (
            <button
                onClick={handleInstall}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-200"
            >
                <Download className="w-5 h-5" />
                <span>ติดตั้งแอปพลิเคชัน</span>
            </button>
        );
    }

    // Floating prompt style
    if (!showPrompt || isInstalled || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">ติดตั้งแอป</h3>
                                <p className="text-sm text-orange-100">เพิ่มไปที่หน้าจอหลัก</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                        ติดตั้ง CPE Repair เพื่อเข้าถึงได้รวดเร็วและใช้งานได้แม้ไม่มีอินเทอร์เน็ต
                    </p>

                    {/* Features */}
                    <div className="flex gap-4 mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>เปิดเร็ว</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>ใช้ออฟไลน์</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>แจ้งเตือน</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            ไว้ทีหลัง
                        </button>
                        <button
                            onClick={handleInstall}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            ติดตั้ง
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
