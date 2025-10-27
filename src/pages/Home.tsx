import {motion} from "framer-motion";
import {RefreshCcw, Zap} from "lucide-react";
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
    category: string;
}

const Home = () => {
    const [previousBadges, setPreviousBadges] = useState<Badge[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [showBadgeList, setShowBadgeList] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/get-badges")
            .then(res => res.json())
            .then(data => setPreviousBadges(data))
            .catch(err => console.error("Error while fetching badges", err));
    }, []);

    const handleBadgeGenerated = (imageUrl: string, name: string, category: string) => {
        const newBadge: Badge = {
            id: Date.now().toString(),
            imageUrl,
            timestamp: Date.now(),
            name,
            category,
        };
        const updated = [newBadge, ...previousBadges];
        setPreviousBadges(updated);
    };

    return (
        <div className="min-h-screen bg-background flex justify-center gap-8">
            <div className="flex w-full max-w-full px-24 h-screen overflow-hidden">
                <div className="flex-[1.5] flex flex-col justify-center pr-8">
                    {/* Contenuto normale */}
                    {!showBadgeList && (<>
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

                        <button
                            onClick={() => setShowBadgeList(!showBadgeList)}
                            className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-110 transition-transform"
                        >
                            <motion.div
                                animate={{rotate: showBadgeList ? 180 : 0}}
                                transition={{duration: 0.5}}
                            >
                                <RefreshCcw className="w-6 h-6"/>
                            </motion.div>
                            <span className="font-bold uppercase text-sm">
                                    {showBadgeList ? "Hide badges" : "Show badges"}
                                </span>
                        </button>

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
                    </>)}

                    {/* Contenuto lista badge */}
                    {showBadgeList && (
                        <div className="back-panel absolute inset-0 bg-background p-8 overflow-y-auto z-50">
                            <button
                                onClick={() => setShowBadgeList(!showBadgeList)}
                                className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-110 transition-transform"
                            >
                                <motion.div
                                    animate={{rotate: showBadgeList ? 180 : 0}}
                                    transition={{duration: 0.5}}
                                >
                                    <RefreshCcw className="w-6 h-6"/>
                                </motion.div>
                                <span className="font-bold uppercase text-sm">
                                    {showBadgeList ? "Hide badges" : "Show badges"}
                                </span>
                            </button>
                            <h2 className="text-2xl font-bold mb-4">I tuoi Badge</h2>
                            <ul className="grid grid-cols-2 gap-4">
                                {previousBadges.map(badge => (
                                    <li key={badge.id} className="border rounded-xl p-4">
                                        <div className="w-full h-[1200px] overflow-hidden rounded">
                                            <img src={badge.imageUrl} alt={badge.name}
                                                 className="w-full h-full object-cover rounded"/>
                                        </div>
                                    </li>
                                    ))}
                            </ul>
                        </div>
                        )}
                </div>
                <div className="flex-[2] flex justify-center py-4 h-screen overflow-hidden">
                    {/* Form */}
                    <RegistrationForm onBadgeGenerated={handleBadgeGenerated} setShowBadgeList={setShowBadgeList}/>

                    {/* Badge Preview Modal */}
                    {selectedBadge && (
                        <BadgePreview
                            imageUrl={selectedBadge.imageUrl}
                            onClose={() => setSelectedBadge(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
