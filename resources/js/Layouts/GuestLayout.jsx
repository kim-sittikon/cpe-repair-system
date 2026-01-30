import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <>
            {/* Desktop View */}
            <div className="hidden lg:flex h-screen overflow-hidden bg-white">
                {/* Left Side - Image */}
                <div className="w-1/2 relative">
                    <img
                        src="/images/login-bg.jpg"
                        alt="University Building"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/10 to-transparent mix-blend-multiply"></div>
                </div>

                {/* Right Side - Content */}
                <div className="flex w-1/2 flex-col justify-center px-16 xl:px-24">
                    <div className="mx-auto w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet View - Blurred Background */}
            <div className="lg:hidden relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
                {/* Blurred Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/login-bg.jpg"
                        alt="Background"
                        className="w-full h-full object-cover filter blur-[8px] scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Centered Form Card */}
                <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mx-4 my-8 p-6 sm:p-8">
                    {children}
                </div>
            </div>
        </>
    );
}
