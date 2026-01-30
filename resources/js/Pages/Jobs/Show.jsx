import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Show({ auth, job }) {
    const currentUserSteps = job.job_steps?.filter(step => step.assigned_account_id === auth.user.account_id) || [];
    const currentStep = currentUserSteps.find(step => step.status === 'pending' || step.status === 'in_progress');
    // Fallback: if user has no assigned steps, show the first step of the job
    const allStepsSorted = job.job_steps?.sort((a, b) => a.step_number - b.step_number) || [];
    const [selectedStep, setSelectedStep] = useState(currentStep || currentUserSteps[0] || allStepsSorted[0] || null);
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    // Auto-hide sidebar on mobile
    const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

    const { data, setData, post, processing, errors, reset } = useForm({
        details: '',
        files: [],
    });

    // Keep details empty initially - don't load step_details into the input
    // step_details is the instruction from job creator, not the work result
    useEffect(() => {
        // Reset to empty when changing steps - user types their own work summary
        setData('details', '');
        setUploadedFiles([]);
    }, [selectedStep]);

    const getStatusConfig = (status) => {
        const configs = {
            'pending': { label: 'รอดำเนินการ', bg: 'bg-amber-50', textColor: 'text-amber-600', border: 'border-amber-200' },
            'in_progress': { label: 'กำลังดำเนินการ', bg: 'bg-blue-50', textColor: 'text-blue-600', border: 'border-blue-200' },
            'completed': { label: 'เสร็จสิ้น', bg: 'bg-emerald-50', textColor: 'text-emerald-600', border: 'border-emerald-200' },
            'done': { label: 'เสร็จสิ้น', bg: 'bg-emerald-50', textColor: 'text-emerald-600', border: 'border-emerald-200' },
            'rejected': { label: 'ปฏิเสธ', bg: 'bg-red-50', textColor: 'text-red-600', border: 'border-red-200' },
        };
        return configs[status] || configs['pending'];
    };

    const isMyStep = (step) => step.assigned_account_id === auth.user.account_id;
    const isCurrentStep = (step) => selectedStep?.jobstep_id === step.jobstep_id;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
        setData('files', [...data.files, ...files]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles(prev => [...prev, ...files]);
        setData('files', [...data.files, ...files]);
    };

    const removeFile = (index) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        setData('files', newFiles);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('details', data.details);
        formData.append('status', 'in_progress');
        uploadedFiles.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });
        router.post(route('repairs.jobs.step.update', selectedStep.jobstep_id), formData);
    };

    const handleComplete = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('details', data.details);
        formData.append('status', 'completed');
        uploadedFiles.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });
        router.post(route('repairs.jobs.step.update', selectedStep.jobstep_id), formData);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`ใบงาน - ${job.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

                    {/* Header Card - Premium Design */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4 sm:mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400"></div>
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">เลขและชื่อใบงาน</p>
                                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                                    JOB-{String(job.job_id).padStart(3, '0')}, {job.name}
                                </h1>
                            </div>
                            <Link
                                href={route(new URLSearchParams(window.location.search).get('from') === 'index' ? 'repairs.jobs.index' : 'repairs.jobs.my')}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all flex-shrink-0"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile: Horizontal Step Selector */}
                    <div className="lg:hidden mb-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">เลือกขั้นตอน</p>
                            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                                {job.job_steps?.sort((a, b) => a.step_number - b.step_number).map((step) => {
                                    const isActive = isMyStep(step) && (step.status === 'pending' || step.status === 'in_progress');
                                    const isCurrent = isCurrentStep(step);
                                    const isCompleted = step.status === 'completed' || step.status === 'done';

                                    return (
                                        <button
                                            key={step.jobstep_id}
                                            onClick={() => setSelectedStep(step)}
                                            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${isCurrent
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                                : isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : isCompleted
                                                        ? 'bg-gray-100 text-gray-400'
                                                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                                                }`}
                                        >
                                            {isCompleted && (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {step.step_number}. {step.step_name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Two Cards Layout */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

                        {/* Left Card - Step List - Hidden on Mobile */}
                        <div className={`hidden lg:block transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:w-80 flex-shrink-0 opacity-100' : 'lg:w-0 opacity-0 lg:hidden'} overflow-hidden`}>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-4 lg:p-5">
                                    <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                                        ขั้นตอนการดำเนินงานรวม
                                    </h2>

                                    <div className="space-y-2">
                                        {job.job_steps?.sort((a, b) => a.step_number - b.step_number).map((step,) => {
                                            const isActive = isMyStep(step) && (step.status === 'pending' || step.status === 'in_progress');
                                            const isCurrent = isCurrentStep(step);
                                            const isCompleted = step.status === 'completed' || step.status === 'done';

                                            return (
                                                <button
                                                    key={step.jobstep_id}
                                                    onClick={() => setSelectedStep(step)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 hover:shadow-sm cursor-pointer ${isCurrent
                                                        ? 'border-blue-400 bg-blue-50 shadow-sm'
                                                        : isActive
                                                            ? 'border-emerald-400 bg-emerald-50'
                                                            : isCompleted
                                                                ? 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {isCompleted && (
                                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <span className={`text-sm ${isActive || isCurrent ? 'text-gray-900 font-semibold' : isCompleted ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                                                            {step.step_number}. {step.step_name}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Card - Step Details & Form */}
                        <div className="flex-1 relative">
                            {/* Toggle Sidebar Button - Hidden on mobile */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="hidden md:flex absolute -left-4 top-6 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center hover:bg-gray-50 transition-all"
                            >
                                <svg className={`w-4 h-4 text-gray-600 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {selectedStep ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                    {/* Step Header - Responsive */}
                                    <div className="p-4 sm:p-6 border-b border-gray-50">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                                            ขั้นตอนที่ {selectedStep.step_number}
                                        </h3>

                                        {/* Step Info Box - Responsive */}
                                        <div className="border border-gray-100 rounded-xl p-4 sm:p-5 bg-gradient-to-br from-gray-50/50 to-white">
                                            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                <div className="w-1 h-full min-h-[20px] bg-gradient-to-b from-orange-400 to-amber-500 rounded-full flex-shrink-0"></div>
                                                <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">{selectedStep.step_name}</h4>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 sm:gap-6 ml-3 sm:ml-4">
                                                <div>
                                                    <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider block mb-0.5 sm:mb-1">ประเภท</span>
                                                    <span className="text-xs sm:text-sm text-gray-800 font-medium">
                                                        {selectedStep.action === 'act' ? '🔧 ดำเนินการ' : '✅ อนุมัติ'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider block mb-0.5 sm:mb-1">กำหนดเสร็จ</span>
                                                    <span className="text-xs sm:text-sm text-gray-800 font-medium flex items-center gap-1 sm:gap-1.5">
                                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {selectedStep.completeDT
                                                            ? new Date(selectedStep.completeDT).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
                                                            : '-'
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Instructions from job creator - Styled as a callout */}
                                            {selectedStep.step_details && (
                                                <div className="mt-4 sm:mt-5 ml-0 sm:ml-4 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60">
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-[10px] sm:text-xs text-amber-700 font-semibold uppercase tracking-wider block mb-1 sm:mb-1.5">💡 คำแนะนำจากผู้มอบหมาย</span>
                                                            <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">{selectedStep.step_details}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Form - Responsive */}
                                    {(selectedStep.status === 'pending' || selectedStep.status === 'in_progress') && isMyStep(selectedStep) && (
                                        <div className="p-4 sm:p-6">
                                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center gap-2">
                                                <div className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></div>
                                                รายละเอียดการดำเนินงาน
                                            </h4>

                                            <form className="space-y-4 sm:space-y-6">
                                                {/* Details Input */}
                                                <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        สรุปผลการดำเนินงาน
                                                    </label>
                                                    <textarea
                                                        value={data.details}
                                                        onChange={(e) => setData('details', e.target.value)}
                                                        placeholder="กรอกรายละเอียดการทำงาน..."
                                                        rows={5}
                                                        className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all resize-none text-sm text-gray-700 placeholder-gray-300 bg-white shadow-sm hover:shadow-md hover:border-gray-200"
                                                    />
                                                    <p className="text-[10px] sm:text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        กรอกรายละเอียดการทำงาน ปัญหาที่พบ และวิธีการแก้ไข
                                                    </p>
                                                </div>

                                                {/* File Upload */}
                                                <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl p-4 sm:p-5 border border-blue-100/50">
                                                    <label className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-3">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        แนบไฟล์/รูปประกอบ
                                                    </label>
                                                    <div
                                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                                        onDragLeave={() => setDragOver(false)}
                                                        onDrop={handleDrop}
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all bg-white active:scale-[0.98] ${dragOver
                                                            ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-100'
                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md'
                                                            }`}
                                                    >
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            multiple
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                            accept="image/*,.pdf,.doc,.docx"
                                                        />
                                                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-1">
                                                                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-500">
                                                                <span className="hidden sm:inline">ลากไฟล์มาวางที่นี่ หรือ </span>
                                                                <span className="text-blue-500 hover:underline">แตะเพื่อเลือกไฟล์</span>
                                                            </span>
                                                            <span className="text-xs text-gray-400">รองรับไฟล์ภาพ, PDF, DOC (ไม่เกิน 10 MB)</span>
                                                        </div>
                                                    </div>

                                                    {/* Uploaded Files */}
                                                    {uploadedFiles.length > 0 && (
                                                        <div className="mt-4 space-y-2">
                                                            {uploadedFiles.map((file, index) => (
                                                                <div key={index} className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
                                                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                                                            {file.type?.startsWith('image/') ? (
                                                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{file.name}</span>
                                                                            <span className="text-[10px] sm:text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeFile(index)}
                                                                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0 ml-2"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons - Professional Design */}
                                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                                                    <button
                                                        type="button"
                                                        onClick={handleSave}
                                                        disabled={processing}
                                                        className="px-6 py-3 bg-white text-gray-600 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                        </svg>
                                                        บันทึกแบบร่าง
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleComplete}
                                                        disabled={processing}
                                                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        ดำเนินการเสร็จสิ้น
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* View Only State - Other's Step */}
                                    {!isMyStep(selectedStep) && selectedStep.status !== 'completed' && selectedStep.status !== 'done' && (
                                        <div className="p-4 sm:p-8 text-center border-t border-gray-100">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">ดูได้อย่างเดียว</h4>
                                            <p className="text-xs sm:text-sm text-gray-500">ขั้นตอนนี้ได้รับมอบหมายให้ผู้อื่นดำเนินการ</p>
                                        </div>
                                    )}

                                    {/* Completed State */}
                                    {(selectedStep.status === 'completed' || selectedStep.status === 'done') && (
                                        <div className="p-6 sm:p-10 text-center">
                                            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-5 shadow-lg shadow-emerald-200">
                                                <svg className="w-7 h-7 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h4 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">ขั้นตอนนี้เสร็จสิ้นแล้ว</h4>
                                            <p className="text-xs sm:text-base text-gray-500">
                                                เสร็จสิ้นเมื่อ: {selectedStep.completeDT ? new Date(selectedStep.completeDT).toLocaleString('th-TH') : '-'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-12 text-center">
                                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-5">
                                        <svg className="w-7 h-7 sm:w-10 sm:h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">ไม่มีขั้นตอนที่ต้องทำ</h3>
                                    <p className="text-xs sm:text-base text-gray-500">คุณไม่มีขั้นตอนที่ได้รับมอบหมายในใบงานนี้</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
