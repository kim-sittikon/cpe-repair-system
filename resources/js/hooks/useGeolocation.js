import { useState, useCallback } from 'react';

/**
 * Custom hook for getting user's geolocation
 * Returns location, error, loading state, and methods to get/clear location
 */
export function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

    const getLocation = useCallback(() => {
        if (!isSupported) {
            setError('Geolocation ไม่รองรับบนอุปกรณ์นี้');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
                setLoading(false);
            },
            (err) => {
                let errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'กรุณาอนุญาตให้เข้าถึงตำแหน่ง';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'หมดเวลาในการระบุตำแหน่ง';
                        break;
                }
                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000, // Cache for 1 minute
            }
        );
    }, [isSupported]);

    const clearLocation = useCallback(() => {
        setLocation(null);
        setError(null);
    }, []);

    return {
        location,
        error,
        loading,
        isSupported,
        getLocation,
        clearLocation,
    };
}

export default useGeolocation;
