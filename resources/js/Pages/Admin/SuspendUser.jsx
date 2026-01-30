import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Shield, Clock, AlertTriangle, Calendar, ArrowLeft, CheckCircle, XCircle, Mail } from 'lucide-react';

export default function SuspendUser({ user }) {
    const [activeSection, setActiveSection] = useState('temporary');
    const [confirmPermanent, setConfirmPermanent] = useState(false);

    const temporaryForm = useForm({
        type: 'temporary',
        reason: '',
        suspension_start: '',
        suspension_end: '',
    });

    const permanentForm = useForm({
        type: 'permanent',
        reason: '',
    });

    const handleTemporarySubmit = (e) => {
        e.preventDefault();
        temporaryForm.post(route('admin.users.suspend.store', user.account_id));
    };

    const handlePermanentSubmit = (e) => {
        e.preventDefault();
        if (!confirmPermanent) {
            alert('กรุณายืนยันการปิดใช้งานบัญชีถาวร');
            return;
        }
        permanentForm.post(route('admin.users.suspend.store', user.account_id));
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'staff': return 'bg-blue-100 text-blue-700';
            case 'teacher': return 'bg-green-100 text-green-700';
            case 'student': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const isSuspended = user.suspended_at !== null;

    return (
        <AuthenticatedLayout>
            <Head title={`ระงับบัญชี - ${user.first_name} ${user.last_name}`} />

            <div className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href={route('admin.users.index')} className="hover:text-orange-500">จัดการผู้ใช้งาน</Link>
                        <span>/</span>
                        <span className="text-gray-800 font-medium">ระงับการใช้งานบัญชี</span>
                    </nav>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <Link
                            href={route('admin.users.index')}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                        >
                            จัดการบัญชีผู้ใช้งาน
                        </Link>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-500">
                            ระงับการใช้งานบัญชี
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Shield className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-800">ระงับการใช้งานบัญชี</h1>
                                        <p className="text-sm text-gray-500">ระงับแบบชั่วคราว หรือ ระงับถาวร</p>
                                    </div>
                                </div>
                            </div>

                            {/* Already Suspended Warning */}
                            {isSuspended && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-yellow-800 font-medium">บัญชีนี้ถูกระงับอยู่แล้ว</p>
                                        <p className="text-yellow-700 text-sm mt-1">
                                            ประเภท: {user.suspension_type === 'permanent' ? 'ถาวร' : 'ชั่วคราว'}
                                            {user.suspension_end && ` (ถึง ${new Date(user.suspension_end).toLocaleDateString('th-TH')})`}
                                        </p>
                                        <button
                                            onClick={() => router.post(route('admin.users.unsuspend', user.account_id))}
                                            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                                        >
                                            ยกเลิกการระงับ
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Section 1: Temporary Suspension */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</div>
                                    <h2 className="font-bold text-gray-800">ระงับชั่วคราว (Temporary suspension)</h2>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">กำหนดช่วงเวลา ระบุเหตุผล และกำหนดพฤติกรรมเมื่อครบกำหนด</p>

                                <form onSubmit={handleTemporarySubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">เริ่มระงับ (วันที่/เวลา)</label>
                                            <input
                                                type="datetime-local"
                                                value={temporaryForm.data.suspension_start}
                                                onChange={(e) => temporaryForm.setData('suspension_start', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                                disabled={isSuspended}
                                            />
                                            {temporaryForm.errors.suspension_start && (
                                                <p className="text-red-500 text-xs mt-1">{temporaryForm.errors.suspension_start}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">สิ้นสุดระงับ (วันที่/เวลา)</label>
                                            <input
                                                type="datetime-local"
                                                value={temporaryForm.data.suspension_end}
                                                onChange={(e) => temporaryForm.setData('suspension_end', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                                disabled={isSuspended}
                                            />
                                            {temporaryForm.errors.suspension_end && (
                                                <p className="text-red-500 text-xs mt-1">{temporaryForm.errors.suspension_end}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผล</label>
                                        <textarea
                                            placeholder="กรอกเหตุผล"
                                            rows={3}
                                            value={temporaryForm.data.reason}
                                            onChange={(e) => temporaryForm.setData('reason', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                            disabled={isSuspended}
                                        />
                                        {temporaryForm.errors.reason && (
                                            <p className="text-red-500 text-xs mt-1">{temporaryForm.errors.reason}</p>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-400">ระหว่างช่วงระงับ ผู้ใช้จะไม่สามารถเข้าสู่ระบบ และจะมีแจ้งเตือนอัตโนมัติ</p>

                                    <button
                                        type="submit"
                                        disabled={temporaryForm.processing || isSuspended}
                                        className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {temporaryForm.processing ? 'กำลังดำเนินการ...' : 'ยืนยันระงับชั่วคราว'}
                                    </button>
                                </form>
                            </div>

                            {/* Section 2: Permanent Suspension */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">2</div>
                                    <h2 className="font-bold text-gray-800">ระงับถาวร / ปิดใช้งานบัญชี (Permanent suspension)</h2>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">ปิดการใช้งานบัญชี โดยไม่ลบข้อมูลตามนโยบายการเก็บรักษา</p>

                                <form onSubmit={handlePermanentSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผล</label>
                                        <textarea
                                            placeholder="กรอกเหตุผล"
                                            rows={4}
                                            value={permanentForm.data.reason}
                                            onChange={(e) => permanentForm.setData('reason', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                            disabled={isSuspended && user.suspension_type === 'permanent'}
                                        />
                                        {permanentForm.errors.reason && (
                                            <p className="text-red-500 text-xs mt-1">{permanentForm.errors.reason}</p>
                                        )}
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={confirmPermanent}
                                            onChange={(e) => setConfirmPermanent(e.target.checked)}
                                            className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                            disabled={isSuspended && user.suspension_type === 'permanent'}
                                        />
                                        <span className="text-sm text-gray-600">
                                            ยืนยันว่าตรวจสอบแล้วและยอมรับผลกระทบของการปิดใช้งานบัญชีนี้
                                        </span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={permanentForm.processing || !confirmPermanent || (isSuspended && user.suspension_type === 'permanent')}
                                        className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {permanentForm.processing ? 'กำลังดำเนินการ...' : 'ปิดใช้งานบัญชี'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Column - User Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                                        {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{user.first_name} {user.last_name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">สถานะ</span>
                                        {isSuspended ? (
                                            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                <XCircle className="w-3 h-3" /> ถูกระงับ
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> ใช้งานอยู่
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">บทบาท (Role)</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">อัปเดตล่าสุด</span>
                                        <span className="text-sm text-gray-800">
                                            {user.updated_at ? new Date(user.updated_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">สิทธิ์การใช้งาน</span>
                                        <span className="text-sm text-gray-800">
                                            {[
                                                user.job_repair && 'ซ่อม',
                                                user.job_complaint && 'ร้องเรียน',
                                                user.job_admin && 'แอดมิน'
                                            ].filter(Boolean).join(', ') || '-'}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={route('admin.users.index')}
                                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    กลับหน้าจัดการผู้ใช้
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
