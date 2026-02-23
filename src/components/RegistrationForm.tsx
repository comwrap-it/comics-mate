import {useForm} from "react-hook-form";
import {useState} from "react";
import {motion} from "framer-motion";
import {Zap} from "lucide-react";
import {toast} from "react-toastify";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {ImageUpload} from "./ImageUpload";
import {Loader} from "./Loader";
import {BadgePreview} from "./BadgePreview";
import axios from "axios";
import {generateBadge, getNumberByEmail} from "@/utils/api";

interface RegistrationFormProps {
    onBadgeGenerated: (imageUrl: string, name: string, category: string) => void;
    setShowBadgeList: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
    name: string;
    email: string;
    company: string;
    photo: string;
    style: string;
    ai_model: string;
    dimensions?: string;
    quality?: string;
    acceptPolicy: boolean;
    acceptProfiling: boolean;
}

const STYLES = [
    {value: "batman", label: "🦇 Batman (senza maschera)"},
    {value: "superman", label: "🦸 Superman"},
    {value: "wonder_woman", label: "⚔️ Wonder Woman"},
    {value: "spider_man", label: "🕷️ Spider-Man (senza maschera)"},
    {value: "captain_america", label: "🛡️ Captain America"},
    {value: "thor", label: "⚡ Thor (Mjolnir)"},
    {value: "black_widow", label: "🕸️ Black Widow"},
    {value: "hogwarts", label: "🪄 Hogwarts (Grifondoro)"},
    {value: "dragon_ball", label: "🐉 Dragon Ball"},
    {value: "barbie", label: "💖 Barbie / Ken"},
    {value: "lara_croft", label: "🏹 Lara Croft (Tomb Raider)"},
    {value: "wednesday_addams", label: "🖤 Mercoledì Addams"},
    {value: "cleopatra", label: "👑 Cleopatra"},
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
    const defaultValues = {
        style: "batman",
        ai_model: "gemini",
        dimensions: "square",
        quality: "medium",
        company: "",
        acceptPolicy: false,
        acceptProfiling: false,
    };
    const {register, handleSubmit, watch, setValue, reset, formState: {errors}} = useForm<FormData>({
        defaultValues,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [resetKey, setResetKey] = useState(0);
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
            formData.append("company", data.company ?? "");
            formData.append("acceptPolicy", data.acceptPolicy ? "true" : "false");
            formData.append("acceptProfiling", data.acceptProfiling ? "true" : "false");
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
            
            // Always try to get number from get-videos API using email
            let number = response.number; // Fallback to header number if available
            if (data.email) {
                try {
                    const numberFromVideos = await getNumberByEmail(data.email);
                    if (numberFromVideos !== null) {
                        number = numberFromVideos.toString();
                    }
                } catch (error) {
                    console.error("Error fetching number from videos:", error);
                    // Keep the number from response headers if available
                }
            }
            setBadgeNumber(number);
            
            onBadgeGenerated(imageUrl, data.name, data.style);
            toast.success("Badge generated!");
        } catch (error) {
            console.error("Error while generating badge:", error);
            
            // Gestione specifica per errore 400 con "Failed to generate image."
            if (axios.isAxiosError(error) && error.response?.status === 400 && error.response.data instanceof Blob) {
                try {
                    const errorText = await error.response.data.text();
                    if (errorText.includes("Failed to generate image.")) {
                        toast.error("Non è stato possibile generare l'immagine. Riprova più tardi.", {
                            autoClose: 5000,
                        });
                        return;
                    }
                } catch (blobError) {
                    console.error("Error reading error blob:", blobError);
                }
            }
            
            toast.error("Errore durante la generazione del badge. Riprova.", {
                autoClose: 5000,
            });
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
                    company: formData.company || "",
                    acceptProfiling: formData.acceptProfiling ?? false,
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

                        {/* Azienda */}
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-lg font-bold">
                                Azienda
                            </Label>
                            <Input
                                id="company"
                                {...register("company")}
                                placeholder="Nome azienda"
                                className="h-14 text-lg border-2 border-foreground"
                            />
                        </div>

                        {/* Photo Upload */}
                        <ImageUpload key={resetKey} onFileChange={setPhotoFile}/>

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

                        {/* Obbligatorio: consenso trattamento per il servizio */}
                        <div className="space-y-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    {...register("acceptPolicy", {
                                        required: "Devi accettare la privacy policy e i termini per procedere",
                                    })}
                                    className="mt-1.5 h-5 w-5 rounded border-2 border-foreground accent-primary cursor-pointer"
                                />
                                <span className="text-base text-foreground group-hover:text-foreground/90">
                                    Accetto la{" "}
                                    <a href="https://www.reply.com/en/privacy-notice-marketing" className="font-semibold underline hover:text-primary" target="_blank" rel="noopener noreferrer">privacy policy</a>
                                    {" "}e i termini di utilizzo per la generazione del badge e l'invio del video personalizzato.
                                </span>
                            </label>
                            {errors.acceptPolicy && (
                                <p className="text-destructive text-sm font-semibold">{errors.acceptPolicy.message}</p>
                            )}
                        </div>

                        {/* Facoltativo: consenso alla profilazione (art. 6.1.a GDPR) */}
                        <div className="space-y-3 rounded-xl border-2 border-foreground bg-muted/30 p-4">
                            <p className="text-sm text-foreground">
                                <strong>Consenso alla profilazione e analisi comportamentale</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Prendo atto che i miei dati personali potranno essere trattati mediante analisi automatizzate per valutare i miei interessi e preferenze, al fine di inviarmi comunicazioni di marketing mirate (art. 6.1.a GDPR). La mancata accettazione non impedisce la partecipazione all'evento.
                            </p>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    {...register("acceptProfiling")}
                                    className="mt-1.5 h-5 w-5 rounded border-2 border-foreground accent-primary cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-foreground group-hover:text-foreground/90">
                                    ACCETTO il trattamento dei miei dati per finalità di profilazione
                                </span>
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Ho letto l'<a href="https://www.reply.com/en/privacy-notice-marketing" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">informativa privacy</a> e sono consapevole che posso revocare il consenso in qualsiasi momento con la stessa facilità con cui l'ho prestato.
                            </p>
                        </div>

                        {/* Submit Button + Reset */}
                        <div className="flex justify-center items-center gap-3">
                            <Button
                                type="submit"
                                className="bg-primary text-primary-foreground !px-12 !py-8 border-2 border-foreground rounded-lg font-black text-lg
               flex items-center gap-3 transform transition-transform duration-300 hover:scale-105 shadow-lg"
                                disabled={isLoading}
                            >
                                <Zap className="!w-6 !h-6 !mt-1"/>
                                Generate
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="text-sm font-semibold py-2 px-4 border-2 border-foreground rounded-lg"
                                disabled={isLoading}
                                onClick={() => {
                                    reset(defaultValues);
                                    setPhotoFile(null);
                                    setResetKey((k) => k + 1);
                                }}
                            >
                                Reset
                            </Button>
                        </div>

                    </motion.form>
                </div>
            </div>
        </>
    );
};
