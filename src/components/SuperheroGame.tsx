import {useState, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Shield, Zap, Star, Skull, AlertTriangle} from "lucide-react";

interface GameItem {
    id: number;
    x: number;
    type: "shield" | "lightning" | "star" | "kryptonite" | "villain";
    points: number;
    createdAt: number;
}

const ITEM_TYPES = [
    {type: "shield" as const, icon: Shield, points: 10, color: "text-primary", emoji: "🛡️"},
    {type: "lightning" as const, icon: Zap, points: 5, color: "text-accent", emoji: "⚡"},
    {type: "star" as const, icon: Star, points: 3, color: "text-secondary", emoji: "⭐"},
    {type: "kryptonite" as const, icon: Skull, points: -15, color: "text-foreground", emoji: "💎"},
    {type: "villain" as const, icon: AlertTriangle, points: -25, color: "text-destructive", emoji: "👹"},
];

const FALL_DURATION = 2500;

export const SuperheroGame = () => {
    const [score, setScore] = useState(0);
    const [items, setItems] = useState<GameItem[]>([]);
    const [nextId, setNextId] = useState(0);

    useEffect(() => {
        const spawnInterval = setInterval(() => {
            const isBad = Math.random() < 0.4;
            const goodItems = ITEM_TYPES.filter(t => t.points > 0);
            const badItems = ITEM_TYPES.filter(t => t.points < 0);
            const itemPool = isBad && badItems.length > 0 ? badItems : goodItems;
            const itemType = itemPool[Math.floor(Math.random() * itemPool.length)];

            const newItem: GameItem = {
                id: nextId,
                x: Math.random() * 80 + 10,
                type: itemType.type,
                points: itemType.points,
                createdAt: Date.now(),
            };
            setItems(prev => [...prev, newItem]);
            setNextId(prev => prev + 1);
        }, 600);

        return () => clearInterval(spawnInterval);
    }, [nextId]);

    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            const now = Date.now();
            setItems(prev => {
                const itemsToRemove: GameItem[] = [];
                const remainingItems = prev.filter(item => {
                    const age = now - item.createdAt;
                    if (age >= FALL_DURATION) {
                        itemsToRemove.push(item);
                        return false;
                    }
                    return true;
                });

                itemsToRemove.forEach(item => {
                    if (item.points > 0) {
                        setScore(currentScore => Math.max(0, currentScore - item.points));
                    }
                });

                return remainingItems;
            });
        }, 100);

        return () => clearInterval(cleanupInterval);
    }, []);

    const handleItemClick = useCallback((item: GameItem) => {
        setScore(prev => Math.max(0, prev + item.points));
        setItems(prev => prev.filter(i => i.id !== item.id));
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
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
                    🦸 {Math.max(0, score)} 🦸
                </motion.div>
                <p className="text-lg font-bold text-foreground">
                    Cattura scudi e fulmini! Evita kryptonite e villain! ⚠️
                </p>
            </div>

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
                                    y: 336,
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

                <div className="absolute bottom-0 left-0 right-0 h-2 bg-destructive/50 z-20" />
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    💡 Clicca su scudi, fulmini e stelle prima che cadano!
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p className="font-semibold text-success">✅ Bonus: Scudo +10 | Fulmine +5 | Stella +3</p>
                    <p className="font-semibold text-destructive">❌ Malus: Kryptonite -15 | Villain -25</p>
                </div>
            </div>
        </div>
    );
};
