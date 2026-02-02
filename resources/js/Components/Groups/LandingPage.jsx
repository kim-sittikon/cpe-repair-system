import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';

export default function LandingPage({ urgentNews, generalNews }) {
    // --- Carousel Logic ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(340);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Safeguard: Ensure urgentNews is an ARRAY and limit to 7 items max
    const MAX_URGENT_NEWS = 7;
    const rawUrgentNews = Array.isArray(urgentNews)
        ? urgentNews
        : (urgentNews ? Object.values(urgentNews) : []);
    const validUrgentNews = rawUrgentNews.slice(0, MAX_URGENT_NEWS);

    const validGeneralNews = generalNews || { data: [] };

    // Debounced real-time search
    useEffect(() => {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search (300ms delay)
        searchTimeoutRef.current = setTimeout(() => {
            if (searchQuery !== '' || window.location.search.includes('search=')) {
                setIsSearching(true);
                router.get(
                    route('dashboard'),
                    searchQuery ? { search: searchQuery } : {},
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsSearching(false),
                    }
                );
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);
    const validGeneralNewsData = Array.isArray(validGeneralNews.data)
        ? validGeneralNews.data
        : (validGeneralNews.data ? Object.values(validGeneralNews.data) : []);

    const hasUrgentNews = validUrgentNews.length > 0;
    const [visibleCards, setVisibleCards] = useState(3);

    // Responsive card width and visible cards
    useEffect(() => {
        const updateCardWidth = () => {
            if (window.innerWidth < 640) {
                setCardWidth(window.innerWidth - 48); // Mobile: full width - padding
                setVisibleCards(1);
            } else if (window.innerWidth < 1024) {
                setCardWidth(320); // Tablet
                setVisibleCards(2);
            } else {
                setCardWidth(360); // Desktop
                setVisibleCards(3);
            }
        };
        updateCardWidth();
        window.addEventListener('resize', updateCardWidth);
        return () => window.removeEventListener('resize', updateCardWidth);
    }, []);

    // Auto-Play Logic
    useEffect(() => {
        if (isPaused || !hasUrgentNews) return;
        const timeout = setTimeout(() => nextSlide(), 5000);
        return () => clearTimeout(timeout);
    }, [currentIndex, isPaused, hasUrgentNews]);

    // Calculate max index to prevent empty space
    const maxIndex = Math.max(0, validUrgentNews.length - visibleCards);

    const nextSlide = () => {
        if (hasUrgentNews) {
            setCurrentIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
        }
    };

    const prevSlide = () => {
        if (hasUrgentNews) {
            setCurrentIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* 1. Hero Section - Improved Responsive */}
            <div className="relative w-full min-h-fit sm:min-h-[550px] lg:min-h-[600px] overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/landing-bg-final.webp')" }}
                ></div>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

                {/* Content */}
                <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
                    <div className="space-y-4 sm:space-y-6 text-left">
                        {/* Main Title - Responsive */}
                        <div className="space-y-2 sm:space-y-3">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight">
                                ระบบรับแจ้งปัญหา
                                <br className="sm:hidden" />
                                <span className="hidden sm:inline"> </span>
                                ภาควิศวกรรมคอมพิวเตอร์
                            </h1>

                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white/90 tracking-wide">
                                Computer Engineering Issue Reporting
                            </h2>
                        </div>

                        {/* Description - Responsive */}
                        <div className="text-gray-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-2xl space-y-1">
                            <p className="hidden sm:block">
                                พบปัญหาเกี่ยวกับอุปกรณ์คอมพิวเตอร์ อุปกรณ์ในห้องเรียน หรือระบบเครือข่าย
                                ระบบนี้พร้อมรับแจ้งและติดตามสถานะให้คุณอย่างสะดวกและรวดเร็ว
                            </p>
                            <p className="sm:hidden text-gray-400">
                                แจ้งปัญหาอุปกรณ์คอมพิวเตอร์และระบบเครือข่ายได้ง่ายๆ
                            </p>
                        </div>

                        {/* CTA Buttons - Responsive */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                            <Link
                                href={route('report.create')}
                                className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                แจ้งปัญหา
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <Link
                                href={route('report.history')}
                                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-medium rounded-xl hover:bg-white/20 transition-all duration-300 text-base sm:text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                ติดตามสถานะ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">

                {/* Header */}
                <div className="text-center space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">ข่าวสารประชาสัมพันธ์</h3>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto rounded-full"></div>
                </div>

                {/* Urgent News Carousel */}
                {hasUrgentNews && (
                    <div
                        className="relative group/carousel"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-700 border-l-4 border-orange-500 pl-3">
                                เรื่องด่วน (Urgent)
                            </h4>
                            {/* Indicators - show only for available slide positions */}
                            <div className="flex gap-1.5 sm:gap-2">
                                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                            ? 'w-6 sm:w-8 bg-orange-500'
                                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* Carousel Viewport - with padding to prevent cut-off */}
                        <div
                            ref={carouselRef}
                            className="overflow-hidden w-full relative -mx-4 px-4 sm:-mx-6 sm:px-6"
                        >
                            <div
                                className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                                style={{
                                    transform: `translateX(-${currentIndex * (cardWidth + (window.innerWidth < 640 ? 16 : 24))}px)`,
                                    paddingRight: '80px' // Show peek of next card
                                }}
                            >
                                {validUrgentNews.map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="flex-shrink-0 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-1"
                                        style={{ width: `${cardWidth}px` }}
                                    >
                                        {/* Image Area */}
                                        <div className="h-40 sm:h-48 lg:h-52 overflow-hidden relative">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider animate-pulse">
                                                Urgent
                                            </div>
                                            <div className="absolute bottom-0 left-0 bg-gradient-to-r from-black/70 to-transparent text-white text-xs px-3 py-1.5 rounded-tr-lg">
                                                {item.date}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-4 sm:p-5">
                                            <h5 className="font-bold text-lg sm:text-xl text-gray-800 line-clamp-1 leading-tight group-hover:text-orange-500 transition-colors">
                                                {item.title}
                                            </h5>
                                            <p className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed mt-2">
                                                {item.desc}
                                            </p>

                                            {/* Location Badge - แสดงตึก/ห้อง */}
                                            {(item.building_name || item.room_name) && (
                                                <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-fit mt-3">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="font-medium truncate max-w-[180px]">
                                                        {item.building_name}{item.room_name && ` / ${item.room_name}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white hover:scale-110 transition-all duration-300 z-20 opacity-0 group-hover/carousel:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white hover:scale-110 transition-all duration-300 z-20 opacity-0 group-hover/carousel:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                )}

                {/* All News Section */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-700 border-l-4 border-gray-400 pl-3">
                            เรื่องทั้งหมด (All News)
                        </h4>

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ค้นหาข่าวสาร..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                            />
                            {isSearching ? (
                                <svg className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 transform -translate-y-1/2 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                            )}
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* News List */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {(validGeneralNewsData.length > 0 ? validGeneralNewsData : []).map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:shadow-lg hover:border-orange-100 transition-all duration-200 group cursor-pointer"
                            >
                                {/* Image */}
                                <div className="w-full sm:w-40 lg:w-48 h-32 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                                    <img src={item.img} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={item.title} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center space-y-1.5 sm:space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {item.date}
                                        </div>
                                    </div>
                                    <h5 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">
                                        {item.title}
                                    </h5>
                                    <p className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                    {/* Location Badge */}
                                    {(item.building_name || item.room_name) && (
                                        <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-fit">
                                            <MapPin className="w-3 h-3" />
                                            <span className="font-medium truncate max-w-[200px]">
                                                {item.building_name}{item.room_name && ` / ${item.room_name}`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Arrow - Desktop only */}
                                <div className="hidden sm:flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-orange-500 flex items-center justify-center transition-all duration-200">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {validGeneralNewsData.length > 0 && (
                        <div className="flex justify-center pt-4 sm:pt-6 pb-6 sm:pb-8">
                            <nav className="flex items-center gap-1.5 sm:gap-2">
                                <button className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                {[1, 2, 3].map((page) => (
                                    <button
                                        key={page}
                                        className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${page === 1
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
