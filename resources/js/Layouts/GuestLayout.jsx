import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-white">
            {/* Left Side - Image (Hidden on Mobile) */}
            <div className="hidden w-1/2 lg:block relative">
                <img
                    src="/images/login-bg.jpg"
                    alt="University Building"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-yellow-500/20 mix-blend-multiply"></div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
                <div className="mx-auto w-full max-w-md">
                    {/* Slot for the login form */}
                    {children}
                </div>
            </div>
        </div>
    );
}
