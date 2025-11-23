import {useForm} from "react-hook-form";
import {useState} from "react";
import {motion} from "framer-motion";
import {Sparkles, Wand2, Gift, Star} from "lucide-react";
import {toast} from "react-toastify";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {Textarea} from "./ui/textarea";
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
    character: string;
    ai_model: string;
    dimensions?: string;
    quality?: string;
    action_prompt: string;
}

const STYLES = [
    {value: "santa", label: "🎅 Santa Claus"},
    {value: "elf", label: "🧝 Christmas Elf"},
    {value: "reindeer", label: "🦌 Reindeer"},
    {value: "snowman", label: "⛄ Snowman"},
    {value: "christmas", label: "🎄 Christmas Character"},
];

const CHARACTERS = [
    {value: "santa_helper", label: "🎅 Santa's Helper"},
    {value: "elf_worker", label: "🧝 Christmas Elf Worker"},
    {value: "reindeer_rider", label: "🦌 Reindeer Rider"},
    {value: "snowman_builder", label: "⛄ Snowman Builder"},
    {value: "gift_deliverer", label: "🎁 Gift Deliverer"},
    {value: "christmas_caroler", label: "🎵 Christmas Caroler"},
    {value: "cookie_baker", label: "🍪 Cookie Baker"},
    {value: "ornament_maker", label: "🎨 Ornament Maker"},
];

const AI_MODELS = [
    {value: "gemini", label: "Google Gemini"},
    {value: "openai", label: "OpenAI"},
    {value: "firefly", label: "Adobe Firefly"},
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
            style: "santa",
            character: "santa_helper",
            ai_model: "gemini",
            dimensions: "square",
            quality: "medium",
            action_prompt: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const selectedStyle = watch("style") || "santa";
    const selectedCharacter = watch("character") || "santa_helper";
    const selectedAiModel = watch("ai_model");


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
            formData.append("class", data.character);
            const dimensionObj = DIMENSIONS.find(d => d.value === data.dimensions);
            formData.append("size", dimensionObj?.val || "1024x1024");
            formData.append("quality", data.quality);
            formData.append("model", data.ai_model);
            formData.append("video_model", data.ai_model);
            formData.append("customPrompt", data.action_prompt);
            formData.append("image", photoFile); // photoFile è un oggetto File

            const responseBlob = await generateBadge(formData);

            const imageUrl = URL.createObjectURL(responseBlob);
            setGeneratedImage(imageUrl);
            setCategory(data.style);
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

            fetch("http://localhost:5000/save-badge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    category: category,
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
                <BadgePreview imageUrl={generatedImage} onClose={handleClosePreview}/>
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
                                {...register("name", {required: "Name is required"})}
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
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email is not valid",
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
                                value={selectedStyle || "santa"}
                                onValueChange={(value) => {
                                    setValue("style", value);
                                    // Reset character to default when style changes
                                    setValue("character", "santa_helper");
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

                        {/* Character */}
                        <div className="space-y-2">
                            <Label className="text-lg font-bold">
                                Character / Class <span className="text-primary">*</span>
                            </Label>
                            <Select
                                value={selectedCharacter || "santa_helper"}
                                onValueChange={(value) => setValue("character", value)}
                            >
                                <SelectTrigger className="h-14 text-lg border-2 border-foreground bg-background">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground bg-background">
                                    {CHARACTERS.map((character) => (
                                        <SelectItem key={character.value} value={character.value} className="text-lg">
                                            {character.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.character && (
                                <p className="text-destructive text-sm font-semibold">{errors.character.message}</p>
                            )}
                        </div>

                        {/* AI Model */}
                        <div className="space-y-2">
                            <Label className="text-lg font-bold">
                                AI Model <span className="text-primary">*</span>
                            </Label>
                            <Select
                                value={selectedAiModel}
                                onValueChange={(value) => setValue("ai_model", value)}
                            >
                                <SelectTrigger className="h-14 text-lg border-2 border-foreground bg-background">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground bg-background">
                                    {AI_MODELS.map((model) => (
                                        <SelectItem key={model.value} value={model.value} className="text-lg">
                                            {model.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* OpenAI Options */}
                        {selectedAiModel === "openai" && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: "auto"}}
                                exit={{opacity: 0, height: 0}}
                                className="space-y-6 p-6 bg-secondary/10 border-2 border-foreground rounded-xl"
                            >
                                {/* Dimensions */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-bold">Dimensioni</Label>
                                    <Select
                                        value={watch("dimensions")}
                                        onValueChange={(value) => setValue("dimensions", value)}
                                    >
                                        <SelectTrigger
                                            className="h-14 text-lg border-2 border-foreground bg-background">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-foreground bg-background">
                                            {DIMENSIONS.map((dim) => (
                                                <SelectItem key={dim.value} value={dim.value} className="text-lg">
                                                    {dim.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Quality */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-bold">Qualità</Label>
                                    <Select
                                        value={watch("quality")}
                                        onValueChange={(value) => setValue("quality", value)}
                                    >
                                        <SelectTrigger
                                            className="h-14 text-lg border-2 border-foreground bg-background">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-foreground bg-background">
                                            {QUALITY.map((q) => (
                                                <SelectItem key={q.value} value={q.value} className="text-lg">
                                                    {q.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Prompt */}
                        <div className="space-y-2">
                            <Label htmlFor="action_prompt" className="text-lg font-bold flex items-center gap-2">
                                <Star className="w-5 h-5 text-accent"/>
                                Custom actions
                            </Label>
                            <Textarea
                                id="action_prompt"
                                {...register("action_prompt")}
                                placeholder="e.g.: wearing a Santa hat, holding a gift, with Christmas lights in the background"
                                className="min-h-32 text-lg border-2 border-foreground resize-none"
                            />
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
