import DangerButton from '@/Components/UI/DangerButton';
import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import Modal from '@/Components/UI/Modal';
import SecondaryButton from '@/Components/UI/SecondaryButton';
import TextInput from '@/Components/UI/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-gray-900">
                    ลบบัญชีผู้ใช้
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    เมื่อลบบัญชีแล้ว ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้
                    กรุณาดาวน์โหลดหรือบันทึกข้อมูลที่ต้องการก่อนดำเนินการลบบัญชี
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                ลบบัญชีผู้ใช้
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        คุณแน่ใจหรือไม่ที่จะลบบัญชีนี้?
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        เมื่อลบบัญชีแล้ว ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร
                        กรุณากรอกรหัสผ่านเพื่อยืนยันว่าต้องการลบบัญชี
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="รหัสผ่าน"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="กรอกรหัสผ่านเพื่อยืนยัน"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            ยกเลิก
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            {processing ? 'กำลังลบ...' : 'ยืนยันลบบัญชี'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
