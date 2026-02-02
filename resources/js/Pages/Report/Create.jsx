import React, { useState, useCallback } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Camera, MapPin, AlertCircle, FileText, Send } from 'lucide-react';
import CameraCapture from '@/Components/CameraCapture';

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
        latitude: null,
        longitude: null,
    });

    const [imagePreview, setImagePreview] = useState([]);
    const [imageError, setImageError] = useState('');
    const [localErrors, setLocalErrors] = useState({});
    const [showCamera, setShowCamera] = useState(false);

    // Logic to find the selected building and its rooms
    const selectedBuilding = buildings.find(b => String(b.building_id) === String(data.location_id));
    const availableRooms = selectedBuilding ? selectedBuilding.rooms : [];


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = data.images.length + files.length;

        if (totalImages > 5) {
            setImageError('สามารถอัปโหลดได้สูงสุด 5 รูป');
            // Auto clear error after 3 seconds
            setTimeout(() => setImageError(''), 3000);
            return;
        }

        setImageError(''); // Clear any previous error
        setData('images', [...data.images, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreview([...imagePreview, ...newPreviews]);
    };

    // Handle camera capture
    const handleCameraCapture = useCallback((file) => {
        const totalImages = data.images.length + 1;

        if (totalImages > 5) {
            setImageError('สามารถอัปโหลดได้สูงสุด 5 รูป');
            setTimeout(() => setImageError(''), 3000);
            setShowCamera(false);
            return;
        }

        setImageError('');
        setData('images', [...data.images, file]);
        setImagePreview([...imagePreview, URL.createObjectURL(file)]);
        setShowCamera(false);
    }, [data.images, imagePreview, setData]);

    const submit = (e) => {
        e.preventDefault();

        // Local validation: if building is selected, room must be selected too
        const newLocalErrors = {};
        if (data.location_id && !data.room) {
            newLocalErrors.room = 'กรุณาเลือกห้อง (เมื่อเลือกอาคารแล้วต้องเลือกห้องด้วย)';
        }

        if (Object.keys(newLocalErrors).length > 0) {
            setLocalErrors(newLocalErrors);
            return;
        }

        setLocalErrors({});
        console.log('Submitting data:', data);
        post(route('report.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Custom Header Section */}
            <div className="relative w-full h-[160px] sm:h-[300px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/landing-bg-final.webp')" }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-medium text-white tracking-wide leading-tight drop-shadow-md">
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


                        {/* Location - Show for both but Required only for Repair */}
                        <div className="space-y-3 transition-all duration-300 ease-in-out">
                            <label className="text-lg sm:text-xl font-medium text-gray-800">
                                สถานที่ {data.type === 'repair' && <span className="text-red-500 text-sm sm:text-base">* (จำเป็นต้องระบุ)</span>}
                                {data.type === 'complaint' && <span className="text-gray-400 text-sm font-normal ml-2">(ไม่บังคับ)</span>}
                            </label>
                            <div className="grid grid-cols-2 gap-2 sm:gap-6">
                                <div className="space-y-1">
                                    <select
                                        value={data.location_id}
                                        onChange={e => {
                                            const newLocationId = e.target.value;
                                            setData(currentData => ({ ...currentData, location_id: newLocationId, room: '' }));
                                        }}
                                        className={`w-full rounded-lg sm:rounded-md border-gray-300 shadow-sm focus:border-[#F59E0B] focus:ring-[#F59E0B] py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 ${errors.location_id ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">เลือกอาคาร</option>
                                        {buildings.map(building => (
                                            <option key={building.building_id} value={building.building_id}>
                                                {building.building_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.location_id && <div className="text-red-500 text-xs sm:text-sm">{errors.location_id}</div>}
                                </div>
                                <div className="space-y-1">
                                    <select
                                        value={data.room}
                                        onChange={e => {
                                            setData('room', e.target.value);
                                            // Clear local error when user selects a room
                                            if (e.target.value) {
                                                setLocalErrors(prev => ({ ...prev, room: '' }));
                                            }
                                        }}
                                        className={`w-full rounded-lg sm:rounded-md border-gray-300 shadow-sm focus:border-[#F59E0B] focus:ring-[#F59E0B] py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 ${(errors.room || localErrors.room) ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">เลือกห้อง</option>

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
                                    {(errors.room || localErrors.room) && <div className="text-red-500 text-xs sm:text-sm">{errors.room || localErrors.room}</div>}
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
                        <div className="space-y-3">
                            <label className="text-xl font-medium text-gray-800">แนบรูปภาพ</label>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Camera button - Mobile only */}
                                <button
                                    type="button"
                                    onClick={() => setShowCamera(true)}
                                    className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg transition-colors"
                                >
                                    <Camera className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-700">ถ่ายรูป</span>
                                </button>

                                {/* File picker */}
                                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">เลือกรูปภาพ</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-400">JPG, PNG ไม่เกิน 5 รูป (10MB)</span>
                            </div>

                            {/* Image Error Message */}
                            {imageError && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-pulse">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-600 font-medium">{imageError}</span>
                                </div>
                            )}

                            {/* Selected files list */}
                            {imagePreview.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                                    {imagePreview.map((src, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                            <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPreviews = imagePreview.filter((_, i) => i !== index);
                                                    const newImages = data.images.filter((_, i) => i !== index);
                                                    setImagePreview(newPreviews);
                                                    setData('images', newImages);
                                                }}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="group flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md sm:w-40"
                            >
                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                ย้อนกลับ
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl font-medium hover:from-[#D97706] hover:to-[#B45309] transition-all duration-200 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed sm:w-40"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    <>
                                        บันทึกข้อมูล
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
