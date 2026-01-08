export default function AdminDashboardContent({ stats, recentActivity }) {
    const getActionBadge = (action) => {
        const badges = {
            created: 'bg-green-100 text-green-700',
            updated: 'bg-blue-100 text-blue-700',
            deleted: 'bg-red-100 text-red-700',
        };

        const labels = {
            created: '✨ สร้าง',
            updated: '✏️ แก้ไข',
            deleted: '🗑️ ลบ',
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badges[action]}`}>
                {labels[action]}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        return type === 'repair' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                🔧 แจ้งซ่อม
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                📢 ร้องเรียน
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">ผู้ใช้งานทั้งหมด</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-full">
                            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Buildings Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">อาคารทั้งหมด</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.buildings}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-full">
                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Rooms Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">ห้องทั้งหมด</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rooms}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Keywords Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">คีย์เวิร์ดทั้งหมด</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.keywords}</p>
                        </div>
                        <div className="bg-orange-100 p-4 rounded-full">
                            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">ความเคลื่อนไหวข้อมูลหลัก (Recent Activity)</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">การกระทำ</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">รายการ</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ประเภท</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">โดย</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">เวลา</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentActivity && recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <tr key={activity.id + '-' + index} className="hover:bg-orange-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {getActionBadge(activity.action)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{activity.keyword}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getTypeBadge(activity.type)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {activity.actor_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {activity.time}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-6xl text-gray-300">📊</div>
                                            <p className="text-gray-500 text-lg">ยังไม่มีความเคลื่อนไหว</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
