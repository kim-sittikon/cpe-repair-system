import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Camera, MapPin, AlertCircle, FileText, Send } from 'lucide-react';

export default function Create({ auth, buildings = [] }) {
    // The original code had `const { auth } = usePage().props;` here.
    // Assuming 'auth' is now passed as a prop based on the instruction's function signature.
    const { data, setData, post, processing, errors } = useForm({
        type: 'repair', // 'repair' (อาคารสถานที่) or 'complaint' (การเรียนการสอน)
        title: '',
        description: '',
        location_id: '', // building
        room: '',
        images: [],
    });

    const [imagePreview, setImagePreview] = useState([]);

    // Logic to find the selected building and its rooms
    const selectedBuilding = buildings.find(b => String(b.building_id) === String(data.location_id));
    const availableRooms = selectedBuilding ? selectedBuilding.rooms : [];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', [...data.images, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreview([...imagePreview, ...newPreviews]);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('report.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Custom Header Section */}
            <div className="relative w-full h-[300px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/landing-bg-final.png')" }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-3xl md:text-4xl font-medium text-white tracking-wide leading-tight drop-shadow-md">
                        แบบฟอร์มแจ้งปัญหา ภาควิศวกรรมคอมพิวเตอร์
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto -mt-10 mb-12 relative px-4 sm:px-6 lg:px-8 z-20">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 p-8 md:p-10">

                    <form onSubmit={submit} className="space-y-8 font-sans">

                        {/* Type Selection */}
                        <div className="space-y-4">
                            <label className="text-xl font-medium text-gray-800">ประเภท :</label>
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 pl-2 md:pl-8">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="repair"
                                        checked={data.type === 'repair'}
                                        onChange={() => setData('type', 'repair')}
                                        className="w-5 h-5 text-[#F59E0B] border-gray-300 focus:ring-[#F59E0B] cursor-pointer"
                                    />
                                    <span className={`text-lg transition-colors ${data.type === 'repair' ? 'text-gray-800 font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                                        อาคารสถานที่
                                    </span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="complaint"
                                        checked={data.type === 'complaint'}
                                        onChange={() => setData('type', 'complaint')}
                                        className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-600 cursor-pointer"
                                    />
                                    <span className={`text-lg transition-colors ${data.type === 'complaint' ? 'text-gray-800 font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                                        การเรียนการสอน อาจารย์ นักศึกษา
                                    </span>
                                </label>
                            </div>
                        </div>


                        {/* Location - Only show for Repair */}
                        {/* Location - Show for both but Required only for Repair */}
                        <div className="space-y-4 transition-all duration-300 ease-in-out">
                            <label className="text-xl font-medium text-gray-800">
                                สถานที่ {data.type === 'repair' && <span className="text-red-500 text-base">* (จำเป็นต้องระบุ)</span>}
                                {data.type === 'complaint' && <span className="text-gray-400 text-base font-normal ml-2">(ไม่บังคับ)</span>}
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-0">
                                <div className="space-y-2">
                                    <select
                                        value={data.location_id}
                                        onChange={e => {
                                            const newLocationId = e.target.value;
                                            setData(currentData => ({ ...currentData, location_id: newLocationId, room: '' }));
                                        }}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-[#F59E0B] focus:ring-[#F59E0B] py-2.5 text-gray-600 ${errors.location_id ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">เลือกอาคาร</option>
                                        {buildings.map(building => (
                                            <option key={building.building_id} value={building.building_id}>
                                                {building.building_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.location_id && <div className="text-red-500 text-sm mt-1">{errors.location_id}</div>}
                                </div>
                                <div className="space-y-2">

                                    <select
                                        value={data.room}
                                        onChange={e => setData('room', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#F59E0B] focus:ring-[#F59E0B] py-2.5 text-gray-600"
                                    >
                                        <option value="">เลือกห้อง {data.room_id ? '' : '(ถ้ามี)'}</option>

                                        {!data.location_id && (
                                            <option disabled>กรุณาเลือกอาคารก่อน</option>
                                        )}

                                        {data.location_id && availableRooms.length === 0 && (
                                            <option disabled>ไม่มีข้อมูลห้องในอาคารนี้</option>
                                        )}

                                        {availableRooms.map(room => (
                                            <option key={room.room_id} value={room.room_name}>
                                                {room.room_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.room && <div className="text-red-500 text-sm mt-1">{errors.room}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium text-gray-800">หัวเรื่อง</label>
                            <div className="">
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#F59E0B] focus:ring-[#F59E0B] py-2.5"
                                    placeholder="กรอกชื่อหัวเรื่อง"
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium text-gray-800">รายละเอียด</label>
                            <div className="">
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="6"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#F59E0B] focus:ring-[#F59E0B]"
                                    placeholder="กรอกรายละเอียด"
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <label className="text-xl font-medium text-gray-800">แนบไฟล์รูปภาพ (ถ้ามี)</label>

                            <div className="border border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <div className="mb-3">
                                        <svg className="w-10 h-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    </div>
                                    <span className="text-xs text-gray-400 mb-2">ลากรูปมาวางที่นี่ หรือ</span>
                                    <span className="px-4 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-600">เลือกรูปภาพ</span>
                                    <span className="text-[10px] text-gray-300 mt-2">ไม่เกิน 5 รูป รองรับไฟล์นามสกุล JPG, JPEG และ PNG และมีขนาดไฟล์ไม่เกิน 2 MB</span>
                                </div>
                            </div>

                            {imagePreview.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {imagePreview.map((src, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-8 py-2.5 border border-[#F59E0B] text-[#F59E0B] rounded-full font-medium hover:bg-orange-50 transition-colors bg-white w-40"
                            >
                                ล้างค่าแบบฟอร์ม
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#F59E0B] text-white rounded-full font-medium hover:bg-[#D97706] transition-colors shadow-md w-40 disabled:opacity-50"
                            >
                                {processing ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
