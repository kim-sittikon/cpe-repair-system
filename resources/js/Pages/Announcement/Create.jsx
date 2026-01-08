import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Camera, Save, ArrowLeft, Info, LayoutTemplate, Eye, AlertCircle, CheckCircle2, PanelRightClose, PanelRightOpen, Image as ImageIcon } from 'lucide-react';

export default function Create({ auth, latestAnnouncements }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        detail: '',
        is_urgent: false,
        image: null,
    });

    const [activeTab, setActiveTab] = useState('create'); // 'create' or 'manage'
    const [preview, setPreview] = useState(null);
    const [showPreview, setShowPreview] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('announcements.store'), {
            onSuccess: () => {
                reset();
                setPreview(null);
                setActiveTab('manage'); // Optional: Switch to manage tab on success? Maybe keep at create.
            },
        });
    };

    // Filter announcements for the "Manage" tab
    const filteredAnnouncements = latestAnnouncements?.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.detail.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Helper for Date Preview
    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="จัดการข่าวสารประชาสัมพันธ์" />

            <div className="py-8 bg-gray-50/50 min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                                <LayoutTemplate className="w-8 h-8 text-[#F59E0B]" />
                                จัดการข่าวสาร / ประกาศ
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm pl-11">
                                สร้างข่าวประชาสัมพันธ์ใหม่ หรือจัดการข่าวสารเดิมที่มีอยู่
                            </p>
                        </div>

                        <Link
                            href={route('dashboard')}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับเมนูหลัก
                        </Link>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex flex-wrap gap-1">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'create'
                                ? 'bg-[#F59E0B] text-white shadow-md shadow-orange-500/20'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            สร้างข่าวใหม่
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'manage'
                                ? 'bg-[#F59E0B] text-white shadow-md shadow-orange-500/20'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <LayoutTemplate className="w-4 h-4" />
                            จัดการ/ลบข่าวสาร
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="transition-all duration-500 ease-in-out">

                        {/* -------------------- TAB 1: CREATE -------------------- */}
                        {activeTab === 'create' && (
                            <div className="animate-fade-in-up">
                                <div className="flex justify-end items-center gap-3 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className={`px-4 py-2.5 border font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 ${showPreview ? 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {showPreview ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                                        {showPreview ? 'ซ่อนตัวอย่าง' : 'แสดงตัวอย่าง'}
                                    </button>

                                    <button
                                        onClick={submit}
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-[#F59E0B] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:bg-[#d97706] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                กำลังบันทึก...
                                            </span>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                เผยแพร่ประกาศ
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-3' : ''} gap-8 items-start`}>
                                    {/* Input Form */}
                                    <div className={`${showPreview ? 'lg:col-span-2' : 'w-full max-w-4xl mx-auto'} space-y-6`}>
                                        {/* Card: Details */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-[#F59E0B] rounded-full"></span>
                                                    รายละเอียดข่าวสาร
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-6">
                                                {/* TitleInput */}
                                                <div className="space-y-2 group">
                                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 group-focus-within:text-[#F59E0B] transition-colors">
                                                        หัวข้อข่าว / ชื่อเรื่อง <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        id="title"
                                                        type="text"
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-medium text-gray-800 placeholder:text-gray-300"
                                                        placeholder="เช่น ปิดปรับปรุงระบบเครือข่าย อาคาร 1..."
                                                    />
                                                    {errors.title && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
                                                </div>

                                                {/* DetailInput */}
                                                <div className="space-y-2 group">
                                                    <label htmlFor="detail" className="block text-sm font-semibold text-gray-700 group-focus-within:text-[#F59E0B] transition-colors">
                                                        รายละเอียดเนื้อหา <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        id="detail"
                                                        rows="6"
                                                        value={data.detail}
                                                        onChange={(e) => setData('detail', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all text-gray-600 placeholder:text-gray-300 leading-relaxed resize-none"
                                                        placeholder="ระบุรายละเอียด วันเวลา และสถานที่..."
                                                    ></textarea>
                                                    {errors.detail && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.detail}</p>}
                                                </div>

                                                {/* Post Type */}
                                                <div className="space-y-3 pt-2">
                                                    <label className="block text-sm font-semibold text-gray-700">ประเภทการประกาศ</label>
                                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                                        <div className="flex bg-gray-100 p-1.5 rounded-xl w-full sm:w-fit gap-1 shadow-inner">
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('is_urgent', false)}
                                                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${!data.is_urgent ? 'bg-white text-gray-800 shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                <CheckCircle2 className={`w-4 h-4 ${!data.is_urgent ? 'text-green-500' : 'text-transparent'}`} />
                                                                เรื่องทั่วไป
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('is_urgent', true)}
                                                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${data.is_urgent ? 'bg-white text-red-600 shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                <AlertCircle className={`w-4 h-4 ${data.is_urgent ? 'text-red-500' : 'text-transparent'}`} />
                                                                เรื่องเร่งด่วน
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card: Image Upload */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                    รูปภาพประกอบ
                                                </h3>
                                            </div>
                                            <div className="p-6">
                                                <label
                                                    htmlFor="file-upload"
                                                    className={`relative group flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden bg-gray-50/50 ${preview ? 'border-gray-200' : 'border-gray-300 hover:border-[#F59E0B] hover:bg-orange-50/30'}`}
                                                >
                                                    {preview ? (
                                                        <div className="relative w-full h-full group-hover:opacity-95 transition-opacity">
                                                            <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                                                                <span className="bg-white text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                                                                    <Camera className="w-4 h-4" /> เปลี่ยนรูปภาพ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                            <div className="w-20 h-20 mb-6 bg-white text-[#F59E0B] rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] transition-all duration-300">
                                                                <Camera className="w-10 h-10" />
                                                            </div>
                                                            <p className="mb-2 text-lg text-gray-600 font-medium">
                                                                <span className="text-[#F59E0B] border-b-2 border-[#F59E0B]/20 group-hover:border-[#F59E0B]">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                                                            </p>
                                                            <p className="text-sm text-gray-400">รองรับไฟล์ SVG, PNG, JPG หรือ GIF (สูงสุด 5MB)</p>
                                                        </div>
                                                    )}
                                                    <input id="file-upload" name="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                                {errors.image && <p className="text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.image}</p>}
                                            </div>
                                        </div>

                                    </div>

                                    {/* Preview Column */}
                                    <div className={`hidden lg:block lg:col-span-1 transition-all duration-500 ease-in-out ${showPreview ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none absolute right-0'}`}>
                                        <div className="sticky top-24 space-y-4">
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm font-semibold uppercase tracking-wider">Live Preview</span>
                                            </div>

                                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 ring-4 ring-gray-50/50 transform transition-all hover:scale-[1.02] duration-300">
                                                {/* Image Area */}
                                                <div className="h-48 overflow-hidden relative bg-gray-100 group cursor-default">
                                                    {preview ? (
                                                        <img src={preview} alt="News Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50 pattern-grid">
                                                            <LayoutTemplate className="w-12 h-12 mb-2 opacity-30" />
                                                            <span className="text-xs font-medium">รูปภาพตัวอย่าง</span>
                                                        </div>
                                                    )}
                                                    {data.is_urgent && (
                                                        <div className="absolute top-3 right-3 bg-[#F59E0B] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider animate-pulse">
                                                            Urgent
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 bg-white/95 text-gray-800 text-xs font-semibold px-4 py-1.5 rounded-tr-xl shadow-sm backdrop-blur-sm">
                                                        {today}
                                                    </div>
                                                </div>

                                                {/* Content Area */}
                                                <div className="p-5 space-y-4">
                                                    <div>
                                                        <h5 className={`font-bold text-lg leading-tight transition-colors ${!data.title ? 'text-gray-300 select-none italic' : 'text-gray-800'}`}>
                                                            {data.title || "หัวข้อข่าวจะแสดงที่นี่..."}
                                                        </h5>
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm line-clamp-3 font-light leading-relaxed ${!data.detail ? 'text-gray-300 italic' : 'text-gray-600'}`}>
                                                            {data.detail || "รายละเอียดเนื้อหาข่าวจะแสดงตัวอย่างที่นี่..."}
                                                        </p>
                                                    </div>

                                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between opacity-60 pointer-events-none">
                                                        <span className="text-xs text-gray-400 font-light flex items-center gap-1">
                                                            อ่านเพิ่มเติม
                                                            <ArrowLeft className="w-3 h-3 rotate-180" />
                                                        </span>
                                                        <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                                            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-600 text-xs leading-relaxed">
                                                <div className="flex items-center justify-center gap-2 mb-1 font-semibold">
                                                    <Info className="w-4 h-4" />
                                                    <span>Tips</span>
                                                </div>
                                                ตัวอย่างขวามือนี้ เป็นเพียงการจำลองการแสดงผลเบื้องต้น <br /> หน้าจอจริงอาจปรับเปลี่ยนตามขนาดอุปกรณ์ของผู้ใช้
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* -------------------- TAB 2: MANAGE -------------------- */}
                        {activeTab === 'manage' && (
                            <div className="animate-fade-in-up">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                                    {/* Action Bar */}
                                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">รายการประกาศทั้งหมด ({filteredAnnouncements.length})</h3>
                                            <p className="text-xs text-gray-500">จัดการ แก้ไข หรือลบประกาศของคุณ</p>
                                        </div>

                                        {/* Search Input */}
                                        <div className="relative w-full md:w-72">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent sm:text-sm transition-shadow"
                                                placeholder="ค้นหาชื่อประกาศ..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Table Content */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-gray-600">
                                            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                                                <tr>
                                                    <th className="px-6 py-4">รูปภาพ</th>
                                                    <th className="px-6 py-4">รายละเอียด</th>
                                                    <th className="px-6 py-4 text-center">สถานะ</th>
                                                    <th className="px-6 py-4">วันที่ลงประกาศ</th>
                                                    <th className="px-6 py-4 text-right">ดำเนินการ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredAnnouncements.length > 0 ? (
                                                    filteredAnnouncements.map((news) => (
                                                        <tr key={news.id} className="hover:bg-gray-50/50 transition-colors group">
                                                            <td className="px-6 py-4 w-32 align-top">
                                                                <div className="h-20 w-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
                                                                    {news.image ? (
                                                                        <img
                                                                            src={`/storage/${news.image}`}
                                                                            alt="Thumbnail"
                                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.style.display = 'none';
                                                                                e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'text-gray-300');
                                                                                e.target.parentNode.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center w-full h-full text-gray-300 bg-gray-50">
                                                                            <LayoutTemplate className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <p className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#F59E0B] transition-colors">
                                                                    {news.title}
                                                                </p>
                                                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                                                    {news.detail}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4 text-center align-top pt-5">
                                                                {news.is_urgent ? (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                                                                        <AlertCircle className="w-3 h-3 mr-1.5" />
                                                                        Urgent
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                                                                        <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                                                        General
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-500 text-sm align-top pt-5 whitespace-nowrap">
                                                                {new Date(news.created_at).toLocaleDateString('th-TH', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </td>
                                                            <td className="px-6 py-4 text-right align-top pt-5">
                                                                <Link
                                                                    href={route('announcements.destroy', news.id)}
                                                                    method="delete"
                                                                    as="button"
                                                                    onClick={(e) => {
                                                                        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบประกาศนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all duration-200 border border-red-100 hover:border-red-500 shadow-sm"
                                                                    title="ลบประกาศ"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                                    <LayoutTemplate className="w-8 h-8 opacity-40" />
                                                                </div>
                                                                <p className="text-lg font-medium text-gray-500">
                                                                    {searchTerm ? 'ไม่พบประกาศที่ตรงกับคำค้นหา' : 'ยังไม่มีรายการประกาศในขณะนี้'}
                                                                </p>
                                                                {searchTerm && (
                                                                    <button
                                                                        onClick={() => setSearchTerm('')}
                                                                        className="text-[#F59E0B] hover:underline"
                                                                    >
                                                                        ล้างคำค้นหา
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-center text-xs text-gray-400">
                                        แสดงผล {filteredAnnouncements.length} รายการจากทั้งหมด
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .pattern-grid {
                    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
