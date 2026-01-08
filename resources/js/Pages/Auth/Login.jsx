import Checkbox from '@/Components/UI/Checkbox';
import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import TextInput from '@/Components/UI/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
                    ลงชื่อเข้าใช้
                </h1><br />
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span className="flex-1 h-px bg-gray-200"></span>
                    <span>หรือ</span>
                    <span className="flex-1 h-px bg-gray-200"></span>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="อีเมล" className="text-gray-500" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-3"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                        <InputLabel htmlFor="password" value="รหัสผ่าน" className="text-gray-500" />
                        <button type="button" className="text-xs text-gray-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                            ซ่อน
                        </button>
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-3"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />

                    <div className="flex justify-end mt-1">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="underline text-sm text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                ลืมรหัสผ่าน?
                            </Link>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-4 pt-4">
                    <PrimaryButton className="w-full justify-center bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-full text-lg normal-case font-normal" disabled={processing}>
                        <span className="flex items-center gap-2">
                            เข้าสู่ระบบ
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </span>
                    </PrimaryButton>

                    <div className="text-center text-sm text-gray-500">
                        ยังไม่มีบัญชีใช่หรือไม่? <Link href={route('register')} className="text-gray-900 font-bold underline">ลงทะเบียน</Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
