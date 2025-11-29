import {X, Camera, Upload} from "lucide-react";
import {useRef, useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";

interface ImageUploadProps {
    onFileChange: (file: File | null) => void
}

export const ImageUpload = ({onFileChange}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string>("");
    const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoReady, setVideoReady] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file (JPEG, PNG, WEBP)");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const img = new Image();
            img.onload = () => {
                setImgSize({width: img.width, height: img.height});
            };
            img.src = base64String;
            setPreview(base64String);
        };
        reader.readAsDataURL(file);


        const previewUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setImgSize({ width: img.width, height: img.height });
        };
        img.src = previewUrl;

        setPreview(previewUrl);

        onFileChange(file);
    };

    const handleRemove = () => {
        setPreview("");
        setImgSize(null);
        onFileChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        stopCamera();
    };

    const handleClick = () => fileInputRef.current?.click();

    // Camera functions
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'user', 
                    width: { ideal: 1280 }, 
                    height: { ideal: 720 } 
                }
            });
            setShowCamera(true);
            setStream(mediaStream);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please check permissions.");
        }
    };

    // Effect to set video stream when camera modal opens
    useEffect(() => {
        if (showCamera && stream && videoRef.current) {
            const video = videoRef.current;
            video.srcObject = stream;
            
            const handleLoadedMetadata = () => {
                // Check if video has valid dimensions
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                    setVideoReady(true);
                    video.play().catch(err => {
                        console.error("Error playing video:", err);
                    });
                } else {
                    // Retry after a short delay
                    setTimeout(() => {
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            setVideoReady(true);
                            video.play().catch(err => {
                                console.error("Error playing video:", err);
                            });
                        }
                    }, 100);
                }
            };
            
            const handleError = () => {
                console.error("Video error");
                setVideoReady(false);
            };
            
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('error', handleError);
            
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('error', handleError);
            };
        } else {
            setVideoReady(false);
        }
    }, [showCamera, stream]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
        setVideoReady(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Invert the image horizontally (mirror effect)
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                        handleFileFromBlob(file);
                        stopCamera();
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    const handleFileFromBlob = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file (JPEG, PNG, WEBP)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const img = new Image();
            img.onload = () => {
                setImgSize({width: img.width, height: img.height});
            };
            img.src = base64String;
            setPreview(base64String);
        };
        reader.readAsDataURL(file);

        const previewUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setImgSize({ width: img.width, height: img.height });
        };
        img.src = previewUrl;

        setPreview(previewUrl);
        onFileChange(file);
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="space-y-3">
            <label className="block text-lg font-bold text-foreground">
                Your photo <span className="text-primary">*</span>
            </label>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            <canvas ref={canvasRef} className="hidden" />

            {preview ? (
                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    className="relative rounded-xl overflow-hidden border-4 border-foreground mx-auto"
                    style={{
                        width: imgSize ? `${imgSize.width}px` : "100%",
                        maxWidth: "100%",
                    }}
                >
                    <img src={preview} alt="Preview" className="w-full h-auto object-contain"/>
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-4 gap-3">
                        <button
                            type="button"
                            onClick={handleClick}
                            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-bold border-2 border-foreground hover:-translate-y-0.5 transition-all"
                        >
                            Change photo
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold border-2 border-foreground hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <X className="w-5 h-5"/>
                            Remove photo
                        </button>
                    </div>
                </motion.div>
            ) : (
                // Stato iniziale: nessuna immagine
                <div className="space-y-3">
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        className="border-4 border-dashed border-foreground rounded-xl flex flex-col items-center justify-center p-8 hover:bg-foreground/5 transition"
                    >
                        <p className="text-foreground font-semibold text-lg mb-4">Choose how to add your photo</p>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-bold border-2 border-foreground hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <Upload className="w-5 h-5"/>
                                Upload from device
                            </button>
                            <button
                                type="button"
                                onClick={startCamera}
                                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold border-2 border-foreground hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <Camera className="w-5 h-5"/>
                                Take photo
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">(JPEG, PNG, or WEBP, max 5MB)</p>
                    </motion.div>
                </div>
            )}

            {/* Camera Modal */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={stopCamera}
                    >
                        <motion.div
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.9, opacity: 0}}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card border-4 border-foreground rounded-2xl p-6 max-w-2xl w-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Take a photo</h3>
                                <button
                                    type="button"
                                    onClick={stopCamera}
                                    className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold border-2 border-foreground hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    <X className="w-5 h-5"/>
                                    Close
                                </button>
                            </div>
                            
                            <div className="relative bg-black rounded-xl overflow-hidden mb-4 w-full" style={{ aspectRatio: '16/9', minHeight: '400px', maxWidth: '100%' }}>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-contain"
                                    style={{ 
                                        width: '100%', 
                                        height: '100%',
                                        display: videoReady ? 'block' : 'none',
                                        transform: 'scaleX(-1)' // Mirror the video
                                    }}
                                />
                                {(!stream || !videoReady) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white">
                                        <div className="text-center">
                                            <p className="text-lg font-semibold mb-2">Loading camera...</p>
                                            <p className="text-sm text-gray-400">Please allow camera access when prompted</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    disabled={!videoReady}
                                    className={`px-8 py-4 rounded-lg font-bold border-2 border-foreground transition-all flex items-center gap-2 text-lg ${
                                        videoReady 
                                            ? 'bg-primary text-primary-foreground hover:-translate-y-0.5 cursor-pointer' 
                                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    <Camera className="w-6 h-6"/>
                                    {videoReady ? 'Capture Photo' : 'Waiting for camera...'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
