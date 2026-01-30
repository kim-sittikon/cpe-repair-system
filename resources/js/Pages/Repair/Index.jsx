import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, repairs, filters }) {
    // State for filters - Default to 'pending' to show only active repairs
    const [params, setParams] = useState({
        search: filters.search || '',
        status: filters.status || 'pending',
        priority: filters.priority || '',
    });

    // Checkbox State
    const [selectedItems, setSelectedItems] = useState([]);

    // Modal State for Description
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({ title: '', description: '' });

    // Helper: Extract name from email (e.g., "sittikon xorionzswerp@gmail.com" -> "sittikon xorionzswerp")
    const extractName = (reporter) => {
        if (!reporter) return 'ไม่ระบุ';
        // If it contains @ it's likely an email format
        if (reporter.includes('@')) {
            // Try to extract the name before the email
            const match = reporter.match(/^(.+?)\s*\S+@\S+$/);
            if (match && match[1]) {
                return match[1].trim();
            }
            // Fallback: just return the part before @
            return reporter.split('@')[0].replace(/\./g, ' ');
        }
        return reporter;
    };

    // Open detail modal
    const openDetailModal = (title, description) => {
        setSelectedDetail({ title, description });
        setShowDetailModal(true);
    };

    // Debounce Search & Handle Filter Changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (params.search !== (filters.search || '')) {
                router.get(route('repairs.index'), params, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [params.search]);

    const handleFilterChange = (key, value) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        router.get(route('repairs.index'), newParams, { preserveState: true, replace: true });
    };

    // Toggle Checkbox (Multi Selection for Create Job)
    const toggleSelect = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Helper: Priority Badge (compact for table)
    const renderPriority = (priority, hasPersonalMatch = false) => {
        const badge = hasPersonalMatch ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                สำหรับคุณ
            </span>
        ) : null;

        // ถ้ามี personal match และเป็นระดับปกติ ให้แสดงแค่ badge "สำหรับคุณ" อย่างเดียว
        if (hasPersonalMatch && (priority === 'ปกติ' || !priority || priority === 'normal')) {
            return <div className="flex flex-col gap-1">{badge}</div>;
        }

        const getPriorityContent = () => {
            switch (priority) {
                case 'เร่งด่วนมาก':
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-500 text-white whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            เร่งด่วน
                        </span>
                    );
                default:
                    return (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                            ปกติ
                        </span>
                    );
            }
        };

        return (
            <div className="flex flex-col gap-1">
                {getPriorityContent()}
                {badge}
            </div>
        );
    };

    // Helper: Status Badge (compact for table)
    const renderStatus = (status) => {
        let bgColor = 'bg-gray-100';
        let textColor = 'text-gray-600';
        let dotColor = 'bg-gray-400';

        switch (status) {
            case 'รอดำเนินการ':
                bgColor = 'bg-blue-50'; textColor = 'text-blue-600'; dotColor = 'bg-blue-500';
                break;
            case 'กำลังดำเนินการ':
                bgColor = 'bg-amber-50'; textColor = 'text-amber-600'; dotColor = 'bg-amber-500';
                break;
            case 'เสร็จสิ้น':
                bgColor = 'bg-emerald-50'; textColor = 'text-emerald-600'; dotColor = 'bg-emerald-500';
                break;
            case 'ยกเลิก':
                bgColor = 'bg-red-50'; textColor = 'text-red-600'; dotColor = 'bg-red-400';
                break;
        }

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${bgColor} ${textColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="รายการแจ้งซ่อม" />

            <div className="py-6 sm:py-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/50">
                <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

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
                                    <li className="font-semibold text-orange-600">รายการแจ้งซ่อม</li>
                                </ol>
                            </nav>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                รายการแจ้งซ่อมทั้งหมด
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">จัดการและติดตามงานแจ้งซ่อมในระบบ</p>
                        </div>
                        <Link
                            href={route('repairs.dashboard')}
                            className="hidden lg:inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            ดู Dashboard
                        </Link>
                    </div>

                    {/* Toolbar Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/80 p-4 sm:p-6">
                        {/* Mobile: Compact 2-row layout */}
                        <div className="lg:hidden space-y-3">
                            {/* Row 1: Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 0) {
                                            alert('กรุณาเลือกรายการที่ต้องการสร้างใบงาน');
                                            return;
                                        }
                                        const queryString = selectedItems.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
                                        router.visit(`/repairs/jobs/create?${queryString}`);
                                    }}
                                    disabled={selectedItems.length === 0}
                                    className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border-2
                                        ${selectedItems.length > 0
                                            ? 'border-orange-500 bg-white text-orange-600'
                                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>สร้างใบงาน{selectedItems.length > 0 && ` (${selectedItems.length})`}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 0) {
                                            alert('กรุณาเลือกรายการที่ต้องการเปลี่ยนสถานะ');
                                            return;
                                        }
                                        if (selectedItems.length > 1) {
                                            alert('เปลี่ยนสถานะได้ทีละ 1 รายการเท่านั้น');
                                            return;
                                        }
                                        const queryString = selectedItems.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
                                        router.visit(`/repairs/status?${queryString}`);
                                    }}
                                    disabled={selectedItems.length === 0}
                                    className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5
                                        ${selectedItems.length === 1
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>เปลี่ยนสถานะ{selectedItems.length === 1 && ` (1)`}</span>
                                </button>
                            </div>
                            {/* Row 2: Search + Filter */}
                            <div className="flex gap-2">
                                <div className="relative flex-1 group">
                                    <input
                                        type="text"
                                        placeholder="ค้นหา..."
                                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        value={params.search}
                                        onChange={(e) => setParams({ ...params, search: e.target.value })}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <select
                                    className="w-36 px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    value={params.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="pending">🕐 รอดำเนินการ</option>
                                    <option value="finished">✅ เสร็จสิ้น</option>
                                    <option value="all">📁 ทั้งหมด</option>
                                </select>
                            </div>
                        </div>

                        {/* Desktop: Full layout */}
                        <div className="hidden lg:flex lg:justify-between lg:items-center gap-4">
                            {/* Left: Action Buttons */}
                            <div className="flex flex-row gap-3">
                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 0) {
                                            alert('กรุณาเลือกรายการที่ต้องการสร้างใบงาน');
                                            return;
                                        }
                                        const queryString = selectedItems.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
                                        router.visit(`/repairs/jobs/create?${queryString}`);
                                    }}
                                    disabled={selectedItems.length === 0}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border-2
                                        ${selectedItems.length > 0
                                            ? 'border-orange-500 bg-white text-orange-600 hover:bg-orange-50 shadow-sm hover:shadow'
                                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>สร้างใบงาน{selectedItems.length > 0 && ` (${selectedItems.length})`}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 0) {
                                            alert('กรุณาเลือกรายการที่ต้องการเปลี่ยนสถานะ');
                                            return;
                                        }
                                        if (selectedItems.length > 1) {
                                            alert('เปลี่ยนสถานะได้ทีละ 1 รายการเท่านั้น');
                                            return;
                                        }
                                        const queryString = selectedItems.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
                                        router.visit(`/repairs/status?${queryString}`);
                                    }}
                                    disabled={selectedItems.length === 0}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
                                        ${selectedItems.length === 1
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>เปลี่ยนสถานะ{selectedItems.length === 1 && ` (1)`}</span>
                                </button>
                            </div>
                            {/* Right: Filters */}
                            <div className="flex gap-3">
                                <div className="relative w-80 group">
                                    <input
                                        type="text"
                                        placeholder="ค้นหาเลขที่ หรือ ชื่อเรื่อง..."
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                                        value={params.search}
                                        onChange={(e) => setParams({ ...params, search: e.target.value })}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <select
                                    className="w-56 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer hover:border-orange-300 transition-all shadow-sm"
                                    value={params.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="pending">🕐 รอดำเนินการ</option>
                                    <option value="finished">✅ ดำเนินการเสร็จสิ้น</option>
                                    <option value="all">📁 รายการทั้งหมด</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-4">
                        {repairs.data.length > 0 ? (
                            repairs.data.map((item) => (
                                <div
                                    key={item.numeric_id}
                                    onClick={() => {
                                        if (item.raw_status !== 'finished' && item.raw_status !== 'completed') {
                                            toggleSelect(item.numeric_id);
                                        }
                                    }}
                                    className={`bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border transition-all active:scale-[0.99]
                                        ${item.raw_status === 'finished' || item.raw_status === 'completed'
                                            ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/30'
                                            : selectedItems.includes(item.numeric_id)
                                                ? 'border-orange-300 bg-gradient-to-br from-orange-50/50 to-amber-50/30 ring-2 ring-orange-200'
                                                : 'border-gray-100 hover:border-orange-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox/Checkmark */}
                                        <div className="pt-0.5 flex-shrink-0">
                                            {item.raw_status !== 'finished' && item.raw_status !== 'completed' ? (
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer
                                                    ${selectedItems.includes(item.numeric_id)
                                                        ? 'bg-orange-500 border-orange-500'
                                                        : 'border-gray-300 bg-white hover:border-orange-400'
                                                    }`}
                                                    onClick={(e) => { e.stopPropagation(); toggleSelect(item.numeric_id); }}
                                                >
                                                    {selectedItems.includes(item.numeric_id) && (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                                                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">{item.id}</span>
                                                </div>
                                                {renderStatus(item.status)}
                                            </div>
                                            <h3
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.visit(`/repairs/status?ids[]=${item.numeric_id}`);
                                                }}
                                                className="text-base font-semibold text-gray-900 line-clamp-2 mb-3 cursor-pointer hover:text-orange-600 active:text-orange-700 transition-colors"
                                            >
                                                {item.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {item.location}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {item.created_at}
                                                </span>
                                                {/* Priority Badge */}
                                                {item.priority === 'เร่งด่วนมาก' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-500 text-white whitespace-nowrap">
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                        เร่งด่วน
                                                    </span>
                                                )}
                                                {/* For You Badge - Always show when hasPersonalMatch is true */}
                                                {item.hasPersonalMatch && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
                                                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                                        สำหรับคุณ
                                                    </span>
                                                )}
                                                {/* Normal Priority Badge - Only show when NOT hasPersonalMatch and NOT Very Urgent */}
                                                {!item.hasPersonalMatch && item.priority !== 'เร่งด่วนมาก' && (
                                                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                                                        ปกติ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-lg shadow-gray-200/50 border border-gray-100">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-bold text-gray-700">ไม่พบรายการแจ้งซ่อม</p>
                                <p className="text-sm text-gray-400 mt-2">ลองเปลี่ยนคำค้นหา หรือตัวกรองดูนะครับ</p>
                            </div>
                        )}

                        {/* Mobile Pagination */}
                        {repairs.links && repairs.data.length > 0 && (
                            <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100">
                                <Link
                                    href={repairs.prev_page_url || '#'}
                                    className={`flex-1 py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all mr-2
                                        ${repairs.prev_page_url
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                                >
                                    ← ก่อนหน้า
                                </Link>
                                <span className="text-sm font-medium text-gray-600 px-3 py-2 bg-gray-50 rounded-lg">
                                    {repairs.current_page}/{repairs.last_page}
                                </span>
                                <Link
                                    href={repairs.next_page_url || '#'}
                                    className={`flex-1 py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all ml-2
                                        ${repairs.next_page_url
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                                >
                                    ถัดไป →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table - Hidden on Mobile */}
                    <div className="hidden lg:block bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100/80 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80">
                                    <tr>
                                        <th scope="col" className="w-10 px-2 py-3"></th>
                                        <th scope="col" className="w-20 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">เลขที่</th>
                                        <th scope="col" className="w-36 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">เรื่องแจ้งซ่อม</th>
                                        <th scope="col" className="w-40 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">รายละเอียด</th>
                                        <th scope="col" className="w-24 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">สถานที่</th>
                                        <th scope="col" className="w-24 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ผู้แจ้ง</th>
                                        <th scope="col" className="w-20 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">เร่งด่วน</th>
                                        <th scope="col" className="w-28 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">สถานะ</th>
                                        <th scope="col" className="w-32 px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">วัน-เวลา</th>
                                        <th scope="col" className="w-12 px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">เครดิต</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {repairs.data.length > 0 ? (
                                        repairs.data.map((item) => (
                                            <tr
                                                key={item.numeric_id}
                                                className={`transition-all duration-200 group
                                                    ${item.raw_status === 'finished' || item.raw_status === 'completed'
                                                        ? 'bg-gradient-to-r from-emerald-50/30 to-teal-50/20 hover:from-emerald-50/50 hover:to-teal-50/40'
                                                        : selectedItems.includes(item.numeric_id)
                                                            ? 'bg-gradient-to-r from-orange-50/60 to-amber-50/40 hover:from-orange-50/80 hover:to-amber-50/60'
                                                            : 'hover:bg-orange-50/30'
                                                    }`}
                                            >
                                                <td className="px-2 py-3">
                                                    {item.raw_status !== 'finished' && item.raw_status !== 'completed' ? (
                                                        <div
                                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                                                                ${selectedItems.includes(item.numeric_id)
                                                                    ? 'bg-orange-500 border-orange-500'
                                                                    : 'border-gray-300 bg-white hover:border-orange-400'
                                                                }`}
                                                            onClick={() => toggleSelect(item.numeric_id)}
                                                        >
                                                            {selectedItems.includes(item.numeric_id) && (
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center" title="เสร็จสิ้น">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-2 py-3">
                                                    <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                                                        {item.id}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="group/title relative">
                                                        <span className="text-sm text-gray-900 font-medium block truncate max-w-[140px] cursor-pointer hover:text-orange-600 transition-all">
                                                            {item.title}
                                                        </span>
                                                        {item.title && item.title.length > 25 && (
                                                            <div className="absolute left-0 top-full mt-2 z-[9999] opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible transition-all duration-200 pointer-events-none">
                                                                <div className="relative bg-gray-800 text-white text-xs rounded-lg py-2 px-3 max-w-xs shadow-xl">
                                                                    <p className="break-words">{item.title}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div
                                                        className="group/desc relative cursor-pointer"
                                                        onClick={() => item.description && item.description.length > 20 && openDetailModal(item.title, item.description)}
                                                    >
                                                        <span className={`text-sm text-gray-500 block truncate max-w-[150px] ${item.description && item.description.length > 20 ? 'hover:text-cyan-600 transition-all cursor-pointer' : ''}`}>
                                                            {item.description || '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <span className="text-sm text-gray-600 truncate block max-w-[80px]" title={item.location}>
                                                        {item.location}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <span className="text-sm text-gray-700 truncate block max-w-[80px]" title={item.reporter}>
                                                        {extractName(item.reporter)}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3">
                                                    {renderPriority(item.priority, item.hasPersonalMatch)}
                                                </td>
                                                <td className="px-2 py-3">
                                                    {renderStatus(item.status)}
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-500">
                                                        {item.created_at}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                                        ${(item.reporter_credit ?? 0) > 0 ? 'bg-emerald-100 text-emerald-700' :
                                                            (item.reporter_credit ?? 0) < 0 ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-600'}`}
                                                    >
                                                        {item.reporter_credit ?? 0}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-16 text-center">
                                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xl font-bold text-gray-700">ไม่พบรายการแจ้งซ่อม</p>
                                                <p className="text-base text-gray-400 mt-2">ลองเปลี่ยนคำค้นหา หรือตัวกรองดูนะครับ</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {repairs.links && repairs.data.length > 0 && (
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 px-6 py-5 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        แสดง <span className="font-semibold text-gray-700">{repairs.from || 0}</span> - <span className="font-semibold text-gray-700">{repairs.to || 0}</span> จาก <span className="font-semibold text-gray-700">{repairs.total || 0}</span> รายการ
                                    </div>
                                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px overflow-hidden" aria-label="Pagination">
                                        {repairs.links.map((link, key) => (
                                            <Link
                                                key={key}
                                                href={link.url || '#'}
                                                preserveState
                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all
                                                    ${link.active
                                                        ? 'z-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                                    }
                                                    ${!link.url ? 'cursor-not-allowed opacity-50' : ''}
                                                    ${key === 0 ? 'rounded-l-xl' : ''}
                                                    ${key === repairs.links.length - 1 ? 'rounded-r-xl' : ''}
                                                `}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowDetailModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">รายละเอียด</h3>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Title */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">เรื่องแจ้งซ่อม</p>
                                <p className="text-base font-medium text-gray-900">{selectedDetail.title}</p>
                            </div>

                            {/* Description */}
                            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-4 border border-cyan-100">
                                <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    รายละเอียด
                                </p>
                                <p className="text-sm text-cyan-900 leading-relaxed whitespace-pre-wrap break-words">
                                    {selectedDetail.description || 'ไม่มีรายละเอียด'}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
