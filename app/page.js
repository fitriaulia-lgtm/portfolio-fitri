'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import FlowerHero from '@/components/FlowerHero';
import PortfolioContent from '@/components/PortfolioContent';
import MusicPlayer from '@/components/MusicPlayer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Lokasi foto kamu di folder public/images/fitri-photo.jpg
  const HERO_PHOTO_URL = "/images/fitri-photo.png";
  const CARD_PHOTO_URL = "/images/aul-jpg.png";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="bg-[#0a0a0c] text-stone-100 min-h-screen selection:bg-[#b37283] selection:text-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : (
          <div key="main-content">
            <nav className="fixed top-0 left-0 w-full z-40 px-4 py-4 sm:px-6 sm:py-6 flex justify-between items-center pointer-events-none">
              <span />
              <button className="pointer-events-auto text-xs font-mono tracking-widest text-stone-200 border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-all">
                MENU +
              </button>
            </nav>

            {/* Scene 1: Hero Bunga & Foto Cinematic */}
            <FlowerHero mousePos={mousePos} photoUrl={HERO_PHOTO_URL} />

            {/* Scene 2: Konten portfolio dan About dengan ID card */}
            <PortfolioContent photoUrl={CARD_PHOTO_URL} />

            <MusicPlayer />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}