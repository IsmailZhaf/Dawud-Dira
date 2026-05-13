import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, delay } from 'framer-motion';
import { Calendar, MapPin, Gift, MessageCircle, Music, Pause, Play, ChevronDown, AlignRight, X, Heart, MessageSquare, Home, ArrowRight } from 'lucide-react';
import './App.css';
import { SectionRSVP } from "./components/SectionRSVP"

const App = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Ismail dan Partner');
  const [showMain, setShowMain] = useState(false);
  const audioRef = React.useRef(null);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleOpen = () => {
    // Preload gambar segera
    ['/AXA02547.webp', '/AXA02556.webp', '/AXA02594.webp', '/AXA02740.webp'].forEach(src => {
      const img = new Image(); img.src = src;
    });

    setIsOpened(true);

    setShowMain(true);

    setTimeout(() => setIsPlaying(true), 1800);
  };
  const toggleMusic = () => setIsPlaying(prev => !prev);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/Terbuang Dalam Waktu - Barasuara (Peaceful Piano).mp3"
        loop
      />

      <AnimatePresence>
        {!isOpened && (
          <motion.section
            className="cover-section"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <div className="background-overlay" />
            <div className="cover-content">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                  className="cover-date-top"
                >
                  <div className="date-day-month">06 / 06</div>
                  <div className="date-year">2026</div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 2 }}
                  className="wedding-of"
                >
                  THE WEDDING OF
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 2.25 }}
                  className="couple-names"
                >
                  Dawud & Dira
                </motion.h1>
              </div>

              <div className="bottom-section">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 2.75 }}
                  className="guest-info"
                >
                  <p className="to-label">KEPADA</p>

                  <h2 className="guest-name">{guestName}</h2>

                  <p className="invite-text">
                    Dengan segala hormat, kami mengundang Anda untuk menghadiri acara
                    pernikahan kami.
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpen}
                  id="tombol-buka"
                  className="open-button"
                >
                  BUKA UNDANGAN
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {showMain && (
        <div className="desktop-split-layout">
          {/* Panel Kiri — Banner */}
          <div className="desktop-left-banner">
            <div className="banner-bg" />
            <div className="banner-overlay" />
            <div className="banner-top-bar">
              <span className="banner-monogram">D &amp; D</span>
              <span className="banner-top-date">2026</span>
            </div>
            <div className="banner-inner">
              <p className="banner-wedding-of">The Wedding of</p>
              <div className="banner-thin-line" />
              <h1 className="banner-names">
                Dawud<br />
                <span className="banner-ampersand">&amp;</span> Dira
              </h1>
              <div className="banner-divider-row">
                <div className="banner-divider-line" />
                <span className="banner-divider-ornament">✦</span>
                <div className="banner-divider-line" />
              </div>
              <p className="banner-verse">
                "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya."
              </p>
              <p className="banner-verse-source">— QS. Ar-Rum : 21</p>
            </div>
          </div>

          {/* Panel Kanan — Konten Mobile */}
          <div className="desktop-right-panel">
            <BackgroundSlideshow contained={true} />
            <div className="mobile-phone-frame">
              <div className="mobile-phone-screen">
                <div className="main-wrapper">
                  <Navigation />
                  <main className="main-content">
                    <SectionHome />
                    <SectionGroom />
                    <SectionBride />
                    <SectionStory />
                    <SectionEvent />
                    <SectionGallery />
                    <SectionRSVP />
                    <SectionGift />
                    <SectionFooter />
                  </main>
                  <div className="floating-controls">
                    <button className="control-btn music-toggle" onClick={toggleMusic}>
                      {isPlaying ? <Music size={20} className="animate-spin" /> : <Music size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const BackgroundSlideshow = ({ contained = false }) => {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const images = ['/AXA02547.webp', '/AXA02556.webp', '/AXA02594.webp', '/AXA02740.webp'];

  useEffect(() => {
    let count = 0;
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      const done = () => { if (++count === images.length) setLoaded(true); };
      img.onload = done; img.onerror = done;
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setInterval(() => setIndex(p => (p + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, [loaded]);

  return (
    <motion.div
      className={contained ? 'main-background-slideshow contained' : 'main-background-slideshow'}
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 1.5 }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="slideshow-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          style={{ backgroundImage: `url(${images[index]})` }}
        >
          <div className="slideshow-overlay" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'couple', label: 'Bride and Groom' },
    { id: 'event', label: 'Wedding Event' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'rsvp', label: 'RSVP' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav>
      <motion.button
        layoutId="nav-ui"
        className="hamburger-btn"
        onClick={() => setIsOpen(true)}
      >
        <AlignRight size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId="nav-ui"
              className="menu-card"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button className="close-pill-btn" onClick={() => setIsOpen(false)}>
                CLOSE
              </button>

              <motion.div
                className="menu-links"
                initial="hidden"
                animate="show"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.4
                    }
                  }
                }}
              >
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="menu-link"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { type: 'spring', stiffness: 100, damping: 15 }
                      },
                      hover: { x: 10 }
                    }}
                    initial="hidden"
                    animate="show"
                    whileHover="hover"
                  >
                    <motion.span
                      className="hover-arrow"
                      variants={{
                        hover: { opacity: 1, x: 0 }
                      }}
                      style={{ opacity: 0, x: -10 }} // Explicitly hidden by default
                    >
                      <ArrowRight size={24} strokeWidth={1.5} />
                    </motion.span>
                    <span className="link-text">{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHome = () => (
  <section id="home" className="section-home">
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 1 }}
        className="home-content"
      >
        <div className="date-top"><span>06 / 06</span> <span>2026</span></div>

        <p className="label-wedding">THE WEDDING OF</p>

        <h2 className="main-names">Dawud & <br /> Dira</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 1.5 }}
        className="quote-container"
      >
        <p className="quote">
          “And of His signs is that He created for you from yourselves mates
          that you may find tranquillity in them, and He placed between you
          affection and mercy. Indeed in that are signs for a people who give
          thought.”
        </p>

        <p className="quote-source">Q.S Ar-Rum Ayat 21</p>
      </motion.div>
    </div>
  </section>
);

