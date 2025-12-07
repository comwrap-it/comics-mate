import {useForm} from "react-hook-form";
import {useState} from "react";
import {motion} from "framer-motion";
import {Gift} from "lucide-react";
import {toast} from "react-toastify";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {ImageUpload} from "./ImageUpload";
import {Loader} from "./Loader";
import {BadgePreview} from "./BadgePreview";
import {generateBadge} from "@/utils/api";

interface RegistrationFormProps {
    onBadgeGenerated: (imageUrl: string, name: string, category: string) => void;
    setShowBadgeList: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
    name: string;
    email: string;
    photo: string;
    style: string;
    ai_model: string;
    dimensions?: string;
    quality?: string;
}

const STYLES = [
    {value: "classic_santa_claus", label: "🎅 Santa Claus Style"},
    {value: "the_grinch", label: "👹 Il Grinch"},
    {value: "home_alone_kevin", label: "🏠 Mamma ho perso l'aereo"},
    {value: "buddy_the_elf", label: "🧝 Elf (Buddy)"},
    {value: "cinepanettone_90s", label: "🎬 Cinepanettone '90s"},
    {value: "fantozzi_office", label: "👔 Fantozzi (Cena Aziendale)"},
    {value: "tim_burton_style", label: "🎃 Nightmare Before Christmas"},
    {value: "hogwarts_winter", label: "⚡ Harry Potter (Hogwarts)"},
    {value: "stranger_things_lights", label: "💡 Stranger Things (Luci)"},
    {value: "white_walker_xmas", label: "❄️ Il Trono di Spade (White Walker)"},
    {value: "christmas_carol_singer", label: "🎵 Christmas Carol Singer"},
];

const DIMENSIONS = [
    {value: "square", label: "Square (1024x1024)", val: "1024x1024"},
    {value: "horizontal", label: "Horizontal (1536x1024)", val: "1536x1024"},
    {value: "vertical", label: "Vertical (1024x1536)", val: "1024x1536"},
];

const QUALITY = [
    {value: "low", label: "Low"},
    {value: "medium", label: "Medium"},
    {value: "high", label: "High"},
];

export const RegistrationForm = ({onBadgeGenerated, setShowBadgeList}: RegistrationFormProps) => {
    const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm<FormData>({
        defaultValues: {
            style: "classic_santa_claus",
            ai_model: "gemini",
            dimensions: "square",
            quality: "medium",
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [badgeNumber, setBadgeNumber] = useState<string | undefined>(undefined);

    const selectedStyle = watch("style");


    const onSubmit = async (data: FormData) => {
        if (!photoFile) {
            toast.error("Load a photo first!");
            return;
        }

        setIsLoading(true);
        setGeneratedImage("");

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("type", data.style);
            formData.append("class", data.style); // Use style as class since they're unified
            const dimensionObj = DIMENSIONS.find(d => d.value === data.dimensions);
            formData.append("size", dimensionObj?.val || "1024x1024");
            formData.append("quality", data.quality);
            formData.append("model", data.ai_model);
            formData.append("video_model", data.ai_model);
            formData.append("image", photoFile); // photoFile è un oggetto File

            const response = await generateBadge(formData);

            const imageUrl = URL.createObjectURL(response.blob);
            setGeneratedImage(imageUrl);
            setCategory(data.style);
            setBadgeNumber(response.number);
            onBadgeGenerated(imageUrl, data.name, data.style);
            toast.success("Badge generated!");
        } catch (error) {
            console.error("Error while generating badge:", error);
            toast.error("Error while generating badge :(");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePreview = async () => {
        if (generatedImage) {
            const blob = await fetch(generatedImage).then(res => res.blob());
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // Get the name and email from the form data
            const formData = watch();
            fetch("http://localhost:5000/save-badge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    category: category,
                    userName: formData.name || "Unknown",
                    email: formData.email || "",
                    number: badgeNumber,
                })
            })
                .then(res => res.json())
                .then(data => console.log("Badge saved:", data))
                .catch(err => console.error("Error saving badge:", err));
        }
        setGeneratedImage("");
        setTimeout(() => setShowBadgeList(true), 2000);
    };

    return (
        <>
            {isLoading && <Loader/>}
            {generatedImage && (
                <BadgePreview 
                    imageUrl={generatedImage} 
                    onClose={handleClosePreview}
                    badgeName={watch("name")}
                    showSuccessMessage={true}
                />
            )}


            <div className="flex-[2] flex justify-center overflow-y-auto h-[calc(100vh-48px)] py-8">
                <div className="w-full max-w-3xl pb-16">
                    <motion.form
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full bg-card border-4 border-foreground rounded-2xl p-8 space-y-8"
                    >
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-lg font-bold">
                                Name <span className="text-primary">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...register("name", {required: "Il nome è obbligatorio"})}
                                placeholder="Your name"
                                className="h-14 text-lg border-2 border-foreground"
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm font-semibold">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-lg font-bold">
                                Email <span className="text-primary">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "L'email è obbligatoria",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email not valid",
                                    },
                                })}
                                placeholder="youremail@email.com"
                                className="h-14 text-lg border-2 border-foreground"
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm font-semibold">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Photo Upload */}
                        <ImageUpload onFileChange={setPhotoFile}/>

                        {/* Style */}
                        <div className="space-y-2">
                            <Label className="text-lg font-bold">
                                Style <span className="text-primary">*</span>
                            </Label>
                            <Select
                                value={selectedStyle}
                                onValueChange={(value) => {
                                    setValue("style", value);
                                }}
                            >
                                <SelectTrigger className="h-14 text-lg border-2 border-foreground bg-background">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground bg-background">
                                    {STYLES.map((style) => (
                                        <SelectItem key={style.value} value={style.value} className="text-lg">
                                            {style.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="bg-primary text-primary-foreground !px-12 !py-8 border-2 border-foreground rounded-lg font-black text-lg
               flex items-center gap-3 transform transition-transform duration-300 hover:scale-105 shadow-lg"
                                disabled={isLoading}
                            >
                                <Gift className="!w-6 !h-6 !mt-1"/>
                                Generate Christmas Badge
                            </Button>
                        </div>

                    </motion.form>
                </div>
            </div>
        </>
    );
};
