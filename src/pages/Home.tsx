import {motion} from "framer-motion";
import {Zap} from "lucide-react";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {RegistrationForm} from "@/components/RegistrationForm";
import {Disclaimer} from "@/components/Disclaimer";
import {useEffect, useState} from "react";
import {BadgePreview} from "@/components/BadgePreview";

interface Badge {
    id: string;
    imageUrl: string;
    timestamp: number;
    name: string;
}

const Home = () => {
    const [previousBadges, setPreviousBadges] = useState<Badge[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("lucca-badges");
        if (saved) {
            setPreviousBadges(JSON.parse(saved));
        }
    }, []);

    const handleBadgeGenerated = (imageUrl: string, name: string) => {
        const newBadge: Badge = {
            id: Date.now().toString(),
            imageUrl,
            timestamp: Date.now(),
            name,
        };
        const updated = [newBadge, ...previousBadges];
        setPreviousBadges(updated);
        localStorage.setItem("lucca-badges", JSON.stringify(updated));
    };

    const handleDeleteBadge = (id: string) => {
        const updated = previousBadges.filter(b => b.id !== id);
        setPreviousBadges(updated);
        localStorage.setItem("lucca-badges", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />

                {/* Header */}
                <motion.div
                    initial={{opacity: 0, y: -30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, type: "spring", bounce: 0.4}}
                    className="text-center mb-12 max-w-4xl mx-auto"
                >
                    <div className="inline-block mb-6">
                        <motion.div
                            animate={{
                                rotate: [0, -5, 5, -5, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                            className="bg-primary text-primary-foreground px-8 py-4 border-4 border-foreground rounded-2xl inline-flex items-center gap-3"
                        >
                            <Zap className="w-10 h-10" fill="currentColor"/>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                                Reply Comics
                            </h1>
                            <Zap className="w-10 h-10" fill="currentColor"/>
                        </motion.div>
                    </div>

                    <motion.h2
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.2, duration: 0.5}}
                        className="text-3xl md:text-4xl font-black text-foreground mb-4 uppercase"
                    >
                        Hero Badge Generator
                    </motion.h2>

                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4}}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Become your favorite hero!
                    </motion.p>
                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4}}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Upload your photo and create your own AI badge.
                    </motion.p>

                    {/* Comic burst decoration */}
                    <div className="mt-6 flex justify-center gap-4">
                        {["POW!", "BANG!", "WOW!"].map((text, i) => (
                            <motion.div
                                key={text}
                                initial={{opacity: 0, scale: 0}}
                                animate={{opacity: 1, scale: 1}}
                                className="bg-accent text-foreground px-4 py-2 border-2 border-foreground rounded-lg font-black text-sm !rotate-3 !hover:rotate-6 !transition-transform"
                                style={{transform: `rotate(${(i - 1) * 8}deg)`}}
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.8}}
                    className="max-w-3xl mx-auto mt-8"
                >
                    <Disclaimer/>
                </motion.div>
            </div>
            <div>
                {/* Form */}
                <RegistrationForm onBadgeGenerated={handleBadgeGenerated}/>

                {/* Badge Preview Modal */}
                {selectedBadge && (
                    <BadgePreview
                        imageUrl={selectedBadge.imageUrl}
                        onClose={() => setSelectedBadge(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
