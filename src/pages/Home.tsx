import {motion} from "framer-motion";
import {RefreshCcw, Gift, Snowflake, Star} from "lucide-react";
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
        <div className="min-h-screen bg-background flex justify-center gap-8 relative overflow-hidden">
            {/* Background Christmas decorations - subtle stars in corners */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Decorative stars in corners - subtle and elegant */}
                {[
                    {x: "5%", y: "10%", size: "w-8 h-8"},
                    {x: "95%", y: "15%", size: "w-6 h-6"},
                    {x: "8%", y: "85%", size: "w-7 h-7"},
                    {x: "92%", y: "90%", size: "w-5 h-5"},
                ].map((star, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className={`absolute text-accent/20 ${star.size}`}
                        style={{
                            left: star.x,
                            top: star.y,
                        }}
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    >
                        <Star className="w-full h-full" fill="currentColor" />
                    </motion.div>
                ))}
            </div>
            
            <div className="flex w-full max-w-full px-24 h-screen overflow-hidden relative z-10">
                <div className="flex-[1.5] flex flex-col justify-center pr-8 relative">
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

                        {/* Header */}
                        <motion.div
                            initial={{opacity: 0, y: -30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, type: "spring", bounce: 0.4}}
                            className="text-center mb-12 max-w-4xl mx-auto relative"
                        >
                            {/* Snowflakes decoration - falling from top, evenly distributed */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                                {[...Array(12)].map((_, i) => {
                                    // Distribute snowflakes evenly across the width
                                    const xPosition = (i * (100 / 12)) + (Math.random() * (100 / 12));
                                    const delay = i * 0.3;
                                    const duration = 8 + Math.random() * 4;
                                    
                                    return (
                                        <motion.div
                                            key={i}
                                            className="absolute text-primary/15"
                                            initial={{
                                                x: `${xPosition}%`,
                                                y: -30,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                y: "110vh",
                                                opacity: [0, 0.6, 0.6, 0],
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: duration,
                                                repeat: Infinity,
                                                delay: delay,
                                                ease: "linear",
                                            }}
                                        >
                                            <Snowflake className="w-3 h-3" />
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="inline-block mb-6 relative z-10">
                                <motion.div
                                    animate={{
                                        rotate: [0, -3, 3, -3, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                    }}
                                    className="bg-primary text-primary-foreground px-8 py-4 border-4 border-foreground rounded-2xl inline-flex items-center gap-3 shadow-lg"
                                >
                                    <Gift className="w-10 h-10" fill="currentColor"/>
                                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                                        Secret Santa
                                    </h1>
                                    <Gift className="w-10 h-10" fill="currentColor"/>
                                </motion.div>
                            </div>

                            <motion.h2
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{delay: 0.2, duration: 0.5}}
                                className="text-3xl md:text-4xl font-black text-foreground mb-4 uppercase relative z-10"
                            >
                                🎄 Christmas Badge Generator 🎄
                            </motion.h2>

                            <motion.p
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.4}}
                                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative z-10"
                            >
                                Create your festive Christmas badge!
                            </motion.p>
                            <motion.p
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.4}}
                                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative z-10"
                            >
                                Upload your photo and become a Christmas hero for your Secret Santa!
                            </motion.p>

                            {/* Christmas decoration */}
                            <div className="mt-6 flex justify-center gap-4 relative z-10">
                                {["🎁", "⭐", "❄️"].map((emoji, i) => (
                                    <motion.div
                                        key={emoji}
                                        initial={{opacity: 0, scale: 0, rotate: -180}}
                                        animate={{opacity: 1, scale: 1, rotate: 0}}
                                        transition={{delay: 0.6 + i * 0.1, type: "spring", bounce: 0.6}}
                                        className="bg-accent text-foreground px-4 py-2 border-2 border-foreground rounded-lg font-black text-xl"
                                        style={{transform: `rotate(${(i - 1) * 8}deg)`}}
                                    >
                                        {emoji}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Show Badges Button - positioned below decorations */}
                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.8, duration: 0.5}}
                                className="mt-6 flex justify-center relative z-10"
                            >
                                <button
                                    onClick={() => setShowBadgeList(!showBadgeList)}
                                    className="bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-110 transition-transform border-2 border-foreground"
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
                            </motion.div>
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
                        <div className="absolute inset-0 bg-background overflow-y-auto z-50">
                            {/* Header with button */}
                            <div className="sticky top-0 bg-background border-b-4 border-foreground z-30 p-6 flex items-center justify-between shadow-lg">
                                <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                                    <Gift className="w-8 h-8 text-primary"/>
                                    Your Christmas Badges
                                </h2>
                                <button
                                    onClick={() => setShowBadgeList(!showBadgeList)}
                                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-110 transition-transform border-2 border-foreground"
                                >
                                    <motion.div
                                        animate={{rotate: showBadgeList ? 180 : 0}}
                                        transition={{duration: 0.5}}
                                    >
                                        <RefreshCcw className="w-6 h-6"/>
                                    </motion.div>
                                    <span className="font-bold uppercase text-sm">
                                        Hide Badges
                                    </span>
                                </button>
                            </div>

                            {/* Badge Grid */}
                            <div className="p-8">
                                {previousBadges.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Gift className="w-16 h-16 text-primary mx-auto mb-4 opacity-50"/>
                                        <p className="text-xl font-bold text-muted-foreground">
                                            No badges generated yet
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Create your first Christmas badge!
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                        {previousBadges.map(badge => (
                                            <motion.li
                                                key={badge.id}
                                                initial={{opacity: 0, scale: 0.9}}
                                                animate={{opacity: 1, scale: 1}}
                                                className="bg-card border-4 border-foreground rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                                            >
                                                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-muted">
                                                    <img
                                                        src={badge.imageUrl}
                                                        alt={badge.name}
                                                        className="w-full h-full object-contain rounded-xl"
                                                    />
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className="font-bold text-lg text-foreground">{badge.name}</p>
                                                    <p className="text-sm text-muted-foreground capitalize mt-1">
                                                        {badge.category}
                                                    </p>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}
                            </div>
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
