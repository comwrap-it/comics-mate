import { motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "./ui/button";

interface BadgePreviewProps {
  imageUrl: string;
  onClose: () => void;
}

export const BadgePreview = ({ imageUrl, onClose }: BadgePreviewProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "lucca-comics-badge.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        className="bg-card border-4 border-foreground rounded-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 border-b-4 border-foreground flex justify-between items-center">
          <h2 className="text-3xl font-bold uppercase">Il Tuo Badge!</h2>
          <button
            onClick={onClose}
            className="hover:scale-110 transition-transform"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Image */}
        <div className="p-8 bg-gradient-to-br from-background to-accent/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl overflow-hidden border-4 border-foreground"
          >
            <img
              src={imageUrl}
              alt="Generated Badge"
              className="w-full h-auto"
            />
          </motion.div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t-4 border-foreground bg-background flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownload}
            variant="success"
            className="flex-1"
          >
            <Download className="w-5 h-5" />
            Scarica Badge
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Chiudi
          </Button>
        </div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-success/10 border-t-4 border-foreground p-4 text-center"
        >
          <p className="text-success font-bold text-lg">
            ✅ Badge generato con successo!
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Riceverai il video personalizzato via email
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