const SectionGroom = () => (
  <section id="couple" className="section-groom">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="groom"
      >
        <p className="label">THE GROOM</p>
        <h2 className="name">Dawud</h2>
        <div className="divider" />
        <p className="parent-label">Putra Pertama Dari</p>
        <p className="parents-groom">Bapak H. Suyanto & Ibu Tukiningsih</p>
        <a href="https://instagram.com/dawud_al" target="_blank" className="insta-btn">@dawud_al</a>
      </motion.div>
    </div>
  </section>
);

const SectionBride = () => (
  <section className="section-bride">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="bride"
      >
        <p className="label">THE BRIDE</p>
        <h2 className="name">Dira</h2>
        <div className="divider" />
        <p className="parent-label">Putri Kedua Dari</p>
        <p className="parents-bride">Bapak  & Ibu </p>
        <a href="https://instagram.com/dirafdhla" target="_blank" className="insta-btn">@dirafdhla</a>
      </motion.div>
    </div>
  </section>
);

const SectionStory = () => {
  const stories = [
    {
      chapter: 'CHAPTER ONE',
      title: 'Awal Bertemu',
      text: 'Pada tahun 2020, di tengah hiruk-pikuk dunia kepengurusan himpunan arsitektur, kami mulai saling mengenal, seperti dua garis yang bersinggungan tanpa sengaja. Saat itu, kami dalam rutinitas, sibuk dengan divisi kami masing-masing. Namun, di sela-sela waktu yang terbatas, kami mulai berbicara, berdiskusi, dan menemukan kenyamanan dalam setiap kata yang terucap.'
    },
    {
      chapter: 'CHAPTER TWO',
      title: 'Menjalin Hubungan',
      text: 'Waktu pun berlalu, dan hubungan kami berkembang, dari sekadar teman menjadi sebuah ikatan cinta yang tak terucapkan. Bersama, kami melalui suka dan duka, menjalani setiap liku dengan tangan yang saling menggenggam, memperkuat ikatan yang kami bangun. Sejak tahun 2021, Dawud semakin dekat dengan keluarga Dira.'
    },
    {
      chapter: 'CHAPTER THREE',
      title: 'Lamaran',
      text: 'Pada Desember 2024, di tengah perjalanan cinta kami, Dawud melamar Dira, mengukir janji yang lebih dari sekadar kata. Kini, di tahun 2025, dengan segala usaha dan pengorbanan yang telah kami jalani bersama, kami siap melangkah ke pelaminan. Kami akan merayakan cinta yang telah tumbuh lama.'
    },
  ];

  return (
    <section id="story" className="section-story">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="section-title"
        >
          JOURNEY OF LOVE
        </motion.h2>
        <div className="timeline">
          {stories.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="chapter-label">{item.chapter}</div>
              <h3 className="story-title">{item.title}</h3>
              <p className="story-text">{item.text}</p>
              <div className="story-divider" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-wrapper">
      <div className="countdown-item"><span>{timeLeft.days}</span><p>Hari</p></div>
      <div className="countdown-item"><span>{timeLeft.hours}</span><p>Jam</p></div>
      <div className="countdown-item"><span>{timeLeft.minutes}</span><p>Menit</p></div>
      <div className="countdown-item"><span>{timeLeft.seconds}</span><p>Detik</p></div>
    </div>
  );
};

const SectionEvent = () => (
  <section id="event" className="section-event">
    <div className="container">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="section-title"
      >
        SAVE THE DATE
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <Countdown targetDate={new Date('2026-06-06T09:00:00').getTime()} />
      </motion.div>

      <div className="event-cards">
        <motion.div
          className="event-card glass"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="save-our-date">SAVE OUR DATE</p>
          <h3>AKAD NIKAH</h3>
          <div className="event-info">
            <p className="date">Sabtu, 06 Juni 2026</p>
            <p className="time">09.00 - 11.00 WIB</p>
            <p className="venue">Gedung Serbaguna Peruri</p>
            <p className="address">Jl. H.Mencong No.24, RT.003/RW.013, Sudimara Tim., Kec. Ciledug, Kota Tangerang, Banten 15151</p>
          </div>
          <a
            className="map-button"
            href="https://maps.app.goo.gl/8jXfV3wstQ8Xi2e89"
            target="_blank"
            rel="noopener noreferrer"
          >
            GOOGLE MAPS
          </a>
        </motion.div>

        <motion.div
          className="event-card glass"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="save-our-date">SAVE OUR DATE</p>
          <h3>RESEPSI</h3>
          <div className="event-info">
            <p className="date">Sabtu, 06 Juni 2026</p>
            <p className="time">12.00 - 15.00 WIB</p>
            <p className="venue">Gedung Serbaguna Peruri</p>
            <p className="address">Jl. H.Mencong No.24, RT.003/RW.013, Sudimara Tim., Kec. Ciledug, Kota Tangerang, Banten 15151</p>
          </div>
          <a
            className="map-button"
            href="https://maps.app.goo.gl/8jXfV3wstQ8Xi2e89"
            target="_blank"
            rel="noopener noreferrer"
          >
            GOOGLE MAPS
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

const SectionGallery = () => {
  const images = [
    '/AXA02556.webp', '/AXA02547.webp', '/AXA02740.webp', '/AXA02542.webp',
    '/AXA02535.webp', '/AXA02594.webp', '/AXA02631.webp', '/AXA02997.webp',
    '/AXA02524.webp',
  ];

  return (
    <section id="gallery" className="section-gallery">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-title"
        >
          OUR MOMENT
        </motion.h2>
        <div className="gallery-layout">
          {images.reduce((rows, _, index) => {
            if (index % 3 === 0) {
              rows.push(images.slice(index, index + 3));
            }
            return rows;
          }, []).map((group, rowIndex) => (
            <div
              key={rowIndex}
              className={`gallery-row ${rowIndex % 2 === 0 ? 'normal' : 'reverse'}`}
            >
              <div className="big-image">
                <img src={group[0]} alt="" />
              </div>
              <div className="stack-column">
                <div className="small-image">
                  <img src={group[1]} alt="" />
                </div>

                <div className="small-image">
                  <img src={group[2]} alt="" />
                </div>
              </div>
            </div>
          ))}
          <img src="/AXA02520.webp" alt='' />
        </div>
      </div>
    </section>
  );
};

const SectionGift = () => {
  const accounts = [
    {
      bank: "BCA",
      number: "4741128033",
      name: "Dira",
    },
    {
      bank: "MANDIRI",
      number: "1760003014220",
      name: "Dawud",
    },
  ];
  const [copied, setCopied] = useState("");

  const handleCopy = (text, bank) => {
    navigator.clipboard.writeText(text);
    setCopied(bank);

    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <section id="gift" className="section-gift">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-title"
        >
          WEDDING GIFT
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="rsvp-subtitle" style={{ marginTop: "2em" }}
        >
          Cinta, tawa, dan kebersamaan kalian di hari pernikahan kami adalah hadiah terindah. Namun, jika kamu ingin memberikan hadiah, segala bentuk hadiah untuk kehidupan baru kami akan sangat berarti.
        </motion.p>

        <div className="gift-cards">
          {accounts.map((acc) => (
            <motion.div
              key={acc.bank}
              className="gift-card glass"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p className="bank">{acc.bank}</p>
              <p className="account-number">{acc.number}</p>
              <p className="account-name">{acc.name}</p>

              <button
                className="copy-button"
                onClick={() => handleCopy(acc.number, acc.bank)}
              >
                {copied === acc.bank ? "TERSALIN ✓" : "SALIN"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


// const SectionSouvenir = () => (
//   <section id="souvenir" className="section-souvenir">
//     <div className="container">
//       <motion.h2
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         className="section-title"
//       >
//         SOUVENIR CARD
//       </motion.h2>
//       <motion.div
//         className="souvenir-card glass"
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         style={{ padding: '40px', textAlign: 'center', borderRadius: '20px' }}
//       >
//         <p style={{ opacity: 0.8, lineHeight: '1.8' }}>
//           Terima kasih telah memberikan tanda kasih Anda. <br />
//           Anda dapat menukarkan tanda kasih ini dengan souvenir di lokasi acara.
//         </p>
//       </motion.div>
//     </div>
//   </section>
// );

const SectionFooter = () => (
  <section className="section-footer">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="footer-content"
      >
        <p className="final-label">TERIMA KASIH</p>
        <h2 className="signature">Dawud & Dira</h2>
        <div className="credit">Created by Ismail Zhanfeari</div>
      </motion.div>
    </div>
  </section>
);

export default App;
