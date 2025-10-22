import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { Loader } from "./Loader";
import { BadgePreview } from "./BadgePreview";
import { generateBadgeMock } from "@/utils/api";

interface RegistrationFormProps {
  onBadgeGenerated: (imageUrl: string, name: string) => void;
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
  { value: "superhero", label: "Superhero" },
  { value: "anime", label: "Anime" },
  { value: "cartoon", label: "Cartoon" },
  { value: "dnd", label: "Dungeons & Dragons" },
];

const AI_MODELS = [
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "firefly", label: "Adobe Firefly" },
];

const DIMENSIONS = [
  { value: "square", label: "Square (1024x1024)" },
  { value: "horizontal", label: "Horizontal (1536x1024)" },
  { value: "vertical", label: "Vertical (1024x1536)" },
];

const QUALITY = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const CHARACTER_OPTIONS: Record<string, string[]> = {
  anime: ["Protagonista Shonen", "Mago", "Samurai", "Ninja"],
  superhero: ["Superman-style", "Batman-style", "Wonder Woman-style", "Spider-Man-style"],
  cartoon: ["Personaggio Disney", "Looney Tunes", "Anime Chibi", "Cartoon Network"],
  dnd: ["Guerriero", "Mago", "Ladro", "Chierico", "Ranger", "Barbaro"],
};

export const RegistrationForm = ({ onBadgeGenerated }: RegistrationFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      style: "superhero",
      ai_model: "gemini",
      dimensions: "square",
      quality: "medium",
      action_prompt: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [photoBase64, setPhotoBase64] = useState<string>("");

  const selectedStyle = watch("style");
  const selectedAiModel = watch("ai_model");

  const onSubmit = async (data: FormData) => {
    if (!photoBase64) {
      toast.error("Per favore carica una foto!");
      return;
    }

    setIsLoading(true);
    setGeneratedImage("");

    try {
      const payload = {
        name: data.name,
        email: data.email,
        style: data.style,
        character: data.character,
        ai_model: data.ai_model,
        dimensions: data.ai_model === "openai" ? data.dimensions : undefined,
        quality: data.ai_model === "openai" ? data.quality : undefined,
        action_prompt: data.action_prompt,
        photo: photoBase64,
      };

      const response = await generateBadgeMock(payload);

      if (response.success && response.image_url) {
        setGeneratedImage(response.image_url);
        onBadgeGenerated(response.image_url, data.name);
        toast.success("Badge generato con successo!");
      } else {
        throw new Error(response.error || "Errore nella generazione");
      }
    } catch (error) {
      console.error("Error generating badge:", error);
      toast.error(
        error instanceof Error ? error.message : "Errore durante la generazione del badge"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreview = () => {
    setGeneratedImage("");
    // Optionally reset form
  };

  return (
    <>
      {isLoading && <Loader />}
      {generatedImage && (
        <BadgePreview imageUrl={generatedImage} onClose={handleClosePreview} />
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto bg-card border-4 border-foreground rounded-2xl p-8 space-y-8"
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-lg font-bold">
            Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="name"
            {...register("name", { required: "Il nome è obbligatorio" })}
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
        <ImageUpload value={photoBase64} onImageChange={setPhotoBase64} />

        {/* Style */}
        <div className="space-y-2">
          <Label className="text-lg font-bold">
            Style <span className="text-primary">*</span>
          </Label>
          <Select
            value={selectedStyle}
            onValueChange={(value) => {
              setValue("style", value);
              setValue("character", ""); // Reset character when style changes
            }}
          >
            <SelectTrigger className="h-14 text-lg border-2 border-foreground bg-background">
              <SelectValue />
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
          <Label htmlFor="character" className="text-lg font-bold">
            Character / Class <span className="text-primary">*</span>
          </Label>
          <Textarea
              id="character"
              {...register("character")}
              placeholder="e.g. Superman, Spiderman, Flash, ..."
              className="min-h-8 !text-lg border-2 border-foreground resize-none"
          />
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
              <SelectValue />
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 p-6 bg-secondary/10 border-2 border-foreground rounded-xl"
          >
            {/* Dimensions */}
            <div className="space-y-2">
              <Label className="text-lg font-bold">Dimensioni</Label>
              <Select
                value={watch("dimensions")}
                onValueChange={(value) => setValue("dimensions", value)}
              >
                <SelectTrigger className="h-14 text-lg border-2 border-foreground bg-background">
                  <SelectValue />
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
                <SelectTrigger className="h-14 text-lg border-2 border-foreground bg-background">
                  <SelectValue />
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
            <Wand2 className="w-5 h-5 text-accent" />
            Custom actions
          </Label>
          <Textarea
            id="action_prompt"
            {...register("action_prompt")}
            placeholder="e.g.: flying and landing with sight towards camera then show biceps"
            className="min-h-32 text-lg border-2 border-foreground resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
              type="submit"
              variant="hero"
              className="bg-accent text-foreground !px-12 !py-8 border-2 border-foreground rounded-lg font-black text-lg
               flex items-center gap-3 transform transition-transform duration-300 hover:scale-105"
              disabled={isLoading}
          >
            <Sparkles className="!w-6 !h-6 !mt-1" />
            Generate
          </Button>
        </div>

      </motion.form>
    </>
  );
};
