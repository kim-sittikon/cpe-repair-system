import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function MyJobs({ auth, mySteps }) {
    const [selectedStep, setSelectedStep] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openStepModal = (step) => {
        setSelectedStep(step);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStep(null);
    };
    const getStatusConfig = (status) => {
        const statusMap = {
            'pending': {
                text: 'รอดำเนินการ',
                bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
                textColor: 'text-orange-700',
                borderColor: 'border-orange-200',
                dotColor: 'bg-orange-500',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            },
            'in_progress': {
                text: 'กำลังดำเนินการ',
                bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
                textColor: 'text-blue-700',
                borderColor: 'border-blue-200',
                dotColor: 'bg-blue-500',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                )
            },
            'completed': {
                text: 'เสร็จสิ้น',
                bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
                textColor: 'text-green-700',
                borderColor: 'border-green-200',
                dotColor: 'bg-green-500',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            },
            'rejected': {
                text: 'ปฏิเสธ',
                bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
                textColor: 'text-red-700',
                borderColor: 'border-red-200',
                dotColor: 'bg-red-500',
                icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            },
        };
        return statusMap[status] || statusMap['pending'];
    };

    const getActionConfig = (action) => {
        if (action === 'act') {
            return {
                text: 'ดำเนินการ',
                icon: '🔧',
                bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
                description: 'ต้องลงมือปฏิบัติ'
            };
        }
        return {
            text: 'อนุมัติ',
            icon: '✓',
            bgColor: 'bg-gradient-to-r from-purple-500 to-violet-600',
            description: 'ต้องตรวจสอบและอนุมัติ'
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pendingCount = mySteps.data.filter(s => s.status === 'pending').length;
    const inProgressCount = mySteps.data.filter(s => s.status === 'in_progress').length;
    const completedCount = mySteps.data.filter(s => s.status === 'completed' || s.status === 'done').length;

    // Filter เฉพาะงานที่ยังไม่เสร็จ
    const activeSteps = mySteps.data.filter(s => s.status !== 'completed' && s.status !== 'done');

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ใบงานของฉัน" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Premium Header */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

                        <div className="relative px-8 py-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white tracking-tight">ใบงานของฉัน</h1>
                                        <p className="text-blue-100 mt-1 text-lg">งานที่ได้รับมอบหมายให้ดำเนินการหรืออนุมัติ</p>
                                    </div>
                                </div>

                                {/* Quick Stats in Header */}
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <p className="text-3xl font-bold text-white">{pendingCount}</p>
                                        <p className="text-xs text-blue-100 font-medium">รอดำเนินการ</p>
                                    </div>
                                    <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <p className="text-3xl font-bold text-white">{inProgressCount}</p>
                                        <p className="text-xs text-blue-100 font-medium">กำลังทำ</p>
                                    </div>
                                    <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <p className="text-3xl font-bold text-white">{completedCount}</p>
                                        <p className="text-xs text-blue-100 font-medium">ฉันทำเสร็จ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6 lg:hidden">
                        <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                                <p className="text-xs text-gray-500">รอดำเนินการ</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                                <p className="text-xs text-gray-500">กำลังทำ</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                                <p className="text-xs text-gray-500">ฉันทำเสร็จ</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
                        {activeSteps.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่มีงานที่รอดำเนินการ</h3>
                                <p className="text-gray-500 max-w-md mx-auto">ยินดีด้วย! คุณทำงานที่ได้รับมอบหมายเสร็จสิ้นแล้วทั้งหมด</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full table-fixed">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50">
                                                <th className="w-[22%] px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ขั้นตอน</th>
                                                <th className="w-[18%] px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ใบงาน</th>
                                                <th className="w-[12%] px-3 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">จำนวนขั้นตอน</th>
                                                <th className="w-[12%] px-3 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">อยู่ในขั้นตอนที่</th>
                                                <th className="w-[14%] px-3 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">มอบหมายเมื่อ</th>
                                                <th className="w-[10%] px-3 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">สถานะ</th>
                                                <th className="w-[12%] px-3 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {activeSteps.map((step, index) => {
                                                const status = getStatusConfig(step.status);
                                                const action = getActionConfig(step.action);
                                                const totalSteps = step.job?.job_steps?.length || 0;
                                                return (
                                                    <tr
                                                        key={step.jobstep_id}
                                                        className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 ${step.status === 'pending' ? 'bg-orange-50/30' : ''
                                                            }`}
                                                    >
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative flex-shrink-0">
                                                                    <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}>
                                                                        {step.step_number}
                                                                    </div>
                                                                    {step.status === 'pending' && (
                                                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => openStepModal(step)}
                                                                    className="text-left group min-w-0 flex-1"
                                                                >
                                                                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{step.step_name}</div>
                                                                    <div className="text-xs text-blue-500 group-hover:text-blue-700 flex items-center gap-1 mt-0.5">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        ดูรายละเอียด
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="font-semibold text-gray-900 text-sm truncate">{step.job?.name}</div>
                                                                    <div className="text-xs text-orange-600 font-medium">JOB-{String(step.job_id).padStart(4, '0')}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* จำนวนขั้นตอน */}
                                                        <td className="px-3 py-4 text-center">
                                                            <div className="inline-flex flex-col items-center">
                                                                <span className="text-2xl font-bold text-purple-600">{totalSteps}</span>
                                                                <span className="text-xs text-purple-400">ขั้นตอน</span>
                                                            </div>
                                                        </td>
                                                        {/* อยู่ในขั้นตอนที่ */}
                                                        <td className="px-3 py-4 text-center">
                                                            <div className="inline-flex flex-col items-center">
                                                                <span className="text-2xl font-bold text-blue-600">{step.step_number}</span>
                                                                <span className="text-xs text-blue-400">ขั้นตอนที่</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            <div className="text-sm text-gray-600 whitespace-nowrap">{formatDate(step.created_at)}</div>
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${status.bgColor} ${status.textColor} ${status.borderColor}`}>
                                                                <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`}></span>
                                                                <span className="font-semibold text-xs whitespace-nowrap">{status.text}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            <Link
                                                                href={route('repairs.jobs.show', step.job_id)}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-2 ${action.bgColor} text-white text-xs font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md whitespace-nowrap`}
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                </svg>
                                                                {step.action === 'act' ? 'ดำเนินการ' : 'ตรวจสอบ'}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="lg:hidden divide-y divide-gray-100">
                                    {activeSteps.map((step) => {
                                        const status = getStatusConfig(step.status);
                                        const action = getActionConfig(step.action);
                                        const totalSteps = step.job?.job_steps?.length || 0;
                                        const progressPercent = totalSteps > 0 ? Math.round((step.step_number / totalSteps) * 100) : 0;
                                        return (
                                            <div key={step.jobstep_id} className={`p-5 ${step.status === 'pending' ? 'bg-orange-50/50' : ''}`}>
                                                <div className="flex items-start gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <div className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                                            {step.step_number}
                                                        </div>
                                                        {step.status === 'pending' && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-600">
                                                                ขั้นตอน {step.step_number}/{totalSteps}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${status.bgColor} ${status.textColor} ${status.borderColor}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
                                                                <span className="text-xs font-semibold">{status.text}</span>
                                                            </span>
                                                        </div>
                                                        <h3 className="font-bold text-gray-900 text-lg truncate">{step.step_name}</h3>
                                                        <p className="text-sm text-gray-500 mt-0.5">{step.job?.name} • <span className="text-orange-600 font-medium">JOB-{String(step.job_id).padStart(4, '0')}</span></p>

                                                        {/* Progress Bar */}
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                                    style={{ width: `${progressPercent}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-400">{progressPercent}%</span>
                                                        </div>

                                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            มอบหมายเมื่อ: {formatDate(step.created_at)}
                                                        </p>
                                                        <Link
                                                            href={route('repairs.jobs.show', step.job_id)}
                                                            className={`inline-flex items-center gap-2 mt-3 px-4 py-2 ${action.bgColor} text-white text-sm font-bold rounded-lg hover:shadow-md transition-all`}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                            {step.action === 'act' ? 'ดำเนินการ' : 'ตรวจสอบ'}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        {mySteps.last_page > 1 && (
                            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-center gap-2">
                                {mySteps.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${link.active
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                            : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Step Detail Modal */}
            {showModal && selectedStep && (
                <div className="fixed inset-0 z-50 overflow-y-auto" onClick={closeModal}>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"></div>

                        <div
                            className="relative inline-block w-full max-w-lg p-0 overflow-hidden text-left align-bottom bg-white rounded-2xl shadow-2xl transform transition-all sm:my-8 sm:align-middle"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                            {selectedStep.step_number}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{selectedStep.step_name}</h3>
                                            <p className="text-blue-100 text-sm mt-0.5">ขั้นตอนที่ {selectedStep.step_number}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-5 space-y-4">
                                {/* Job Info */}
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-orange-600 font-medium">ใบงาน</p>
                                        <p className="font-semibold text-gray-900">{selectedStep.job?.name}</p>
                                        <p className="text-xs text-orange-500">JOB-{String(selectedStep.job_id).padStart(4, '0')}</p>
                                    </div>
                                </div>

                                {/* Step Details */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 block mb-2">รายละเอียดขั้นตอน</label>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[80px]">
                                        {selectedStep.step_details ? (
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedStep.step_details}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">ไม่มีรายละเอียดเพิ่มเติม</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Type & Status */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-xs text-blue-600 font-medium mb-1">ประเภทงาน</p>
                                        <p className="font-semibold text-blue-800">
                                            {selectedStep.action === 'act' ? '🔧 ดำเนินการ' : '✓ อนุมัติ'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl border ${getStatusConfig(selectedStep.status).bgColor} ${getStatusConfig(selectedStep.status).borderColor}`}>
                                        <p className={`text-xs font-medium mb-1 ${getStatusConfig(selectedStep.status).textColor}`}>สถานะ</p>
                                        <p className={`font-semibold ${getStatusConfig(selectedStep.status).textColor}`}>
                                            {getStatusConfig(selectedStep.status).text}
                                        </p>
                                    </div>
                                </div>

                                {/* Assignment Date */}
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>มอบหมายเมื่อ: {formatDate(selectedStep.created_at)}</span>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    ปิด
                                </button>
                                <Link
                                    href={route('repairs.jobs.show', selectedStep.job_id)}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    ไปยังใบงาน
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout >
    );
}
