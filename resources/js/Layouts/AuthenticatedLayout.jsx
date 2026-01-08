import Navbar from '@/Components/UI/Navbar';

export default function Authenticated({ user, header, children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
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

            {/* Page Content (Push down for fixed navbar) */}
            <main className="flex-1 pt-16 lg:pt-20">
                {children}
            </main>

            {/* Footer (Global) */}
            <div className="bg-[#4a4a4a] text-white py-4 text-center text-sm font-light tracking-wide mt-auto">
                © 2025 Department of Computer Engineering, RMUTT. All rights reserved
            </div>
        </div>
    );
}
