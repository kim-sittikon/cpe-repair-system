import { useEffect } from 'react';
import Navbar from '@/Components/UI/Navbar';
import BottomNavbar from '@/Components/UI/BottomNavbar';
import InstallPWA from '@/Components/InstallPWA';
import NotificationPermission from '@/Components/NotificationPermission';
import { updateBadge, clearBadge } from '@/services/badging';

export default function Authenticated({ user, header, children }) {
    // Update app badge when component mounts
    useEffect(() => {
        // Update badge count for staff users
        if (user?.job_repair || user?.job_complaint || user?.role === 'admin') {
            updateBadge();
        } else {
            // Clear badge for regular users
            clearBadge();
        }

        // Refresh badge periodically (every 5 minutes)
        const interval = setInterval(() => {
            if (user?.job_repair || user?.job_complaint || user?.role === 'admin') {
                updateBadge();
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar Only (No Sidebar) */}
            <Navbar user={user} />

            {/* Page Heading */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">{header}</h2>
                    </div>
                </header>
            )}

            {/* Page Content (Push down for fixed navbar, add bottom padding for mobile nav) */}
            <main className="flex-1 pt-16 lg:pt-20 pb-20 lg:pb-0 bg-gray-50">
                {children}
            </main>

            {/* Footer (Global) - Always at bottom, hidden on mobile when bottom nav is visible */}
            <footer className="hidden lg:block bg-[#4a4a4a] text-white py-4 text-center text-sm font-light tracking-wide">
                © 2025 Department of Computer Engineering, RMUTT. All rights reserved
            </footer>

            {/* Bottom Navigation for Mobile */}
            <BottomNavbar />

            {/* PWA Install Prompt */}
            <InstallPWA />

            {/* Push Notification Permission Prompt */}
            <NotificationPermission />
        </div>
    );
}
