import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react'; // Add router
import { useState } from 'react';
import Dropdown from '@/Components/UI/Dropdown'; // Import Dropdown
import { User, Mail, Shield, CheckCircle, XCircle, Clock, MoreVertical, RefreshCw, Trash2, Search, SlidersHorizontal, X } from 'lucide-react';

export default function UserList({ activeUsers, pendingUsers }) {
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Helper for role badge colors
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'teacher': return 'bg-blue-100 text-blue-700';
            case 'staff': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, role:staff, job:repair, etc.

    // Filter Logic
    const filterUsers = (users) => {
        return users.filter(user => {
            // 1. Search (Name/Email)
            const matchesSearch =
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Filter Dropdown
            if (filterType === 'all') return true;

            if (filterType.startsWith('role:')) {
                return user.role === filterType.split(':')[1];
            }

            if (filterType.startsWith('job:')) {
                const jobType = filterType.split(':')[1];
                return user[`job_${jobType}`] === true;
            }

            if (filterType.startsWith('status:')) {
                const status = filterType.split(':')[1];
                return user.status === status;
            }

            return true;
        });
    };

    const filteredActiveUsers = filterUsers(activeUsers);
    const filteredPendingUsers = filterUsers(pendingUsers);

    // Resend Handler
    const { post, delete: destroy, processing } = useForm(); // Initialize useForm

    const handleResend = (id) => {
        if (confirm('คุณต้องการส่งคำเชิญซ้ำไปยังผู้ใช้งานรายนี้ใช่หรือไม่?')) {
            post(route('admin.users.resend', id), { preserveScroll: true }); // Use post from useForm
        }
    };

    const handleCancel = (id) => {
        if (confirm('คุณต้องการยกเลิกคำเชิญนี้ใช่หรือไม่? ข้อมูลจะถูกลบถาวร')) {
            destroy(route('admin.users.cancel', id), { preserveScroll: true }); // Use destroy from useForm
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="จัดการผู้ใช้งาน" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header & Actions */}
                    <div className="flex flex-col gap-4 mb-6 px-4 sm:px-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">จัดการผู้ใช้งาน</h2>
                                <p className="text-sm text-gray-500">รวมรายชื่อผู้ใช้งานทั้งหมดในระบบ</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            {/* Search Input */}
                            <div className="relative flex-1 sm:flex-none sm:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ หรือ อีเมล..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>

                            {/* Mobile Filter Button */}
                            <div className="relative sm:hidden">
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`p-2 border rounded-lg transition-colors ${filterType !== 'all'
                                        ? 'bg-orange-100 border-orange-400 text-orange-600'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <SlidersHorizontal className="h-5 w-5" />
                                </button>
                                {/* Mobile Filter Dropdown */}
                                {showFilterDropdown && (
                                    <div className="absolute right-0 top-12 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                                            <span className="text-sm font-medium text-gray-700">ตัวกรอง</span>
                                            <button onClick={() => setShowFilterDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => { setFilterType('all'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'all' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >ทั้งหมด</button>
                                            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">สถานะ</div>
                                            <button
                                                onClick={() => { setFilterType('status:active'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'status:active' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >ใช้งานปกติ</button>
                                            <button
                                                onClick={() => { setFilterType('status:suspended'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'status:suspended' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >บัญชีที่โดนระงับ</button>
                                            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">บทบาท</div>
                                            <button
                                                onClick={() => { setFilterType('role:student'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'role:student' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >นักศึกษา</button>
                                            <button
                                                onClick={() => { setFilterType('role:teacher'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'role:teacher' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >อาจารย์</button>
                                            <button
                                                onClick={() => { setFilterType('role:staff'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'role:staff' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >เจ้าหน้าที่</button>
                                            <button
                                                onClick={() => { setFilterType('role:admin'); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filterType === 'role:admin' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                                            >ผู้ดูแลระบบ</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Filter Dropdown */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="hidden sm:block w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                            >
                                <option value="all">ทั้งหมด</option>
                                <optgroup label="สถานะ">
                                    <option value="status:active">ใช้งานปกติ</option>
                                    <option value="status:suspended">บัญชีที่โดนระงับ</option>
                                </optgroup>
                                <optgroup label="บทบาท">
                                    <option value="role:student">นักศึกษา</option>
                                    <option value="role:teacher">อาจารย์</option>
                                    <option value="role:staff">เจ้าหน้าที่</option>
                                    <option value="role:admin">ผู้ดูแลระบบ</option>
                                </optgroup>
                                <optgroup label="กลุ่มงาน">
                                    <option value="job:repair">กลุ่มงานแจ้งซ่อม</option>
                                    <option value="job:complaint">กลุ่มงานร้องเรียน</option>
                                    <option value="job:admin">ผู้ดูแลระบบ</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white overflow-visible shadow-sm sm:rounded-lg border border-gray-200">

                        {/* Tabs Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`${activeTab === 'active'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">ผู้ใช้งานปัจจุบัน</span>
                                    <span className="sm:hidden">ปัจจุบัน</span>
                                    <span className={`ml-1 sm:ml-2 py-0.5 px-2 sm:px-2.5 rounded-full text-xs font-medium ${activeTab === 'active' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-900'}`}>
                                        {filteredActiveUsers.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`${activeTab === 'pending'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                                >
                                    <Clock className="w-4 h-4" />
                                    <span className="hidden sm:inline">รอการตอบรับ</span>
                                    <span className="sm:hidden">รอตอบรับ</span>
                                    <span className={`ml-1 sm:ml-2 py-0.5 px-2 sm:px-2.5 rounded-full text-xs font-medium ${activeTab === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-900'}`}>
                                        {filteredPendingUsers.length}
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block lg:hidden p-4 space-y-3">
                            {(activeTab === 'active' ? filteredActiveUsers : filteredPendingUsers).map((user) => (
                                <div key={user.account_id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                                                {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                            {user.job_repair && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />ซ่อม</span>}
                                            {user.job_complaint && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />ร้องเรียน</span>}
                                            {user.job_admin && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />แอดมิน</span>}
                                        </div>
                                        {activeTab === 'active' ? (
                                            user.status === 'suspended' ? (
                                                <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <XCircle className="w-3 h-3" /> ถูกระงับ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" /> ใช้งาน
                                                </span>
                                            )
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">
                                                <Clock className="w-3 h-3" /> รอดำเนินการ
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-3 flex gap-2">
                                        {activeTab === 'active' ? (
                                            <>
                                                <Link
                                                    href={route('admin.users.edit', user.account_id)}
                                                    className="flex-1 text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                >
                                                    <User className="w-3 h-3" /> แก้ไขข้อมูล
                                                </Link>
                                                <Link
                                                    href={route('admin.users.suspend', user.account_id)}
                                                    className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                >
                                                    <XCircle className="w-3 h-3" /> ระงับบัญชี
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleResend(user.account_id)}
                                                    disabled={processing}
                                                    className="flex-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                >
                                                    <RefreshCw className="w-3 h-3" /> ส่งซ้ำ
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(user.account_id)}
                                                    disabled={processing}
                                                    className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" /> ยกเลิก
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {(activeTab === 'active' ? filteredActiveUsers : filteredPendingUsers).length === 0 && (
                                <div className="py-12 text-center text-gray-500">
                                    <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p>ไม่พบข้อมูลผู้ใช้งาน</p>
                                </div>
                            )}
                        </div>


                        {/* Desktop Table - Hidden on Mobile */}
                        <div className="hidden lg:block overflow-x-auto overflow-y-visible pb-20">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ผู้ใช้งาน
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            บทบาท
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            แจ้งซ่อม
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ร้องเรียน
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            แอดมิน
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {activeTab === 'active' ? 'วันที่เข้าร่วม' : 'ส่งคำเชิญเมื่อ'}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            สถานะ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            จัดการ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(activeTab === 'active' ? filteredActiveUsers : filteredPendingUsers).map((user) => (
                                        <tr key={user.account_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                            {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.first_name} {user.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getRoleColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Repair */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.job_repair && (
                                                    <CheckCircle className="w-5 h-5 text-gray-800 mx-auto" />
                                                )}
                                            </td>
                                            {/* Complaint */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.job_complaint && (
                                                    <CheckCircle className="w-5 h-5 text-gray-800 mx-auto" />
                                                )}
                                            </td>
                                            {/* Admin */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.job_admin && (
                                                    <CheckCircle className="w-5 h-5 text-gray-800 mx-auto" />
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(activeTab === 'active' ? user.created_at : user.invitation_sent_at).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                {activeTab === 'pending' && (
                                                    <span className="text-xs text-red-400 block mt-1">
                                                        หมดอายุ: {new Date(user.invitation_expires_at).toLocaleDateString('th-TH')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {activeTab === 'active' ? (
                                                    user.status === 'suspended' ? (
                                                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-semibold">
                                                            <XCircle className="w-3 h-3" /> ถูกระงับ
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-semibold">
                                                            <CheckCircle className="w-3 h-3" /> ใช้งาน
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-semibold">
                                                        <Clock className="w-3 h-3" /> รอดำเนินการ
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {activeTab === 'active' ? (
                                                    <div className="flex justify-end">
                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition px-2 py-1 rounded hover:bg-gray-100">
                                                                    จัดการ <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </Dropdown.Trigger>
                                                            <Dropdown.Content contentClasses="py-1 bg-white border border-gray-200">
                                                                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 font-semibold mb-1">
                                                                    จัดการบัญชี
                                                                </div>
                                                                <Dropdown.Link href={route('admin.users.edit', user.account_id)} className="flex items-center gap-2 group">
                                                                    <User className="w-4 h-4 text-gray-400 group-hover:text-blue-500" /> แก้ไขข้อมูล
                                                                </Dropdown.Link>
                                                                <Dropdown.Link
                                                                    href={route('admin.users.suspend', user.account_id)}
                                                                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full text-left group"
                                                                >
                                                                    <XCircle className="w-4 h-4 text-red-400 group-hover:text-red-600" /> ระงับการใช้งาน
                                                                </Dropdown.Link>
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleResend(user.account_id)}
                                                            disabled={processing}
                                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors flex items-center gap-1"
                                                            title="ส่งคำเชิญซ้ำ"
                                                        >
                                                            <RefreshCw className="w-4 h-4" /> <span className="text-xs">ส่งซ้ำ</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(user.account_id)}
                                                            disabled={processing}
                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center gap-1"
                                                            title="ยกเลิกคำเชิญ"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> <span className="text-xs">ยกเลิก</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {(activeTab === 'active' ? filteredActiveUsers : filteredPendingUsers).length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <User className="w-8 h-8 text-gray-300" />
                                                    <p>ไม่พบข้อมูลผู้ใช้งานในส่วนนี้</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
