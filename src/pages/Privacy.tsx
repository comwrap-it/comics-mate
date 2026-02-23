import {Link} from "react-router-dom";
import {Shield, ArrowLeft} from "lucide-react";
import {motion} from "framer-motion";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-6 py-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-8"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    Torna al form
                </Link>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4}}
                    className="bg-card border-4 border-foreground rounded-2xl p-8 shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="w-10 h-10 text-primary flex-shrink-0"/>
                        <h1 className="text-3xl font-black text-foreground uppercase">
                            Informativa privacy
                        </h1>
                    </div>

                    <div className="prose prose-lg max-w-none space-y-6 text-foreground">
                        <p className="text-sm text-muted-foreground">
                            In conformità con il Regolamento (UE) 2016/679 (GDPR) e la normativa italiana in materia di protezione dei dati personali.
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">1. Titolare del trattamento</h2>
                            <p className="text-muted-foreground">
                                Il titolare del trattamento è [Ragione sociale / Nome]. Per esercitare i tuoi diritti o per revocare il consenso puoi contattarci a: [indirizzo email o indirizzo postale].
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">2. Finalità e base giuridica</h2>
                            <p className="text-muted-foreground">
                                I dati raccolti (nome, email, azienda, immagine) sono trattati per:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
                                <li><strong>Erogazione del servizio</strong> (generazione badge e invio video personalizzato), in base al consenso (art. 6.1.a GDPR) e, ove applicabile, all'esecuzione di un contratto.</li>
                                <li><strong>Profilazione e marketing</strong> (solo se hai espresso consenso): analisi automatizzate delle preferenze e degli interessi per inviarti comunicazioni di marketing mirate (art. 6.1.a GDPR). Puoi revocare questo consenso in qualsiasi momento senza che la partecipazione all'evento ne risenta.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">3. Profilazione</h2>
                            <p className="text-muted-foreground">
                                Con "profilazione" si intende il trattamento effettuato mediante analisi automatizzate dei tuoi dati (es. preferenze, comportamento) al fine di valutare aspetti personali e inviarti messaggi pubblicitari o promozionali mirati. Il consenso alla profilazione è <strong>facoltativo</strong> e la sua mancata accettazione non impedisce la partecipazione all'evento né la generazione del badge.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">4. Revoca del consenso</h2>
                            <p className="text-muted-foreground">
                                Puoi revocare il consenso in qualsiasi momento con la stessa facilità con cui l'hai prestato, contattando il titolare ai recapiti indicati. La revoca non pregiudica la liceità del trattamento basata sul consenso prima della revoca.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">5. Diritti dell'interessato</h2>
                            <p className="text-muted-foreground">
                                Hai diritto ad accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione, nonché a proporre reclamo all'Autorità Garante per la protezione dei dati personali (garanteprivacy.it).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">6. Conservazione</h2>
                            <p className="text-muted-foreground">
                                I dati saranno conservati per il tempo necessario all'erogazione del servizio e all'evento, salvo obblighi di legge. I dati trattati per profilazione saranno conservati fino alla revoca del consenso o ai limiti previsti dalla policy interna.
                            </p>
                        </section>
                    </div>

                    <div className="mt-10 pt-6 border-t-2 border-foreground">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold border-2 border-foreground hover:scale-105 transition-transform"
                        >
                            <ArrowLeft className="w-5 h-5"/>
                            Torna al form
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;
