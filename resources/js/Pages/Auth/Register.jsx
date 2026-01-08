import { useState, useEffect } from 'react';
import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import TextInput from '@/Components/UI/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Register() {
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        firstName: '',
        lastName: '',
        name: '', // Will be combined
        email: '',
        password: '',
        password_confirmation: '',
        otp: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // OTP State
    const [timer, setTimer] = useState(0);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [otpMessage, setOtpMessage] = useState('');

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        clearErrors('email');
        setOtpMessage('');

        if (!data.email) {
            setError('email', 'กรุณากรอกอีเมลก่อนขอรหัส OTP');
            return;
        }

        if (!data.email.endsWith('@mail.rmutt.ac.th')) {
            setError('email', 'อีเมลต้องลงท้ายด้วย @mail.rmutt.ac.th');
            return;
        }

        setIsOtpSending(true);

        try {
            await axios.post(route('send-otp'), { email: data.email });
            setTimer(60); // 60 seconds cooldown
            setOtpMessage('ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว (หากไม่พบโปรดเช็ค Junk/Spam)');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                // Set errors from backend logic (e.g. invalid email format)
                Object.keys(error.response.data.errors).forEach(key => {
                    setError(key, error.response.data.errors[key][0]);
                });
            } else {
                setError('email', 'เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่');
            }
        } finally {
            setIsOtpSending(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Combine names
        data.name = `${data.firstName} ${data.lastName}`.trim();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
            <Head title="ลงทะเบียน" />

            {/* Blurred Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/register-side-bg.jpg"
                    alt="Background"
                    className="w-full h-full object-cover filter blur-[8px] scale-110"
                />
                <div className="absolute inset-0 bg-black/30"></div> {/* Overlay to ensure text contrast if needed, mostly for aesthetics */}
            </div>

            {/* Centered Form Card */}
            <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mx-4 my-8">
                <div className="flex flex-col md:flex-row">

                    {/* Form Side */}
                    <div className="w-full p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900">สร้างบัญชีผู้ใช้</h1>
                            <p className="text-gray-500 mt-2 text-sm">กรอกข้อมูลเพื่อสมัครสมาชิก</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5 font-sans">

                            {/* Name / Surname */}
                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-1">
                                    <InputLabel htmlFor="firstName" value="ชื่อ" className="text-gray-700 font-medium" />
                                    <TextInput
                                        id="firstName"
                                        value={data.firstName}
                                        onChange={(e) => setData('firstName', e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                                        placeholder="ชื่อจริง"
                                        required
                                    />
                                    <InputError message={errors.firstName} className="mt-1" />
                                </div>
                                <div className="w-1/2 space-y-1">
                                    <InputLabel htmlFor="lastName" value="นามสกุล" className="text-gray-700 font-medium" />
                                    <TextInput
                                        id="lastName"
                                        value={data.lastName}
                                        onChange={(e) => setData('lastName', e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                                        placeholder="นามสกุล"
                                        required
                                    />
                                    <InputError message={errors.lastName} className="mt-1" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="email" value="อีเมล (ต้องลงท้ายด้วย @mail.rmutt.ac.th)" className="text-gray-700 font-medium" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                                    placeholder="name.s@mail.rmutt.ac.th"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div className="relative space-y-1">
                                <div className="flex justify-between items-center">
                                    <InputLabel htmlFor="password" value="รหัสผ่าน" className="text-gray-700 font-medium" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-xs text-[#E11D48] hover:text-[#BE123C] font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        {showPassword ? (
                                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" /></svg> ซ่อนรหัสผ่าน</>
                                        ) : (
                                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> แสดงรหัสผ่าน</>
                                        )}
                                    </button>
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative space-y-1">
                                <InputLabel htmlFor="password_confirmation" value="ยืนยันรหัสผ่าน" className="text-gray-700 font-medium" />
                                <TextInput
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            {/* OTP */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="otp" value="ยืนยันรหัส OTP" className="text-gray-700 font-medium" />
                                <div className="flex gap-3">
                                    <TextInput
                                        id="otp"
                                        value={data.otp}
                                        onChange={(e) => setData('otp', e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                                        placeholder="กรอกรหัส 6 หลัก"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isOtpSending || timer > 0}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shadow-md active:scale-95 ${isOtpSending || timer > 0
                                            ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                                            : 'bg-gray-800 hover:bg-gray-900 text-white hover:shadow-lg'
                                            }`}
                                    >
                                        {isOtpSending ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                กำลังส่ง...
                                            </span>
                                        ) : timer > 0 ? (
                                            `ส่งใหม่ (${timer}s)`
                                        ) : (
                                            'ส่งรหัส OTP'
                                        )}
                                    </button>
                                </div>
                                {otpMessage && <p className="text-sm text-green-600 mt-1">{otpMessage}</p>}
                            </div>

                            {/* Terms */}
                            <div className="block pt-2">
                                <label className="flex items-center cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#E11D48] shadow-sm focus:ring-[#E11D48] h-5 w-5 cursor-pointer"
                                            checked={data.terms}
                                            onChange={(e) => setData('terms', e.target.checked)}
                                        />
                                    </div>
                                    <span className="ms-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                        ฉันยอมรับ <a href="#" className="text-[#E11D48] hover:text-[#BE123C] font-semibold underline decoration-2 underline-offset-2">นโยบายความเป็นส่วนตัว</a>
                                    </span>
                                </label>
                            </div>

                            <div className="flex flex-col gap-4 pt-6">
                                <PrimaryButton
                                    className="w-full justify-center bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                    disabled={processing}
                                >
                                    <span className="flex items-center gap-2">
                                        ลงทะเบียน
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </span>
                                </PrimaryButton>

                                <div className="text-center text-sm text-gray-500 mt-2">
                                    มีบัญชีผู้ใช้งานแล้ว? <Link href={route('login')} className="text-[#E11D48] font-bold hover:underline">เข้าสู่ระบบ</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
