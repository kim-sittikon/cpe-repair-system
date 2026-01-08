import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import TextInput from '@/Components/UI/TextInput';
import { Head, useForm, Link } from '@inertiajs/react'; // Add Link
import { useState } from 'react'; // Add state for show password

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false); // Visibility toggle state
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
            <Head title="ตั้งรหัสผ่านใหม่" />

            {/* Blurred Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/login-bg.jpg"
                    alt="Background"
                    className="w-full h-full object-cover filter blur-[8px] scale-110"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>


            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mx-4 my-8 p-8">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900">ตั้งรหัสผ่านใหม่ (Reset Password)</h1>
                    <p className="text-gray-500 mt-2 text-sm">กรุณากำหนดรหัสผ่านใหม่ของคุณ</p>
                </div>


                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="อีเมล" className="text-gray-700 font-medium" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-100 p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] cursor-not-allowed" // Readonly style
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            readOnly // Ensure email is readonly
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="relative space-y-1">
                        <div className="flex justify-between items-center">
                            <InputLabel htmlFor="password" value="รหัสผ่านใหม่" className="text-gray-700 font-medium" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-[#E11D48] hover:text-[#BE123C] font-semibold flex items-center gap-1 transition-colors">
                                {showPassword ? "ซ่อน" : "แสดง"}
                            </button>
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="relative space-y-1">
                        <InputLabel htmlFor="password_confirmation" value="ยืนยันรหัสผ่านใหม่" className="text-gray-700 font-medium" />
                        <TextInput
                            type={showConfirmPassword ? "text" : "password"}
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                        >
                            {/* Simple eye icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="pt-4 flex items-center justify-end">
                        <PrimaryButton className="w-full justify-center bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" disabled={processing}>
                            ตั้งรหัสผ่านใหม่
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
