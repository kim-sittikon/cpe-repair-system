import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import TextInput from '@/Components/UI/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ className = '' }) {
    const user = usePage().props.auth.user;

    // Split name into first_name and last_name if not already separated
    const nameParts = (user.name || '').split(' ');
    const initialFirstName = user.first_name || nameParts[0] || '';
    const initialLastName = user.last_name || nameParts.slice(1).join(' ') || '';

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: initialFirstName,
            last_name: initialLastName,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-gray-900">
                    ข้อมูลโปรไฟล์
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    แก้ไขชื่อและนามสกุลของคุณ
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Email - Read Only */}
                <div>
                    <InputLabel htmlFor="email" value="อีเมล" />
                    <div className="mt-1 flex items-center gap-2">
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                            value={user.email}
                            disabled
                            readOnly
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                            (ไม่สามารถแก้ไขได้)
                        </span>
                    </div>
                </div>

                {/* First Name */}
                <div>
                    <InputLabel htmlFor="first_name" value="ชื่อ" />
                    <TextInput
                        id="first_name"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        required
                        isFocused
                        autoComplete="given-name"
                        placeholder="กรอกชื่อของคุณ"
                    />
                    <InputError className="mt-2" message={errors.first_name} />
                </div>

                {/* Last Name */}
                <div>
                    <InputLabel htmlFor="last_name" value="นามสกุล" />
                    <TextInput
                        id="last_name"
                        className="mt-1 block w-full"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        required
                        autoComplete="family-name"
                        placeholder="กรอกนามสกุลของคุณ"
                    />
                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'กำลังบันทึก...' : 'บันทึก'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-medium">
                            ✓ บันทึกสำเร็จ
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
