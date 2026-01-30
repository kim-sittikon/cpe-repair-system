import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Status({ auth, complaints, statusOptions }) {
    // Default to 'finished' as that's the only action option
    const [selectedStatus, setSelectedStatus] = useState('finished');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('status');
    const [votedComplaints, setVotedComplaints] = useState(
        // Initialize with already credited complaints
        complaints.filter(c => c.credited).map(c => c.numeric_id)
    );
    const [votingId, setVotingId] = useState(null);

    const handleVote = (complaintId, vote) => {
        setVotingId(complaintId);
        router.post(route('complaints.credit.vote', complaintId), {
            vote: vote, // 'up' or 'down'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setVotedComplaints(prev => [...prev, complaintId]);
            },
            onFinish: () => setVotingId(null),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.patch(route('complaints.status.update'), {
            ids: complaints.map(c => c.numeric_id),
            status: selectedStatus,
        }, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    // รวม IDs และ Titles สำหรับแสดง
    const displayText = complaints.map(c => `${c.id}, ${c.title}`).join(' | ');
    const firstComplaint = complaints[0] || {};

    // Helper: แสดง file icon ตาม type
    const renderFileIcon = (file, index) => {
        const colorMap = {
            jpg: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            jpeg: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            png: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
            pdf: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
            default: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
        };
        const colors = colorMap[file.extension] || colorMap.default;
        const label = file.extension.toUpperCase();

        return (
            <a
                key={index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${colors.bg} ${colors.text} border ${colors.border} font-bold text-sm hover:opacity-80 hover:shadow-md transition-all group`}
            >
                <span className="text-lg font-bold">{label}</span>
                <span className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">คลิกเพื่อดู</span>
            </a>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} header="เปลี่ยนสถานะ">
            <Head title="เปลี่ยนสถานะ" />

            <div className="py-4 sm:py-6 min-h-screen bg-gradient-to-b from-orange-50/50 to-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

                    {/* Breadcrumb - Hidden on mobile */}
                    <nav className="hidden sm:block text-sm text-gray-500">
                        <ol className="list-none p-0 inline-flex items-center gap-2">
                            <li className="hover:text-gray-700 transition-colors cursor-default">รายการ</li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link
                                    href={route('complaints.index')}
                                    className="hover:text-amber-600 hover:underline transition-colors"
                                >
                                    รายการร้องเรียนทั้งหมด
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="font-medium text-amber-600">เปลี่ยนสถานะ</li>
                        </ol>
                    </nav>

                    {/* Page Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 sm:hidden">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">เปลี่ยนสถานะ</h1>
                    </div>

                    {/* Header Card - เลขและชื่อใบงาน */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">เลขและชื่อใบงาน</p>
                                <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">{displayText}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Card with Tabs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Tabs - Scrollable on mobile */}
                        <div className="border-b border-gray-100 overflow-x-auto">
                            <nav className="flex min-w-max px-4 sm:px-6">
                                <button
                                    onClick={() => setActiveTab('status')}
                                    className={`py-3 sm:py-4 px-4 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap
                                        ${activeTab === 'status'
                                            ? 'border-amber-500 text-amber-600'
                                            : 'border-transparent text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        เปลี่ยนสถานะ
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`py-3 sm:py-4 px-4 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap
                                        ${activeTab === 'details'
                                            ? 'border-amber-500 text-amber-600'
                                            : 'border-transparent text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        รายละเอียด
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 sm:p-6 md:p-8">

                            {/* Tab 1: เปลี่ยนสถานะ */}
                            {activeTab === 'status' && (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-8 sm:mb-12">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            เปลี่ยนสถานะการดำเนินงาน
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full sm:max-w-xs px-4 py-3.5 pr-10 border-2 border-amber-200 rounded-xl bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 cursor-pointer hover:border-amber-300 font-medium"
                                            >
                                                <option value="finished">ดำเนินการเสร็จสิ้น</option>
                                            </select>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 sm:max-w-md">
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>สถานะปัจจุบัน: <span className="text-blue-600 font-medium">รับเรื่อง</span> → เปลี่ยนเป็น: <span className="text-green-600 font-medium">ดำเนินการเสร็จสิ้น</span></span>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Full width on mobile */}
                                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
                                        <Link
                                            href={route('complaints.index')}
                                            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 border-2 border-amber-500 text-amber-600 rounded-xl sm:rounded-full font-semibold hover:bg-amber-50 transition-all hover:shadow-sm active:scale-[0.98] text-center"
                                        >
                                            ย้อนกลับ
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl sm:rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200 hover:shadow-xl active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    กำลังอัปเดต...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    อัปเดตสถานะ
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Tab 2: รายละเอียด */}
                            {activeTab === 'details' && (
                                <div className="space-y-8">
                                    {complaints.map((complaint, idx) => (
                                        <div key={complaint.id} className={idx > 0 ? 'pt-8 border-t border-gray-100' : ''}>

                                            {/* ชื่อ-นามสกุล และ สถานที่ */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">ชื่อ-นามสกุล</p>
                                                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700 border border-gray-100">
                                                        {complaint.reporter_name}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">สถานที่</p>
                                                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700 border border-gray-100">
                                                        {complaint.location}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* หัวเรื่องปัญหาที่แจ้ง */}
                                            <div className="mb-6">
                                                <p className="text-sm text-gray-500 mb-2">หัวเรื่องปัญหาที่แจ้ง</p>
                                                <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700 border border-gray-100">
                                                    {complaint.title}
                                                </div>
                                            </div>

                                            {/* รูปภาพประกอบ */}
                                            {complaint.files && complaint.files.length > 0 && (
                                                <div className="mb-6">
                                                    <p className="text-sm text-gray-500 mb-1">รูปภาพประกอบ</p>
                                                    <p className="text-xs text-gray-400 mb-3">แตะที่รายการเพื่อดูตัวอย่างแบบเต็มหน้าจอ</p>
                                                    <div className="flex gap-4 flex-wrap">
                                                        {complaint.files.map((file, fileIdx) => renderFileIcon(file, fileIdx))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* รายละเอียดปัญหาที่แจ้ง */}
                                            <div className="mb-6">
                                                <p className="text-sm text-gray-500 mb-2">รายละเอียดปัญหาที่แจ้ง</p>
                                                <div className="bg-gray-50 rounded-xl px-4 py-4 text-gray-700 min-h-[100px] border border-gray-100 whitespace-pre-wrap">
                                                    {complaint.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                                                </div>
                                            </div>

                                            {/* Feedback */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-50">
                                                <span>ข้อมูลนี้มีประโยชน์หรือไม่</span>
                                                {votedComplaints.includes(complaint.numeric_id) ? (
                                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                                        ✓ ให้คะแนนแล้ว
                                                    </span>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleVote(complaint.numeric_id, 'up')}
                                                            disabled={votingId === complaint.numeric_id}
                                                            className="p-2 hover:bg-green-50 hover:text-green-600 rounded-full transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="มีประโยชน์ (+1 credit)"
                                                        >
                                                            {votingId === complaint.numeric_id ? (
                                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleVote(complaint.numeric_id, 'down')}
                                                            disabled={votingId === complaint.numeric_id}
                                                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="ไม่มีประโยชน์ (-1 credit)"
                                                        >
                                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
