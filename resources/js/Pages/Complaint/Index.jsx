import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, complaints, filters }) {
    // State for filters
    const [params, setParams] = useState({
        search: filters.search || '',
        status: filters.status || '',
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

    // Toggle Checkbox
    const toggleSelect = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
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
    const renderPriority = (priority) => {
        switch (priority) {
            case 'เร่งด่วนมาก':
                return (
                    <div className="flex items-center gap-2 text-red-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                        <span className="font-semibold text-sm">เร่งด่วนมาก</span>
                    </div>
                );
            case 'เร่งด่วน':
                return (
                    <div className="flex items-center gap-2 text-orange-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                        <span className="font-medium text-sm">เร่งด่วน</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                        <span className="text-sm font-medium">ปกติ</span>
                    </div>
                );
        }
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header & Breadcrumbs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <nav className="text-sm text-gray-500 mb-1">
                                <ol className="list-none p-0 inline-flex">
                                    <li className="flex items-center">
                                        <Link href="#" className="hover:text-indigo-600 transition-colors">รายการ</Link>
                                        <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" /></svg>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-gray-900 font-semibold">รายการร้องเรียนทั้งหมด</span>
                                    </li>
                                </ol>
                            </nav>
                            <h2 className="text-2xl font-bold text-gray-900">รายการร้องเรียนทั้งหมด</h2>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-full md:w-auto">
                            <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-all flex items-center justify-center gap-2">
                                <span>เปลี่ยนสถานะ</span>
                                <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto items-center">
                            {/* Search Input */}
                            <div className="relative w-full md:w-72 group">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={params.search}
                                    onChange={(e) => setParams({ ...params, search: e.target.value })}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Filter Dropdowns (Bonus) */}
                            <select
                                className="hidden md:block w-40 pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-indigo-300 transition-colors"
                                value={params.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">สถานะทั้งหมด</option>
                                <option value="pending">รอดำเนินการ</option>
                                <option value="processing">กำลังดำเนินการ</option>
                                <option value="finished">เสร็จสิ้น</option>
                            </select>
                        </div>
                    </div>

                    {/* Pro Table */}
                    <div className="bg-white shadow-lg shadow-gray-200/50 rounded-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/80 backdrop-blur-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 w-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                                onChange={toggleSelectAll}
                                                checked={complaints.data.length > 0 && selectedItems.length === complaints.data.length}
                                            />
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">เลขที่แจ้ง</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">เรื่องร้องเรียน</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อผู้แจ้ง</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ความเร่งด่วน</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">วัน-เวลา</th>
                                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">เครดิต</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {complaints.data.length > 0 ? (
                                        complaints.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-indigo-50/40 transition-colors cursor-pointer ${selectedItems.includes(item.id) ? 'bg-indigo-50/60' : ''}`}
                                            >
                                                <td className="px-6 py-4 w-4">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                                        checked={selectedItems.includes(item.id)}
                                                        onChange={() => toggleSelect(item.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 font-medium line-clamp-1">{item.title}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-700 font-medium">
                                                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-500">
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                                        </div>
                                                        {item.reporter}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderPriority(item.priority)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatus(item.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        {item.created_at}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-indigo-600">
                                                    {item.reporter_credit ?? '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
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
