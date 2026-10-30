'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BloomingRoseBranch from '@/components/BloomingRoseBranch';

export default function FlowerHero({ mousePos, photoUrl }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 180], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 220], [1, 0.94]);
  const hasScrolledAway = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Halaman awal masuk perlahan, dan transisi yang sama diputar ulang
  // setiap kali user swipe up kembali ke sini dari About Me.
  useEffect(() => {
    const reveal = () => {
      setIsRevealed(false);
      window.requestAnimationFrame(() => setIsRevealed(true));
    };

    reveal();
    return scrollY.on('change', (value) => {
      if (value > 24) {
        hasScrolledAway.current = true;
        return;
      }
      if (hasScrolledAway.current) {
        hasScrolledAway.current = false;
        reveal();
      }
    });
  }, [scrollY]);

  const photoParallaxX = mousePos.x * 9;
  const photoParallaxY = mousePos.y * 9;
  const textParallaxX = mousePos.x * 4;

  return (
    <motion.section
      style={{ y: heroY }}
      className="relative w-full h-screen snap-start snap-always overflow-hidden flex items-center justify-center bg-[#0a0a0c] bg-grain"
    >
      {/* LATAR HITAM PEKAT + CAHAYA SINEMATIK SESUAI TEMA ROSE */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 48% 44% at 44% 42%, rgba(209,148,162,0.18) 0%, rgba(20,10,17,0.45) 48%, rgba(6,6,8,0) 78%), linear-gradient(180deg, #06060a 0%, #0a0a0c 52%, #050507 100%)',
        }}
      />

      <motion.div
        initial={false}
        animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 1.04 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-[6]"
      >
        <motion.div
          style={{ opacity: contentOpacity, scale: contentScale }}
          className="absolute inset-0"
        >
        <BloomingRoseBranch />

        {/* Partikel debu halus */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.2, 0.1, 0],
                scale: [0, 1, 1.6, 0],
                y: [0, -110, -220, -320],
                x: [0, (i % 2 === 0 ? 1 : -1) * 34, (i % 2 === 0 ? 1 : -1) * 66, (i % 2 === 0 ? 1 : -1) * 96],
              }}
              transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeOut', delay: i * 0.6 }}
              className="absolute"
              style={{
                left: `${12 + i * 12}%`,
                top: `${62 + i * 4}%`,
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fff0f4 0%, #f5c4d1 50%, transparent 70%)',
              }}
            />
          ))}
        </div>

        {/* 2. FOTO DI TENGAH (background sudah transparan) */}
        <motion.div
          animate={{ x: photoParallaxX, y: photoParallaxY }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="absolute inset-0 z-10 flex items-end justify-center"
        >
          <div className="relative w-[270px] sm:w-[340px] md:w-[430px] h-[450px] sm:h-[560px] md:h-[680px]">
            <div
              className="absolute inset-x-2 bottom-6 top-16 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle at 50% 55%, rgba(244,180,205,0.3), transparent 68%)' }}
            />
            <img
              src={photoUrl}
              alt="Fitri Aulia Insani"
              className="relative w-full h-full object-contain object-bottom drop-shadow-[0_30px_70px_rgba(0,0,0,0.9)]"
            />
          </div>
        </motion.div>

        {/* 3. TYPOGRAPHY EDITORIAL — KIRI & KANAN */}
        <motion.div
          animate={{ x: textParallaxX }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          {/* KIRI — nama, diletakkan di atas area bunga */}
          <div className="absolute left-[6%] sm:left-[10%] md:left-[20%] top-[9%] text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-stone-50 uppercase leading-[0.85]">
              FITRI AULIA
            </h2>
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-stone-100/90 leading-none mt-1">
              INSANI
            </p>
          </div>

          {/* KANAN */}
          <div className="absolute right-[6%] sm:right-[10%] md:right-[20%] top-[58%] text-right">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-stone-50 uppercase leading-[0.85]">
              WEB
            </h2>
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-stone-100/90 leading-none mt-1">
              DEVELOPER
            </p>
          </div>
        </motion.div>

        {/* TAGLINE + INDIKATOR SWIPE */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-stone-500 font-light text-center px-4 sm:px-6">
            Turning ideas into real solutions
          </p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-light">Swipe Up</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-4 h-7 border border-stone-600 rounded-full flex justify-center pt-1"
            >
              <div className="w-1 h-1.5 bg-[#f2c9d2] rounded-full" />
            </motion.div>
          </div>
        </div>
        </motion.div>
      </motion.div>

      {/* VIGNETTE + GRAIN */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 46% 44%, transparent 36%, rgba(4,4,5,0.5) 76%, rgba(2,2,3,0.9) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-30 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </motion.section>
  );
}
