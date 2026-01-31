import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Check, RotateCcw, SwitchCamera } from 'lucide-react';

/**
 * CameraCapture Component
 * 
 * Provides in-app camera functionality for capturing photos
 * Supports front/back camera switching on mobile devices
 * 
 * @param {function} onCapture - Called with captured image as File object
 * @param {function} onClose - Called when camera is closed without capturing
 */
export default function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' = back, 'user' = front
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const isSupported = typeof navigator !== 'undefined' &&
        'mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices;

    const startCamera = useCallback(async () => {
        if (!isSupported) {
            setError('กล้องไม่รองรับบนอุปกรณ์นี้');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play();
            }

            setStream(mediaStream);
            setLoading(false);
        } catch (err) {
            console.error('Camera error:', err);
            let errorMessage = 'ไม่สามารถเปิดกล้องได้';
            if (err.name === 'NotAllowedError') {
                errorMessage = 'กรุณาอนุญาตให้เข้าถึงกล้อง';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'ไม่พบกล้องบนอุปกรณ์นี้';
            }
            setError(errorMessage);
            setLoading(false);
        }
    }, [facingMode, isSupported]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, [stream]);

    const takePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        const ctx = canvas.getContext('2d');

        // If front camera, flip horizontally
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhoto(dataUrl);

        // Stop camera preview
        stopCamera();
    }, [facingMode, stopCamera]);

    const retakePhoto = useCallback(() => {
        setPhoto(null);
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
            });
    }, [photo, onCapture]);

    const handleClose = useCallback(() => {
        stopCamera();
        setPhoto(null);
        setError(null);
        onClose?.();
    }, [stopCamera, onClose]);

    const switchCamera = useCallback(async () => {
        // Stop current stream first
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(newFacingMode);
    }, [stream, facingMode]);

    // Auto-start camera when component mounts or facingMode changes
    useEffect(() => {
        startCamera();

        return () => {
            // Cleanup: stop any active stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    if (!isSupported) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
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
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 left-0 right-0 z-10">
                <button
                    onClick={handleClose}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <span className="text-white font-medium">ถ่ายรูป</span>
                {stream && !photo && (
                    <button
                        onClick={switchCamera}
                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                        <SwitchCamera className="w-6 h-6" />
                    </button>
                )}
                {photo && <div className="w-10" />}
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center">
                {loading && (
                    <div className="text-white text-center">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                        <p>กำลังเปิดกล้อง...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center p-4">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={startCamera}
                            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
                        >
                            ลองอีกครั้ง
                        </button>
                    </div>
                )}

                {!loading && !error && !photo && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                    />
                )}

                {photo && (
                    <img
                        src={photo}
                        alt="Captured"
                        className="w-full h-full object-contain"
                    />
                )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-black/50 absolute bottom-0 left-0 right-0">
                {!photo ? (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={takePhoto}
                            disabled={loading || error || !stream}
                            className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-white hover:bg-gray-100" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={retakePhoto}
                            className="flex flex-col items-center gap-1 text-white"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                                <RotateCcw className="w-6 h-6" />
                            </div>
                            <span className="text-sm">ถ่ายใหม่</span>
                        </button>
                        <button
                            onClick={confirmPhoto}
                            className="flex flex-col items-center gap-1 text-white"
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
