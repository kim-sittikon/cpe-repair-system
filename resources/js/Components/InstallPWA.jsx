import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Zap, Bell, Wifi, Share, Plus } from 'lucide-react';

export default function InstallPWA({ showInSettings = false }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [showDesktopInstructions, setShowDesktopInstructions] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isInStandaloneMode = window.navigator.standalone === true;
        setIsIOS(isIOSDevice && !isInStandaloneMode);

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
            // Track install event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_installed', {
                    event_category: 'PWA',
                    event_label: 'Install'
                });
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // For iOS: Show prompt after 30 seconds
        if (isIOSDevice && !isInStandaloneMode && !dismissed && !showInSettings) {
            setTimeout(() => setShowPrompt(true), 30000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [dismissed, showInSettings]);

    const handleInstall = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

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
        setShowIOSInstructions(false);
        setDismissed(true);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    // Benefits list
    const benefits = [
        { icon: Zap, text: 'เปิดเร็วทันใจ', color: 'text-yellow-500' },
        { icon: Wifi, text: 'ใช้งานออฟไลน์ได้', color: 'text-blue-500' },
        { icon: Bell, text: 'แจ้งเตือนทันที', color: 'text-red-500' },
    ];

    // Desktop Instructions Modal - MUST be before showInSettings return!
    if (showDesktopInstructions) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowDesktopInstructions(false)}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white text-center">
                        <button
                            onClick={() => setShowDesktopInstructions(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="ปิด"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <img
                                src="/icons/android/android-launchericon-96-96.png"
                                alt="CPE Repair"
                                className="w-12 h-12 rounded-xl"
                            />
                        </div>
                        <h2 className="text-xl font-bold">ติดตั้งบน Desktop</h2>
                        <p className="text-blue-100 text-sm mt-1">Chrome / Edge / Brave</p>
                    </div>

                    {/* Steps */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">ดูที่ Address Bar</p>
                                <p className="text-sm text-gray-500">มองหาไอคอน ⊕ หรือ 📥 ด้านขวา</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">กดไอคอนติดตั้ง</p>
                                <p className="text-sm text-gray-500">หรือกด ⋮ เมนู → "Install app"</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                3
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">กด "Install"</p>
                                <p className="text-sm text-gray-500">แอปจะปรากฏบน Desktop</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={() => setShowDesktopInstructions(false)}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // iOS Instructions Modal - MUST be before showInSettings return!
    if (showIOSInstructions) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowIOSInstructions(false)}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white text-center">
                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="ปิด"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <img
                                src="/icons/android/android-launchericon-96-96.png"
                                alt="CPE Repair"
                                className="w-12 h-12 rounded-xl"
                            />
                        </div>
                        <h2 className="text-xl font-bold">ติดตั้งบน iPhone</h2>
                        <p className="text-orange-100 text-sm mt-1">ทำตาม 3 ขั้นตอนง่ายๆ</p>
                    </div>

                    {/* Steps */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">กดปุ่ม Share</p>
                                <p className="text-sm text-gray-500">ที่ด้านล่างของ Safari</p>
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                    <Share className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-600">Share</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">เลือก "Add to Home Screen"</p>
                                <p className="text-sm text-gray-500">เลื่อนหาในเมนู</p>
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                    <Plus className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-600">Add to Home Screen</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                3
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">กด "Add"</p>
                                <p className="text-sm text-gray-500">แอปจะปรากฏบนหน้า Home</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

        // If deferredPrompt is available, show install button
        if (deferredPrompt) {
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

        // iOS - show instructions button
        if (isIOS) {
            return (
                <button
                    onClick={() => setShowIOSInstructions(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-200"
                >
                    <Download className="w-5 h-5" />
                    <span>ติดตั้งแอปพลิเคชัน</span>
                </button>
            );
        }

        // Desktop - show clickable button with instructions (compact style)
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowDesktopInstructions(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-all text-sm"
            >
                <Download className="w-4 h-4" />
                <span>ติดตั้งแอป</span>
            </button>
        );
    }

    // Don't show auto popup modal if installed, no prompt available (and not iOS), or dismissed
    if (!showPrompt || isInstalled || (!deferredPrompt && !isIOS)) return null;

    // Rich Install UI - Medium Level Modal (auto popup after 30 seconds)
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleDismiss}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                    aria-label="ปิด"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 p-8 text-white text-center">
                    {/* App Icon with glow effect */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl scale-110" />
                        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform">
                            <img
                                src="/icons/android/android-launchericon-96-96.png"
                                alt="CPE Repair"
                                className="w-16 h-16"
                            />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">CPE Repair</h2>
                    <p className="text-orange-100">ระบบแจ้งปัญหา CPE</p>
                </div>

                {/* Benefits */}
                <div className="p-6">
                    <p className="text-gray-600 text-center mb-5">
                        ติดตั้งแอปเพื่อประสบการณ์ที่ดีกว่า
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${benefit.color === 'text-yellow-500' ? 'bg-yellow-100' :
                                    benefit.color === 'text-blue-500' ? 'bg-blue-100' : 'bg-red-100'
                                    }`}>
                                    <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                                </div>
                                <span className="text-xs text-gray-600 text-center font-medium">
                                    {benefit.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleInstall}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-[0.98]"
                        >
                            <Download className="w-5 h-5" />
                            <span>🚀 ติดตั้งเลย</span>
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                        >
                            ไว้ทีหลัง
                        </button>
                    </div>
                </div>

                {/* Footer hint */}
                <div className="px-6 pb-6 pt-0">
                    <p className="text-xs text-gray-400 text-center">
                        ติดตั้งฟรี • ไม่เปลืองพื้นที่ • ลบได้ทุกเมื่อ
                    </p>
                </div>
            </div>
        </div>
    );
}
