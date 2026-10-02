'use client';
import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer({ src = '/music.mp3' }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Tidak ada autoplay: audio hanya dib.play() saat tombol ditekan.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleReady = () => setIsReady(true);
    const handleError = () => setIsReady(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    audio.addEventListener('canplay', handleReady);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      audio.removeEventListener('canplay', handleReady);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // Browser memblokir autoplay sebelum ada interaksi user;
        // di sini interaksi sudah terjadi, jadi biasanya tidak terjadi.
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" loop />

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
        title={isPlaying ? 'Jeda' : 'Putar'}
        className="music-player fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#d194a2]/30 bg-[#121115]/80 text-lg backdrop-blur-sm transition-all duration-300 hover:border-[#d194a2]/70 hover:bg-[#d194a2]/10 active:scale-95"
      >
        <span aria-hidden="true" className={isPlaying ? '' : 'opacity-60'}>
          {isPlaying ? '⏸' : '🎵'}
        </span>

        {isPlaying ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-[#d194a2]/40"
          />
        ) : null}
      </button>

      {!isReady ? (
        <span className="sr-only">File musik belum tersedia di /music.mp3</span>
      ) : null}
    </>
  );
}
