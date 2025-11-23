import {useState, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Gift, Star, Snowflake, X, AlertTriangle} from "lucide-react";

interface GameItem {
    id: number;
    x: number;
    type: "gift" | "star" | "snowflake" | "coal" | "grinch";
    points: number;
    createdAt: number;
}

const ITEM_TYPES = [
    {type: "gift" as const, icon: Gift, points: 10, color: "text-primary", emoji: "🎁"},
    {type: "star" as const, icon: Star, points: 5, color: "text-accent", emoji: "⭐"},
    {type: "snowflake" as const, icon: Snowflake, points: 3, color: "text-secondary", emoji: "❄️"},
    {type: "coal" as const, icon: X, points: -15, color: "text-foreground", emoji: "🪨"},
    {type: "grinch" as const, icon: AlertTriangle, points: -25, color: "text-destructive", emoji: "👹"},
];

const FALL_DURATION = 2500; // 2.5 seconds to fall (faster!)

export const ChristmasGame = () => {
    const [score, setScore] = useState(0);
    const [items, setItems] = useState<GameItem[]>([]);
    const [nextId, setNextId] = useState(0);

    // Spawn new items - faster spawn rate
    useEffect(() => {
        const spawnInterval = setInterval(() => {
            // 60% chance of good items, 40% chance of bad items
            const isBad = Math.random() < 0.4;
            const goodItems = ITEM_TYPES.filter(t => t.points > 0);
            const badItems = ITEM_TYPES.filter(t => t.points < 0);
            const itemPool = isBad && badItems.length > 0 ? badItems : goodItems;
            const itemType = itemPool[Math.floor(Math.random() * itemPool.length)];
            
            const newItem: GameItem = {
                id: nextId,
                x: Math.random() * 80 + 10, // 10% to 90% of width
                type: itemType.type,
                points: itemType.points,
                createdAt: Date.now(),
            };
            setItems(prev => [...prev, newItem]);
            setNextId(prev => prev + 1);
        }, 600); // Spawn every 0.6 seconds (faster!)

        return () => clearInterval(spawnInterval);
    }, [nextId]);

    // Remove items that have fallen and apply penalty for bonus items
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            const now = Date.now();
            setItems(prev => {
                const itemsToRemove: GameItem[] = [];
                const remainingItems = prev.filter(item => {
                    const age = now - item.createdAt;
                    if (age >= FALL_DURATION) {
                        // Item reached the ground
                        itemsToRemove.push(item);
                        return false; // Remove from items
                    }
                    return true;
                });

                // Apply penalty for bonus items that reached the ground
                itemsToRemove.forEach(item => {
                    if (item.points > 0) {
                        // Bonus item reached ground - lose points
                        setScore(currentScore => Math.max(0, currentScore - item.points));
                    }
                });

                return remainingItems;
            });
        }, 100); // Check more frequently

        return () => clearInterval(cleanupInterval);
    }, []);

    const handleItemClick = useCallback((item: GameItem) => {
        setScore(prev => Math.max(0, prev + item.points)); // Prevent negative score
        setItems(prev => prev.filter(i => i.id !== item.id));
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            {/* Score */}
            <div className="mb-6 text-center">
                <motion.div
                    key={score}
                    initial={{scale: 1.5}}
                    animate={{scale: 1}}
                    className="text-4xl font-black mb-2"
                    style={{
                        color: score < 0 ? "#ef4444" : score === 0 ? "#000000" : "#16a34a"
                    }}
                >
                    🎄 {Math.max(0, score)} 🎄
                </motion.div>
                <p className="text-lg font-bold text-foreground">
                    Catch the gifts! Avoid coal and Grinch! ⚠️
                </p>
            </div>

            {/* Game Area */}
            <div className="relative w-full max-w-2xl h-96 bg-background/50 border-4 border-foreground rounded-2xl overflow-hidden">
                <AnimatePresence>
                    {items.map(item => {
                        const itemType = ITEM_TYPES.find(t => t.type === item.type)!;
                        const ItemIcon = itemType.icon;
                        const itemColor = itemType.color;
                        const isBad = item.points < 0;
                        
                        return (
                            <motion.button
                                key={item.id}
                                initial={{opacity: 0, scale: 0, y: -60}}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 336, // h-96 (384px) - icon height (48px) = 336px
                                }}
                                exit={{opacity: 0, scale: 0}}
                                transition={{
                                    y: {
                                        duration: FALL_DURATION / 1000,
                                        ease: "linear",
                                    },
                                    opacity: {duration: 0.3},
                                    scale: {duration: 0.3},
                                }}
                                whileHover={{scale: 1.3, zIndex: 10}}
                                whileTap={{scale: 0.8}}
                                onClick={() => handleItemClick(item)}
                                className={`absolute left-0 top-0 -translate-x-1/2 ${itemColor} cursor-pointer hover:drop-shadow-lg z-10 ${
                                    isBad ? "animate-pulse" : ""
                                }`}
                                style={{
                                    left: `${item.x}%`,
                                }}
                            >
                                <div className="relative">
                                    <ItemIcon className="w-12 h-12" fill={isBad ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isBad ? 3 : 2} />
                                    {isBad && (
                                        <motion.div
                                            animate={{rotate: [0, -10, 10, -10, 0]}}
                                            transition={{duration: 0.5, repeat: Infinity}}
                                            className="absolute -top-2 -right-2 text-destructive text-lg font-black"
                                        >
                                            ⚠️
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>

                {/* Ground line */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-destructive/50 z-20" />
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    💡 Click on gifts, stars and snowflakes before they fall!
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p className="font-semibold text-success">✅ Bonus: Gifts +10 | Stars +5 | Snowflakes +3</p>
                    <p className="font-semibold text-destructive">❌ Malus: Coal -15 | Grinch -25</p>
                </div>
            </div>
        </div>
    );
};

