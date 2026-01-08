import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';

export default function InvitationExpired({ email }) {
    return (
        <GuestLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <div className="mb-6">
                        <svg
                            className="w-16 h-16 text-red-500 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        ลิงก์คำเชิญหมดอายุแล้ว
                    </h2>

                    <p className="text-gray-600 mb-6">
                        คำเชิญสำหรับ <strong>{email}</strong> หมดอายุแล้ว (เกิน 24 ชั่วโมง)
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            กรุณาติดต่อผู้ดูแลระบบเพื่อขอส่งคำเชิญใหม่
                        </p>
                    </div>

                    <Link
                        href={route('login')}
                        className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        กลับไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
