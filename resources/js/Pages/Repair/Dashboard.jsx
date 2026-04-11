import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

export default function Dashboard({ auth, stats, chartData, statusPieData, urgentRepairs }) {

    // Helper for Status Badge Color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'รอดำเนินการ': return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'กำลังดำเนินการ': return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'รับเรื่อง': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'ปฏิเสธการดำเนินการ': return 'bg-red-100 text-red-700 border border-red-200';
            case 'เสร็จสิ้น': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Repair Dashboard" />

            <div className="py-6 sm:py-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/50">
                <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <nav className="hidden sm:block text-sm text-gray-500 mb-2">
                                <ol className="list-none p-0 inline-flex items-center gap-2">
                                    <li className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        กลุ่มงานแจ้งซ่อม
                                    </li>
                                    <li className="text-gray-300">/</li>
                                    <li className="font-semibold text-orange-600">หน้าหลัก</li>
                                </ol>
                            </nav>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                ภาพรวมงานแจ้งซ่อม
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">ติดตามและจัดการงานแจ้งซ่อมในระบบ</p>
                        </div>
                        <Link
                            href={route('repairs.index')}
                            className="hidden sm:inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            ดูรายการทั้งหมด
                        </Link>
                    </div>

                    {/* Stats Cards - Full Width */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Urgent Card */}
                        <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 sm:p-6 shadow-xl shadow-rose-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-rose-100 text-xs sm:text-sm font-medium uppercase tracking-wide">แจ้งซ่อมเร่งด่วน</p>
                                        <p className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">{stats.urgent}</p>
                                        <p className="text-rose-200 text-xs mt-1">รายการที่ต้องดำเนินการ</p>
                                    </div>
                                    <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* New Today Card */}
                        <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 sm:p-6 shadow-xl shadow-blue-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-xs sm:text-sm font-medium uppercase tracking-wide">แจ้งซ่อมใหม่วันนี้</p>
                                        <p className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">{stats.new_today}</p>
                                        <p className="text-blue-200 text-xs mt-1">รายการเข้าใหม่</p>
                                    </div>
                                    <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Card */}
                        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 sm:p-6 shadow-xl shadow-emerald-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-100 text-xs sm:text-sm font-medium uppercase tracking-wide">ซ่อมเสร็จแล้ว</p>
                                        <p className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">{stats.closed_month}</p>
                                        <p className="text-emerald-200 text-xs mt-1">เดือนนี้</p>
                                    </div>
                                    <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Card */}
                        <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 sm:p-6 shadow-xl shadow-orange-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-xs sm:text-sm font-medium uppercase tracking-wide">การแจ้งซ่อมทั้งหมด</p>
                                        <p className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">{stats.total}</p>
                                        <p className="text-orange-200 text-xs mt-1">รายการในระบบ</p>
                                    </div>
                                    <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section - Two Column */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        {/* Area Chart (3/5) */}
                        <div className="xl:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100/80 hover:shadow-2xl transition-shadow duration-500">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></span>
                                        แนวโน้มการแจ้งซ่อมรายเดือน
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">สถิติการแจ้งซ่อมตลอดปี {new Date().getFullYear() + 543}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <span className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></span>
                                    จำนวนแจ้งซ่อม
                                </div>
                            </div>
                            <div className="h-[320px] sm:h-[360px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            width={35}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                                fontSize: '14px',
                                                padding: '12px 16px'
                                            }}
                                            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#F97316"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            dot={{ r: 5, fill: '#F97316', strokeWidth: 3, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0, fill: '#EA580C' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart (2/5) */}
                        <div className="xl:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100/80 hover:shadow-2xl transition-shadow duration-500">
                            <div className="mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                                    สัดส่วนสถานะงาน
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">ภาพรวมสถานะการดำเนินการ</p>
                            </div>
                            <div className="h-[280px] sm:h-[320px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                            cornerRadius={8}
                                        >
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                                fontSize: '14px',
                                                padding: '12px 16px'
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={50}
                                            iconType="circle"
                                            iconSize={10}
                                            wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">{stats.total}</div>
                                    <div className="text-sm text-gray-500 font-medium">รายการ</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Urgent Repairs Section - Full Width */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50/50">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-lg shadow-rose-500/30">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                            รายการแจ้งซ่อมเร่งด่วน
                                        </h3>
                                        <p className="text-gray-500 text-sm">รายการที่ต้องดำเนินการโดยเร็ว (เร่งด่วนมาก)</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('repairs.index')}
                                    className="inline-flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-100 hover:border-rose-200 transition-all hover:shadow"
                                >
                                    ดูทั้งหมด
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block lg:hidden divide-y divide-gray-100">
                            {urgentRepairs.length > 0 ? (
                                urgentRepairs.map((item) => (
                                    <div key={item.id} className="p-5 hover:bg-rose-50/50 transition-colors">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">{item.id}</span>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
                                                    เร่งด่วนมาก
                                                </span>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3">{item.title}</h4>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {item.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {item.created_at}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/repairs/status?ids[]=${item.id}`}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            เปลี่ยนสถานะ
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-700 text-lg">ไม่มีรายการเร่งด่วน 🎉</p>
                                    <p className="text-gray-500 mt-2">ยินดีด้วย! ไม่มีงานซ่อมเร่งด่วนที่ต้องดำเนินการ</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">เลขที่แจ้ง</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">หัวข้อ</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">สถานที่</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ความเร่งด่วน</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">สถานะ</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">การดำเนินการ</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">วัน-เวลา</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {urgentRepairs.length > 0 ? (
                                        urgentRepairs.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-orange-50/50 transition-colors group">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-orange-600 bg-orange-50 group-hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">{item.id}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{item.title}</div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        {item.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
                                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                        เร่งด่วนมาก
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusBadge(item.status)}`}>
                                                        • {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <Link
                                                        href={`/repairs/status?ids[]=${item.id}`}
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        เปลี่ยนสถานะ
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {item.created_at}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-16 text-center">
                                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="font-bold text-gray-700 text-xl">ไม่มีรายการเร่งด่วน 🎉</p>
                                                <p className="text-gray-500 mt-2 text-base">ยินดีด้วย! ไม่มีงานซ่อมเร่งด่วนที่ต้องดำเนินการ</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
