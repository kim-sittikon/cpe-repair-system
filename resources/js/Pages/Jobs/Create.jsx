import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/UI/Modal';

export default function Create({ auth, repairs, assignees, selectedIds }) {
    const [showRepairs, setShowRepairs] = useState(true);
    const [selectedRepairs, setSelectedRepairs] = useState(selectedIds.map(Number));
    const [selectedRepairDetail, setSelectedRepairDetail] = useState(null);
    // Lightbox state for viewing images
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        repair_ids: selectedIds.map(Number),
        steps: [
            { step_name: '', action: 'act', assigned_account_id: '', step_details: '', due_date: '', attached_file_ids: [] }
        ],
    });

    // Get all available images from selected repairs
    const availableImages = repairs
        .filter(r => selectedRepairs.includes(r.id))
        .flatMap(r => (r.files || []).filter(f => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(f.extension)).map(f => ({ ...f, repairId: r.id, repairNumericId: r.numeric_id })));

    // Toggle repair selection
    const toggleRepair = (id) => {
        const numId = Number(id);
        let newSelection;
        if (selectedRepairs.includes(numId)) {
            newSelection = selectedRepairs.filter(r => r !== numId);
        } else {
            newSelection = [...selectedRepairs, numId];
        }
        setSelectedRepairs(newSelection);
        setData('repair_ids', newSelection);
    };

    // Open repair detail modal
    const openRepairDetail = (repair) => {
        setSelectedRepairDetail(repair);
    };

    // Close repair detail modal
    const closeRepairDetail = () => {
        setSelectedRepairDetail(null);
    };

    // Add new step
    const addStep = () => {
        setData('steps', [
            ...data.steps,
            { step_name: '', action: 'act', assigned_account_id: '', step_details: '', due_date: '', attached_file_ids: [] }
        ]);
    };

    // Remove step
    const removeStep = (index) => {
        if (data.steps.length > 1) {
            setData('steps', data.steps.filter((_, i) => i !== index));
        }
    };

    // Update step data
    const updateStep = (index, field, value) => {
        const newSteps = [...data.steps];
        newSteps[index][field] = value;
        setData('steps', newSteps);
    };

    // Toggle file attachment for a step
    const toggleFileAttachment = (stepIndex, fileId) => {
        const newSteps = [...data.steps];
        const currentFiles = newSteps[stepIndex].attached_file_ids || [];
        if (currentFiles.includes(fileId)) {
            newSteps[stepIndex].attached_file_ids = currentFiles.filter(id => id !== fileId);
        } else {
            newSteps[stepIndex].attached_file_ids = [...currentFiles, fileId];
        }
        setData('steps', newSteps);
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.repair_ids.length === 0) {
            alert('กรุณาเลือกรายการแจ้งซ่อมอย่างน้อย 1 รายการ');
            return;
        }
        post(route('repairs.jobs.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="สร้างใบงาน" />

            <div className="py-6 sm:py-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
                <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <div className="mb-6">
                        <nav className="text-sm text-gray-500 mb-2">
                            <ol className="list-none p-0 inline-flex items-center gap-2">
                                <li className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    กลุ่มงานแจ้งซ่อม
                                </li>
                                <li className="text-gray-300">/</li>
                                <li>
                                    <Link href={route('repairs.index')} className="hover:text-orange-600 transition-colors">
                                        รายการแจ้งซ่อม
                                    </Link>
                                </li>
                                <li className="text-gray-300">/</li>
                                <li className="font-semibold text-orange-600">สร้างใบงาน</li>
                            </ol>
                        </nav>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                            สร้างใบงาน
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">สร้างใบงานสำหรับดำเนินการซ่อมแซม</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Selected Repairs Card - Collapsible */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-6 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowRepairs(!showRepairs)}
                                className="w-full p-5 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50/50 hover:from-orange-100 hover:to-amber-100/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/25">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-gray-900">รายการคำขอ</h3>
                                        <p className="text-xs text-gray-500">เลือกรายการที่จะรวมในใบงาน</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-lg shadow-sm">
                                        {selectedRepairs.length} รายการ
                                    </span>
                                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${showRepairs ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {showRepairs && (
                                <div className="border-t border-gray-100">
                                    {repairs.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">เลือก</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">เลขที่แจ้ง</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">หัวข้อคำร้อง</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">รูป</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">ตำแหน่ง</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">ผู้แจ้ง</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {repairs.map((repair) => (
                                                        <tr
                                                            key={repair.id}
                                                            className={`transition-all duration-200 ${selectedRepairs.includes(repair.id)
                                                                ? 'bg-gradient-to-r from-orange-50 to-amber-50/50 hover:from-orange-100 hover:to-amber-100/50'
                                                                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50/50'}`}
                                                        >
                                                            <td className="px-4 py-4" onClick={() => toggleRepair(repair.id)}>
                                                                <div className="flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedRepairs.includes(repair.id)}
                                                                        onChange={() => { }}
                                                                        className="w-5 h-5 rounded-md border-2 border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer shadow-sm transition-all checked:shadow-orange-200 checked:shadow-md"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4" onClick={() => toggleRepair(repair.id)}>
                                                                <span className="inline-flex items-center text-xs font-bold text-orange-600 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                                    {repair.numeric_id}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openRepairDetail(repair);
                                                                    }}
                                                                    className="group text-left w-full"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors underline decoration-dotted underline-offset-2 decoration-gray-300 group-hover:decoration-orange-400">
                                                                            {repair.title}
                                                                        </span>
                                                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-[10px] text-gray-400 group-hover:text-orange-400 transition-colors">
                                                                        คลิกเพื่อดูรายละเอียด
                                                                    </span>
                                                                </button>
                                                            </td>
                                                            <td className="px-4 py-4 text-center" onClick={() => toggleRepair(repair.id)}>
                                                                {repair.files && repair.files.length > 0 ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            openRepairDetail(repair);
                                                                        }}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-all"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        {repair.files.length}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-gray-300 text-xs">-</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-4 hidden md:table-cell" onClick={() => toggleRepair(repair.id)}>
                                                                <div className="flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span className="text-gray-500 text-xs">{repair.location}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 hidden lg:table-cell" onClick={() => toggleRepair(repair.id)}>
                                                                <div className="flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                    <span className="text-gray-500 text-xs">{repair.requester}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 mb-3">ไม่มีรายการที่เลือก</p>
                                            <Link
                                                href={route('repairs.index')}
                                                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                                กลับไปเลือกรายการ
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Job Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">รายละเอียดใบงาน</h3>
                                        <p className="text-xs text-gray-500">กรอกข้อมูลใบงานและขั้นตอนการดำเนินการ</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 space-y-6">
                                {/* Job Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ชื่อใบงาน <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="กรอกชื่อใบงาน"
                                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus:bg-white'}`}
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Steps Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            ขั้นตอนการดำเนินงาน <span className="text-rose-500">*</span>
                                        </label>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                            {data.steps.length} ขั้นตอน
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {data.steps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="relative bg-gradient-to-br from-gray-50 to-slate-50/50 rounded-xl p-5 border border-gray-200/80"
                                            >
                                                {/* Step Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-bold rounded-lg shadow-sm">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-700">ขั้นตอนที่ {index + 1}</span>
                                                    </div>
                                                    {data.steps.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStep(index)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Step Fields */}
                                                <div className="space-y-4">
                                                    {/* Step Name */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">ชื่อขั้นตอน</label>
                                                        <input
                                                            type="text"
                                                            value={step.step_name}
                                                            onChange={(e) => updateStep(index, 'step_name', e.target.value)}
                                                            placeholder="กรอกชื่อขั้นตอน"
                                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                        />
                                                    </div>

                                                    {/* Type, Assignee & Due Date Row */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        {/* Action Type */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">ประเภท</label>
                                                            <select
                                                                value={step.action}
                                                                onChange={(e) => updateStep(index, 'action', e.target.value)}
                                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                                                            >
                                                                <option value="">เลือกประเภท</option>
                                                                <option value="act">🔧 ดำเนินการ</option>
                                                                <option value="app">✅ อนุมัติ</option>
                                                            </select>
                                                        </div>

                                                        {/* Assignee */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">ผู้รับผิดชอบ</label>
                                                            <select
                                                                value={step.assigned_account_id}
                                                                onChange={(e) => updateStep(index, 'assigned_account_id', e.target.value)}
                                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                                                            >
                                                                <option value="">เลือกผู้รับผิดชอบ</option>
                                                                {assignees.map((user) => (
                                                                    <option key={user.id} value={user.id}>
                                                                        {user.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Due Date */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                                                <span className="flex items-center gap-1">
                                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    กำหนดเสร็จ
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={step.due_date}
                                                                onChange={(e) => updateStep(index, 'due_date', e.target.value)}
                                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Step Details */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">รายละเอียด</label>
                                                        <textarea
                                                            value={step.step_details}
                                                            onChange={(e) => updateStep(index, 'step_details', e.target.value)}
                                                            placeholder="เพิ่มรายละเอียด"
                                                            rows="2"
                                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                                                        />
                                                    </div>

                                                    {/* Image Attachment Section */}
                                                    {availableImages.length > 0 && (
                                                        <div className="border-t border-gray-100 pt-4">
                                                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                                                <span className="flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    เลือกรูปแนบสำหรับขั้นตอนนี้
                                                                    {(step.attached_file_ids?.length || 0) > 0 && (
                                                                        <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold">
                                                                            {step.attached_file_ids.length} รูป
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </label>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {availableImages.map((img) => {
                                                                    const isSelected = (step.attached_file_ids || []).includes(img.id);
                                                                    return (
                                                                        <button
                                                                            key={img.id}
                                                                            type="button"
                                                                            onClick={() => toggleFileAttachment(index, img.id)}
                                                                            className={`relative group overflow-hidden rounded-lg border-2 transition-all ${isSelected
                                                                                    ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg'
                                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                                }`}
                                                                        >
                                                                            <img
                                                                                src={img.url}
                                                                                alt={img.name}
                                                                                className="w-16 h-16 object-cover"
                                                                            />
                                                                            {/* Overlay with source info */}
                                                                            <div className={`absolute inset-0 flex items-center justify-center transition-all ${isSelected
                                                                                    ? 'bg-orange-500/30'
                                                                                    : 'bg-black/0 group-hover:bg-black/10'
                                                                                }`}>
                                                                                {isSelected && (
                                                                                    <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
                                                                            {/* Repair ID badge */}
                                                                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] py-0.5 text-center truncate">
                                                                                {img.repairNumericId}
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Step Button */}
                                    <button
                                        type="button"
                                        onClick={addStep}
                                        className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2 font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        เพิ่มขั้นตอน
                                    </button>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50/50">
                                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                    <Link
                                        href={route('repairs.index')}
                                        className="px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center text-sm"
                                    >
                                        ยกเลิก
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || selectedRepairs.length === 0}
                                        className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm
                                            ${processing || selectedRepairs.length === 0
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                กำลังสร้าง...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                สร้างใบงาน
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>

            {/* Repair Detail Modal */}
            <Modal show={selectedRepairDetail !== null} onClose={closeRepairDetail} maxWidth="lg">
                {selectedRepairDetail && (
                    <div className="overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">รายละเอียดคำขอ</h3>
                                        <p className="text-orange-100 text-sm">หมายเลข {selectedRepairDetail.numeric_id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeRepairDetail}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Title Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">หัวข้อคำร้อง</p>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-xl px-5 py-4 text-gray-900 font-medium border border-orange-100">
                                    {selectedRepairDetail.title}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Location */}
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ตำแหน่ง/สถานที่</p>
                                    </div>
                                    <p className="text-gray-900 font-medium">{selectedRepairDetail.location || '-'}</p>
                                </div>

                                {/* Requester */}
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ผู้แจ้ง</p>
                                    </div>
                                    <p className="text-gray-900 font-medium">{selectedRepairDetail.requester || '-'}</p>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedRepairDetail.description && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">รายละเอียดปัญหา</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl px-5 py-4 text-gray-700 min-h-[80px] border border-gray-100 whitespace-pre-wrap leading-relaxed">
                                        {selectedRepairDetail.description}
                                    </div>
                                </div>
                            )}

                            {/* Files/Images Preview */}
                            {selectedRepairDetail.files && selectedRepairDetail.files.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            ไฟล์แนบ ({selectedRepairDetail.files.length})
                                        </p>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        {selectedRepairDetail.files.map((file, index) => {
                                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.extension);
                                            const imageFiles = selectedRepairDetail.files.filter(f => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(f.extension));
                                            const imageIndex = imageFiles.findIndex(f => f.url === file.url);

                                            if (isImage) {
                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => {
                                                            setLightboxImage(imageFiles);
                                                            setLightboxIndex(imageIndex >= 0 ? imageIndex : 0);
                                                        }}
                                                        className="relative group overflow-hidden rounded-xl border-2 border-gray-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-lg cursor-pointer"
                                                    >
                                                        <img
                                                            src={file.url}
                                                            alt={`ไฟล์แนบ ${index + 1}`}
                                                            className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                );
                                            }

                                            // Non-image file - still opens in new tab
                                            const colorMap = {
                                                pdf: { bg: 'from-red-500 to-rose-600' },
                                                doc: { bg: 'from-blue-500 to-indigo-600' },
                                                docx: { bg: 'from-blue-500 to-indigo-600' },
                                                default: { bg: 'from-gray-500 to-gray-600' },
                                            };
                                            const config = colorMap[file.extension] || colorMap.default;

                                            return (
                                                <a
                                                    key={index}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center bg-gradient-to-br ${config.bg} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all group`}
                                                >
                                                    <svg className="w-8 h-8 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span className="text-xs font-bold uppercase">{file.extension}</span>
                                                    <span className="text-[9px] opacity-75 group-hover:opacity-100 transition-opacity">คลิกเพื่อดู</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!selectedRepairs.includes(selectedRepairDetail.id)) {
                                        toggleRepair(selectedRepairDetail.id);
                                    }
                                    closeRepairDetail();
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {selectedRepairs.includes(selectedRepairDetail.id) ? 'เลือกแล้ว' : 'เลือกรายการนี้'}
                            </button>
                            <button
                                type="button"
                                onClick={closeRepairDetail}
                                className="px-5 py-2.5 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Fullscreen Image Lightbox */}
            {lightboxImage && lightboxImage.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setLightboxImage(null)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                        {lightboxIndex + 1} / {lightboxImage.length}
                    </div>

                    {/* Previous button */}
                    {lightboxImage.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev === 0 ? lightboxImage.length - 1 : prev - 1));
                            }}
                            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Main Image */}
                    <img
                        src={lightboxImage[lightboxIndex]?.url}
                        alt={`รูปภาพ ${lightboxIndex + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Next button */}
                    {lightboxImage.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev === lightboxImage.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Thumbnail strip */}
                    {lightboxImage.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                            {lightboxImage.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(idx);
                                    }}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === lightboxIndex ? 'border-orange-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
