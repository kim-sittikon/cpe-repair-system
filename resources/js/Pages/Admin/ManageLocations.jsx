import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function ManageLocations({ auth, buildings = [], rooms = [] }) {
    const [activeTab, setActiveTab] = useState('buildings');

    const buildingForm = useForm({
        building_name: '',
    });

    const roomForm = useForm({
        building_id: '',
        room_name: '',
    });

    const handleAddBuilding = (e) => {
        e.preventDefault();
        buildingForm.post(route('admin.buildings.store'), {
            preserveScroll: true,
            onSuccess: () => buildingForm.reset(),
        });
    };

    const handleAddRoom = (e) => {
        e.preventDefault();
        roomForm.post(route('admin.rooms.store'), {
            preserveScroll: true,
            onSuccess: () => roomForm.reset(),
        });
    };

    const [deletingItem, setDeletingItem] = useState(null);
    const deleteForm = useForm();

    const handleDeleteBuilding = (building) => {
        deleteForm.clearErrors();
        setDeletingItem({ type: 'building', data: building });
    };

    const handleDeleteRoom = (room) => {
        deleteForm.clearErrors();
        setDeletingItem({ type: 'room', data: room });
    };

    const confirmDelete = () => {
        if (!deletingItem) return;

        const { type, data } = deletingItem;
        const routeName = type === 'building' ? 'admin.buildings.destroy' : 'admin.rooms.destroy';
        const id = type === 'building' ? data.building_id : data.room_id;

        deleteForm.delete(route(routeName, id), {
            preserveScroll: true,
            onSuccess: () => setDeletingItem(null),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="กำหนดที่ตั้ง" />

            <div className="py-8 bg-gray-50 min-h-screen font-['K2D']">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-600 mb-4">
                        <span>ระบบหลัก</span> / <span className="font-semibold">กำหนดที่ตั้ง</span>
                    </div>

                    {/* Page Title */}
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">กำหนดที่ตั้ง</h1>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-300 mb-6">
                        <button
                            onClick={() => setActiveTab('buildings')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'buildings'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            กำหนดที่ตั้ง
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'rooms'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            เพิ่มห้อง
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {activeTab === 'buildings' && (
                            <div>
                                {/* Add Building Form */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium mb-4">อาคารและชั้น</h3>
                                    <form onSubmit={handleAddBuilding} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="เช่น CPE1 ชั้น 1"
                                                value={buildingForm.data.building_name}
                                                onChange={(e) => buildingForm.setData('building_name', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={buildingForm.processing}
                                            className="px-8 py-2 bg-[#F59E0B] hover:bg-[#d97706] text-white font-medium rounded-md transition-colors disabled:opacity-50"
                                        >
                                            เพิ่ม
                                        </button>
                                    </form>
                                </div>

                                {/* Buildings Table */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">รายการอาคารและชั้น</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">ลำดับ</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">อาคาร</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-center">การจัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {buildings.length > 0 ? (
                                                    buildings.map((building, index) => (
                                                        <tr key={building.building_id} className="hover:bg-gray-50">
                                                            <td className="border border-gray-300 px-4 py-2">{String(index + 1).padStart(2, '0')}</td>
                                                            <td className="border border-gray-300 px-4 py-2">{building.building_name}</td>
                                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                                <button
                                                                    onClick={() => handleDeleteBuilding(building)}
                                                                    className="px-4 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-sm font-medium"
                                                                >
                                                                    ลบอาคาร
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                            ไม่มีข้อมูลอาคาร
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rooms' && (
                            <div>
                                {/* Add Room Form */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium mb-4">อาคารและชั้น</h3>
                                    <form onSubmit={handleAddRoom} className="flex flex-col md:flex-row md:items-end gap-4">
                                        <div className="w-full md:w-1/3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                อาคารและชั้น
                                            </label>
                                            <select
                                                value={roomForm.data.building_id}
                                                onChange={(e) => roomForm.setData('building_id', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                                required
                                            >
                                                <option value="">เลือกอาคารและชั้น</option>
                                                {buildings.map((building) => (
                                                    <option key={building.building_id} value={building.building_id}>
                                                        {building.building_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex-grow w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ระบุห้องที่ต้องการกำหนด
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="เช่น 16105"
                                                value={roomForm.data.room_name}
                                                onChange={(e) => roomForm.setData('room_name', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div className="w-full md:w-auto">
                                            <button
                                                type="submit"
                                                disabled={roomForm.processing}
                                                className="w-full md:w-auto px-8 py-2 bg-[#F59E0B] hover:bg-[#d97706] text-white font-medium rounded-md transition-colors disabled:opacity-50 whitespace-nowrap"
                                            >
                                                เพิ่ม
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Rooms Table */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">รายการอาคารและห้อง</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">ลำดับ</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">อาคาร</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">ห้อง</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-center">การจัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rooms.length > 0 ? (
                                                    rooms.map((room, index) => (
                                                        <tr key={room.room_id} className="hover:bg-gray-50">
                                                            <td className="border border-gray-300 px-4 py-2">{String(index + 1).padStart(2, '0')}</td>
                                                            <td className="border border-gray-300 px-4 py-2">{room.building?.building_name}</td>
                                                            <td className="border border-gray-300 px-4 py-2">{room.room_name}</td>
                                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                                <button
                                                                    onClick={() => handleDeleteRoom(room)}
                                                                    className="px-4 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-sm font-medium"
                                                                >
                                                                    ลบห้อง
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                            ไม่มีข้อมูลห้อง
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
                        {/* Header with Icon */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 text-center border-b-4 border-red-500">
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500 mb-4 shadow-lg">
                                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {deletingItem.type === 'building' ? 'ลบอาคาร?' : 'ลบห้อง?'}
                            </h3>
                            <p className="text-gray-600 mt-2">
                                คุณแน่ใจหรือไม่ว่าต้องการลบ <span className="font-bold text-red-600">"{deletingItem.type === 'building' ? deletingItem.data.building_name : deletingItem.data.room_name}"</span> ?
                            </p>
                        </div>

                        {/* Content & Buttons */}
                        <div className="p-6 bg-white">
                            {deleteForm.errors.error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {deleteForm.errors.error}
                                </div>
                            )}

                            <p className="text-sm text-gray-500 text-center mb-6">
                                การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลที่เกี่ยวข้องอาจได้รับผลกระทบ
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteForm.processing}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleteForm.processing ? 'กำลังลบ...' : '✓ ยืนยันลบ'}
                                </button>
                                <button
                                    onClick={() => setDeletingItem(null)}
                                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
                                >
                                    ✕ ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
