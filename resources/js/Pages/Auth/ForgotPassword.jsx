import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import TextInput from '@/Components/UI/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
            <Head title="ลืมรหัสผ่าน" />

            {/* Blurred Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/login-bg.jpg" // Reuse login bg or similar
                    alt="Background"
                    className="w-full h-full object-cover filter blur-[8px] scale-110"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Centered Form Card */}
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mx-4 my-8 p-8">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900">ลืมรหัสผ่าน?</h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        ไม่ต้องกังวล เพียงกรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้ครับ
                    </p>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg text-center border border-green-200">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="อีเมลของคุณ" className="text-gray-700 font-medium" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white p-3 shadow-sm focus:border-[#E11D48] focus:ring-[#E11D48] transition-all"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@mail.rmutt.ac.th"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end">
                        <PrimaryButton
                            className="w-full justify-center bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            disabled={processing}
                        >
                            ส่งลิงก์รีเซ็ตรหัสผ่าน
                        </PrimaryButton>
                    </div>

                    <div className="text-center mt-4">
                        <Link href={route('login')} className="text-sm text-gray-500 hover:text-[#E11D48] transition-colors flex items-center justify-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
