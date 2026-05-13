import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

export const SectionRSVP = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [attendance, setAttendance] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [wishes, setWishes] = useState([]);
    const [toast, setToast] = useState("");
    const wishesRef = useRef(null);
    const rafRef = useRef(null);
    const isPausedRef = useRef(false);
    const resumeTimerRef = useRef(null);

    useEffect(() => { fetchWishes(); }, []);

    // Auto-scroll engine — jalan setelah wishes ada
    useEffect(() => {
        if (wishes.length === 0) return;

        const el = wishesRef.current;
        if (!el) return;

        // Tunggu render selesai lalu mulai
        const init = setTimeout(() => {
            el.scrollTop = 0;
            startScroll();
        }, 600);

        return () => {
            clearTimeout(init);
            cancelAnimationFrame(rafRef.current);
        };
    }, [wishes]);

    const startScroll = () => {
        cancelAnimationFrame(rafRef.current);

        const tick = () => {
            const el = wishesRef.current;
            if (!el) return;

            if (!isPausedRef.current) {
                el.scrollTop += 0.7;

                // Reset seamless — saat sudah di tengah (duplikat mulai)
                if (el.scrollTop >= el.scrollHeight / 2) {
                    el.scrollTop = 0;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
    };

    // Pause saat user touch/scroll, resume 2.5 detik setelah berhenti
    const pauseScroll = useCallback(() => {
        isPausedRef.current = true;
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
            isPausedRef.current = false;
        }, 2500);
    }, []);

    const fetchWishes = async () => {
        const { data, error } = await supabase
            .from("doa")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error && data) setWishes(data);
    };

    const openSheet = () => {
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeSheet = () => {
        setIsOpen(false);
        document.body.style.overflow = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!name.trim() || !attendance.trim() || !message.trim()) return;

        setLoading(true);
        const { error } = await supabase
            .from("doa")
            .insert([{ name, message, attendance }]);
        setLoading(false);

        if (!error) {
            setToast("Ucapan berhasil dikirim");

            setName("");
            setMessage("");
            setAttendance("");
            closeSheet();

            fetchWishes();

            setTimeout(() => setToast(""), 2500);
        } else {
            setToast("Gagal mengirim, coba lagi");

            setTimeout(() => setToast(""), 2500);
        }
    };

    const displayWishes = [...wishes, ...wishes];

    return (
        <>
            <section id="rsvp" className="section-rsvp">
                <div className="container">
                    <motion.h2
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} className="section-title"
                    >
                        RSVP & WISHES
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="rsvp-subtitle"
                    >
                        Konfirmasi kehadiran dan tinggalkan ucapan untuk kami.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="open-rsvp-btn" onClick={openSheet}
                    >
                        ISI RSVP
                    </motion.button>

                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}
                        className="rsvp-subtitle" style={{ marginTop: "2em" }}
                    >
                        Terima kasih telah memberikan ucapan selamat, saran pernikahan terbaik,
                        hal-hal lucu, atau apa pun itu—semuanya istimewa bagi kami!
                    </motion.p>

                    {wishes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}
                            className="wishes-container"
                        >
                            <div className="wishes-fade-top" />

                            <div
                                className="wishes-scroll"
                                ref={wishesRef}
                                onScroll={pauseScroll}
                                onTouchStart={pauseScroll}
                                onMouseEnter={pauseScroll}
                                onMouseLeave={() => { isPausedRef.current = false; }}
                            >
                                <div className="wishes-track">
                                    {displayWishes.map((wish, index) => (
                                        <div key={`${wish.id}-${index}`} className="wish-card glass">
                                            <div className="wish-header">
                                                <div className="wish-avatar">
                                                    {wish.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="wish-meta">
                                                    <div className="wish-name-row">
                                                        <p className="wish-name">{wish.name}</p>
                                                        {wish.attendance === "Hadir" && (
                                                            <span className="attendance-badge">
                                                                ✓
                                                            </span>
                                                        )}
                                                        {wish.attendance === "Tidak Hadir" && (
                                                            <span className="attendance-badge not-attending">
                                                                ✕
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="wish-message">"{wish.message}"</p>
                                                    <p className="wish-time">
                                                        {new Date(wish.created_at).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="wishes-fade-bottom" />
                        </motion.div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="rsvp-sheet-overlay"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeSheet}
                        />
                        <motion.div
                            className="rsvp-sheet"
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        >
                            <div className="sheet-handle" />
                            <h3 className="sheet-title">RSVP & WISHES</h3>

                            <form autoComplete="off" onSubmit={handleSubmit} className="rsvp-form">
                                <input type="text" placeholder="Nama" value={name}
                                    onChange={(e) => setName(e.target.value)} required />
                                <textarea placeholder="Ucapan" rows="3" value={message}
                                    onChange={(e) => setMessage(e.target.value)} />
                                <select
                                    value={attendance}
                                    onChange={(e) => setAttendance(e.target.value)}
                                    required
                                >
                                    <option value="">Konfirmasi Kehadiran</option>
                                    <option value="Hadir">Hadir</option>
                                    <option value="Tidak Hadir">Tidak Hadir</option>
                                </select>
                                <button type="submit" className="submit-button"
                                    disabled={loading || !name.trim() || !attendance.trim() || !message.trim()}>
                                    {loading ? "Mengirim..." : "KIRIM"}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="toast-notification"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};