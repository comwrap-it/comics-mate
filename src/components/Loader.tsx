import {motion} from "framer-motion";
import {Snowflake, Gift} from "lucide-react";

export const Loader = () => {
    return (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                initial={{scale: 0}}
                animate={{scale: 1}}
                className="bg-card border-4 border-foreground rounded-2xl shadow-comic-hover p-12 flex flex-col items-center gap-6 max-w-md"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        },
                        scale: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                    className="relative"
                >
                    <Gift className="w-24 h-24 text-primary"/>
                </motion.div>

                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                        🎄 Creating your Christmas Badge... 🎄
                    </h3>
                    <p className="text-muted-foreground">
                        Santa's elves are working on your custom badge!
                    </p>
                </div>

                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-4 h-4"
                        >
                            <Snowflake className="w-full h-full text-primary"/>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
