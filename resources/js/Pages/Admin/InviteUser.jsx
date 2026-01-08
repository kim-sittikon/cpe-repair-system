import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Mail, User, Shield, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

export default function InviteUser({ recentInvites = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role: 'staff',
        job_repair: true,
        job_admin: false,
        job_complaint: true,
    });

    // Seperate form for bulk upload
    const bulkForm = useForm({
        file: null,
    });

    // 🧠 Smart Logic: เปลี่ยนสิทธิ์ตาม Role อัตโนมัติ
    useEffect(() => {
        if (data.role === 'staff') {
            // Staff: ต้องเป็นช่างซ่อม, ไม่ใช่แอดมิน
            setData(prev => ({ ...prev, job_repair: true, job_admin: false, job_complaint: true }));
        } else if (data.role === 'teacher') {
            // Teacher: ให้เลือกเอง แต่ default ไม่ใช่แอดมิน
            setData(prev => ({ ...prev, job_admin: false, job_repair: false, job_complaint: true }));
        }
    }, [data.role]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.invite.send'), {
            onSuccess: () => reset('email'),
        });
    };

    const submitBulk = (e) => {
        e.preventDefault();
        bulkForm.post(route('admin.users.bulk'), {
            onSuccess: () => {
                bulkForm.reset();
                document.getElementById('bulk_invite_modal').close();
            },
        });
    };

    const [actionModal, setActionModal] = useState(null); // { type: 'resend' | 'cancel', user: userObject }

    const confirmAction = () => {
        if (!actionModal) return;

        const { type, user } = actionModal;

        if (type === 'resend') {
            router.post(route('admin.users.resend', user.account_id), {}, {
                onFinish: () => setActionModal(null)
            });
        } else if (type === 'cancel') {
            router.delete(route('admin.users.cancel', user.account_id), {
                onFinish: () => setActionModal(null)
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-8">

                <div className="text-center mb-8 relative">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">เชิญผู้ใช้งานใหม่</h1>
                    <p className="mt-2 text-gray-500 text-lg">ส่งคำเชิญเข้าร่วมระบบผ่านทางอีเมล</p>

                    <button
                        onClick={() => document.getElementById('bulk_invite_modal').showModal()}
                        className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        นำเข้า (Excel/CSV)
                    </button>
                </div>

                {/* Bulk Invite Modal */}
                <dialog id="bulk_invite_modal" className="modal p-0 rounded-xl shadow-2xl backdrop:bg-gray-900/50">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-900">นำเข้าผู้ใช้งานแบบกลุ่ม (Bulk Invite)</h3>
                            <button onClick={() => document.getElementById('bulk_invite_modal').close()} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={submitBulk}>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="font-semibold text-blue-900 text-sm mb-2">คำแนะนำไฟล์ CSV</h4>
                                    <p className="text-sm text-blue-700 mb-2">เตรียมไฟล์ .csv หรือ .txt โดยมีรูปแบบดังนี้:</p>
                                    <code className="block bg-white p-2 rounded border border-blue-200 text-xs text-gray-600">
                                        email,role<br />
                                        user1@example.com,student<br />
                                        user2@example.com,staff
                                    </code>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">เลือกไฟล์ CSV</label>
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={e => bulkForm.setData('file', e.target.files[0])}
                                        required
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-orange-50 file:text-orange-700
                                            hover:file:bg-orange-100"
                                    />
                                    {bulkForm.errors.file && <p className="text-red-500 text-xs mt-1">{bulkForm.errors.file}</p>}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={bulkForm.processing}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {bulkForm.processing ? 'กำลังอัปโหลด...' : 'เริ่มนำเข้าข้อมูล'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </dialog>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Invite Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-orange-500 p-4">
                                <h2 className="text-white font-semibold flex items-center gap-2">
                                    <Mail className="w-5 h-5" /> ฟอร์มส่งคำเชิญ
                                </h2>
                            </div>

                            <form onSubmit={submit} className="p-8 space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        อีเมลผู้ใช้งาน <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            placeholder="user@rmutt.ac.th"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        บทบาทหน้าที่ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
                                        >
                                            <option value="staff">เจ้าหน้าที่ (Staff)</option>
                                            <option value="teacher">อาจารย์ (Teacher)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Permissions Card */}
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-orange-500" /> กำหนดสิทธิ์การเข้าถึง
                                    </h3>

                                    <div className="space-y-3">
                                        {/* กลุ่มงานแจ้งปัญหา (แสดงเฉพาะ Teacher) */}
                                        {data.role === 'teacher' && (
                                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group">
                                                <div className="flex h-5 items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.job_complaint}
                                                        onChange={e => setData('job_complaint', e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 group-hover:ring-2"
                                                    />
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-medium text-gray-900">กลุ่มงานแจ้งปัญหา</span>
                                                    <p className="text-gray-500 text-xs">สำหรับการดูแลเรื่องการเรียนการสอน</p>
                                                </div>
                                            </label>
                                        )}

                                        {/* กลุ่มงานแจ้งซ่อม */}
                                        <label className={`flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group ${data.role === 'staff' ? 'bg-orange-50 border-orange-200' : ''}`}>
                                            <div className="flex h-5 items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.job_repair}
                                                    disabled={data.role === 'staff'}
                                                    onChange={e => setData('job_repair', e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">
                                                    กลุ่มงานแจ้งซ่อม
                                                    {data.role === 'staff' && <span className="ml-2 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Required</span>}
                                                </span>
                                                <p className="text-gray-500 text-xs">สำหรับเจ้าหน้าที่ช่างและผู้ดูแลงานซ่อม</p>
                                            </div>
                                        </label>

                                        {/* กลุ่มแอดมิน (แสดงเฉพาะ Teacher) */}
                                        {data.role === 'teacher' && (
                                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer group">
                                                <div className="flex h-5 items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.job_admin}
                                                        onChange={e => setData('job_admin', e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 group-hover:ring-2"
                                                    />
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-medium text-gray-900">ผู้ดูแลระบบ (Admin)</span>
                                                    <p className="text-gray-500 text-xs">สิทธิ์สูงสุดในการจัดการระบบ (หากได้รับมอบหมาย)</p>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-bold text-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            กำลังส่งข้อมูล...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" /> ส่งคำเชิญทันที
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Recent History & Tips */}
                    <div className="space-y-6">

                        {/* Recent Invites Panel */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" /> ประวัติล่าสุด
                                </h3>
                                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{recentInvites.length}</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentInvites.length > 0 ? (
                                    recentInvites.map((invite) => (
                                        <div key={invite.account_id} className="p-4 hover:bg-gray-50 transition-colors group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-gray-900 text-sm truncate w-2/3" title={invite.email}>
                                                    {invite.email}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${invite.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {invite.status}
                                                    </span>

                                                    {/* Actions for Pending Users */}
                                                    {invite.status === 'pending' && (
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => setActionModal({ type: 'resend', user: invite })}
                                                                title="ส่งคำเชิญใหม่อีกครั้ง"
                                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => setActionModal({ type: 'cancel', user: invite })}
                                                                title="ยกเลิกคำเชิญ"
                                                                className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{invite.role}</span>
                                                <span>{new Date(invite.invitation_sent_at).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        ยังไม่มีประวัติการเชิญ
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> ข้อแนะนำ
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                                <li>ลิงก์คำเชิญมีอายุใช้งาน <strong>24 ชั่วโมง</strong></li>
                                <li><strong>Staff</strong> จะได้รับสิทธิ์งานซ่อมโดยอัตโนมัติ</li>
                                <li><strong>Teacher</strong> สามารถเลือกรับงานแอดมินหรือแจ้งซ่อมได้ตามความเหมาะสม</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {actionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in-up">
                        <div className={`p-6 text-center border-b-4 ${actionModal.type === 'resend' ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'}`}>
                            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 shadow-lg ${actionModal.type === 'resend' ? 'bg-blue-500' : 'bg-red-500'}`}>
                                {actionModal.type === 'resend' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {actionModal.type === 'resend' ? 'ส่งคำเชิญอีกครั้ง?' : 'ยกเลิกคำเชิญ?'}
                            </h3>
                            <p className="text-gray-600 mt-2 text-sm">
                                {actionModal.type === 'resend'
                                    ? <span>ต้องการส่งอีเมลเชิญไปยัง<br /><span className="font-bold text-blue-600">{actionModal.user.email}</span> อีกครั้งหรือไม่?</span>
                                    : <span>ต้องการยกเลิกและลบคำเชิญของ<br /><span className="font-bold text-red-600">{actionModal.user.email}</span> หรือไม่?</span>
                                }
                            </p>
                        </div>
                        <div className="p-4 bg-white flex gap-3">
                            <button
                                onClick={confirmAction}
                                className={`flex-1 px-4 py-2 text-white font-bold rounded-xl shadow-md transition-transform transform hover:scale-[1.02] active:scale-95 ${actionModal.type === 'resend' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                ยืนยัน
                            </button>
                            <button
                                onClick={() => setActionModal(null)}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl shadow-md transition-transform transform hover:scale-[1.02] active:scale-95"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
