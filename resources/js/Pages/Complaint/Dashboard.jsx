import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard({ auth, stats, chartData, statusPieData, urgentComplaints }) {

    // Helper for Status Badge Color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'รอดำเนินการ': return 'bg-blue-100 text-blue-800';
            case 'กำลังดำเนินการ': return 'bg-yellow-100 text-yellow-800';
            case 'เสร็จสิ้น': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Complaint Dashboard" />

            <div className="py-4">
                <div className="max-w-[90%] mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* 1. Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Red Card: Urgent */}
                        {/* Red Card: Urgent */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm font-medium">คำร้องเรียนเร่งด่วน</div>
                                    <div className="text-4xl font-bold mt-2 text-rose-500">{stats.urgent}</div>
                                </div>
                                <div className="p-3 bg-rose-100 rounded-xl text-rose-500 animate-pulse">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Blue Card: New Today */}
                        {/* Blue Card: New Today */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm font-medium">คำร้องเรียนใหม่วันนี้</div>
                                    <div className="text-4xl font-bold mt-2 text-blue-500">{stats.new_today}</div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl text-blue-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Green Card: Closed Month */}
                        {/* Green Card: Closed Month */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm font-medium">ปิดงานแล้ว (เดือนนี้)</div>
                                    <div className="text-4xl font-bold mt-2 text-emerald-500">{stats.closed_month}</div>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Purple Card: Total */}
                        {/* Purple Card: Total */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm font-medium">คำร้องเรียนทั้งหมด</div>
                                    <div className="text-4xl font-bold mt-2 text-indigo-500">{stats.total}</div>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Charts Section (Grid Layout) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Line Chart (2/3) */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">แนวโน้มคำร้องเรียนรายเดือน</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart (1/3) */}
                        <div className="bg-white overflow-hidden shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-emerald-500 pl-3">สัดส่วนสถานะงาน</h3>
                            <div className="h-[300px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text for Donut */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                                    <div className="text-3xl font-bold text-gray-800">100%</div>
                                    <div className="text-xs text-gray-400">ภาพรวม</div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 3. Urgent Complaints Table */}
                    < div className="bg-white overflow-hidden shadow-lg sm:rounded-2xl p-8 border border-gray-100" >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-red-500 pl-3">รายการคำร้องเร่งด่วน</h3>
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่แจ้ง</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หัวข้อที่แจ้ง</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ความเร่งด่วน</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เปลี่ยนสถานะ</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วัน-เวลา</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {urgentComplaints.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="max-w-xs truncate">{item.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                                                    {item.urgency}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                    • {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-3 rounded shadow-sm transition-colors">
                                                    เปลี่ยนสถานะ
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {item.created_at}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div >

                </div >
            </div >
        </AuthenticatedLayout >
    );
}
