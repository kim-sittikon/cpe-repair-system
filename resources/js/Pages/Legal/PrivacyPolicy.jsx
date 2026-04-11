import { Head, Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState('intro');
    const contentRef = useRef(null);

    const sections = [
        { id: 'intro', title: '1. บทนำ' },
        { id: 'data-collected', title: '2. ข้อมูลที่เราเก็บรวบรวม' },
        { id: 'legal-basis', title: '3. ฐานกฎหมายในการประมวลผล' },
        { id: 'purpose', title: '4. วัตถุประสงค์การใช้ข้อมูล' },
        { id: 'disclosure', title: '5. การเปิดเผยข้อมูล' },
        { id: 'retention', title: '6. ระยะเวลาการเก็บรักษา' },
        { id: 'security', title: '7. มาตรการความปลอดภัย' },
        { id: 'cookies', title: '8. คุกกี้และเทคโนโลยีติดตาม' },
        { id: 'rights', title: '9. สิทธิของเจ้าของข้อมูล' },
        { id: 'transfer', title: '10. การโอนข้อมูลข้ามแดน' },
        { id: 'changes', title: '11. การเปลี่ยนแปลงนโยบาย' },
        { id: 'disclaimer', title: '12. ข้อจำกัดความรับผิดชอบ' },
        { id: 'contact', title: '13. ติดต่อเรา' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Head title="นโยบายความเป็นส่วนตัว" />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">นโยบายความเป็นส่วนตัว</h1>
                                <p className="text-xs text-gray-500">CPE Repair System</p>
                            </div>
                        </div>
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            กลับหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Sidebar - Table of Contents */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <nav className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">สารบัญ</h3>
                            <ul className="space-y-2">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${activeSection === section.id
                                                ? 'bg-orange-50 text-orange-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {section.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3" ref={contentRef}>
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Hero Section */}
                            <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-8 py-10 text-white">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-extrabold">นโยบายความเป็นส่วนตัว</h1>
                                        <p className="text-white/80 mt-1">นโยบายความเป็นส่วนตัว</p>
                                    </div>
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    ระบบ CPE Repair System ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน
                                    นโยบายนี้จัดทำขึ้นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    ปรับปรุงล่าสุด: 29 มกราคม 2569
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 lg:p-10 prose prose-gray max-w-none">

                                {/* Section 1 */}
                                <section id="intro" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
                                        บทนำ
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        ระบบ CPE Repair System ("ทางเรา" หรือ "ระบบ") ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของท่าน ("ผู้ใช้งาน")
                                        นโยบายนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และรักษาความปลอดภัยของข้อมูลส่วนบุคคลของท่าน
                                        ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และพระราชบัญญัติว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2550 (และที่แก้ไขเพิ่มเติม)
                                    </p>
                                </section>

                                {/* Section 2 */}
                                <section id="data-collected" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
                                        ข้อมูลที่เราเก็บรวบรวม
                                    </h2>
                                    <p className="text-gray-600 mb-4">เพื่อให้ท่านสามารถใช้งานระบบแจ้งซ่อมและติดตามสถานะได้ เราเก็บรวบรวมข้อมูลดังต่อไปนี้:</p>

                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-orange-400">
                                            <h4 className="font-semibold text-gray-900 mb-2">📋 ข้อมูลระบุตัวตน</h4>
                                            <p className="text-gray-600 text-sm">ชื่อ, นามสกุล (เพื่อยืนยันตัวตนว่าเป็นบุคลากร/นักศึกษาจริง)</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-400">
                                            <h4 className="font-semibold text-gray-900 mb-2">📧 ข้อมูลการติดต่อ</h4>
                                            <p className="text-gray-600 text-sm">อีเมลมหาวิทยาลัย (@mail.rmutt.ac.th) เพื่อรับรหัส OTP, แจ้งเตือนสถานะการซ่อม และยืนยันสิทธิ์</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-400">
                                            <h4 className="font-semibold text-gray-900 mb-2">🔐 ข้อมูลการเข้าใช้งาน</h4>
                                            <p className="text-gray-600 text-sm">รหัสผ่าน (เข้ารหัส), บันทึกการเข้าสู่ระบบ (Log Files), IP Address, ประเภทอุปกรณ์ และเบราว์เซอร์</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-400">
                                            <h4 className="font-semibold text-gray-900 mb-2">🔧 ข้อมูลการแจ้งซ่อม</h4>
                                            <p className="text-gray-600 text-sm">รายละเอียดอุปกรณ์, รูปภาพความเสียหาย และประวัติการส่งซ่อมทั้งหมด</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3 */}
                                <section id="legal-basis" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
                                        ฐานกฎหมายในการประมวลผลข้อมูล
                                    </h2>
                                    <p className="text-gray-600 mb-4">ตาม PDPA มาตรา 24 เราประมวลผลข้อมูลของท่านภายใต้ฐานกฎหมายดังนี้:</p>

                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">ฐานกฎหมาย</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">กิจกรรมที่เกี่ยวข้อง</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-4 py-3 font-medium text-gray-900">ความยินยอม (Consent)</td>
                                                    <td className="px-4 py-3 text-gray-600">การสมัครสมาชิกและลงทะเบียนใช้งานระบบ</td>
                                                </tr>
                                                <tr className="bg-gray-50/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">การปฏิบัติตามสัญญา</td>
                                                    <td className="px-4 py-3 text-gray-600">การให้บริการแจ้งซ่อม, ติดตามสถานะ และแจ้งเตือน</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium text-gray-900">หน้าที่ตามกฎหมาย</td>
                                                    <td className="px-4 py-3 text-gray-600">การเก็บ Log Files ตาม พ.ร.บ. คอมพิวเตอร์ (อย่างน้อย 90 วัน)</td>
                                                </tr>
                                                <tr className="bg-gray-50/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">ประโยชน์อันชอบธรรม</td>
                                                    <td className="px-4 py-3 text-gray-600">การรักษาความปลอดภัยระบบและป้องกันการโจมตี</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Section 4 */}
                                <section id="purpose" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">4</span>
                                        วัตถุประสงค์การใช้ข้อมูล
                                    </h2>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                            <div>
                                                <span className="font-medium text-gray-900">การยืนยันตัวตน:</span>
                                                <span className="text-gray-600 ml-1">เพื่อให้มั่นใจว่าผู้ใช้งานเป็นเจ้าของบัญชีและมีสิทธิ์ในระบบ</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                            <div>
                                                <span className="font-medium text-gray-900">การให้บริการ:</span>
                                                <span className="text-gray-600 ml-1">เพื่อดำเนินการรับแจ้งซ่อม, ติดตามสถานะ และประสานงานกับช่างเทคนิค</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                            <div>
                                                <span className="font-medium text-gray-900">การติดต่อสื่อสาร:</span>
                                                <span className="text-gray-600 ml-1">เพื่อส่งรหัส OTP, แจ้งเตือนสถานะงานซ่อม หรือข่าวสารที่เกี่ยวข้อง</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                            <div>
                                                <span className="font-medium text-gray-900">ความปลอดภัย:</span>
                                                <span className="text-gray-600 ml-1">เพื่อตรวจสอบและป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต</span>
                                            </div>
                                        </li>
                                    </ul>
                                </section>

                                {/* Section 5 */}
                                <section id="disclosure" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">5</span>
                                        การเปิดเผยและส่งต่อข้อมูล
                                    </h2>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                                        <p className="text-red-800 font-medium">⚠️ ทางเรา ไม่มีนโยบายจำหน่ายข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก</p>
                                    </div>
                                    <p className="text-gray-600 mb-3">ข้อมูลของท่านอาจถูกเปิดเผยได้ในกรณีดังต่อไปนี้เท่านั้น:</p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span><strong>ผู้ดูแลระบบและเจ้าหน้าที่เทคนิค:</strong> เพื่อดำเนินการซ่อมแซมและแก้ไขปัญหา</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span><strong>หน่วยงานภายในมหาวิทยาลัย:</strong> ในกรณีตรวจสอบทรัพย์สินหรือยืนยันสถานภาพ</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span><strong>การบังคับใช้กฎหมาย:</strong> หากได้รับการร้องขอตามกระบวนการทางกฎหมาย</span>
                                        </li>
                                    </ul>
                                </section>

                                {/* Section 6 */}
                                <section id="retention" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">6</span>
                                        ระยะเวลาการเก็บรักษาข้อมูล
                                    </h2>
                                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านไว้ตราบเท่าที่ท่านยังมีสถานภาพเป็นผู้ใช้งานระบบ
                                                    หรือตามความจำเป็นเพื่อวัตถุประสงค์ทางกฎหมาย
                                                </p>
                                                <p className="text-blue-700 font-medium mt-2">
                                                    📝 ข้อมูล Log การใช้งานจะถูกเก็บรักษาไว้อย่างน้อย 90 วัน ตาม พ.ร.บ. คอมพิวเตอร์
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 7 */}
                                <section id="security" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">7</span>
                                        มาตรการความปลอดภัย
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                                            <span className="text-2xl">🔒</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">การเข้ารหัสรหัสผ่าน</h4>
                                                <p className="text-sm text-gray-600">ใช้ Hash & Salt ในฐานข้อมูล</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                                            <span className="text-2xl">🔐</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">HTTPS/SSL</h4>
                                                <p className="text-sm text-gray-600">การเชื่อมต่อที่ปลอดภัยตลอดการใช้งาน</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                                            <span className="text-2xl">👤</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">การจำกัดสิทธิ์</h4>
                                                <p className="text-sm text-gray-600">เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                                            <span className="text-2xl">🛡️</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Firewall & Monitoring</h4>
                                                <p className="text-sm text-gray-600">ระบบป้องกันการโจมตีทางไซเบอร์</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 8 */}
                                <section id="cookies" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">8</span>
                                        คุกกี้และเทคโนโลยีติดตาม
                                    </h2>
                                    <p className="text-gray-600 mb-4">ระบบของเราใช้คุกกี้ที่จำเป็นสำหรับการทำงานดังนี้:</p>
                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">ประเภท</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">วัตถุประสงค์</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">ระยะเวลา</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-4 py-3 font-medium text-gray-900">Session Cookie</td>
                                                    <td className="px-4 py-3 text-gray-600">รักษาสถานะการเข้าสู่ระบบ</td>
                                                    <td className="px-4 py-3 text-gray-600">หมดอายุเมื่อปิดเบราว์เซอร์</td>
                                                </tr>
                                                <tr className="bg-gray-50/50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">CSRF Token</td>
                                                    <td className="px-4 py-3 text-gray-600">ป้องกันการโจมตี CSRF</td>
                                                    <td className="px-4 py-3 text-gray-600">ต่อ Session</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium text-gray-900">Remember Token</td>
                                                    <td className="px-4 py-3 text-gray-600">จดจำการเข้าสู่ระบบ (ถ้าเลือก)</td>
                                                    <td className="px-4 py-3 text-gray-600">30 วัน</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-3">* เราไม่ใช้คุกกี้เพื่อการโฆษณาหรือติดตามพฤติกรรมข้ามเว็บไซต์</p>
                                </section>

                                {/* Section 9 */}
                                <section id="rights" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">9</span>
                                        สิทธิของเจ้าของข้อมูล (8 ประการ)
                                    </h2>
                                    <p className="text-gray-600 mb-4">ตาม PDPA ท่านมีสิทธิดังต่อไปนี้:</p>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {[
                                            { num: 1, title: 'สิทธิในการเข้าถึง', desc: 'ขอเข้าถึงข้อมูลส่วนบุคคลของท่าน' },
                                            { num: 2, title: 'สิทธิในการแก้ไข', desc: 'ขอแก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน' },
                                            { num: 3, title: 'สิทธิในการลบ', desc: 'ขอให้ลบข้อมูลที่ไม่จำเป็น' },
                                            { num: 4, title: 'สิทธิในการระงับ', desc: 'ขอระงับการประมวลผลชั่วคราว' },
                                            { num: 5, title: 'สิทธิในการคัดค้าน', desc: 'คัดค้านการประมวลผลข้อมูล' },
                                            { num: 6, title: 'สิทธิในการโอนย้าย', desc: 'ขอรับข้อมูลในรูปแบบที่อ่านได้' },
                                            { num: 7, title: 'สิทธิในการถอนความยินยอม', desc: 'ถอนความยินยอมได้ทุกเมื่อ' },
                                            { num: 8, title: 'สิทธิในการร้องเรียน', desc: 'ร้องเรียนต่อหน่วยงานกำกับดูแล' },
                                        ].map((right) => (
                                            <div key={right.num} className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl p-4 border border-orange-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">{right.num}</span>
                                                    <h4 className="font-semibold text-gray-900">{right.title}</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 ml-8">{right.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mt-4 text-sm">
                                        หากท่านต้องการใช้สิทธิใดๆ กรุณาติดต่อผู้ดูแลระบบผ่านช่องทางที่ระบุด้านล่าง เราจะดำเนินการภายใน 30 วันนับจากวันที่ได้รับคำขอ
                                    </p>
                                </section>

                                {/* Section 10 */}
                                <section id="transfer" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">10</span>
                                        การโอนข้อมูลข้ามแดน
                                    </h2>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">🇹🇭</span>
                                            <div>
                                                <p className="text-green-800 font-medium">ข้อมูลของท่านจะถูกเก็บรักษาภายในประเทศไทยเท่านั้น</p>
                                                <p className="text-green-700 text-sm mt-1">เราไม่มีนโยบายโอนข้อมูลส่วนบุคคลไปยังต่างประเทศ</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 11 */}
                                <section id="changes" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">11</span>
                                        การเปลี่ยนแปลงนโยบาย
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว โดยจะแจ้งให้ท่านทราบผ่าน:
                                    </p>
                                    <ul className="mt-3 space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            การแจ้งเตือนทางอีเมล (กรณีเปลี่ยนแปลงสำคัญ)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            การประกาศบนหน้าเข้าสู่ระบบ
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            การอัปเดตวันที่ "ปรับปรุงล่าสุด" บนหน้านี้
                                        </li>
                                    </ul>
                                </section>

                                {/* Section 12 */}
                                <section id="disclaimer" className="scroll-mt-24 mb-10">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">12</span>
                                        ข้อจำกัดความรับผิดชอบ
                                    </h2>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                                        <p className="text-yellow-800 leading-relaxed">
                                            ⚠️ ระบบนี้จัดทำขึ้นเพื่ออำนวยความสะดวกในการแจ้งซ่อมภายในหน่วยงาน แม้เราจะใช้มาตรการความปลอดภัยขั้นสูง
                                            แต่เราไม่สามารถรับประกันได้ว่าระบบจะปราศจากข้อผิดพลาด หรือการโจมตีจากไวรัส/มัลแวร์ 100%
                                            ผู้ใช้งานยอมรับความเสี่ยงที่อาจเกิดขึ้นจากการใช้งานอินเทอร์เน็ต
                                        </p>
                                    </div>
                                </section>

                                {/* Section 13 */}
                                <section id="contact" className="scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">13</span>
                                        ติดต่อเรา
                                    </h2>
                                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
                                        <h4 className="font-bold text-lg mb-4">ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium">ภาควิชาวิศวกรรมคอมพิวเตอร์</p>
                                                    <p className="text-gray-400 text-sm">คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p className="text-gray-300 text-sm">39 หมู่ 1 ถ.รังสิต-นครนายก ต.คลองหก อ.คลองหลวง จ.ปทุมธานี 12110</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href="mailto:cpe@rmutt.ac.th" className="text-orange-400 hover:text-orange-300 transition-colors">cpe@rmutt.ac.th</a>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} CPE Repair System. สงวนลิขสิทธิ์.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
