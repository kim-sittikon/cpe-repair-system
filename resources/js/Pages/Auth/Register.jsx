import { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/UI/InputError';
import InputLabel from '@/Components/UI/InputLabel';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import TextInput from '@/Components/UI/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

// Privacy Policy Modal Component
function PrivacyPolicyModal({ isOpen, onClose, onAccept }) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setHasScrolledToBottom(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            setHasScrolledToBottom(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-6 py-5 text-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">นโยบายความเป็นส่วนตัว</h2>
                                <p className="text-white/70 text-xs">กรุณาอ่านและยอมรับเงื่อนไขก่อนลงทะเบียน</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                {!hasScrolledToBottom && (
                    <div className="absolute left-1/2 bottom-24 -translate-x-1/2 z-10 animate-bounce">
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            เลื่อนลงเพื่ออ่านต่อ
                        </div>
                    </div>
                )}

                {/* Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-600"
                >
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">1</span>
                            บทนำ
                        </h3>
                        <p className="leading-relaxed">
                            ระบบ CPE Repair System ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของท่าน
                            นโยบายนี้จัดทำขึ้นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">2</span>
                            ข้อมูลที่เราเก็บรวบรวม
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                <span><strong>ข้อมูลระบุตัวตน:</strong> ชื่อ, นามสกุล</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                <span><strong>ข้อมูลการติดต่อ:</strong> อีเมลมหาวิทยาลัย (@mail.rmutt.ac.th)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                <span><strong>ข้อมูลการเข้าใช้งาน:</strong> รหัสผ่าน (เข้ารหัส), Log Files, IP Address</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                <span><strong>ข้อมูลการแจ้งซ่อม:</strong> รายละเอียดอุปกรณ์, รูปภาพ, ประวัติการซ่อม</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">3</span>
                            ฐานกฎหมายในการประมวลผล (PDPA มาตรา 24)
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">ความยินยอม</span>
                                <span className="text-gray-500">การสมัครสมาชิก</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">การปฏิบัติตามสัญญา</span>
                                <span className="text-gray-500">การให้บริการแจ้งซ่อม</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">หน้าที่ตามกฎหมาย</span>
                                <span className="text-gray-500">การเก็บ Log (พ.ร.บ. คอมพิวเตอร์)</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">4</span>
                            วัตถุประสงค์การใช้ข้อมูล
                        </h3>
                        <ul className="space-y-1">
                            <li>✓ การยืนยันตัวตนผู้ใช้งาน</li>
                            <li>✓ การให้บริการแจ้งซ่อมและติดตามสถานะ</li>
                            <li>✓ การส่ง OTP และแจ้งเตือนสถานะ</li>
                            <li>✓ การรักษาความปลอดภัยระบบ</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">5</span>
                            การเปิดเผยข้อมูล
                        </h3>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                            <p className="text-red-700 font-medium text-xs">⚠️ เราไม่จำหน่ายข้อมูลส่วนบุคคลให้บุคคลภายนอก</p>
                        </div>
                        <p>ข้อมูลอาจเปิดเผยแก่: ผู้ดูแลระบบ, หน่วยงานภายในมหาวิทยาลัย, หรือตามกระบวนการทางกฎหมาย</p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">6</span>
                            ระยะเวลาการเก็บรักษา
                        </h3>
                        <p>เก็บรักษาตราบเท่าที่ท่านเป็นผู้ใช้งาน • Log การใช้งานเก็บอย่างน้อย 90 วันตาม พ.ร.บ. คอมพิวเตอร์</p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">7</span>
                            มาตรการความปลอดภัย
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-lg p-2 text-xs">🔒 เข้ารหัสรหัสผ่าน (Hash & Salt)</div>
                            <div className="bg-gray-50 rounded-lg p-2 text-xs">🔐 HTTPS/SSL ตลอดการใช้งาน</div>
                            <div className="bg-gray-50 rounded-lg p-2 text-xs">👤 จำกัดสิทธิ์การเข้าถึง</div>
                            <div className="bg-gray-50 rounded-lg p-2 text-xs">🛡️ Firewall & Monitoring</div>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">8</span>
                            คุกกี้และเทคโนโลยีติดตาม
                        </h3>
                        <p>เราใช้คุกกี้ที่จำเป็นเท่านั้น: Session Cookie, CSRF Token, Remember Token (ถ้าเลือก)</p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">9</span>
                            สิทธิของเจ้าของข้อมูล (8 ประการ)
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">1</span> สิทธิในการเข้าถึง</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">2</span> สิทธิในการแก้ไข</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">3</span> สิทธิในการลบ</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">4</span> สิทธิในการระงับ</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">5</span> สิทธิในการคัดค้าน</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">6</span> สิทธิในการโอนย้าย</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">7</span> สิทธิในการถอนความยินยอม</div>
                            <div className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">8</span> สิทธิในการร้องเรียน</div>
                        </div>
                    </section>

                    {/* Section 10-13 */}
                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">10</span>
                            การโอนข้อมูลข้ามแดน
                        </h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-green-700 font-medium text-xs">🇹🇭 ข้อมูลของท่านจะถูกเก็บรักษาภายในประเทศไทยเท่านั้น</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">11</span>
                            การเปลี่ยนแปลงนโยบาย
                        </h3>
                        <p>เราจะแจ้งให้ทราบผ่านอีเมลหรือประกาศในระบบเมื่อมีการเปลี่ยนแปลงที่สำคัญ</p>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">12</span>
                            ข้อจำกัดความรับผิดชอบ
                        </h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-700 text-xs">⚠️ แม้เราใช้มาตรการความปลอดภัยขั้นสูง แต่ไม่สามารถรับประกันได้ว่าระบบจะปราศจากข้อผิดพลาด 100%</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">13</span>
                            ติดต่อเรา
                        </h3>
                        <div className="bg-gray-800 rounded-xl p-4 text-white text-xs">
                            <p className="font-semibold mb-1">ภาควิชาวิศวกรรมคอมพิวเตอร์</p>
                            <p className="text-gray-400">คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี</p>
                            <p className="text-orange-400 mt-1">📧 cpe@rmutt.ac.th</p>
                        </div>
                    </section>

                    {/* End of content marker */}
                    <div className="text-center pt-4 pb-2">
                        <p className="text-gray-400 text-xs">— จบเนื้อหานโยบายความเป็นส่วนตัว —</p>
                        <p className="text-gray-500 text-xs mt-1">ปรับปรุงล่าสุด: 29 มกราคม 2569</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href={route('privacy.policy')}
                            target="_blank"
                            className="text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            ดูฉบับเต็ม
                        </Link>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={onAccept}
                                disabled={!hasScrolledToBottom}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${hasScrolledToBottom
                                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {hasScrolledToBottom ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        ฉันยอมรับ
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                        เลื่อนอ่านให้จบก่อน
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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

    const handlePrivacyAccept = () => {
        setData('terms', true);
        setShowPrivacyModal(false);
    };

    const submit = (e) => {
        e.preventDefault();

        // Combine names
        data.name = `${data.firstName} ${data.lastName}`.trim();

        post(route('register'), {
            preserveScroll: true,
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
            <Head title="ลงทะเบียน" />

            {/* Privacy Policy Modal */}
            <PrivacyPolicyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                onAccept={handlePrivacyAccept}
            />

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
                            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
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
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:bg-white transition-all"
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
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:bg-white transition-all"
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
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:bg-white transition-all"
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
                                        className="text-xs text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors"
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
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative space-y-1">
                                <div className="flex justify-between items-center">
                                    <InputLabel htmlFor="password_confirmation" value="ยืนยันรหัสผ่าน" className="text-gray-700 font-medium" />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-xs text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" /></svg> ซ่อนรหัสผ่าน</>
                                        ) : (
                                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> แสดงรหัสผ่าน</>
                                        )}
                                    </button>
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                    required
                                />
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
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:bg-white transition-all"
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
                                <InputError message={errors.otp} className="mt-1" />
                            </div>

                            {/* Terms */}
                            <div className="block pt-2">
                                <div
                                    onClick={() => {
                                        if (!data.terms) {
                                            setShowPrivacyModal(true);
                                        }
                                    }}
                                    className="flex items-center cursor-pointer group"
                                >
                                    <div className="relative flex items-center">
                                        <div
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${data.terms
                                                ? 'bg-orange-500 border-orange-500'
                                                : 'border-gray-300 bg-white hover:border-orange-400'
                                                }`}
                                        >
                                            {data.terms && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="ms-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                        ฉันยอมรับ{' '}
                                        <span className="text-orange-500 hover:text-orange-600 font-semibold underline decoration-2 underline-offset-2">
                                            นโยบายความเป็นส่วนตัว
                                        </span>
                                        {!data.terms && (
                                            <span className="text-gray-400 text-xs ml-2">(กดเพื่ออ่านและยอมรับ)</span>
                                        )}
                                    </span>
                                </div>
                                {data.terms && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1 ml-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        คุณได้ยอมรับนโยบายความเป็นส่วนตัวแล้ว
                                    </p>
                                )}
                                <InputError message={errors.terms} className="mt-1" />
                            </div>

                            <div className="flex flex-col gap-4 pt-6">
                                <PrimaryButton
                                    className="w-full justify-center bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-600 hover:via-rose-600 hover:to-pink-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                    disabled={processing}
                                >
                                    <span className="flex items-center gap-2">
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                กำลังลงทะเบียน...
                                            </>
                                        ) : (
                                            <>
                                                ลงทะเบียน
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                            </>
                                        )}
                                    </span>
                                </PrimaryButton>

                                <div className="text-center text-sm text-gray-500 mt-2">
                                    มีบัญชีผู้ใช้งานแล้ว? <Link href={route('login')} className="text-orange-500 font-bold hover:underline">เข้าสู่ระบบ</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
