import {ShieldCheck} from "lucide-react";
import comwrapImage from "../../assets/Comwrap Christmas.png";

export const Disclaimer = () => {
    return (
        <div className="mt-4 flex flex-col items-center gap-2">
            {/* Comwrap Logo - Larger to fill space */}
            <img 
                src={comwrapImage} 
                alt="Comwrap" 
                className="w-48 md:w-64 h-auto object-contain"
            />
            
            {/* Privacy Box - Smaller, closer to image */}
            <div className="p-3 bg-muted/50 border-2 border-foreground rounded-lg shadow-comic-sm max-w-md">
                <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"/>
                    <div className="text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Privacy & Data</p>
                        <p>
                            The data will be used exclusively for badge generation and for sending the personalized video
                            via email. No information will be stored after the Secret Santa event.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
