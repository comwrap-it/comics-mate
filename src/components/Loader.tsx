import {motion} from "framer-motion";
import {ChristmasGame} from "./ChristmasGame";

export const Loader = () => {
    return (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{scale: 0, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0, opacity: 0}}
                className="bg-card border-4 border-foreground rounded-2xl shadow-comic-hover flex flex-col items-center gap-4 max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="w-full bg-primary text-primary-foreground p-4 border-b-4 border-foreground text-center">
                    <h3 className="text-2xl font-black uppercase">
                        🎄 Creating your Christmas Badge... 🎄
                    </h3>
                    <p className="text-sm mt-1 opacity-90">
                        Santa's elves are working! Play while you wait...
                    </p>
                </div>

                {/* Game */}
                <div className="flex-1 w-full overflow-y-auto p-4">
                    <ChristmasGame />
                </div>
            </motion.div>
        </div>
    );
};
