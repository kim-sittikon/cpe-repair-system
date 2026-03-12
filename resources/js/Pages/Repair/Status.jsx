import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Status({ auth, repairs, statusOptions }) {
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]?.value || 'processing');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('status');
    const [votedRepairs, setVotedRepairs] = useState(
        repairs.filter(r => r.credited).map(r => r.numeric_id)
    );
    const [votingId, setVotingId] = useState(null);
    // Lightbox modal state
    const [lightboxImage, setLightboxImage] = useState(null);

    // Completion form state
    const [completionNotes, setCompletionNotes] = useState('');
    const [completionImages, setCompletionImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef(null);

    const handleVote = (repairId, vote) => {
        setVotingId(repairId);
        router.post(route('repairs.credit.vote', repairId), {
            vote: vote,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setVotedRepairs(prev => [...prev, repairId]);
            },
            onFinish: () => setVotingId(null),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        repairs.forEach(r => formData.append('ids[]', r.numeric_id));
        formData.append('status', selectedStatus);

        // Add completion data if finishing
        if (selectedStatus === 'finished') {
            formData.append('completion_notes', completionNotes);
            completionImages.forEach((file, index) => {
                formData.append(`completion_images[${index}]`, file);
            });
        }

        router.post(route('repairs.status.update'), formData, {
            forceFormData: true,
            headers: { 'X-HTTP-Method-Override': 'PATCH' },
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Image upload validation constants
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalFiles = completionImages.length + files.length;

        if (totalFiles > 5) {
            setImageError('อัปโหลดได้สูงสุด 5 รูป');
            return;
        }

        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setImageError('รองรับเฉพาะไฟล์ JPG และ PNG เท่านั้น');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                setImageError('ขนาดไฟล์ต้องไม่เกิน 5MB ต่อรูป');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
        }

        setImageError('');
        setCompletionImages(prev => [...prev, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index) => {
        setCompletionImages(prev => prev.filter((_, i) => i !== index));
    };

    const displayText = repairs.map(r => `${r.id}, ${r.title}`).join(' | ');

    // Helper: แสดง file preview
    const renderFilePreview = (file, index) => {
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.extension);

        if (isImage) {
            return (
                <div
                    key={index}
                    onClick={() => setLightboxImage(file.url)}
                    className="relative group overflow-hidden rounded-xl border-2 border-gray-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-lg cursor-pointer"
                >
                    <img
                        src={file.url}
                        alt={`ไฟล์แนบ ${index + 1}`}
                        className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            );
        }

        const colorMap = {
            pdf: { bg: 'from-red-500 to-rose-600', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
            doc: { bg: 'from-blue-500 to-indigo-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            docx: { bg: 'from-blue-500 to-indigo-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            default: { bg: 'from-gray-500 to-gray-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        };
        const config = colorMap[file.extension] || colorMap.default;

        return (
            <a
                key={index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center bg-gradient-to-br ${config.bg} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all group`}
            >
                <svg className="w-8 h-8 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
                </svg>
                <span className="text-xs font-bold uppercase">{file.extension}</span>
                <span className="text-[9px] opacity-75 group-hover:opacity-100 transition-opacity">คลิกเพื่อดู</span>
            </a>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="เปลี่ยนสถานะ" />

            <div className="py-6 sm:py-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <nav className="text-sm text-gray-500 mb-2">
                                <ol className="list-none p-0 inline-flex items-center gap-2">
                                    <li className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        กลุ่มงานแจ้งซ่อม
                                    </li>
                                    <li className="text-gray-300">/</li>
                                    <li>
                                        <Link href={route('repairs.index')} className="hover:text-orange-600 transition-colors">
                                            รายการแจ้งซ่อม
                                        </Link>
                                    </li>
                                    <li className="text-gray-300">/</li>
                                    <li className="font-semibold text-orange-600">เปลี่ยนสถานะ</li>
                                </ol>
                            </nav>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                เปลี่ยนสถานะใบงาน
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">อัปเดตสถานะการดำเนินงาน</p>
                        </div>
                    </div>

                    {/* Selected Items Card */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 sm:p-6 shadow-xl shadow-orange-500/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-orange-100 text-sm font-medium mb-1">ใบงานที่เลือก ({repairs.length} รายการ)</p>
                                <p className="text-white font-semibold text-sm sm:text-base line-clamp-2">{displayText}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Card with Tabs */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden">

                        {/* Tabs */}
                        <div className="border-b border-gray-100 px-4 sm:px-6 bg-gradient-to-r from-gray-50/50 to-white">
                            <nav className="flex gap-1 sm:gap-2 overflow-x-auto -mb-px">
                                <button
                                    onClick={() => setActiveTab('status')}
                                    className={`py-4 px-4 sm:px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-2
                                        ${activeTab === 'status'
                                            ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        } rounded-t-xl`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    เปลี่ยนสถานะ
                                </button>
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`py-4 px-4 sm:px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-2
                                        ${activeTab === 'details'
                                            ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        } rounded-t-xl`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    รายละเอียด
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-5 sm:p-8">

                            {/* Tab 1: เปลี่ยนสถานะ */}
                            {activeTab === 'status' && (
                                <form onSubmit={handleSubmit}>
                                    <div className="max-w-md mx-auto text-center">
                                        {/* Status Icon */}
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">เปลี่ยนสถานะการดำเนินงาน</h3>
                                        <p className="text-gray-500 text-sm mb-8">เลือกสถานะใหม่สำหรับใบงานที่เลือก</p>

                                        {/* Status Select */}
                                        <div className="mb-8">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full px-5 py-4 border-2 border-orange-200 rounded-xl bg-orange-50/50 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 font-medium cursor-pointer hover:border-orange-300 text-center text-lg"
                                            >
                                                {statusOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.value === 'accepted' ? '✅' : option.value === 'rejected' ? '❌' : '🏁'} {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Status Flow */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="flex items-center justify-center gap-3 text-sm">
                                                {selectedStatus === 'accepted' ? (
                                                    <>
                                                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">รอดำเนินการ</span>
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium">รับเรื่อง</span>
                                                    </>
                                                ) : selectedStatus === 'rejected' ? (
                                                    <>
                                                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">รอดำเนินการ</span>
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                        <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium">ปฏิเสธการดำเนินการ</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium">รับเรื่อง</span>
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-medium">เสร็จสิ้น</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Completion Form - Show when finishing */}
                                        {selectedStatus === 'finished' && (
                                            <div className="mb-8 text-left space-y-4">
                                                {/* Completion Notes */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        <span className="text-red-500">*</span> รายละเอียดการดำเนินงาน
                                                    </label>
                                                    <textarea
                                                        value={completionNotes}
                                                        onChange={(e) => setCompletionNotes(e.target.value)}
                                                        rows={4}
                                                        placeholder="กรอกรายละเอียดการซ่อม เช่น อะไหล่ที่เปลี่ยน, วิธีการแก้ไข..."
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                                                        required
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">ขั้นต่ำ 10 ตัวอักษร</p>
                                                </div>

                                                {/* Completion Images */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        รูปภาพหลังเสร็จงาน (ไม่บังคับ)
                                                    </label>

                                                    {/* Image Preview */}
                                                    {completionImages.length > 0 && (
                                                        <div className="flex flex-wrap gap-3 mb-3">
                                                            {completionImages.map((file, index) => (
                                                                <div key={index} className="relative group">
                                                                    <img
                                                                        src={URL.createObjectURL(file)}
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index)}
                                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Upload Button */}
                                                    {completionImages.length < 5 && (
                                                        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="text-sm text-gray-500">เพิ่มรูปภาพ ({completionImages.length}/5)</span>
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/jpeg,image/png"
                                                                multiple
                                                                onChange={handleImageUpload}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    )}

                                                    <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB สูงสุด 5 ไฟล์</p>

                                                    {imageError && (
                                                        <p className="text-xs text-red-500 mt-2">{imageError}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-row justify-center gap-3">
                                            <Link
                                                href={route('repairs.index')}
                                                className="px-8 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                                            >
                                                ยกเลิก
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 hover:shadow-xl flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        กำลังอัปเดต...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        อัปเดตสถานะ
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Tab 2: รายละเอียด */}
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    {repairs.map((repair, idx) => (
                                        <div key={repair.id} className={`${idx > 0 ? 'pt-6 border-t border-gray-100' : ''}`}>

                                            {/* Repair Header with Title */}
                                            <div className="flex items-start gap-3 mb-4">
                                                <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg flex-shrink-0">{repair.id}</span>
                                                <p className="text-gray-900 font-semibold text-sm leading-relaxed pt-1">{repair.title}</p>
                                            </div>

                                            {/* Info Row - Reporter & Location inline */}
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1 min-w-[140px]">
                                                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">ผู้แจ้ง</p>
                                                        <p className="text-sm text-gray-800 font-medium truncate">{repair.reporter_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1 min-w-[140px]">
                                                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">สถานที่</p>
                                                        <p className="text-sm text-gray-800 font-medium truncate">{repair.location}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Files */}
                                            {repair.files && repair.files.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        ไฟล์แนบ ({repair.files.length})
                                                    </p>
                                                    <div className="flex gap-3 flex-wrap">
                                                        {repair.files.map((file, fileIdx) => renderFilePreview(file, fileIdx))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Description */}
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                                    </svg>
                                                    รายละเอียด
                                                </p>
                                                <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 border border-gray-100 whitespace-pre-wrap leading-relaxed">
                                                    {repair.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                                                </div>
                                            </div>

                                            {/* Voting Section */}
                                            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">⭐</span>
                                                    <p className="text-sm text-gray-600">ให้คะแนนผู้แจ้ง</p>
                                                </div>

                                                {votedRepairs.includes(repair.numeric_id) ? (
                                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                                                        ✓ ให้คะแนนแล้ว
                                                    </span>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleVote(repair.numeric_id, 'up')}
                                                            disabled={votingId === repair.numeric_id}
                                                            className="w-10 h-10 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 rounded-full transition-all disabled:opacity-50 text-xl hover:scale-110 active:scale-95"
                                                            title="+1 credit"
                                                        >
                                                            {votingId === repair.numeric_id ? '...' : '👍'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleVote(repair.numeric_id, 'down')}
                                                            disabled={votingId === repair.numeric_id}
                                                            className="w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-all disabled:opacity-50 text-xl hover:scale-110 active:scale-95"
                                                            title="-1 credit"
                                                        >
                                                            👎
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
            {/* Image Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10 group"
                    >
                        <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image */}
                    <img
                        src={lightboxImage}
                        alt="ดูรูปภาพ"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </AuthenticatedLayout>
    );
}
