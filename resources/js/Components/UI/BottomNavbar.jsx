import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function BottomNavbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [showModeSheet, setShowModeSheet] = useState(false);

    // Get current path for active state
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Pages that should NOT trigger mode change (common pages accessible from all modes)
    const commonPages = ['/announcements', '/profile', '/dashboard'];
    const isCommonPage = commonPages.some(page => currentPath.startsWith(page));

    // Auto-detect mode from current URL
    const detectModeFromPath = () => {
        if (currentPath.startsWith('/repairs')) return 'repair';
        if (currentPath.startsWith('/complaints')) return 'complaint';
        if (currentPath.startsWith('/admin')) return 'admin';
        return 'general';
    };

    const [currentMode, setCurrentMode] = useState('general');

    // Initialize mode from localStorage on client-side mount
    useEffect(() => {
        const savedMode = localStorage.getItem('bottomNavMode');
        if (isCommonPage && savedMode) {
            // On common pages, use saved mode
            setCurrentMode(savedMode);
        } else if (!isCommonPage) {
            // On specific mode pages, detect and save mode
            const newMode = detectModeFromPath();
            setCurrentMode(newMode);
            localStorage.setItem('bottomNavMode', newMode);
        } else if (savedMode) {
            // Fallback: use saved mode if available
            setCurrentMode(savedMode);
        }
    }, [currentPath]);

    if (!user) return null;

    // Check permissions
    const hasRepair = user.job_repair && user.role !== 'student';
    const hasComplaint = user.job_complaint && user.role !== 'student';
    const hasAdmin = user.job_admin && user.role !== 'student';
    const hasAnyStaffPermission = hasRepair || hasComplaint || hasAdmin;
    const isStudent = user.role === 'student';

    const isActive = (path) => {
        if (path === '/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/';
        }
        // Exact match for /admin to prevent matching /admin/users etc.
        if (path === '/admin') {
            return currentPath === '/admin' || currentPath === '/admin/';
        }
        return currentPath.startsWith(path);
    };

    // Prevent body scroll when sheet is open
    useEffect(() => {
        if (showModeSheet) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModeSheet]);

    const closeSheet = () => setShowModeSheet(false);

    const selectMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem('bottomNavMode', mode);
        closeSheet();
    };

    // Define nav items for each mode
    const modeConfigs = {
        general: {
            label: 'ทั่วไป',
            color: 'orange',
            items: [
                {
                    name: 'หน้าแรก',
                    href: '/dashboard',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'แจ้งปัญหา',
                    href: '/report/create',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'ประวัติ',
                    href: '/report/history',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            )}
                        </svg>
                    ),
                },
            ],
        },
        repair: {
            label: 'แจ้งซ่อม',
            color: 'blue',
            items: [
                {
                    name: 'หน้าหลัก',
                    href: '/repairs/dashboard',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'รายการ',
                    href: '/repairs/list',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'งานของฉัน',
                    href: '/repairs/jobs/my',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm3.75 0v.09a49.488 49.488 0 0 0-3.75.253v-.343a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v.343a49.488 49.488 0 0 0-3.75-.253v-.09Z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            )}
                        </svg>
                    ),
                },
            ],
        },
        complaint: {
            label: 'ร้องเรียน',
            color: 'purple',
            items: [
                {
                    name: 'หน้าหลัก',
                    href: '/complaints/dashboard',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-purple-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'รายการ',
                    href: '/complaints/list',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-purple-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'คีย์เวิร์ด',
                    href: '/complaints/keywords',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-purple-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            )}
                        </svg>
                    ),
                },
            ],
        },
        admin: {
            label: 'ผู้ดูแล',
            color: 'green',
            items: [
                {
                    name: 'หน้าหลัก',
                    href: '/admin',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-green-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'ผู้ใช้งาน',
                    href: '/admin/users',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-green-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            )}
                        </svg>
                    ),
                },
                {
                    name: 'ตำแหน่ง',
                    href: '/admin/locations',
                    icon: (active) => (
                        <svg className={`w-6 h-6 ${active ? 'text-green-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                            {active ? (
                                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            )}
                        </svg>
                    ),
                },
            ],
        },
    };

    // Get color classes based on mode
    const getColorClasses = (mode, type) => {
        const colors = {
            general: { active: 'text-orange-500', bg: 'bg-orange-500', bgLight: 'bg-orange-100', textLight: 'text-orange-600' },
            repair: { active: 'text-blue-500', bg: 'bg-blue-500', bgLight: 'bg-blue-100', textLight: 'text-blue-600' },
            complaint: { active: 'text-purple-500', bg: 'bg-purple-500', bgLight: 'bg-purple-100', textLight: 'text-purple-600' },
            admin: { active: 'text-green-500', bg: 'bg-green-500', bgLight: 'bg-green-100', textLight: 'text-green-600' },
        };
        return colors[mode]?.[type] || colors.general[type];
    };

    // Current mode config - students always use general mode
    const effectiveMode = isStudent ? 'general' : currentMode;
    const currentConfig = modeConfigs[effectiveMode] || modeConfigs.general;
    const navItems = currentConfig.items;

    // Available modes for switching
    const availableModes = [
        { key: 'general', label: 'ทั่วไป', icon: '🏠', description: 'แจ้งปัญหา, ประวัติ' },
    ];
    if (hasRepair) availableModes.push({ key: 'repair', label: 'กลุ่มงานแจ้งซ่อม', icon: '🔧', description: 'รายการซ่อม, งานของฉัน' });
    if (hasComplaint) availableModes.push({ key: 'complaint', label: 'กลุ่มงานร้องเรียน', icon: '💬', description: 'รายการร้องเรียน' });
    if (hasAdmin) availableModes.push({ key: 'admin', label: 'ผู้ดูแลระบบ', icon: '⚙️', description: 'จัดการผู้ใช้, ตำแหน่ง' });

    // For students, just show profile
    if (isStudent) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    {[...navItems, {
                        name: 'โปรไฟล์',
                        href: '/profile',
                        icon: (active) => (
                            <svg className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
                                {active ? (
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                )}
                            </svg>
                        ),
                    }].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200"
                            >
                                <div className={`relative ${active ? 'scale-110' : ''} transition-transform duration-200`}>
                                    {item.icon(active)}
                                </div>
                                <span className={`mt-1 text-[10px] font-medium ${active ? 'text-orange-600' : 'text-gray-500'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Mode Indicator Bar */}
            {currentMode !== 'general' && (
                <div className={`fixed bottom-16 left-0 right-0 ${getColorClasses(currentMode, 'bg')} text-white text-center py-1 text-xs font-medium z-30 lg:hidden`}>
                    โหมด: {currentConfig.label}
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200"
                            >
                                <div className={`relative ${active ? 'scale-110' : ''} transition-transform duration-200`}>
                                    {item.icon(active)}
                                    {active && (
                                        <span className={`absolute -top-1 -right-1 w-2 h-2 ${getColorClasses(currentMode, 'bg')} rounded-full`}></span>
                                    )}
                                </div>
                                <span className={`mt-1 text-[10px] font-medium ${active ? getColorClasses(currentMode, 'active') : 'text-gray-500'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Mode Switcher Button */}
                    {hasAnyStaffPermission && (
                        <button
                            onClick={() => setShowModeSheet(true)}
                            className="flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200"
                        >
                            <div className="relative">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                {currentMode !== 'general' && (
                                    <span className={`absolute -top-1 -right-1 w-2 h-2 ${getColorClasses(currentMode, 'bg')} rounded-full`}></span>
                                )}
                            </div>
                            <span className="mt-1 text-[10px] font-medium text-gray-500">
                                เพิ่มเติม
                            </span>
                        </button>
                    )}
                </div>
            </nav>

            {/* Mode Switcher Sheet */}
            {hasAnyStaffPermission && (
                <>
                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${showModeSheet ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={closeSheet}
                    />

                    <div
                        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden transform transition-transform duration-300 ease-out ${showModeSheet ? 'translate-y-0' : 'translate-y-full'
                            }`}
                    >
                        {/* Handle bar */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">เลือกกลุ่มงาน</h3>
                            <button
                                onClick={closeSheet}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Mode Options */}
                        <div className="px-4 py-4 space-y-2">
                            {availableModes.map((mode) => (
                                <button
                                    key={mode.key}
                                    onClick={() => selectMode(mode.key)}
                                    className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all ${currentMode === mode.key
                                        ? `${getColorClasses(mode.key, 'bgLight')} border-2 border-current ${getColorClasses(mode.key, 'active')}`
                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                        }`}
                                >
                                    <span className="text-2xl">{mode.icon}</span>
                                    <div className="flex-1 text-left">
                                        <div className={`font-semibold ${currentMode === mode.key ? getColorClasses(mode.key, 'active') : 'text-gray-800'}`}>
                                            {mode.label}
                                        </div>
                                        <div className="text-sm text-gray-500">{mode.description}</div>
                                    </div>
                                    {currentMode === mode.key && (
                                        <svg className={`w-6 h-6 ${getColorClasses(mode.key, 'active')}`} fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Extra Links for Current Mode */}
                        {currentMode === 'repair' && (
                            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                                <p className="text-xs text-gray-500 mb-2 px-2">เมนูเพิ่มเติม - แจ้งซ่อม</p>
                                <div className="space-y-1">
                                    <Link href="/repairs/jobs" onClick={closeSheet} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                                        <span>📋 ใบงานรวม</span>
                                    </Link>
                                    <Link href="/announcements/create" onClick={closeSheet} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                                        <span>📢 สร้างข่าวสาร</span>
                                    </Link>
                                    <Link href="/repairs/keywords" onClick={closeSheet} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                                        <span>🏷️ กำหนดคีย์เวิร์ด</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {currentMode === 'admin' && (
                            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                                <p className="text-xs text-gray-500 mb-2 px-2">เมนูเพิ่มเติม - ผู้ดูแล</p>
                                <div className="space-y-1">
                                    <Link href="/admin/users/invite" onClick={closeSheet} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors">
                                        <span>👤 สร้างผู้ใช้งาน</span>
                                    </Link>
                                    <Link href="/admin/keywords" onClick={closeSheet} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors">
                                        <span>🏷️ จัดการคีย์เวิร์ด</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="px-4 pb-6 pt-2 border-t border-gray-100 space-y-2">
                            <Link
                                href="/profile"
                                onClick={closeSheet}
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>ตั้งค่าโปรไฟล์</span>
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                onClick={closeSheet}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>ออกจากระบบ</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
