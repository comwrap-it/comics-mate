import { ShieldCheck } from "lucide-react";

export const Disclaimer = () => {
  return (
    <div className="mt-8 p-6 bg-muted/50 border-2 border-foreground rounded-xl shadow-comic-sm">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Privacy & Dati</p>
          <p>
            I dati saranno utilizzati esclusivamente per la generazione del badge
            e l'invio del video personalizzato via email. Nessuna informazione
            sarà salvata dopo l'evento Lucca Comics.
          </p>
        </div>
      </div>
    </div>
  );
};
