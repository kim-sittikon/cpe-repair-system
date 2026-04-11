import { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle, RefreshCw, Navigation } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

/**
 * GeolocationDisplay Component
 * 
 * Shows current location with coordinates and accuracy
 * Can be used in forms to capture user's location
 * 
 * @param {function} onLocationChange - Called when location is obtained/cleared
 * @param {boolean} autoFetch - If true, fetch location on mount
 * @param {boolean} compact - If true, show minimal UI
 */
export default function GeolocationDisplay({
    onLocationChange,
    autoFetch = false,
    compact = false
}) {
    const { location, error, loading, isSupported, getLocation, clearLocation } = useGeolocation();
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (autoFetch && isSupported) {
            getLocation();
        }
    }, [autoFetch, isSupported]);

    useEffect(() => {
        onLocationChange?.(location);
    }, [location, onLocationChange]);

    if (!isSupported) {
        return (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>ไม่รองรับ GPS</span>
            </div>
        );
    }

    // Compact version for inline display
    if (compact) {
        return (
            <button
                type="button"
                onClick={location ? clearLocation : getLocation}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${location
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <MapPin className="w-4 h-4" />
                )}
                {location ? 'ระบุตำแหน่งแล้ว' : 'ระบุตำแหน่ง'}
            </button>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    ตำแหน่งที่ตั้ง
                </label>
                {location && (
                    <button
                        type="button"
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs text-orange-600 hover:text-orange-700"
                    >
                        {showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
                    </button>
                )}
            </div>

            {/* Status display */}
            {!location && !loading && !error && (
                <button
                    type="button"
                    onClick={getLocation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                >
                    <Navigation className="w-5 h-5" />
                    <span>กดเพื่อระบุตำแหน่งปัจจุบัน</span>
                </button>
            )}

            {loading && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 rounded-xl text-orange-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>กำลังระบุตำแหน่ง...</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                    <button
                        type="button"
                        onClick={getLocation}
                        className="p-1 text-red-500 hover:text-red-700"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            )}

            {location && (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-700">ระบุตำแหน่งแล้ว</p>
                        {showDetails && (
                            <div className="text-xs text-green-600 mt-1 space-y-0.5">
                                <p>ละติจูด: {location.latitude.toFixed(6)}</p>
                                <p>ลองจิจูด: {location.longitude.toFixed(6)}</p>
                                <p>ความแม่นยำ: ±{Math.round(location.accuracy)} เมตร</p>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={clearLocation}
                        className="p-2 text-green-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบตำแหน่ง"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
