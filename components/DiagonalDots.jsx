'use client';
import { useEffect, useRef } from 'react';

const DUSTY_PINK = [214, 154, 168];
const WHITE = [255, 255, 255];

// Kemiringan arah aliran: kiri atas ke kanan bawah.
const SLOPE = 0.72;

// Jarak antar baris titik. Sengaja lega supaya tiap baris terbaca
// sendiri dan tidak menyatu jadi gumpalan.
const LINE_GAP = 34;

// Jarak antar titik sepanjang satu baris, juga renggang supaya polanya
// ringan dan tidak pernah terlihat padat.
const DOT_GAP = 74;

// Ukuran titik kecil, bervariasi halus antar titik.
const RADIUS_MIN = 0.7;
const RADIUS_MAX = 1.7;

// Opacity bervariasi halus, bagian tengah sedikit lebih terlihat.
const ALPHA_MIN = 0.22;
const ALPHA_MAX = 0.6;

// Lebar area gambar di luar layar agar baris tidak terpotong tepi.
const MARGIN = 160;

// Kecepatan gelombang, sangat pelan.
const WAVE_SPEED = 0.00035;
const DRIFT_AMPLITUDE = 4;

// Batas frame per detik: animasinya lambat, 40fps sudah cukup.
const FRAME_INTERVAL = 25;

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);
const mix = (a, b, t) => a + (b - a) * t;

// PRNG berbenih supaya tata letak selalu sama di setiap render.
const makeRandom = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

export default function DiagonalDots({ className = '' }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let startTime = 0;
    let isVisible = true;
    let lines = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      // Dibatasi 2 supaya tidak membebani GPU di layar retina resolusi tinggi.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      // Baris disusun dalam kisi berjarak tetap: jarak antar titik
      // selalu terkendali, tidak pernah menumpuk jadi berkas.
      const random = makeRandom(20261001);
      const nextLines = [];
      const lineCount = Math.ceil((height + MARGIN * 2) / LINE_GAP) + 2;

      for (let line = 0; line < lineCount; line += 1) {
        const dots = [];
        // Panjang baris mengikuti arah diagonalnya supaya menutup sampai
        // sudut-sudut section.
        const span = (width + MARGIN * 2) * Math.sqrt(1 + SLOPE * SLOPE);
        const dotCount = Math.ceil(span / DOT_GAP) + 1;

        for (let index = 0; index <= dotCount; index += 1) {
          dots.push({
            // Gangangan kecil per titik supaya pola tidak terlihat seperti
            // cetakan mesin, tapi tetap jauh dari kondisi menumpuk.
            step: DOT_GAP + (random() - 0.5) * DOT_GAP * 0.35,
            offset: (random() - 0.5) * 9,
            radius: mix(RADIUS_MIN, RADIUS_MAX, random()),
            alpha: mix(ALPHA_MIN, ALPHA_MAX, random()),
            phase: random() * Math.PI * 2,
            white: random() < 0.26,
          });
        }

        // Baris ganjil digeser setengah jarak titik supaya dua baris
        // saling mengisi ruang di antaranya: jumlah titik bertambah
        // tanpa membuat jarak antar titik terasa lebih rapat.
        nextLines.push({
          topY: -MARGIN + line * LINE_GAP,
          xOffset: line % 2 === 0 ? 0 : DOT_GAP * 0.5,
          dots,
        });
      }

      lines = nextLines;
    };

    const draw = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      // Dikelompokkan per warna supaya tiap frame hanya menghasilkan
      // sejumlah kecil fill(), bukan satu fill untuk tiap titik.
      const pink = [];
      const white = [];

      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        let x = -MARGIN + line.xOffset;

        for (let i = 0; i < line.dots.length; i += 1) {
          const dot = line.dots[i];
          if (x > width + MARGIN) break;

          // Gelombang merambat perlahan sepanjang baris, ditambah
          // mengambang halus per titik supaya tidak bergerak serempak.
          const wave = Math.sin(elapsed * WAVE_SPEED + x * 0.0035 + dot.phase) * DRIFT_AMPLITUDE;
          const y = line.topY + x * SLOPE + wave + dot.offset;

          // Tepi section diredupkan, tapi tidak terlalu jauh supaya area
          // kiri dan kanan tetap ikut terisi titik.
          const edge = Math.min(x, width - x, y, height - y);
          const fade = clamp01(edge / 110) * 0.4 + 0.6;

          const item = {
            x,
            y,
            radius: dot.radius,
            shade: dot.alpha * fade,
          };

          if (dot.white) white.push(item);
          else pink.push(item);

          // Maju ke titik berikutnya dengan jarak yang sudah ditentukan,
          // jadi jarak antar titik selalu konsisten.
          x += dot.step;
        }
      }

      // Titik polos: tanpa glow, tanpa blur, tanpa halo.
      context.globalCompositeOperation = 'source-over';

      const paint = (items, color) => {
        // Dipisah jadi beberapa tingkat agar jumlah fill() tetap kecil
        // tanpa mengorbankan gradasi opacity antar titik.
        for (let level = 0; level < 3; level += 1) {
          context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${(0.18 + level * 0.16).toFixed(3)})`;
          context.beginPath();
          for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            const bucket = Math.min(2, Math.floor(item.shade * 3));
            if (bucket !== level) continue;
            context.moveTo(item.x + item.radius, item.y);
            context.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          }
          context.fill();
        }
      };

      paint(pink, DUSTY_PINK);
      paint(white, WHITE);
    };

    let lastDraw = 0;

    const loop = (time) => {
      // Gambar dibatasi 40fps; frame yang dilewati tidak melakukan apa-apa.
      if (isVisible && time - lastDraw >= FRAME_INTERVAL) {
        lastDraw = time;
        draw(time);
      }
      frameRef.current = window.requestAnimationFrame(loop);
    };

    // Berhenti saat section tidak terlihat atau tab tidak aktif.
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startTime = 0;
      },
      { threshold: 0.01 },
    );

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameRef.current);
      } else if (!reduceMotion) {
        startTime = 0;
        frameRef.current = window.requestAnimationFrame(loop);
      }
    };

    resize();
    observer.observe(canvas);

    if (reduceMotion) {
      draw(0);
    } else {
      frameRef.current = window.requestAnimationFrame(loop);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(canvas);

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`diagonal-dots pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
