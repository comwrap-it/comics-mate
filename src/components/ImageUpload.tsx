import {X} from "lucide-react";
import {useRef, useState} from "react";
import {motion} from "framer-motion";

interface ImageUploadProps {
    onFileChange: (file: File | null) => void
}

export const ImageUpload = ({onFileChange}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string>("");
    const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    };

    const handleClick = () => fileInputRef.current?.click();

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
                <motion.div
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    className="border-4 border-dashed border-foreground rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-foreground/5 transition"
                    onClick={handleClick}
                >
                    <p className="text-foreground font-semibold text-lg">Load your photo</p>
                    <p className="text-sm text-muted-foreground mt-1">(JPEG, PNG, or WEBP, max 5MB)</p>
                </motion.div>
            )}
        </div>
    );
};
