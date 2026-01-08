import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Keywords({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="กำหนดคีย์เวิร์ด (Keywords)"
        >
            <Head title="Complaint Keywords" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-l-4 border-orange-500">
                            <h3 className="text-lg font-bold mb-2">หน้ากำหนดคีย์เวิร์ด</h3>
                            <p className="text-gray-600">
                                หน้านี้จะใช้สำหรับเพิ่ม/ลบ/แก้ไข คีย์เวิร์ดสำหรับระบบอัตโนมัติ
                                (อยู่ระหว่างการพัฒนาตามแผนงาน)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
