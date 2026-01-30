import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, complaints, filters }) {
    // State for filters - Default to 'pending' to show only active complaints
    const [params, setParams] = useState({
        search: filters.search || '',
        status: filters.status || 'pending',
        priority: filters.priority || '',
    });

    // Checkbox State (Mock for now)
    const [selectedItems, setSelectedItems] = useState([]);

    // Debounce Search & Handle Filter Changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (params.search !== (filters.search || '')) {
                router.get(route('complaints.index'), params, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [params.search]);

    const handleFilterChange = (key, value) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        router.get(route('complaints.index'), newParams, { preserveState: true, replace: true });
    };

    // Toggle Checkbox (Single Selection Only)
    const toggleSelect = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems([]); // Deselect if already selected
        } else {
            setSelectedItems([id]); // Select only this item
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === complaints.data.length && complaints.data.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(complaints.data.map(item => item.id));
        }
    };

    // Helper: Priority with Icon
    const renderPriority = (priority, hasPersonalMatch = false) => {
        const badge = hasPersonalMatch ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                สำหรับคุณ
            </span>
        ) : null;

        const getPriorityContent = () => {
            switch (priority) {
                case 'เร่งด่วนมาก':
                    return (
                        <div className="flex items-center gap-1.5 text-red-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            <span className="font-semibold text-xs whitespace-nowrap">เร่งด่วนมาก</span>
                        </div>
                    );
                case 'เร่งด่วน':
                    return (
                        <div className="flex items-center gap-1.5 text-orange-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            <span className="font-medium text-xs whitespace-nowrap">เร่งด่วน</span>
                        </div>
                    );
                default:
                    return (
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            <span className="text-xs font-medium whitespace-nowrap">ปกติ</span>
                        </div>
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

    // Helper: Status with Dot
    const renderStatus = (status) => {
        let color = 'bg-gray-400';
        let textClass = 'text-gray-600';

        switch (status) {
            case 'รอดำเนินการ': color = 'bg-blue-500'; textClass = 'text-blue-600'; break;
            case 'กำลังดำเนินการ': color = 'bg-green-500'; textClass = 'text-green-600'; break;
            case 'เสร็จสิ้น': color = 'bg-emerald-500'; textClass = 'text-emerald-600'; break;
            case 'ยกเลิก': color = 'bg-red-500'; textClass = 'text-red-600'; break;
        }

        return (
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
                <span className={`text-sm font-medium ${textClass}`}>{status}</span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="รายการร้องเรียน"
        >
            <Head title="รายการร้องเรียน" />

            <div className="py-6 min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Breadcrumb - Matching Status.jsx style */}
                    <nav className="text-sm text-gray-500">
                        <ol className="list-none p-0 inline-flex items-center gap-2">
                            <li className="hover:text-gray-700 transition-colors cursor-default">รายการ</li>
                            <li className="text-gray-400">/</li>
                            <li className="font-medium text-amber-600">รายการร้องเรียนทั้งหมด</li>
                        </ol>
                    </nav>

                    <h1 className="text-xl font-bold text-gray-900">รายการร้องเรียนทั้งหมด</h1>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        {/* Left: Action Button */}
                        <button
                            onClick={() => {
                                if (selectedItems.length === 0) {
                                    alert('กรุณาเลือกรายการที่ต้องการเปลี่ยนสถานะ');
                                    return;
                                }
                                const queryString = selectedItems.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
                                router.visit(`/complaints/status?${queryString}`);
                            }}
                            disabled={selectedItems.length === 0}
                            className={`w-full md:w-auto px-5 py-2.5 rounded-xl shadow-sm text-sm font-medium transition-all flex items-center justify-center gap-2
                                ${selectedItems.length > 0
                                    ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>เปลี่ยนสถานะ{selectedItems.length > 0 && ` (${selectedItems.length})`}</span>
                        </button>

                        {/* Right: Filters (Desktop) */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative flex-1 md:w-72 group">
                                <input
                                    type="text"
                                    placeholder="ค้นหา..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={params.search}
                                    onChange={(e) => setParams({ ...params, search: e.target.value })}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <select
                                className="w-full sm:w-52 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-indigo-300 transition-all shadow-sm"
                                value={params.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="pending">🕐 รอดำเนินการ</option>
                                <option value="finished">✅ ดำเนินการเสร็จสิ้น</option>
                                <option value="all">📁 รายการทั้งหมด</option>
                            </select>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden space-y-3">
                        {complaints.data.length > 0 ? (
                            complaints.data.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        if (item.raw_status !== 'finished' && item.raw_status !== 'completed') {
                                            toggleSelect(item.id);
                                        }
                                    }}
                                    className={`bg-white rounded-xl p-4 shadow-sm border transition-all active:scale-[0.99]
                                        ${item.raw_status === 'finished' || item.raw_status === 'completed'
                                            ? 'border-green-200 bg-green-50/50'
                                            : selectedItems.includes(item.id)
                                                ? 'border-indigo-300 bg-indigo-50/50'
                                                : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox/Checkmark */}
                                        <div className="pt-0.5">
                                            {item.raw_status !== 'finished' && item.raw_status !== 'completed' ? (
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-indigo-600">{item.id}</span>
                                                    {item.hasPersonalMatch && (
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
                                                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                                            สำหรับคุณ
                                                        </span>
                                                    )}
                                                </div>
                                                {renderStatus(item.status)}
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                                    {item.reporter}
                                                </span>
                                                <span>•</span>
                                                <span>{item.created_at}</span>
                                                <span>•</span>
                                                {renderPriority(item.priority, false)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center">
                                <div className="bg-gray-50 p-4 rounded-full mb-3 inline-block">
                                    <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-base font-medium text-gray-600">ไม่พบรายการร้องเรียน</p>
                                <p className="text-sm text-gray-400 mt-1">ลองเปลี่ยนคำค้นหา หรือตัวกรองดูนะครับ</p>
                            </div>
                        )}

                        {/* Mobile Pagination */}
                        {complaints.links && complaints.data.length > 0 && (
                            <div className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                <Link
                                    href={complaints.prev_page_url || '#'}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-all mr-2
                                        ${complaints.prev_page_url
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                                >
                                    ← ก่อนหน้า
                                </Link>
                                <span className="text-sm text-gray-500 px-2">
                                    {complaints.current_page}/{complaints.last_page}
                                </span>
                                <Link
                                    href={complaints.next_page_url || '#'}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-all ml-2
                                        ${complaints.next_page_url
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                                >
                                    ถัดไป →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table - Hidden on Mobile */}
                    <div className="hidden sm:block bg-white shadow-lg shadow-gray-200/50 rounded-xl border border-gray-100">
                        <div className="overflow-y-visible">
                            <table className="w-full table-fixed divide-y divide-gray-100">
                                <thead className="bg-gray-50/80 backdrop-blur-sm">
                                    <tr>
                                        <th scope="col" className="w-12 px-3 py-3">
                                            {/* Single selection only - no select all */}
                                        </th>
                                        <th scope="col" className="w-20 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">เลขที่แจ้ง</th>
                                        <th scope="col" className="w-[18%] px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">เรื่องร้องเรียน</th>
                                        <th scope="col" className="w-[16%] px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">รายละเอียด</th>
                                        <th scope="col" className="w-[12%] px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ชื่อผู้แจ้ง</th>
                                        <th scope="col" className="w-20 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ความเร่งด่วน</th>
                                        <th scope="col" className="w-24 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                                        <th scope="col" className="w-32 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase">วัน-เวลา</th>
                                        <th scope="col" className="w-16 px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase">เครดิต</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {complaints.data.length > 0 ? (
                                        complaints.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`transition-colors cursor-pointer 
                                                    ${item.raw_status === 'finished' || item.raw_status === 'completed'
                                                        ? 'bg-green-50/30 hover:bg-green-50/50'
                                                        : selectedItems.includes(item.id)
                                                            ? 'bg-indigo-50/60 hover:bg-indigo-100/60'
                                                            : 'hover:bg-indigo-50/40'
                                                    }`}
                                            >
                                                <td className="px-3 py-3 w-12">
                                                    {item.raw_status !== 'finished' && item.raw_status !== 'completed' ? (
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5 cursor-pointer transition-all hover:border-indigo-400"
                                                            checked={selectedItems.includes(item.id)}
                                                            onChange={() => toggleSelect(item.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center" title="เสร็จสิ้นแล้ว">
                                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-sm font-medium text-gray-900 truncate">
                                                    {item.id}
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="group/title relative">
                                                        <span className="text-sm text-gray-900 font-medium block truncate cursor-pointer hover:text-indigo-600 transition-all duration-200">
                                                            {item.title}
                                                        </span>
                                                        {/* Premium Tooltip for Title */}
                                                        {item.title && item.title.length > 25 && (
                                                            <div className="absolute left-0 top-full mt-2 z-[9999] opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible transition-all duration-200 pointer-events-none">
                                                                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs rounded-xl py-3 px-4 max-w-[320px] max-h-[200px] overflow-y-auto shadow-2xl border border-gray-700">
                                                                    <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-800 transform rotate-45 border-l border-t border-gray-700"></div>
                                                                    <div className="flex items-start gap-2 relative">
                                                                        <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                                        </svg>
                                                                        <div>
                                                                            <p className="font-semibold text-indigo-300 mb-1">เรื่องร้องเรียน</p>
                                                                            <p className="text-gray-200 leading-relaxed break-words">{item.title}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="group/desc relative">
                                                        <p className="text-sm text-gray-600 truncate cursor-pointer hover:text-indigo-600 transition-all duration-200">
                                                            {item.description || '-'}
                                                        </p>
                                                        {/* Premium Tooltip for Description */}
                                                        {item.description && item.description.length > 20 && (
                                                            <div className="absolute left-0 top-full mt-2 z-[9999] opacity-0 invisible group-hover/desc:opacity-100 group-hover/desc:visible transition-all duration-200 pointer-events-none">
                                                                <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 text-white text-xs rounded-xl py-3 px-4 max-w-[320px] max-h-[200px] overflow-y-auto shadow-2xl border border-slate-600">
                                                                    <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-700 transform rotate-45 border-l border-t border-slate-600"></div>
                                                                    <div className="flex items-start gap-2 relative">
                                                                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        <div>
                                                                            <p className="font-semibold text-emerald-300 mb-1">รายละเอียด</p>
                                                                            <p className="text-gray-200 leading-relaxed break-words">{item.description}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="flex items-center text-sm text-gray-700 truncate">
                                                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-500">
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                                        </div>
                                                        {item.reporter}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    {renderPriority(item.priority, item.hasPersonalMatch)}
                                                </td>
                                                <td className="px-2 py-3">
                                                    {renderStatus(item.status)}
                                                </td>
                                                <td className="px-2 py-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        {item.created_at}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 text-center text-sm font-semibold text-indigo-600">
                                                    {item.reporter_credit ?? '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </div>
                                                    <span className="text-base font-medium text-gray-600">ไม่พบรายการร้องเรียน</span>
                                                    <p className="text-sm text-gray-400 mt-1">ลองเปลี่ยนคำค้นหา หรือตัวกรองดูนะครับ</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {complaints.links && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
                                        <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                                            {complaints.links.map((link, key) => (
                                                <Link
                                                    key={key}
                                                    href={link.url || '#'}
                                                    preserveState
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors
                                                        ${link.active
                                                            ? 'z-10 bg-indigo-600 border border-indigo-600 text-white shadow-md'
                                                            : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                                        }
                                                        ${!link.url ? 'cursor-not-allowed opacity-50' : ''}
                                                        ${key === 0 ? 'rounded-l-lg' : ''}
                                                        ${key === complaints.links.length - 1 ? 'rounded-r-lg' : ''}
                                                    `}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
