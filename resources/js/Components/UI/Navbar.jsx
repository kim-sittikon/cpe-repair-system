import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/UI/Dropdown';
import NotificationToggle from '@/Components/NotificationToggle';
import InstallPWA from '@/Components/InstallPWA';

export default function Navbar() {
    // ALL HOOKS MUST BE AT THE TOP (React Rules of Hooks)
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showingNavigationDropdown) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showingNavigationDropdown]);

    // NOW we can safely check for user
    const user = auth?.user;
    if (!user) return null;

    // Safe Name Handling
    const fullNameParts = (user.name || '').split(' ');
    const firstName = fullNameParts[0] || 'User';
    const lastName = fullNameParts.slice(1).join(' ') || '';
    const userRole = user.role || 'User';

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Close menu helper
    const closeMenu = () => setShowingNavigationDropdown(false);

    // Mobile Nav Link Component
    const MobileNavLink = ({ href, children, icon, method, as }) => (
        <Link
            href={href}
            method={method}
            as={as}
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-lg mx-2 text-[15px] font-medium"
        >
            {icon && <span className="text-gray-400 group-hover:text-orange-500">{icon}</span>}
            <span>{children}</span>
        </Link>
    );

    // Collapsible Section Component
    const CollapsibleSection = ({ title, sectionKey, children, icon }) => {
        const isExpanded = expandedSections[sectionKey] ?? false;
        return (
            <div className="border-b border-gray-100 last:border-b-0">
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="flex items-center justify-between w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                            {icon}
                        </span>
                        <span className="font-semibold text-gray-800">{title}</span>
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="pb-2 pl-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // Helper for Dropdown Trigger Button (Orange Theme)
    const NavDropdownTrigger = ({ label }) => (
        <span className="inline-flex rounded-md">
            <button
                type="button"
                className="inline-flex items-center text-[15px] font-medium text-white hover:text-orange-100 focus:outline-none transition ease-in-out duration-150 font-sans tracking-wide"
            >
                {label}
                <svg
                    className="ml-1 -mr-0.5 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </span>
    );

    // Helper for Dropdown Header
    const DropdownHeader = ({ children }) => (
        <div className="block px-4 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider font-sans">
            {children}
        </div>
    );

    return (
        <nav className="bg-[#F59E0B] shadow-lg border-b border-orange-600 fixed w-full top-0 z-50 font-sans">
            <div className="w-full px-4 lg:px-8">
                <div className="flex justify-between h-16 lg:h-20 items-center">

                    {/* Left Side: Logo & System Name */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        <Link href="/dashboard" className="flex items-center gap-3 lg:gap-4 hover:opacity-90 transition-opacity">
                            <div className="shrink-0 flex items-center bg-white/10 p-2 rounded-full shadow-sm">
                                <img src="/images/rmutt-logo.webp" alt="RMUTT" className="h-8 lg:h-11 w-auto drop-shadow-sm" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-white font-semibold text-base lg:text-xl leading-none tracking-wide drop-shadow-sm mb-0.5 lg:mb-1">
                                    ระบบรับเรื่องแจ้งปัญหา
                                </span>
                                <span className="hidden lg:block text-orange-50 text-xs lg:text-sm font-light tracking-wider opacity-95">
                                    ภาควิศวกรรมคอมพิวเตอร์ (Computer Engineering Issue Reporting System)
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Side: Desktop Menu & Profile */}
                    <div className="hidden lg:flex items-center gap-8 ml-auto">

                        {/* 1. Universal Menu: แจ้งปัญหา */}
                        {/* สำหรับนักศึกษาที่ไม่มีกลุ่มงานใดๆ แสดงเมนูแบบ Links ปกติ */}
                        {user.role === 'student' && !user.job_admin && !user.job_repair && !user.job_complaint ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-[15px] font-medium text-white hover:text-orange-100 transition ease-in-out duration-150 font-sans tracking-wide"
                                >
                                    หน้าแรก
                                </Link>
                                <Link
                                    href={route('report.create')}
                                    className="text-[15px] font-medium text-white hover:text-orange-100 transition ease-in-out duration-150 font-sans tracking-wide"
                                >
                                    ฟอร์มแจ้งปัญหา
                                </Link>
                                <Link
                                    href={route('report.history')}
                                    className="text-[15px] font-medium text-white hover:text-orange-100 transition ease-in-out duration-150 font-sans tracking-wide"
                                >
                                    ประวัติการแจ้ง
                                </Link>
                            </>
                        ) : (
                            <div className="relative group">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <NavDropdownTrigger label="แจ้งปัญหา" />
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="64">
                                        <DropdownHeader>เมนูทั่วไป</DropdownHeader>
                                        <Dropdown.Link href="/dashboard">หน้าแรก</Dropdown.Link>
                                        <Dropdown.Link href={route('report.create')}>ฟอร์มแจ้งปัญหา</Dropdown.Link>
                                        <Dropdown.Link href={route('report.history')}>ประวัติการแจ้ง</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}

                        {/* 2. Repair Group (Conditional) */}
                        {user.job_repair && user.role !== 'student' && (
                            <div className="relative group">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <NavDropdownTrigger label="กลุ่มงานแจ้งซ่อม" />
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="64">
                                        <DropdownHeader>เมนูช่าง</DropdownHeader>
                                        <Dropdown.Link href={route('repairs.dashboard')}>หน้าหลัก</Dropdown.Link>
                                        <Dropdown.Link href={route('repairs.index')}>รายการแจ้งซ่อม</Dropdown.Link>
                                        <Dropdown.Link href="/announcements/create">สร้างข่าวสาร/ลบบบ</Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link href={route('repairs.jobs.index')}>ใบงานรวม</Dropdown.Link>
                                        <Dropdown.Link href={route('repairs.jobs.my')}>ใบงานของฉัน</Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link href={route('repairs.keywords')}>กำหนดคีย์เวิร์ด</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}

                        {/* 3. Complaint Group (Conditional) */}
                        {user.job_complaint && user.role !== 'student' && (
                            <div className="relative group">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <NavDropdownTrigger label="กลุ่มงานร้องเรียน" />
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="64">
                                        <DropdownHeader>เมนูร้องเรียน</DropdownHeader>
                                        <Dropdown.Link href="/complaints/dashboard">หน้าหลัก</Dropdown.Link>
                                        <Dropdown.Link href="/complaints/list">รายการร้องเรียน</Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link href="/complaints/keywords">กำหนดคีย์เวิร์ด</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}

                        {/* 4. Admin Group (Conditional) */}
                        {user.job_admin && user.role !== 'student' && (
                            <div className="relative group">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <NavDropdownTrigger label="ผู้ดูแลระบบ" />
                                    </Dropdown.Trigger>
                                    <Dropdown.Content width="64">
                                        <DropdownHeader>ผู้ดูแลระบบ</DropdownHeader>
                                        <Dropdown.Link href="/admin">หน้าหลัก</Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link href="/admin/users">จัดการผู้ใช้งาน</Dropdown.Link>
                                        <Dropdown.Link href={route('admin.users.invite')}>สร้างผู้ใช้งาน</Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link href="/admin/locations">แเพิ่มอาคาร/ห้อง</Dropdown.Link>
                                        <Dropdown.Link href="/admin/keywords">จัดการคีย์เวิร์ด</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}

                        {/* User Profile Dropdown (Separated by Divider) */}
                        <div className="h-10 w-px bg-orange-400/60"></div>

                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-3 border border-transparent text-sm leading-4 font-medium rounded-full text-white hover:bg-white/10 focus:outline-none transition ease-in-out duration-150 py-1.5 pl-1.5 pr-4"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-white text-[#F59E0B] flex items-center justify-center font-bold text-xl shadow-md ring-2 ring-white/20">
                                                {firstName[0]}
                                            </div>
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-semibold text-[15px] leading-tight">{firstName}</span>
                                                <span className="text-[11px] opacity-90 uppercase tracking-wider font-light">{userRole}</span>
                                            </div>
                                            <svg
                                                className="ml-1 h-4 w-4 opacity-70"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                    </div>

                                    {/* Notification Toggle for Desktop */}
                                    <div className="px-2 py-2 border-b border-gray-100">
                                        <NotificationToggle compact />
                                    </div>

                                    {/* PWA Install Button for Desktop */}
                                    <div className="px-2 py-2 border-b border-gray-100">
                                        <InstallPWA showInSettings />
                                    </div>

                                    <Dropdown.Link href={route('profile.edit')}>
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Profile Settings
                                        </span>
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 hover:bg-red-50">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Log Out
                                        </span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mobile Hamburger (Visible on < lg) */}
                    <div className="flex items-center lg:hidden ml-auto">
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none transition duration-150 ease-in-out"
                            aria-label={showingNavigationDropdown ? "ปิดเมนู" : "เปิดเมนู"}
                            aria-expanded={showingNavigationDropdown}
                        >
                            <svg className="h-7 w-7" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path
                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Slide-in Sidebar */}
            <div className="lg:hidden">
                {/* Dark Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${showingNavigationDropdown ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={closeMenu}
                />

                {/* Sidebar Panel */}
                <div
                    className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${showingNavigationDropdown ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Sidebar Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white text-orange-500 flex items-center justify-center font-bold text-lg shadow-md">
                                {firstName[0]}
                            </div>
                            <div>
                                <div className="font-semibold text-white text-base">
                                    {firstName} {lastName}
                                </div>
                                <div className="text-orange-100 text-sm">{userRole}</div>
                            </div>
                        </div>
                        <button
                            onClick={closeMenu}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Menu Content */}
                    <div className="overflow-y-auto h-[calc(100%-180px)]">
                        {/* แจ้งปัญหา Section */}
                        {/* สำหรับนักศึกษาที่ไม่มีกลุ่มงานใดๆ แสดงเมนูแบบ Links ตรงๆ */}
                        {user.role === 'student' && !user.job_admin && !user.job_repair && !user.job_complaint ? (
                            <div className="border-b border-gray-100 py-2">
                                <MobileNavLink href="/dashboard">
                                    หน้าแรก
                                </MobileNavLink>
                                <MobileNavLink href={route('report.create')}>
                                    ฟอร์มแจ้งปัญหา
                                </MobileNavLink>
                                <MobileNavLink href={route('report.history')}>
                                    ประวัติการแจ้ง
                                </MobileNavLink>
                            </div>
                        ) : (
                            <CollapsibleSection
                                title="แจ้งปัญหา"
                                sectionKey="report"
                                icon={
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                }
                            >
                                <MobileNavLink href="/dashboard">
                                    หน้าแรก
                                </MobileNavLink>
                                <MobileNavLink href={route('report.create')}>
                                    ฟอร์มแจ้งปัญหา
                                </MobileNavLink>
                                <MobileNavLink href={route('report.history')}>
                                    ประวัติการแจ้ง
                                </MobileNavLink>
                            </CollapsibleSection>
                        )}

                        {/* เมนูช่าง Section */}
                        {user.job_repair && user.role !== 'student' && (
                            <CollapsibleSection
                                title="กลุ่มงานแจ้งซ่อม"
                                sectionKey="repair"
                                icon={
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                }
                            >
                                <MobileNavLink href={route('repairs.dashboard')}>
                                    หน้าหลักแจ้งซ่อม
                                </MobileNavLink>
                                <MobileNavLink href={route('repairs.index')}>
                                    รายการแจ้งซ่อม
                                </MobileNavLink>
                                <MobileNavLink href={route('announcements.create')}>
                                    สร้างข่าวสาร
                                </MobileNavLink>
                                <MobileNavLink href={route('repairs.jobs.index')}>
                                    ใบงานรวม
                                </MobileNavLink>
                                <MobileNavLink href={route('repairs.jobs.my')}>
                                    ใบงานของฉัน
                                </MobileNavLink>
                            </CollapsibleSection>
                        )}

                        {/* เมนูร้องเรียน Section */}
                        {user.job_complaint && user.role !== 'student' && (
                            <CollapsibleSection
                                title="กลุ่มงานร้องเรียน"
                                sectionKey="complaint"
                                icon={
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                }
                            >
                                <MobileNavLink href="/complaints/dashboard">
                                    หน้าหลักร้องเรียน
                                </MobileNavLink>
                                <MobileNavLink href="/complaints/list">
                                    รายการร้องเรียน
                                </MobileNavLink>
                                <MobileNavLink href="/complaints/keywords">
                                    กำหนดคีย์เวิร์ด
                                </MobileNavLink>
                            </CollapsibleSection>
                        )}

                        {/* เมนูผู้ดูแลระบบ Section */}
                        {user.job_admin && user.role !== 'student' && (
                            <CollapsibleSection
                                title="ผู้ดูแลระบบ"
                                sectionKey="admin"
                                icon={
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                }
                            >
                                <MobileNavLink href="/admin">
                                    หน้าหลัก
                                </MobileNavLink>
                                <MobileNavLink href="/admin/users">
                                    จัดการผู้ใช้งาน
                                </MobileNavLink>
                                <MobileNavLink href={route('admin.users.invite')}>
                                    สร้างผู้ใช้งาน
                                </MobileNavLink>
                                <MobileNavLink href="/admin/locations">
                                    เพิ่มอาคาร/ห้อง
                                </MobileNavLink>
                                <MobileNavLink href="/admin/keywords">
                                    จัดการคีย์เวิร์ด
                                </MobileNavLink>
                            </CollapsibleSection>
                        )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50 p-4 space-y-2">
                        {/* PWA Install Button - Mobile Only */}
                        <InstallPWA showInSettings />

                        {/* Notification Toggle */}
                        <NotificationToggle />

                        <Link
                            href={route('profile.edit')}
                            onClick={closeMenu}
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            ตั้งค่าโปรไฟล์
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            onClick={closeMenu}
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            ออกจากระบบ
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
