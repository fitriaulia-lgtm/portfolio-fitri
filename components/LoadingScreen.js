'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c] bg-grain text-white select-none overflow-hidden"
    >
      {/* Bentuk bunga buram yang perlahan muncul secara samar saat loading */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(209,148,162,${progress * 0.003}) 0%, rgba(138,121,150,${progress * 0.002}) 50%, transparent 70%)`,
          transform: `scale(${0.6 + progress * 0.005})`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <span className="text-xs uppercase tracking-[0.4em] text-stone-400 font-light mb-8">
          Portfolio Experience
        </span>
        
        <h2 className="font-serif italic text-3xl md:text-5xl text-[#f2c9d2] mb-12 tracking-wide">
          Fitri Aulia Insani
        </h2>

        {/* Progress Bar Minimalis */}
        <div className="w-64 md:w-80 h-[2px] bg-stone-800 relative overflow-hidden mb-4 rounded-full">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#b37283] via-[#d194a2] to-[#f2c9d2]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between w-64 md:w-80 text-[10px] tracking-widest text-stone-500 font-mono">
          <span>LOADING PORTFOLIO</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}