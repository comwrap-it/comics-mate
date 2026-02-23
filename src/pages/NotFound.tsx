import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {Shield} from "lucide-react";
import {motion} from "framer-motion";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <motion.div
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className="text-center"
            >
                <motion.div
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    className="mb-6 inline-block"
                >
                    <Shield className="w-20 h-20 text-primary mx-auto" />
                </motion.div>
                <h1 className="mb-4 text-6xl font-black text-primary">404</h1>
                <p className="mb-4 text-2xl font-bold text-foreground">Oops! Pagina non trovata</p>
                <p className="mb-6 text-lg text-muted-foreground">Questa pagina non esiste.</p>
                <a 
                    href="/" 
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold border-2 border-foreground hover:scale-105 transition-transform shadow-lg"
                >
                    Torna alla home
                </a>
            </motion.div>
        </div>
    );
};

export default NotFound;
