import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function ManageKeywords({ auth, keywords = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [editingKeyword, setEditingKeyword] = useState(null);
    const [deletingKeyword, setDeletingKeyword] = useState(null);

    const form = useForm({
        type: '',
        scope: 'global', // Admin always adds Global
        keyword: '',
    });

    const editForm = useForm({
        type: '',
        scope: '',
        keyword: '',
    });

    const deleteForm = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('admin.keywords.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const handleEdit = (keyword) => {
        setEditingKeyword(keyword);
        editForm.setData({
            type: keyword.type,
            scope: keyword.scope || 'personal', // Handle legacy data
            keyword: keyword.keyword,
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.keywords.update', editingKeyword.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingKeyword(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (keyword) => {
        console.log('Delete clicked for keyword:', keyword);
        setDeletingKeyword(keyword);
    };

    const confirmDelete = () => {
        if (deletingKeyword) {
            console.log('Confirming delete for ID:', deletingKeyword.id);

            deleteForm.delete(route('admin.keywords.destroy', deletingKeyword.id), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Delete successful');
                    setDeletingKeyword(null);
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                },
            });
        }
    };

    // Filter and search logic
    const filteredKeywords = keywords.filter((keyword) => {
        const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || keyword.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="จัดการคีย์เวิร์ด" />

            <div className="py-8 bg-gray-50 min-h-screen font-['K2D']">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-600 mb-4">
                        <span>ระบบหลัก</span> / <span className="font-semibold text-gray-800">กำหนดคีย์เวิร์ด</span>
                    </div>

                    {/* Page Title */}
                    <h1 className="text-3xl font-semibold text-gray-800 mb-8">กำหนดคีย์เวิร์ด</h1>

                    {/* Add Keyword Form */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-8 bg-[#F59E0B] rounded-full"></div>
                            <h2 className="text-xl font-semibold text-gray-800">เพิ่มคีย์เวิร์ดใหม่</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="w-full md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ประเภทกลุ่มงาน <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">เลือกประเภทกลุ่มงาน</option>
                                    <option value="repair">กลุ่มงานแจ้งซ่อม</option>
                                    <option value="complaint">กลุ่มงานร้องเรียน</option>
                                </select>
                                {form.errors.type && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.type}</p>
                                )}
                            </div>



                            <div className="flex-grow w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    คีย์เวิร์ด <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="ระบุคีย์เวิร์ดที่ต้องการเพิ่ม เช่น เครื่องคอมพิวเตอร์เสีย"
                                    value={form.data.keyword}
                                    onChange={(e) => form.setData('keyword', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                    required
                                />
                                {form.errors.keyword && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.keyword}</p>
                                )}
                            </div>

                            <div className="w-full md:w-auto">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full md:w-auto px-6 py-2.5 bg-[#F59E0B] hover:bg-[#d97706] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {form.processing ? 'กำลังเพิ่ม...' : 'เพิ่มคีย์เวิร์ด'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search Box */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🔍 ค้นหาคีย์เวิร์ด
                                </label>
                                <input
                                    type="text"
                                    placeholder="พิมพ์เพื่อค้นหา..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🎯 กรองตามประเภท
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="repair">กลุ่มงานแจ้งซ่อม</option>
                                    <option value="complaint">กลุ่มงานร้องเรียน</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Keywords Table */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-[#F59E0B] rounded-full"></div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    รายการคีย์เวิร์ดกลาง ({filteredKeywords.length} รายการ)
                                </h2>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">ลำดับ</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">คีย์เวิร์ด</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-32">ขอบเขต</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-48">ประเภทกลุ่มงาน</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-48">การจัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredKeywords.length > 0 ? (
                                        filteredKeywords.map((keyword, index) => (
                                            <tr key={keyword.id} className="hover:bg-orange-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-700">
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-800 font-medium">{keyword.keyword}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${keyword.scope === 'global'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                    >
                                                        {keyword.scope === 'global' ? '🌐 ส่วนกลาง' : '👤 ส่วนตัว'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${keyword.type === 'repair'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}
                                                    >
                                                        {keyword.type === 'repair' ? '🔧 แจ้งซ่อม' : '📢 ร้องเรียน'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleEdit(keyword)}
                                                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                                                        >
                                                            ✏️ แก้ไข
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(keyword)}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                                                        >
                                                            🗑️ ลบ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="text-6xl text-gray-300">📭</div>
                                                    <p className="text-gray-500 text-lg">
                                                        {searchTerm || filterType !== 'all'
                                                            ? 'ไม่พบคีย์เวิร์ดที่ค้นหา'
                                                            : 'ยังไม่มีคีย์เวิร์ดในระบบ'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >

            {/* Edit Modal */}
            {
                editingKeyword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[#F59E0B] to-[#d97706] px-6 py-4">
                                <h3 className="text-xl font-semibold text-white">แก้ไขคีย์เวิร์ด</h3>
                            </div>
                            <form onSubmit={handleUpdate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ประเภทกลุ่มงาน
                                    </label>
                                    <select
                                        value={editForm.data.type}
                                        onChange={(e) => editForm.setData('type', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                        required
                                    >
                                        <option value="repair">กลุ่มงานแจ้งซ่อม</option>
                                        <option value="complaint">กลุ่มงานร้องเรียน</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ขอบเขต
                                    </label>
                                    <select
                                        value={editForm.data.scope}
                                        onChange={(e) => editForm.setData('scope', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                        required
                                    >
                                        <option value="personal">ส่วนตัว</option>
                                        <option value="global">ส่วนกลาง</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        คีย์เวิร์ด
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.keyword}
                                        onChange={(e) => editForm.setData('keyword', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingKeyword(null)}
                                        className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="flex-1 px-4 py-2.5 bg-[#F59E0B] hover:bg-[#d97706] text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                deletingKeyword && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header with Icon */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 text-center border-b-4 border-red-500">
                                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500 mb-4 shadow-lg">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    คุณแน่ใจหรือไม่ว่าต้องการลบคีย์เวิร์ดนี้?
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-6 bg-white">
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">คีย์เวิร์ด:</span>
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 mb-3">
                                        {deletingKeyword.keyword}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">ประเภท:</span>{' '}
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${deletingKeyword.type === 'repair'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {deletingKeyword.type === 'repair' ? '🔧 แจ้งซ่อม' : '📢 ร้องเรียน'}
                                        </span>
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                                    >
                                        ✓ ยืนยันลบ
                                    </button>
                                    <button
                                        onClick={() => setDeletingKeyword(null)}
                                        className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-lg"
                                    >
                                        ✕ ยกเลิก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </AuthenticatedLayout >
    );
}
