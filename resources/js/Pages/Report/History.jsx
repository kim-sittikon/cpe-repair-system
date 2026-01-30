import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyRequests({ auth, history }) {

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="รายการคำร้องของฉัน" />

            <div className="py-6 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-[#F59E0B] pl-4 mb-4">
                                    รายการคำร้องของฉัน
                                </h2>
                                <Link href={route('report.create')} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-200">
                                    + แจ้งปัญหาใหม่
                                </Link>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {history.length > 0 ? (
                                    history.map((item, index) => (
                                        <div key={index} className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                                            {/* Header Row: Type + Status */}
                                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                                {item.type === 'repair' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                                        </div>
                                                        <span className="text-orange-600 font-bold text-sm">แจ้งซ่อม</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                        </div>
                                                        <span className="text-indigo-600 font-bold text-sm">ร้องเรียน</span>
                                                    </div>
                                                )}
                                                <span className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                                                    รับเรื่อง
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-gray-800 text-base mb-3 line-clamp-2 leading-relaxed">
                                                {item.title}
                                            </h3>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gray-50 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        สถานที่
                                                    </div>
                                                    <p className="text-gray-800 text-sm font-medium truncate">
                                                        {item.building?.building_name || '-'}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        วันที่
                                                    </div>
                                                    <p className="text-gray-800 text-sm font-medium">
                                                        {new Date(item.created_at).toLocaleDateString('th-TH')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <p className="text-gray-400 text-lg font-medium">ยังไม่มีรายการแจ้งปัญหา</p>
                                        <p className="text-gray-400 text-sm mt-1">กดปุ่ม "แจ้งปัญหาใหม่" เพื่อเริ่มต้น</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">ประเภท</th>
                                            <th scope="col" className="px-6 py-3">หัวเรื่อง</th>
                                            <th scope="col" className="px-6 py-3">สถานที่</th>
                                            <th scope="col" className="px-6 py-3">วันที่</th>
                                            <th scope="col" className="px-6 py-3">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length > 0 ? (
                                            history.map((item, index) => (
                                                <tr key={index} className="bg-white border-b hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.type === 'repair' ? (
                                                            <span className="text-orange-600 font-semibold inline-flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                                                แจ้งซ่อม
                                                            </span>
                                                        ) : (
                                                            <span className="text-indigo-600 font-semibold inline-flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                                ร้องเรียน
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                                                        {item.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.building?.building_name || '-'} / {item.room?.room_name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Date(item.created_at).toLocaleDateString('th-TH')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full border border-blue-200 whitespace-nowrap">รับเรื่อง</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                                    ยังไม่มีรายการแจ้งปัญหา
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
        </AuthenticatedLayout>
    );
}
