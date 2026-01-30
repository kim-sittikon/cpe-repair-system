import Navbar from '@/Components/UI/Navbar';
import BottomNavbar from '@/Components/UI/BottomNavbar';

export default function Authenticated({ user, header, children }) {
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
        </div>
    );
}
