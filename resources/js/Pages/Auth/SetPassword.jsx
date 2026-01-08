import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function SetPassword({ invitation }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
        email: invitation.email,
        token: invitation.token,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('invite.accept'));
    };

    // แปลง role เป็นภาษาไทย
    const roleTranslations = {
        admin: 'ผู้ดูแลระบบ',
        staff: 'เจ้าหน้าที่',
        teacher: 'อาจารย์',
        student: 'นักศึกษา',
    };

    return (
        <GuestLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-2 text-center text-orange-600">
                        ตั้งค่าบัญชีผู้ใช้
                    </h2>
                    <p className="text-gray-600 mb-6 text-center text-sm">
                        ยินดีต้อนรับสู่ระบบ CPE Repair System
                    </p>

                    {/* แสดงข้อมูล Account */}
                    <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200">
                        <p className="text-sm text-gray-700 mb-1">
                            <strong>อีเมล์:</strong> {invitation.email}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>บทบาท:</strong> {roleTranslations[invitation.role] || invitation.role}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อจริง <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                นามสกุล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                รหัสผ่าน (อย่างน้อย 8 ตัวอักษร) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors mt-6"
                        >
                            {processing ? 'กำลังบันทึก...' : 'บันทึกและเข้าใช้งาน'}
                        </button>
                    </form>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        หลังจากบันทึก คุณจะเข้าสู่ระบบโดยอัตโนมัติ
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
