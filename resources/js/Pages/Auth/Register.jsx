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
                    className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-gray-700"
                >
                    {/* Section 1 - บทนำ */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">1</span>
                            บทนำ
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[15px] leading-relaxed text-gray-700">
                                ระบบ <strong className="text-gray-900">CPE Repair System</strong> ("ระบบ") ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของท่าน ("ผู้ใช้งาน")
                                นโยบายฉบับนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และรักษาความปลอดภัยข้อมูลส่วนบุคคลของท่าน
                                ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 <strong className="text-gray-900">(PDPA)</strong>
                            </p>
                        </div>
                    </section>

                    {/* Section 2 - ข้อมูลที่เก็บรวบรวม */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">2</span>
                            ข้อมูลที่เราเก็บรวบรวม
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">เพื่อให้ท่านสามารถใช้งานระบบแจ้งซ่อมและติดตามสถานะได้ เราเก็บรวบรวมข้อมูลดังต่อไปนี้</p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-lg">📋</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">ข้อมูลระบุตัวตน</h4>
                                    <p className="text-sm text-gray-600 mt-0.5">ชื่อ, นามสกุล (เพื่อยืนยันตัวตนว่าเป็นบุคลากร/นักศึกษาจริง)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg">📧</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">ข้อมูลการติดต่อ</h4>
                                    <p className="text-sm text-gray-600 mt-0.5">อีเมลมหาวิทยาลัย (@mail.rmutt.ac.th) เพื่อรับรหัส OTP และแจ้งเตือนสถานะ</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-lg">🔐</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">ข้อมูลการเข้าใช้งาน</h4>
                                    <p className="text-sm text-gray-600 mt-0.5">รหัสผ่าน (เข้ารหัส), บันทึกการเข้าสู่ระบบ (Log Files)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-lg">🔧</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">ข้อมูลการแจ้งซ่อม</h4>
                                    <p className="text-sm text-gray-600 mt-0.5">รายละเอียดอุปกรณ์, รูปภาพความเสียหาย, ประวัติการส่งซ่อม</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 - ฐานกฎหมาย */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">3</span>
                            ฐานกฎหมายในการประมวลผล
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">ตาม PDPA มาตรา 24 เราประมวลผลข้อมูลของท่านภายใต้ฐานกฎหมายดังนี้</p>
                        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">ฐานกฎหมาย</th>
                                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">กิจกรรมที่เกี่ยวข้อง</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-900">ความยินยอม (Consent)</td>
                                        <td className="px-4 py-3 text-gray-600">การสมัครสมาชิกและลงทะเบียนใช้งานระบบ</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                                        <td className="px-4 py-3 font-semibold text-gray-900">การปฏิบัติตามสัญญา</td>
                                        <td className="px-4 py-3 text-gray-600">การให้บริการแจ้งซ่อม, ติดตามสถานะ และแจ้งเตือน</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-900">หน้าที่ตามกฎหมาย</td>
                                        <td className="px-4 py-3 text-gray-600">การเก็บ Log Files ตาม พ.ร.บ. คอมพิวเตอร์ (≥ 90 วัน)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                                        <td className="px-4 py-3 font-semibold text-gray-900">ประโยชน์อันชอบธรรม</td>
                                        <td className="px-4 py-3 text-gray-600">การรักษาความปลอดภัยระบบและป้องกันการโจมตี</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 4 - วัตถุประสงค์ */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">4</span>
                            วัตถุประสงค์การใช้ข้อมูล
                        </h3>
                        <div className="space-y-2.5">
                            {[
                                { icon: '🔑', title: 'การยืนยันตัวตน', desc: 'เพื่อให้มั่นใจว่าผู้ใช้งานเป็นเจ้าของบัญชีและมีสิทธิ์ในระบบ' },
                                { icon: '🔧', title: 'การให้บริการ', desc: 'เพื่อดำเนินการรับแจ้งซ่อม, ติดตามสถานะ และประสานงานกับช่างเทคนิค' },
                                { icon: '📬', title: 'การติดต่อสื่อสาร', desc: 'เพื่อส่งรหัส OTP, แจ้งเตือนสถานะงานซ่อม หรือข่าวสารที่เกี่ยวข้อง' },
                                { icon: '🛡️', title: 'ความปลอดภัย', desc: 'เพื่อตรวจสอบและป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                                    <div>
                                        <span className="font-bold text-gray-900 text-sm">{item.title}:</span>
                                        <span className="text-gray-600 text-sm ml-1">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5 - การเปิดเผย */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">5</span>
                            การเปิดเผยและส่งต่อข้อมูล
                        </h3>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 text-xl">🚫</span>
                            <p className="text-red-800 font-bold text-sm">ทางเราไม่มีนโยบายจำหน่ายข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3 flex items-start gap-3">
                            <span className="flex-shrink-0 text-xl mt-0.5">📌</span>
                            <p className="text-blue-800 text-sm leading-relaxed">
                                <strong>การยินยอมโดยผู้ใช้งาน:</strong> เมื่อท่านสมัครสมาชิกและยอมรับนโยบายนี้ ถือว่าท่านยินยอมให้ระบบเก็บรวบรวม
                                ใช้ และเปิดเผยข้อมูลที่เกี่ยวข้องกับการแจ้งซ่อมแก่เจ้าหน้าที่เทคนิคและผู้ดูแลระบบ
                                เพื่อดำเนินการตามวัตถุประสงค์ของระบบได้
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">ข้อมูลของท่านอาจถูกเปิดเผยได้ในกรณีดังต่อไปนี้เท่านั้น:</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5 font-bold">•</span>
                                <span><strong className="text-gray-900">ผู้ดูแลระบบและเจ้าหน้าที่เทคนิค:</strong> <span className="text-gray-600">เพื่อดำเนินการซ่อมแซมและแก้ไขปัญหาตามที่ท่านแจ้ง</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5 font-bold">•</span>
                                <span><strong className="text-gray-900">หน่วยงานภายในมหาวิทยาลัย:</strong> <span className="text-gray-600">กรณีตรวจสอบทรัพย์สินหรือยืนยันสถานภาพ</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5 font-bold">•</span>
                                <span><strong className="text-gray-900">การบังคับใช้กฎหมาย:</strong> <span className="text-gray-600">หากได้รับการร้องขอตามกระบวนการทางกฎหมาย</span></span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 6 - ระยะเวลา */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">6</span>
                            ระยะเวลาการเก็บรักษา
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                            <span className="flex-shrink-0 text-2xl mt-0.5">⏱️</span>
                            <div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านไว้ตราบเท่าที่ท่านยังมีสถานภาพเป็นผู้ใช้งานระบบ
                                    หรือตามความจำเป็นเพื่อวัตถุประสงค์ทางกฎหมาย
                                </p>
                                <p className="text-blue-700 font-bold text-sm mt-2">
                                    📝 ข้อมูล Log การใช้งานจะถูกเก็บรักษาไว้อย่างน้อย 90 วัน ตาม พ.ร.บ. คอมพิวเตอร์
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 - ความปลอดภัย */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">7</span>
                            มาตรการความปลอดภัย
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: '🔒', title: 'เข้ารหัสรหัสผ่าน', desc: 'Hash & Salt ในฐานข้อมูล' },
                                { icon: '🔐', title: 'HTTPS/SSL', desc: 'การเชื่อมต่อที่ปลอดภัย' },
                                { icon: '👤', title: 'จำกัดสิทธิ์', desc: 'เฉพาะเจ้าหน้าที่ที่เกี่ยวข้อง' },
                                { icon: '🛡️', title: 'Firewall & Monitoring', desc: 'ป้องกันการโจมตีทางไซเบอร์' },
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2.5 border border-gray-100">
                                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-xs">{item.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 8 - คุกกี้ */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">8</span>
                            คุกกี้และเทคโนโลยีติดตาม
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">ระบบของเราใช้คุกกี้ที่จำเป็นสำหรับการทำงานดังนี้</p>
                        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-4 py-2.5 text-left font-bold text-xs uppercase tracking-wide">ประเภท</th>
                                        <th className="px-4 py-2.5 text-left font-bold text-xs uppercase tracking-wide">วัตถุประสงค์</th>
                                        <th className="px-4 py-2.5 text-left font-bold text-xs uppercase tracking-wide">ระยะเวลา</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2.5 font-semibold text-gray-900">Session Cookie</td>
                                        <td className="px-4 py-2.5 text-gray-600">รักษาสถานะการเข้าสู่ระบบ</td>
                                        <td className="px-4 py-2.5 text-gray-600">ปิดเบราว์เซอร์</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                                        <td className="px-4 py-2.5 font-semibold text-gray-900">CSRF Token</td>
                                        <td className="px-4 py-2.5 text-gray-600">ป้องกันการโจมตี CSRF</td>
                                        <td className="px-4 py-2.5 text-gray-600">ต่อ Session</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2.5 font-semibold text-gray-900">Remember Token</td>
                                        <td className="px-4 py-2.5 text-gray-600">จดจำการเข้าสู่ระบบ</td>
                                        <td className="px-4 py-2.5 text-gray-600">30 วัน</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-gray-400 text-xs mt-2 italic">* เราไม่ใช้คุกกี้เพื่อการโฆษณาหรือติดตามพฤติกรรมข้ามเว็บไซต์</p>
                    </section>

                    {/* Section 9 - สิทธิ */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">9</span>
                            สิทธิของเจ้าของข้อมูล (8 ประการ)
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">ตาม PDPA ท่านมีสิทธิดังต่อไปนี้</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                { num: 1, title: 'สิทธิในการเข้าถึง', desc: 'ขอเข้าถึงข้อมูลส่วนบุคคลของท่าน' },
                                { num: 2, title: 'สิทธิในการแก้ไข', desc: 'ขอแก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน' },
                                { num: 3, title: 'สิทธิในการลบ', desc: 'ขอให้ลบข้อมูลที่ไม่จำเป็น' },
                                { num: 4, title: 'สิทธิในการระงับ', desc: 'ขอระงับการประมวลผลชั่วคราว' },
                                { num: 5, title: 'สิทธิในการคัดค้าน', desc: 'คัดค้านการประมวลผลข้อมูล' },
                                { num: 6, title: 'สิทธิในการโอนย้าย', desc: 'ขอรับข้อมูลในรูปแบบที่อ่านได้' },
                                { num: 7, title: 'สิทธิถอนความยินยอม', desc: 'ถอนความยินยอมได้ทุกเมื่อ' },
                                { num: 8, title: 'สิทธิในการร้องเรียน', desc: 'ร้องเรียนต่อหน่วยงานกำกับดูแล' },
                            ].map((right) => (
                                <div key={right.num} className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl p-3 border border-orange-100/60">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs flex items-center justify-center font-bold shadow-sm">{right.num}</span>
                                        <h4 className="font-bold text-gray-900 text-xs">{right.title}</h4>
                                    </div>
                                    <p className="text-xs text-gray-600 ml-8">{right.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-500 mt-3 text-xs">
                            หากท่านต้องการใช้สิทธิใดๆ กรุณาติดต่อผู้ดูแลระบบ เราจะดำเนินการภายใน <strong>30 วัน</strong>นับจากวันที่ได้รับคำขอ
                        </p>
                    </section>

                    {/* Section 10 - โอนข้อมูล */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">10</span>
                            การโอนข้อมูลข้ามแดน
                        </h3>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-3xl flex-shrink-0">🇹🇭</span>
                            <div>
                                <p className="text-green-800 font-bold text-sm">ข้อมูลของท่านจะถูกเก็บรักษาภายในประเทศไทยเท่านั้น</p>
                                <p className="text-green-700 text-xs mt-0.5">เราไม่มีนโยบายโอนข้อมูลส่วนบุคคลไปยังต่างประเทศ</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 11 - การเปลี่ยนแปลง */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">11</span>
                            การเปลี่ยนแปลงนโยบาย
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว โดยจะแจ้งให้ท่านทราบผ่าน:</p>
                        <ul className="space-y-1.5 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span>
                                การแจ้งเตือนทางอีเมล (กรณีเปลี่ยนแปลงสำคัญ)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span>
                                การประกาศบนหน้าเข้าสู่ระบบ
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span>
                                การอัปเดตวันที่ "ปรับปรุงล่าสุด" บนหน้านี้
                            </li>
                        </ul>
                    </section>

                    {/* Section 12 - ข้อจำกัด */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">12</span>
                            ข้อจำกัดความรับผิดชอบ
                        </h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3 flex items-start gap-3">
                            <span className="flex-shrink-0 text-xl mt-0.5">⚠️</span>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                ระบบนี้จัดทำขึ้นเพื่ออำนวยความสะดวกในการแจ้งซ่อมภายในหน่วยงาน แม้เราจะใช้มาตรการความปลอดภัยขั้นสูง
                                แต่เราไม่สามารถรับประกันได้ว่าระบบจะปราศจากข้อผิดพลาด หรือการโจมตีจากไวรัส/มัลแวร์ 100%
                            </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 mb-2">ผู้พัฒนาและผู้ดูแลระบบจะไม่รับผิดชอบในกรณีดังต่อไปนี้:</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                                <span className="text-gray-700">ความเสียหายที่เกิดจากผู้ใช้งาน<strong className="text-gray-900">เปิดเผยข้อมูลส่วนบุคคลด้วยตนเอง</strong> เช่น แชร์รหัสผ่าน หรือเปิดเผยข้อมูลบัญชีให้ผู้อื่น</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                                <span className="text-gray-700">เหตุสุดวิสัยที่อยู่นอกเหนือการควบคุม เช่น <strong className="text-gray-900">การโจมตีทางไซเบอร์, ภัยธรรมชาติ</strong> หรือระบบของบุคคลที่สามล่ม</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                                <span className="text-gray-700">ข้อมูลที่ผู้ใช้งาน<strong className="text-gray-900">กรอกไม่ถูกต้อง</strong>หรือไม่เป็นปัจจุบัน ซึ่งส่งผลต่อการให้บริการ</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                                <span className="text-gray-700">ผลกระทบจากการที่ผู้ใช้งาน<strong className="text-gray-900">ไม่ปฏิบัติตามข้อกำหนด</strong>การใช้งานระบบ หรือใช้ระบบในทางที่ผิดวัตถุประสงค์</span>
                            </li>
                        </ul>
                        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mt-3 flex items-start gap-3">
                            <span className="flex-shrink-0 text-xl mt-0.5">📜</span>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                การกดยอมรับนโยบายนี้ถือว่าท่านได้อ่าน เข้าใจ และยินยอมปฏิบัติตามเงื่อนไขทั้งหมดข้างต้นแล้ว
                                หากท่านไม่เห็นด้วยกับนโยบายนี้ กรุณาอย่าดำเนินการลงทะเบียนใช้งานระบบ
                            </p>
                        </div>
                    </section>

                    {/* Section 13 - ติดต่อ */}
                    <section>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">13</span>
                            ติดต่อเรา
                        </h3>
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
                            <h4 className="font-bold text-sm mb-3">ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)</h4>
                            <div className="space-y-2.5 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-orange-400 flex-shrink-0">🏢</span>
                                    <div>
                                        <p className="font-semibold">ภาควิชาวิศวกรรมคอมพิวเตอร์</p>
                                        <p className="text-gray-400 text-xs">คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-orange-400 flex-shrink-0">📍</span>
                                    <p className="text-gray-300 text-xs">39 หมู่ 1 ถ.รังสิต-นครนายก ต.คลองหก อ.คลองหลวง จ.ปทุมธานี 12110</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-400 flex-shrink-0">📧</span>
                                    <span className="text-orange-400 font-semibold">cpe@rmutt.ac.th</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* End of content marker */}
                    <div className="text-center pt-6 pb-2 border-t border-gray-100">
                        <p className="text-gray-400 text-xs font-medium">— จบเนื้อหานโยบายความเป็นส่วนตัว —</p>
                        <p className="text-gray-500 text-xs mt-1.5 flex items-center justify-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            ปรับปรุงล่าสุด: 12 มีนาคม 2569
                        </p>
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
    const [otpStatus, setOtpStatus] = useState('idle'); // idle, pending, sent, failed
    const [otpRequestId, setOtpRequestId] = useState(null);

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
        setOtpStatus('idle');

        if (!data.email) {
            setError('email', 'กรุณากรอกอีเมลก่อนขอรหัส OTP');
            return;
        }

        if (!data.email.endsWith('@mail.rmutt.ac.th')) {
            setError('email', 'อีเมลต้องลงท้ายด้วย @mail.rmutt.ac.th');
            return;
        }

        setIsOtpSending(true);
        setOtpStatus('pending');
        setOtpMessage('กำลังส่งรหัส OTP...');

        try {
            const response = await axios.post(route('send-otp'), { email: data.email });

            // ✅ Instant response - ไม่ต้อง poll เพราะ backend dispatch แล้ว
            setOtpStatus('sent');
            setOtpMessage('✅ รหัส OTP กำลังถูกส่งไปยังอีเมลของคุณ (กรุณาตรวจสอบภายใน 30 วินาที รวมถึงโฟลเดอร์ Junk/Spam)');
            setTimer(60);
            setIsOtpSending(false);

        } catch (error) {
            setIsOtpSending(false);
            setOtpStatus('idle');

            if (error.response?.status === 429) {
                // Rate limit
                const waitSeconds = error.response.data.wait_seconds || 60;
                setTimer(waitSeconds);
                setOtpMessage(`กรุณารอ ${waitSeconds} วินาที ก่อนขอรหัสใหม่`);
            } else if (error.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach(key => {
                    setError(key, error.response.data.errors[key][0]);
                });
            } else {
                setError('email', 'เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
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
                    src="/images/register-side-bg.webp"
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
                                {otpMessage && (
                                    <p className={`text-sm mt-1 flex items-center gap-1 ${otpStatus === 'sent' ? 'text-green-600' :
                                        otpStatus === 'failed' ? 'text-red-600' :
                                            otpStatus === 'timeout' ? 'text-orange-600' :
                                                otpStatus === 'pending' ? 'text-blue-600' :
                                                    'text-gray-600'
                                        }`}>
                                        {otpStatus === 'pending' && (
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {otpMessage}
                                    </p>
                                )}
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
