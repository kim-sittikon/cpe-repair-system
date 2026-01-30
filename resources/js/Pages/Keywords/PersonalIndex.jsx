import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

export default function PersonalIndex({ auth, personalKeywords = [], globalKeywords = { data: [], links: [] }, group, filters = { search: '' } }) {
    // globalKeywords is now a paginator object

    // Initialize search term from server filters if available, else empty
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [editingKeyword, setEditingKeyword] = useState(null);
    const [deletingKeyword, setDeletingKeyword] = useState(null);

    const isRepair = group === 'repair';
    const groupName = isRepair ? 'กลุ่มงานแจ้งซ่อม' : 'กลุ่มงานร้องเรียน';

    // Theme Colors
    const badgeColor = isRepair
        ? 'bg-blue-600 text-white shadow-blue-200'
        : 'bg-orange-500 text-white shadow-orange-200';
    const borderFocusColor = isRepair ? 'focus:border-blue-500' : 'focus:border-orange-500';

    // Button Styles
    const addButtonStyle = isRepair
        ? 'bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1'
        : 'bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1';

    const saveButtonStyle = isRepair
        ? 'bg-blue-600 hover:bg-blue-700'
        : 'bg-orange-500 hover:bg-orange-600';

    const routePrefix = isRepair ? 'กลุ่มงานแจ้งซ่อม' : 'กลุ่มงานร้องเรียน';

    const form = useForm({
        type: group,
        keyword: '',
    });

    const editForm = useForm({
        keyword: '',
    });

    const deleteForm = useForm();

    // Debounce Search Effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only fetch if searchTerm changed from initial or current
            router.get(
                route(isRepair ? 'repair.keywords' : 'complaints.keywords'),
                { search: searchTerm },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                }
            );
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('keywords.personal.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const handleEdit = (keyword) => {
        setEditingKeyword(keyword);
        editForm.setData('keyword', keyword.keyword);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('keywords.personal.update', editingKeyword.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingKeyword(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (keyword) => {
        setDeletingKeyword(keyword);
    };

    const confirmDelete = () => {
        if (deletingKeyword) {
            deleteForm.delete(route('keywords.personal.destroy', deletingKeyword.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeletingKeyword(null);
                },
            });
        }
    };

    // Personal keywords filtering is still client-side or we can rely on server filtering if we want.
    // Given the controller update, personal keywords are also filtered by 'search'.
    // So we just use personalKeywords directly.
    const displayPersonal = personalKeywords;

    // Pagination Component
    const Pagination = ({ links }) => {
        if (!links || links.length <= 3) return null; // Hide if only 1 page (usually prev, 1, next)

        return (
            <div className="flex flex-wrap justify-center gap-1 mt-4 px-4 pb-4">
                {links.map((link, key) => (
                    link.url === null ? (
                        <div key={key} className="px-3 py-1 text-sm text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <button
                            key={key}
                            onClick={() => router.get(link.url, { search: searchTerm }, { preserveState: true, preserveScroll: true })}
                            className={`px-3 py-1 text-sm border rounded-md transition-colors ${link.active
                                ? `bg-gray-800 text-white border-gray-800 font-bold`
                                : `bg-white text-gray-600 border-gray-200 hover:bg-gray-50`
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`กำหนดคีย์เวิร์ดส่วนตัว - ${groupName}`} />

            <div className="py-10 bg-gray-50 min-h-screen font-['K2D']">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
                            <span>{routePrefix}</span>
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-gray-800">กำหนดคีย์เวิร์ดส่วนตัว</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">กำหนดคีย์เวิร์ดส่วนตัว</h1>
                            <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm tracking-wide w-fit ${badgeColor}`}>
                                {groupName}
                            </span>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">

                        {/* LEFT: Global List (Paginated) - HIDDEN on mobile */}
                        <div className="hidden md:flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-col h-full min-h-[500px]">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        รายการคีย์เวิร์ดกลาง
                                    </h2>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-600">
                                        แบบร่าง (Read Only)
                                    </span>
                                </div>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        placeholder="🔍 ค้นหาคีย์เวิร์ด..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto flex-1">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-500 w-20">ลำดับ</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-500">คีย์เวิร์ด</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {globalKeywords.data && globalKeywords.data.length > 0 ? (
                                            globalKeywords.data.map((keyword, index) => (
                                                <tr key={keyword.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-400 bg-gray-50/30">
                                                        {globalKeywords.from + index}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                        {keyword.keyword}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="px-6 py-12 text-center text-gray-400 text-sm">
                                                    ไม่มีข้อมูล
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Links */}
                            {globalKeywords.links && (
                                <div className="border-t border-gray-100 bg-gray-50/50">
                                    <Pagination links={globalKeywords.links} />
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Add + Personal List (Full width on mobile) */}
                        <div className="space-y-4 md:space-y-6 md:col-span-1">

                            {/* Add Form */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                    <div className={`p-1.5 rounded-md ${isRepair ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    เพิ่มคีย์เวิร์ดใหม่
                                </h2>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-3">
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-stretch">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={form.data.keyword}
                                                onChange={(e) => form.setData('keyword', e.target.value)}
                                                className="w-full h-11 sm:h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-all outline-none text-gray-800 text-sm sm:text-base font-medium placeholder-gray-400"
                                                placeholder="พิมพ์คำที่ต้องการ..."
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className={`h-11 sm:h-12 px-6 sm:px-8 text-white font-bold text-base sm:text-lg rounded-lg shadow-md transform transition-all whitespace-nowrap ${addButtonStyle} flex items-center justify-center gap-2`}
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                            เพิ่ม
                                        </button>
                                    </div>
                                    {form.errors.keyword && (
                                        <p className="text-xs sm:text-sm font-bold text-red-500 animate-pulse flex items-center gap-1">
                                            🚨 {form.errors.keyword}
                                        </p>
                                    )}
                                </form>
                            </div>

                            {/* Personal List */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px] sm:min-h-[400px] flex flex-col">
                                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-white">
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        รายการคีย์เวิร์ดของฉัน
                                        {displayPersonal.length > 0 && (
                                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-1">
                                                {displayPersonal.length} รายการ
                                            </span>
                                        )}
                                    </h2>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    {/* Mobile Card Layout */}
                                    <div className="sm:hidden divide-y divide-gray-100">
                                        {displayPersonal.length > 0 ? (
                                            displayPersonal.map((keyword, index) => (
                                                <div key={keyword.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <span className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                                                {index + 1}
                                                            </span>
                                                            <span className="text-sm font-semibold text-gray-800 truncate">
                                                                {keyword.keyword}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1.5 flex-shrink-0">
                                                            <button
                                                                onClick={() => handleEdit(keyword)}
                                                                className="w-8 h-8 flex items-center justify-center bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(keyword)}
                                                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-16 text-center text-gray-400 text-sm">
                                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                ยังไม่ได้เพิ่มคีย์เวิร์ด<br />
                                                <span className="text-xs text-gray-300">เพิ่มคีย์เวิร์ดแรกของคุณด้านบน</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Desktop Table Layout */}
                                    <table className="w-full hidden sm:table">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-4 py-4 text-center text-sm font-bold text-gray-500 w-16">ลำดับ</th>
                                                <th className="px-4 py-4 text-left text-sm font-bold text-gray-500">คีย์เวิร์ด</th>
                                                <th className="px-4 py-4 text-center text-sm font-bold text-gray-500 w-40">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {displayPersonal.length > 0 ? (
                                                displayPersonal.map((keyword, index) => (
                                                    <tr key={keyword.id} className="group hover:bg-yellow-50/50 transition-colors">
                                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-400 bg-gray-50/20">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </td>
                                                        <td className="px-4 py-4 text-base text-gray-800 font-semibold">
                                                            {keyword.keyword}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(keyword)}
                                                                    className="flex items-center justify-center px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-md hover:bg-yellow-100 hover:border-yellow-300 transition-all font-bold text-xs gap-1 shadow-sm"
                                                                >
                                                                    ✏️ แก้ไข
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(keyword)}
                                                                    className="flex items-center justify-center px-3 py-1.5 bg-white border border-gray-200 text-gray-400 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold text-xs gap-1 shadow-sm"
                                                                >
                                                                    🗑️ ลบ
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-20 text-center text-gray-400 text-base">
                                                        ยังไม่ได้เพิ่มคีย์เวิร์ด
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingKeyword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">แก้ไขคีย์เวิร์ด</h3>
                            <button onClick={() => setEditingKeyword(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">คีย์เวิร์ดที่ต้องการแก้ไข</label>
                            <input
                                type="text"
                                value={editForm.data.keyword}
                                onChange={(e) => editForm.setData('keyword', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg outline-none text-gray-800 font-medium ${borderFocusColor} transition-all mb-6`}
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingKeyword(null)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className={`flex-1 px-4 py-3 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all ${saveButtonStyle}`}
                                >
                                    {editForm.processing ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingKeyword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
                                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบ?</h3>
                            <p className="text-gray-600 mb-6">คุณแน่ใจหรือไม่ที่จะลบ <br /><span className="font-black text-black">"{deletingKeyword.keyword}"</span></p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeletingKeyword(null)} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">ยกเลิก</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition-colors">ลบข้อมูล</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
