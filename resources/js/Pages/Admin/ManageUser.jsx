import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/UI/InputError';
import { Shield, AlertTriangle, ArrowLeft, CheckCircle, XCircle, Mail, ChevronDown, Wrench, MessageSquare, Settings, X } from 'lucide-react';

export default function ManageUser({ user, activeTab: initialTab = 'edit' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [confirmPermanent, setConfirmPermanent] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Edit Form
    const editForm = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'student',
        job_repair: user.job_repair || false,
        job_admin: user.job_admin || false,
        job_complaint: user.job_complaint || false,
    });

    // Suspension Forms
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

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const confirmEdit = () => {
        setShowConfirmModal(false);
        editForm.patch(route('admin.users.update', user.account_id));
    };

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

    // Reordered: นักเรียน → เจ้าหน้าที่ → อาจารย์
    const roleOptions = [
        { value: 'student', label: 'นักเรียน' },
        { value: 'staff', label: 'เจ้าหน้าที่' },
        { value: 'teacher', label: 'อาจารย์' },
    ];

    const getRoleLabel = (value) => {
        if (value === 'admin') return 'ผู้ดูแลระบบ';
        return roleOptions.find(r => r.value === value)?.label || value;
    };

    // Show permissions based on role
    const showPermissions = editForm.data.role === 'teacher' || editForm.data.role === 'staff';
    const isStaff = editForm.data.role === 'staff';
    const isTeacher = editForm.data.role === 'teacher';

    const isSuspended = user.suspended_at !== null;

    return (
        <AuthenticatedLayout>
            <Head title={`จัดการบัญชี - ${user.first_name} ${user.last_name}`} />

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการแก้ไขข้อมูล</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลของ<br />
                                <span className="font-medium text-gray-900">{editForm.data.first_name} {editForm.data.last_name}</span> ใช่หรือไม่?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={confirmEdit}
                                    disabled={editForm.processing}
                                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                                >
                                    {editForm.processing ? 'กำลังบันทึก...' : 'ยืนยัน'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-8 sm:py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'edit'
                                    ? 'text-white bg-orange-500 shadow-lg shadow-orange-200'
                                    : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            จัดการบัญชีผู้ใช้งาน
                        </button>
                        <button
                            onClick={() => setActiveTab('suspend')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'suspend'
                                    ? 'text-white bg-orange-500 shadow-lg shadow-orange-200'
                                    : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            ระงับการใช้งานบัญชี
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-3">
                            {/* Edit Tab Content */}
                            {activeTab === 'edit' && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                    {/* Header with email on mobile */}
                                    <div className="mb-8">
                                        <h1 className="text-xl font-bold text-gray-900">จัดการบัญชีผู้ใช้งาน</h1>
                                        <p className="text-sm text-gray-500 mt-1">เปลี่ยนชื่อ-นามสกุล บทบาท และกำหนดสิทธิ์การใช้งาน</p>
                                        {/* Show email on mobile */}
                                        <div className="lg:hidden mt-3 flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleEditSubmit} className="space-y-6">
                                        {/* Name Fields - Always side by side */}
                                        <div className="flex gap-3 sm:gap-6">
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                                                <input
                                                    type="text"
                                                    value={editForm.data.first_name}
                                                    onChange={(e) => editForm.setData('first_name', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm sm:text-base"
                                                    placeholder="ชื่อ"
                                                    required
                                                />
                                                <InputError className="mt-2" message={editForm.errors.first_name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล</label>
                                                <input
                                                    type="text"
                                                    value={editForm.data.last_name}
                                                    onChange={(e) => editForm.setData('last_name', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm sm:text-base"
                                                    placeholder="นามสกุล"
                                                    required
                                                />
                                                <InputError className="mt-2" message={editForm.errors.last_name} />
                                            </div>
                                        </div>

                                        {/* Role Dropdown */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">บทบาท (Role)</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                                    className="w-full sm:w-64 px-4 py-3 bg-gray-50 border-0 rounded-xl text-left text-gray-900 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all flex items-center justify-between"
                                                >
                                                    <span>{getRoleLabel(editForm.data.role)}</span>
                                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {roleDropdownOpen && (
                                                    <div className="absolute z-10 mt-2 w-full sm:w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                                        {roleOptions.map((role) => (
                                                            <button
                                                                key={role.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    editForm.setData('role', role.value);
                                                                    setRoleDropdownOpen(false);
                                                                    // Reset permissions when switching roles
                                                                    if (role.value === 'student') {
                                                                        editForm.setData(prev => ({
                                                                            ...prev,
                                                                            role: 'student',
                                                                            job_repair: false,
                                                                            job_complaint: false,
                                                                            job_admin: false
                                                                        }));
                                                                    } else if (role.value === 'staff') {
                                                                        // Staff only gets job_repair
                                                                        editForm.setData(prev => ({
                                                                            ...prev,
                                                                            role: 'staff',
                                                                            job_complaint: false,
                                                                            job_admin: false
                                                                        }));
                                                                    }
                                                                }}
                                                                className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${editForm.data.role === role.value
                                                                        ? 'bg-orange-50 text-orange-600 font-medium'
                                                                        : 'text-gray-700'
                                                                    }`}
                                                            >
                                                                {role.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <InputError className="mt-2" message={editForm.errors.role} />
                                        </div>

                                        {/* Permissions - Different based on role */}
                                        {showPermissions && (
                                            <div className="pt-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">สิทธิ์การใช้งาน</label>
                                                <div className="space-y-3">
                                                    {/* กลุ่มงานแจ้งซ่อม - Show for both staff and teacher */}
                                                    <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={editForm.data.job_repair}
                                                            onChange={(e) => editForm.setData('job_repair', e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                        />
                                                        <Wrench className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm text-gray-700">กลุ่มงานแจ้งซ่อม</span>
                                                    </label>

                                                    {/* กลุ่มงานร้องเรียน - Only for teacher */}
                                                    {isTeacher && (
                                                        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 cursor-pointer transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={editForm.data.job_complaint}
                                                                onChange={(e) => editForm.setData('job_complaint', e.target.checked)}
                                                                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                            />
                                                            <MessageSquare className="w-4 h-4 text-purple-500" />
                                                            <span className="text-sm text-gray-700">กลุ่มงานร้องเรียน</span>
                                                        </label>
                                                    )}

                                                    {/* ผู้ดูแลระบบ - Only for teacher */}
                                                    {isTeacher && (
                                                        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 cursor-pointer transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={editForm.data.job_admin}
                                                                onChange={(e) => editForm.setData('job_admin', e.target.checked)}
                                                                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                            />
                                                            <Settings className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm text-gray-700">ผู้ดูแลระบบ</span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200"
                                            >
                                                {editForm.processing ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Suspend Tab Content */}
                            {activeTab === 'suspend' && (
                                <div className="space-y-6">
                                    {/* Show email on mobile for suspend tab too */}
                                    <div className="lg:hidden bg-white rounded-2xl p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>

                                    {/* Already Suspended Warning */}
                                    {isSuspended && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-yellow-800 font-medium">บัญชีนี้ถูกระงับอยู่แล้ว</p>
                                                <p className="text-yellow-700 text-sm mt-1">
                                                    ประเภท: {user.suspension_type === 'permanent' ? 'ถาวร' : 'ชั่วคราว'}
                                                    {user.suspension_end && ` (ถึง ${new Date(user.suspension_end).toLocaleDateString('th-TH')})`}
                                                </p>
                                                <button
                                                    onClick={() => router.post(route('admin.users.unsuspend', user.account_id))}
                                                    className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                                >
                                                    ยกเลิกการระงับ
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Temporary Suspension */}
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-gray-900">ระงับชั่วคราว</h2>
                                            <p className="text-sm text-gray-500 mt-1">กำหนดช่วงเวลาและเหตุผลในการระงับ</p>
                                        </div>

                                        <form onSubmit={handleTemporarySubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">เริ่มระงับ</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={temporaryForm.data.suspension_start}
                                                        onChange={(e) => temporaryForm.setData('suspension_start', e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                        disabled={isSuspended}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">สิ้นสุดระงับ</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={temporaryForm.data.suspension_end}
                                                        onChange={(e) => temporaryForm.setData('suspension_end', e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                        disabled={isSuspended}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">เหตุผล</label>
                                                <textarea
                                                    placeholder="กรอกเหตุผลในการระงับ..."
                                                    rows={3}
                                                    value={temporaryForm.data.reason}
                                                    onChange={(e) => temporaryForm.setData('reason', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
                                                    disabled={isSuspended}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={temporaryForm.processing || isSuspended}
                                                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                ยืนยันระงับชั่วคราว
                                            </button>
                                        </form>
                                    </div>

                                    {/* Permanent Suspension */}
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-gray-900">ระงับถาวร / ปิดบัญชี</h2>
                                            <p className="text-sm text-gray-500 mt-1">ปิดการใช้งานบัญชีอย่างถาวร</p>
                                        </div>

                                        <form onSubmit={handlePermanentSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">เหตุผล</label>
                                                <textarea
                                                    placeholder="กรอกเหตุผลในการปิดบัญชี..."
                                                    rows={4}
                                                    value={permanentForm.data.reason}
                                                    onChange={(e) => permanentForm.setData('reason', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                                                    disabled={isSuspended && user.suspension_type === 'permanent'}
                                                />
                                            </div>

                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={confirmPermanent}
                                                    onChange={(e) => setConfirmPermanent(e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                    disabled={isSuspended && user.suspension_type === 'permanent'}
                                                />
                                                <span className="text-sm text-gray-600">ยืนยันการปิดใช้งานบัญชีนี้</span>
                                            </label>

                                            <button
                                                type="submit"
                                                disabled={permanentForm.processing || !confirmPermanent || (isSuspended && user.suspension_type === 'permanent')}
                                                className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                ปิดใช้งานบัญชี
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Back button on mobile */}
                            <div className="lg:hidden mt-6">
                                <Link
                                    href={route('admin.users.index')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    กลับหน้าจัดการผู้ใช้
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - User Info (Desktop Only) */}
                        <div className="hidden lg:block lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6">
                                {/* User Avatar & Name */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                                        {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">นาย {user.first_name} {user.last_name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">สถานะ</span>
                                        {isSuspended ? (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                <XCircle className="w-3 h-3" /> ถูกระงับ
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> ใช้งานอยู่
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">บทบาท (Role)</span>
                                        <span className="text-sm text-gray-900 font-medium">{getRoleLabel(user.role)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">อัปเดตล่าสุด</span>
                                        <span className="text-sm text-gray-900">
                                            {user.updated_at
                                                ? new Date(user.updated_at).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : '-'
                                            }
                                        </span>
                                    </div>

                                    {/* Show permissions in sidebar only for teacher/staff */}
                                    {(user.role === 'teacher' || user.role === 'staff') && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">สิทธิ์การใช้งาน</span>
                                            <span className="text-sm text-gray-900">
                                                {[
                                                    user.job_repair && 'ซ่อม',
                                                    user.job_complaint && 'ร้องเรียน',
                                                    user.job_admin && 'แอดมิน'
                                                ].filter(Boolean).join(', ') || '-'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Back Button */}
                                <Link
                                    href={route('admin.users.index')}
                                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
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
