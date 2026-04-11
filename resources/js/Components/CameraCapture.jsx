import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Check, RotateCcw, SwitchCamera, AlertCircle } from 'lucide-react';

/**
 * CameraCapture Component (Mobile-Optimized)
 * 
 * Provides in-app camera functionality for capturing photos
 * Optimized for mobile browsers (Chrome Android, Safari iOS)
 * 
 * @param {function} onCapture - Called with captured image as File object
 * @param {function} onClose - Called when camera is closed without capturing
 */
export default function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null); // Use ref to avoid stale closure issues
    const [isReady, setIsReady] = useState(false); // Video is ready to capture
    const [photo, setPhoto] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' = back, 'user' = front
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState(''); // For debugging

    const isSupported = typeof navigator !== 'undefined' &&
        'mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices;

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsReady(false);
    }, []);

    const startCamera = useCallback(async () => {
        if (!isSupported) {
            setError('กล้องไม่รองรับบนอุปกรณ์นี้');
            setLoading(false);
            return;
        }

        // Stop any existing stream first
        stopCamera();

        setLoading(true);
        setError(null);
        setIsReady(false);
        setDebugInfo('กำลังเปิดกล้อง...');

        try {
            // Request camera with explicit constraints for mobile
            const constraints = {
                video: {
                    facingMode: { ideal: facingMode },
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                },
                audio: false,
            };

            setDebugInfo('ขอสิทธิ์เข้าถึงกล้อง...');
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            // Store stream in ref
            streamRef.current = mediaStream;

            if (videoRef.current) {
                // Clear any existing source first
                videoRef.current.srcObject = null;

                // Set new source
                videoRef.current.srcObject = mediaStream;

                // Wait for video to be ready
                setDebugInfo('รอ video metadata...');

                // Handle video ready state
                const handleCanPlay = () => {
                    setDebugInfo(`Video ready: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`);
                    setIsReady(true);
                    setLoading(false);
                };

                const handleError = (e) => {
                    console.error('Video error:', e);
                    setError('ไม่สามารถแสดงภาพจากกล้องได้');
                    setLoading(false);
                };

                videoRef.current.oncanplay = handleCanPlay;
                videoRef.current.onerror = handleError;

                // Try to play
                try {
                    await videoRef.current.play();
                } catch (playError) {
                    console.error('Play error:', playError);
                    // On some devices, play() fails but video still works
                    if (videoRef.current.readyState >= 2) {
                        handleCanPlay();
                    }
                }
            }
        } catch (err) {
            console.error('Camera error:', err);
            let errorMessage = 'ไม่สามารถเปิดกล้องได้';
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = 'กรุณาอนุญาตให้เข้าถึงกล้อง แล้วรีเฟรชหน้า';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage = 'ไม่พบกล้องบนอุปกรณ์นี้';
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage = 'กล้องถูกใช้งานโดยแอพอื่น กรุณาปิดแอพอื่นแล้วลองใหม่';
            } else if (err.name === 'OverconstrainedError') {
                errorMessage = 'ไม่สามารถใช้กล้องที่เลือกได้';
            }
            setError(errorMessage);
            setLoading(false);
            setDebugInfo(`Error: ${err.name} - ${err.message}`);
        }
    }, [facingMode, isSupported, stopCamera]);

    const takePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) {
            setDebugInfo('Error: videoRef or canvasRef is null');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Check if video has valid dimensions
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (!width || !height || width === 0 || height === 0) {
            setDebugInfo(`Error: Invalid video dimensions (${width}x${height})`);
            setError('วิดีโอยังไม่พร้อม กรุณารอสักครู่');
            return;
        }

        setDebugInfo(`Capturing: ${width}x${height}`);

        // Set canvas size to match video
        canvas.width = width;
        canvas.height = height;

        // Draw current video frame to canvas
        const ctx = canvas.getContext('2d');

        // Clear canvas first
        ctx.clearRect(0, 0, width, height);

        // Save context state
        ctx.save();

        // If front camera, flip horizontally
        if (facingMode === 'user') {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }

        // Draw video frame
        ctx.drawImage(video, 0, 0, width, height);

        // Restore context state
        ctx.restore();

        // Convert to data URL with good quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        // Check if dataUrl is valid
        if (dataUrl === 'data:,' || dataUrl.length < 100) {
            setDebugInfo('Error: Failed to capture image from canvas');
            setError('ไม่สามารถถ่ายภาพได้ กรุณาลองใหม่');
            return;
        }

        setPhoto(dataUrl);
        setDebugInfo('Photo captured successfully');

        // Stop camera preview
        stopCamera();
    }, [facingMode, stopCamera]);

    const retakePhoto = useCallback(() => {
        setPhoto(null);
        setError(null);
        startCamera();
    }, [startCamera]);

    const confirmPhoto = useCallback(() => {
        if (!photo) return;

        // Convert data URL to File
        fetch(photo)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
                onCapture(file);
                handleClose();
            })
            .catch(err => {
                console.error('Error converting photo:', err);
                setError('ไม่สามารถบันทึกรูปได้');
            });
    }, [photo, onCapture]);

    const handleClose = useCallback(() => {
        stopCamera();
        setPhoto(null);
        setError(null);
        onClose?.();
    }, [stopCamera, onClose]);

    const switchCamera = useCallback(() => {
        const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(newFacingMode);
    }, [facingMode]);

    // Auto-start camera when component mounts or facingMode changes
    useEffect(() => {
        if (!photo) {
            startCamera();
        }

        return () => {
            stopCamera();
        };
    }, [facingMode]); // Only depend on facingMode

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    if (!isSupported) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่รองรับ</h3>
                    <p className="text-gray-600 mb-4">กล้องไม่รองรับบนเบราว์เซอร์นี้</p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-20">
                <button
                    onClick={handleClose}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <span className="text-white font-medium">ถ่ายรูป</span>
                {!photo && (
                    <button
                        onClick={switchCamera}
                        disabled={loading}
                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                    >
                        <SwitchCamera className="w-6 h-6" />
                    </button>
                )}
                {photo && <div className="w-10" />}
            </div>

            {/* Main content - Video/Photo area */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                {/* Always render video element but control visibility */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    className={`absolute inset-0 w-full h-full object-cover ${photo || loading || error ? 'invisible' : 'visible'}`}
                    style={{
                        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                        zIndex: 5,
                        backgroundColor: 'black'
                    }}
                />

                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="text-white text-center">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <p>กำลังเปิดกล้อง...</p>
                            {/* Debug info - ลบออกได้ตอน production */}
                            <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {error && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="text-center p-4">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-red-400 mb-4 max-w-xs">{error}</p>
                            <button
                                onClick={startCamera}
                                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
                            >
                                ลองอีกครั้ง
                            </button>
                            {/* Debug info */}
                            <p className="text-xs text-gray-600 mt-4">{debugInfo}</p>
                        </div>
                    </div>
                )}

                {/* Photo preview */}
                {photo && (
                    <img
                        src={photo}
                        alt="Captured"
                        className="absolute inset-0 w-full h-full object-contain z-10"
                    />
                )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-20">
                {!photo ? (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={takePhoto}
                            disabled={loading || error || !isReady}
                            className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center active:scale-95"
                        >
                            <div className="w-16 h-16 rounded-full bg-white hover:bg-gray-100" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={retakePhoto}
                            className="flex flex-col items-center gap-1 text-white active:scale-95 transition-transform"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                                <RotateCcw className="w-6 h-6" />
                            </div>
                            <span className="text-sm">ถ่ายใหม่</span>
                        </button>
                        <button
                            onClick={confirmPhoto}
                            className="flex flex-col items-center gap-1 text-white active:scale-95 transition-transform"
                        >
                            <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center">
                                <Check className="w-6 h-6" />
                            </div>
                            <span className="text-sm">ใช้รูปนี้</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
