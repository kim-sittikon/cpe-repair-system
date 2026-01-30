import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth, stats, chartData, statusPieData, urgentComplaints }) {

    const [hoveredCard, setHoveredCard] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile screen
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Helper for Status Badge Color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'รอดำเนินการ': return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'กำลังดำเนินการ': return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'เสร็จสิ้น': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    // Get current date info
    const currentDate = new Date();
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const dateString = `${currentDate.getDate()} ${thaiMonths[currentDate.getMonth()]} ${currentDate.getFullYear() + 543}`;

    // Stats cards configuration
    const statsCards = [
        {
            id: 'urgent',
            title: 'คำร้องเรียนเร่งด่วน',
            value: stats.urgent,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            gradient: 'from-rose-500 to-pink-600',
            bgLight: 'bg-rose-50',
            textColor: 'text-rose-600',
            pulse: true,
        },
        {
            id: 'new',
            title: 'คำร้องใหม่วันนี้',
            value: stats.new_today,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            gradient: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            id: 'closed',
            title: 'ปิดงานแล้ว (เดือนนี้)',
            value: stats.closed_month,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-emerald-500 to-teal-500',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600',
        },
        {
            id: 'total',
            title: 'คำร้องทั้งหมด',
            value: stats.total,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            gradient: 'from-violet-500 to-purple-600',
            bgLight: 'bg-violet-50',
            textColor: 'text-violet-600',
        },
    ];

    // Filter out status with value 0 and calculate totals
    const filteredStatusPieData = statusPieData.filter(item => item.value > 0);
    const total = statusPieData.reduce((sum, item) => sum + item.value, 0);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Complaint Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50">
                <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                    {/* Header Section */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard ร้องเรียน</h1>
                                        <p className="text-sm text-gray-500">กลุ่มงานรับเรื่องร้องเรียน • ภาควิชาวิศวกรรมคอมพิวเตอร์</p>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600">{dateString}</span>
                                </div>
                                <Link
                                    href={route('complaints.index')}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 font-medium text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    ดูรายการทั้งหมด
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {statsCards.map((card, index) => (
                            <div
                                key={card.id}
                                className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
                                onMouseEnter={() => setHoveredCard(card.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Decorative Pattern */}
                                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <circle cx="80" cy="20" r="40" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                        <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${card.bgLight} group-hover:bg-white/20 transition-colors duration-300 shadow-sm`}>
                                            <div className={`${card.textColor} group-hover:text-white transition-colors duration-300 ${card.pulse ? 'animate-pulse' : ''} scale-75 sm:scale-100`}>
                                                {card.icon}
                                            </div>
                                        </div>
                                        {card.pulse && (
                                            <span className="flex h-2 w-2 sm:h-3 sm:w-3">
                                                <span className="animate-ping absolute inline-flex h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-rose-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-rose-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-500 group-hover:text-white/80 transition-colors duration-300 truncate">
                                            {card.title}
                                        </p>
                                        <div className="flex items-end gap-2 sm:gap-3">
                                            <p className={`text-3xl sm:text-5xl font-black ${card.textColor} group-hover:text-white transition-colors duration-300 tracking-tight`}>
                                                {card.value}
                                            </p>
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-400 group-hover:text-white/60 mb-1 sm:mb-2 transition-colors duration-300">
                                                รายการ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Decorative Bar */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 sm:mb-8">
                        {/* Area Chart */}
                        <div className="xl:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-10 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">แนวโน้มคำร้องเรียนรายเดือน</h3>
                                        <p className="text-sm text-gray-400">สถิติย้อนหลัง 12 เดือน</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                                        <span className="text-orange-700 font-medium">จำนวนคำร้องเรียน</span>
                                    </span>
                                </div>
                            </div>
                            <div className="h-[320px] sm:h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{
                                            top: 10,
                                            right: 15,
                                            left: 0,
                                            bottom: 5
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: isMobile ? 10 : 12, fontWeight: 500 }}
                                            dy={isMobile ? 5 : 10}
                                            interval={0}
                                            angle={isMobile ? -45 : 0}
                                            textAnchor={isMobile ? "end" : "middle"}
                                            height={isMobile ? 60 : 30}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            width={30}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                                                padding: '16px 20px',
                                                fontSize: '14px'
                                            }}
                                            labelStyle={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '15px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#F97316"
                                            strokeWidth={3}
                                            fill="url(#colorValue)"
                                            dot={{ r: 5, fill: '#F97316', strokeWidth: 3, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0, fill: '#EA580C' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-10 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">สัดส่วนสถานะงาน</h3>
                                    <p className="text-sm text-gray-400">ภาพรวมทั้งหมด</p>
                                </div>
                            </div>
                            <div className="h-[220px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={filteredStatusPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {filteredStatusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                                fontSize: '13px',
                                                padding: '12px 16px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="text-3xl font-black text-gray-800">{total}</div>
                                    <div className="text-xs text-gray-400 font-medium">งานทั้งหมด</div>
                                </div>
                            </div>
                            {/* Legend */}
                            <div className="mt-6 space-y-3">
                                {filteredStatusPieData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: item.color }}></span>
                                            <span className="text-gray-700 font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-800">{item.value}</span>
                                            <span className="text-xs font-medium text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color }}>
                                                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Urgent Complaints Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-orange-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-100 rounded-xl">
                                        <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">รายการคำร้องเร่งด่วน</h3>
                                        <p className="text-xs text-gray-500">คำร้องที่ต้องดำเนินการโดยเร็ว</p>
                                    </div>
                                </div>
                                {urgentComplaints.length > 0 && (
                                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                        </span>
                                        {urgentComplaints.length} รายการ
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Table - Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">เลขที่</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">หัวข้อที่แจ้ง</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">ความเร่งด่วน</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">วัน-เวลา</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {urgentComplaints.length > 0 ? (
                                        urgentComplaints.map((item) => (
                                            <tr key={item.id} className="hover:bg-orange-50/30 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-gray-800">{item.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700 font-medium max-w-xs truncate">{item.title}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-200">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                        </span>
                                                        {item.urgency}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {item.created_at}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/complaints/status?ids[]=${item.id}`}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        ดูรายละเอียด
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-emerald-100 rounded-full mb-4">
                                                        <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500 font-medium">ไม่มีคำร้องเร่งด่วน</p>
                                                    <p className="text-sm text-gray-400 mt-1">ทุกอย่างเรียบร้อยดี!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards - Mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {urgentComplaints.length > 0 ? (
                                urgentComplaints.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-orange-50/30 transition-colors">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-gray-800">{item.id}</span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                                                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                                                        {item.urgency}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 font-medium truncate">{item.title}</p>
                                            </div>
                                            <span className={`flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {item.created_at}
                                            </span>
                                            <Link
                                                href={`/complaints/status?ids[]=${item.id}`}
                                                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                            >
                                                ดูรายละเอียด
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="inline-flex p-3 bg-emerald-100 rounded-full mb-3">
                                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">ไม่มีคำร้องเร่งด่วน</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
