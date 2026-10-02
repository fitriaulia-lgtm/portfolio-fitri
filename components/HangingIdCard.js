'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls, useInView } from 'framer-motion';

const DROP_TIMES = [0, 0.12, 0.4, 0.6, 0.78, 0.9, 1];
const DROP_Y = [-78, -20, 12, -4.5, 1.6, 0];
const DROP_ANGLE = [-9.5, 6.8, -3.8, 2.2, -0.9, 0];
const DROP_BEND = [8.5, -5, 2.8, -1.5, 0.6, 0];
const DROP_STRETCH = [0.07, -0.035, 0.018, -0.008, 0.003, 0];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Profil putaran: kecepatanenyut kontinu (tidak pernah berhenti di tengah),
// hanya melambat singkat di titik 180° supaya bagian belakang
// kartu terlihat sebentar tanpa putaran terasa terputus.
const buildSpinProfile = (samples = 48) => {
  const step = 1 / (samples - 1);
  const times = [0];
  const fractions = [0];
  let accumulated = 0;

  for (let index = 1; index < samples; index += 1) {
    const t = index * step;
    const dipBack = Math.exp(-(((t - 0.5) / 0.085) ** 2));
    accumulated += (1 - 0.955 * dipBack) * step;
    times.push(t);
    fractions.push(accumulated);
  }

  return {
    times,
    fractions: fractions.map((value) => value / accumulated),
  };
};

const SPIN = buildSpinProfile();

const BrandLogo = ({ logo }) => {
  const isSplit = logo.shape === 'split';
  const isLabelOnly = logo.shape === 'split' || logo.shape === 'cup';

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {isSplit ? (
        <>
          <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill={logo.bg} opacity="0.18" />
          <g fill={logo.fg}>{LOGO_SHAPES.split}</g>
        </>
      ) : (
        <>
          <g fill={logo.bg}>{LOGO_SHAPES[logo.shape]}</g>
          {!isLabelOnly && (
            <text
              x="12"
              y={logo.shape === 'shield' ? 15.6 : 15.4}
              textAnchor="middle"
              fontSize={logo.label.length > 2 ? 6.2 : logo.label.length > 1 ? 7.6 : 10}
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
              fill={logo.fg}
            >
              {logo.label}
            </text>
          )}
        </>
      )}
    </svg>
  );
};

const SKILL_LOGOS = [
  { name: 'HTML', label: '5', shape: 'shield', bg: '#e34f26', fg: '#ffffff' },
  { name: 'CSS', label: '3', shape: 'shield', bg: '#1572b6', fg: '#ffffff' },
  { name: 'JS', label: 'JS', shape: 'square', bg: '#f7df1e', fg: '#1f1f1f' },
  { name: 'PHP', label: 'php', shape: 'oval', bg: '#777bb4', fg: '#ffffff' },
  { name: 'Python', label: 'Py', shape: 'split', bg: '#3776ab', fg: '#ffd43b' },
  { name: 'Java', label: 'J', shape: 'cup', bg: '#f89820', fg: '#ffffff' },
  { name: 'C++', label: 'C+', shape: 'square', bg: '#00599c', fg: '#ffffff' },
  { name: 'SQL', label: 'DB', shape: 'cylinder', bg: '#e38c00', fg: '#ffffff' },
];

const LOGO_SHAPES = {
  shield: (
    <path d="M12 1.6 3 5.1v6.4c0 5 3.8 9.5 9 10.9 5.2-1.4 9-5.9 9-10.9V5.1L12 1.6Z" />
  ),
  square: <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="2.6" />,
  oval: <ellipse cx="12" cy="12" rx="10" ry="7" />,
  split: <path d="M11.9 2.4c-3 0-3.4.6-3.8 1.2-.4.6-.5 1.4-.5 2.2v1.6h4.3v.5H5.9c-.9 0-1.8.5-2.1 1.6-.4 1.1-.4 1.8 0 2.9.3 1 1 1.7 1.9 1.7H7v-2.2c0-1 .9-2 2-2h3.2c.9 0 1.6-.7 1.6-1.6V4c0-.9-.8-1.6-1.7-1.6h-.2Zm-1.7 1.1a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2Zm12 4.2c-.3-.9-1-1.6-1.9-1.6h-1.1v2.2c0 1-.8 1.9-1.9 1.9h-3.3c-.9 0-1.6.8-1.6 1.6v3.1c0 .9.8 1.6 1.6 1.6h2.4c.9 0 1.6-.7 1.6-1.6v-1.6h-4v-.5h5.7c.9 0 1.3-.7 1.6-1.6.3-.9.3-1.8 0-2.9-.1-.6-.3-1.2-.7-1.6Zm-3.3 5.4a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2Z" />,
  cup: <path d="M4 4h13v6.5a6.5 6.5 0 0 1-13 0V4Zm14.5 1.5h1.2a2.4 2.4 0 0 1 0 4.8h-1.2V5.5ZM4 19.2c1.6 1 3.2 1.5 5 1.5s3.4-.5 5-1.5v1.6c-1.5 1-3.3 1.5-5 1.5s-3.5-.5-5-1.5v-1.6Z" />,
  cylinder: <path d="M3 5.5c0-1.4 4-2.5 9-2.5s9 1.1 9 2.5v13c0 1.4-4 2.5-9 2.5s-9-1.1-9-2.5v-13Zm1.6 6.2c1.4 1 4 1.7 7.4 1.7s6-.7 7.4-1.7v2.9c0 1-3.5 1.9-7.4 1.9s-7.4-.9-7.4-1.9v-2.9Zm0 5.9c1.4 1 4 1.7 7.4 1.7s6-.7 7.4-1.7v1.1c0 1-3.5 1.9-7.4 1.9s-7.4-.9-7.4-1.9v-1.1Z" />,
};

export default function HangingIdCard({ photoUrl }) {
  const assemblyRef = useRef(null);
  const lanyardRef = useRef(null);
  const isInView = useInView(assemblyRef, { once: false, amount: 0.25 });
  const origin = useRef(null);
  const moved = useRef(false);
  const peakX = useRef(0);
  const lastSpinDirection = useRef(1);
  const ignoreClick = useRef(false);
  const lanyardLength = useRef(140);
  const previousY = useRef(0);
  const swing = useRef(0);
  const entrancePlayed = useRef(false);
  // Pointermove bisa firing ratusan kali per detik. Tanpa penahan, tiap
  // event memicu set() pada kartu dan tali sehingga transform dihitung
  // ulang jauh lebih cepat dari layar bisa menampilkan. Dua ref ini
  // menahan semua update ke satu requestAnimationFrame, jadi transform
  // hanya dihitung sekali per frame.
  const pendingPointer = useRef(null);
  const pointerFrame = useRef(0);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const cardControls = useAnimationControls();
  const lanyardControls = useAnimationControls();
  const flipControls = useAnimationControls();

  const strapLength = useCallback(() => lanyardRef.current?.offsetHeight || 140, []);

  // Tali elastis: panjangnya selalu pas mengikuti jarak kartu, bertambah ratap
  // saat kartu ditarik cepat, menipis dan miring saat kartu berayun.
  const strapPose = useCallback((offsetY, angle, bend, extraStretch, length = lanyardLength.current) => {
    const stretch = Math.abs(offsetY) / length + extraStretch;
    return {
      rotateZ: 0,
      rotateY: clamp(angle * 0.28, -12, 12),
      scaleX: clamp(1 - stretch * 0.17, 0.72, 1.04),
      scaleY: clamp(1 + offsetY / length + extraStretch, 0.32, 1.6),
      skewX: clamp(bend, -18, 18),
    };
  }, []);

  // Terapkan posisi terakhir yang tersimpan. Dipanggil dari dalam rAF,
  // jadi set() hanya berjalan satu kali per frame.
  const applyPointerPose = useCallback(() => {
    pointerFrame.current = 0;
    const pose = pendingPointer.current;
    if (!pose) return;
    cardControls.set({ x: 0, y: pose.offsetY, rotateZ: pose.angle });
    lanyardControls.set(strapPose(pose.offsetY, pose.angle, pose.bend, pose.extraStretch));
  }, [cardControls, lanyardControls, strapPose]);

  const schedulePointerPose = useCallback(
    (pose) => {
      pendingPointer.current = pose;
      if (pointerFrame.current) return;
      pointerFrame.current = window.requestAnimationFrame(applyPointerPose);
    },
    [applyPointerPose],
  );

  const strapFromFrames = useCallback(
    (yFrames, angleFrames, bendFrames, stretchFrames, length) =>
      yFrames.map((y, index) => strapPose(y, angleFrames[index] || 0, bendFrames[index] || 0, stretchFrames[index] || 0, length)),
    [strapPose],
  );

  const resetLanyard = useCallback(() => {
    lanyardControls.set({ rotateZ: 0, rotateY: 0, scaleX: 1, scaleY: 1, skewX: 0 });
  }, [lanyardControls]);

  // Klik: kartu berputar 360° pada poros tali, bagian belakang berlogo
  // terlihat sekilas, lalu kartu kembali menghadap depan. Arah putaran
  // mengikuti tarikan mendatar terakhir (atau kanan bila baru diklik).
  const flipCard = async () => {
    if (isBusy || !isInView) return;
    lanyardLength.current = strapLength();
    await playFlipSpin(lastSpinDirection.current);
  };

  const playFlipSpin = async (direction) => {
    if (isBusy || !isInView) return;
    setIsBusy(true);
    const length = strapLength();
    lanyardLength.current = length;
    setIsSpinning(true);

    const ease = 'linear';
    const spinTimes = SPIN.times;
    const spinAngles = SPIN.fractions.map((value) => direction * value * 360);
    const twist = SPIN.fractions.map((value) => direction * Math.sin(value * Math.PI) * 24);
    const ys = SPIN.fractions.map((value) => -Math.sin(value * Math.PI) * 6);
    const bends = SPIN.fractions.map((value) => direction * Math.sin(value * Math.PI * 2) * 6);
    const frames = strapFromFrames(
      ys,
      spinAngles,
      bends,
      SPIN.fractions.map(() => 0.05),
      length,
    );
    const duration = 1.15;

    try {
      await Promise.all([
        cardControls.start({
          rotateZ: SPIN.fractions.map((value) => Math.sin(value * Math.PI * 2) * direction * 4),
          y: ys,
          transition: { duration, times: spinTimes, ease },
        }),
        lanyardControls.start({
          rotateZ: frames.map((frame) => frame.rotateZ),
          rotateY: twist,
          scaleX: frames.map((frame) => frame.scaleX),
          scaleY: frames.map((frame) => frame.scaleY),
          skewX: frames.map((frame) => frame.skewX),
          transition: { duration, times: spinTimes, ease },
        }),
        flipControls.start({
          rotateY: spinAngles,
          transition: { duration, times: spinTimes, ease },
        }),
      ]);
    } finally {
      cardControls.set({ rotateZ: 0, x: 0, y: 0 });
      resetLanyard();
      flipControls.set({ rotateY: 0 });
      setIsSpinning(false);
      setIsBusy(false);
    }
  };

  // Lepas setelah ditarik: kartu melayang ke atas lalu turun perlahan sambil
  // berayun, tali ikut melar, menipis, dan bertekuk mengikuti tiap gerak.
  const playDrop = async (dragOffsetY) => {
    const length = lanyardLength.current;
    const yFrames = [dragOffsetY, ...DROP_Y];
    const frames = strapFromFrames(yFrames, DROP_ANGLE, DROP_BEND, DROP_STRETCH, length);

    try {
      await Promise.all([
        cardControls.start({
          y: yFrames,
          rotateZ: [0, ...DROP_ANGLE],
          transition: { duration: 2.7, times: DROP_TIMES, ease: 'easeInOut' },
        }),
        lanyardControls.start({
          rotateZ: frames.map((frame) => frame.rotateZ),
          rotateY: frames.map((frame) => frame.rotateY),
          scaleX: frames.map((frame) => frame.scaleX),
          scaleY: frames.map((frame) => frame.scaleY),
          skewX: frames.map((frame) => frame.skewX),
          transition: { duration: 2.7, times: DROP_TIMES, ease: 'easeInOut' },
        }),
      ]);
    } finally {
      cardControls.set({ rotateZ: 0, x: 0, y: 0 });
      resetLanyard();
      setIsDropping(false);
      setIsBusy(false);
    }
  };

  // Tali dan kartu mengayun jatuh dari atas saat halaman About Me terlihat.
  const playEntrance = useCallback(async () => {
    if (entrancePlayed.current) return;
    entrancePlayed.current = true;

    const length = strapLength();
    lanyardLength.current = length;
    setIsDropping(true);
    setIsBusy(true);

    const yFrames = [-length * 1.2, -length * 0.85, length * 0.18, -length * 0.09, length * 0.035, 0];
    const times = [0, 0.34, 0.58, 0.76, 0.9, 1];
    const ease = 'easeOut';
    const angles = [-8, 7, -4.2, 2.5, -1, 0];
    const bends = [11, -7.5, 4.2, -2.1, 0.8, 0];
    const stretches = [0.06, 0.02, -0.03, 0.015, -0.006, 0];
    const frames = strapFromFrames(yFrames, angles, bends, stretches, length);

    try {
      await Promise.all([
        cardControls.start({
          y: yFrames,
          rotateZ: angles,
          transition: { duration: 1.8, times, ease },
        }),
        lanyardControls.start({
          rotateZ: frames.map((frame) => frame.rotateZ),
          rotateY: frames.map((frame) => frame.rotateY),
          scaleX: frames.map((frame) => frame.scaleX),
          scaleY: frames.map((frame) => frame.scaleY),
          skewX: frames.map((frame) => frame.skewX),
          transition: { duration: 1.8, times, ease },
        }),
      ]);
    } finally {
      cardControls.set({ rotateZ: 0, x: 0, y: 0 });
      resetLanyard();
      setIsDropping(false);
      setIsBusy(false);
    }
  }, [cardControls, lanyardControls, strapFromFrames, resetLanyard, strapLength]);

  useEffect(() => {
    if (isInView) {
      void playEntrance();
      return;
    }

    // Saat kembali ke halaman awal, kartu dan tali terangkat kembali ke atas
    // supaya transisi jatuh bisa diputar ulang tiap kali About Me dibuka.
    entrancePlayed.current = false;
    cardControls.stop();
    lanyardControls.stop();
    flipControls.stop();
    flipControls.set({ rotateY: 0 });
    const length = strapLength();
    lanyardLength.current = length;
    cardControls.set({ rotateZ: 0, x: 0, y: -length * 1.2 });
    lanyardControls.set({ rotateZ: 0, rotateY: 0, scaleX: 1, scaleY: 1, skewX: 0 });
  }, [isInView, cardControls, lanyardControls, flipControls, playEntrance, strapLength]);

  // Batalkan frame pointer yang masih tertunda saat komponen dilepas,
  // supaya tidak ada set() yang berjalan pada elemen yang sudah hilang.
  useEffect(
    () => () => {
      if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
      pointerFrame.current = 0;
    },
    [],
  );

  return (
    <motion.div
      ref={assemblyRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: isInView ? 0.15 : 0 }}
      style={{ pointerEvents: isInView ? 'auto' : 'none' }}
      className={`id-card-assembly relative z-30 flex flex-col items-center${isDragging ? ' id-card-dragging' : ''}${isSpinning ? ' id-card-spinning' : ''}${isBusy && !isDropping && !isSpinning ? ' id-card-in-motion' : ''}${isDropping ? ' id-card-dropping' : ''}`}
    >
      <motion.button
        type="button"
        onPointerDown={(event) => {
          if (isBusy || !isInView) return;
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          lanyardLength.current = strapLength();
          origin.current = { x: event.clientX, y: event.clientY };
          moved.current = false;
          peakX.current = 0;
          previousY.current = 0;
          swing.current = 0;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse') return;

          const start = origin.current;
          if (!start || isBusy) return;

          const deltaX = event.clientX - start.x;
          const deltaY = event.clientY - start.y;
          peakX.current = Math.max(peakX.current, deltaX, -deltaX);
          if (!moved.current && Math.hypot(deltaX, deltaY) < 6) return;

          if (!moved.current) {
            moved.current = true;
            ignoreClick.current = true;
            setIsDragging(true);
          }

          const pullY = clamp(deltaY, -120, 120);
          const speed = pullY - previousY.current;
          previousY.current = pullY;

          // Tarikan cepat membuat kartu terangkat dan tali melar elastis.
          const lift = clamp(speed * 0.3, -26, 26);
          const offsetY = clamp(pullY - lift, -150, 130);

          // Ayunan kartu mengikuti tarikan dan sedikit melambat seperti bandul.
          const targetAngle = clamp(deltaX * 0.07, -8, 8);
          swing.current = swing.current * 0.6 + targetAngle * 0.4;
          const angle = swing.current;
          const bend = clamp(-deltaX * 0.1 + angle * 0.55 + speed * 0.06, -18, 18);
          const extraStretch = clamp(speed * 0.004, -0.03, 0.12);

          schedulePointerPose({ offsetY, angle, bend, extraStretch });
        }}
        onPointerUp={(event) => {
          const start = origin.current;
          origin.current = null;
          event.currentTarget.releasePointerCapture?.(event.pointerId);

          // Frame terakhir sebelum pointer dilepas perlu langsung diterapkan,
          // kalau tidak kartu berhenti sedikit di belakang posisi kursor.
          if (pointerFrame.current) {
            window.cancelAnimationFrame(pointerFrame.current);
            applyPointerPose();
          }
          pendingPointer.current = null;

          if (!start) return;

          if (!moved.current) {
            setIsDragging(false);
            void flipCard();
            return;
          }

          const deltaY = event.clientY - start.y;
          moved.current = false;
          setIsDragging(false);
          window.setTimeout(() => {
            ignoreClick.current = false;
          }, 350);

          const pullX = peakX.current;
          if (pullX >= 22 && pullX > Math.abs(deltaY)) {
            lastSpinDirection.current = Math.sign(pullX);
            void playFlipSpin(Math.sign(pullX));
            return;
          }

          setIsBusy(true);
          setIsDropping(true);
          const pullY = clamp(deltaY, -120, 120);
          const speed = pullY - previousY.current;
          const offsetY = clamp(pullY - clamp(speed * 0.3, -26, 26), -150, 130);
          void playDrop(offsetY);
        }}
        onPointerCancel={() => {
          origin.current = null;
          moved.current = false;
          if (isDragging) {
            setIsDragging(false);
            setIsBusy(true);
            setIsDropping(true);
            void playDrop(0);
          }
        }}
        onClick={() => {
          if (ignoreClick.current) return;
        }}
        onPointerLeave={() => {
          setIsGlowing(false);
        }}
        aria-label="Balik kartu"
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="motion-button flex touch-none select-none flex-col items-center cursor-grab active:cursor-grabbing"
      >
        <div className="id-lanyard-pair relative h-36 w-[min(88vw,340px)] sm:h-40">
          <motion.span
            ref={lanyardRef}
            initial={{ rotateZ: 0, rotateY: 0, scaleX: 1, scaleY: 1, skewX: 0 }}
            animate={lanyardControls}
            style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
            className="id-lanyard-strap"
          >
            <span className="id-lanyard-brand" aria-hidden="true">FITRI AULIA INSANI / FITRI AULIA INSANI</span>
            <span className="id-card-hardware" aria-hidden="true">
              <span className="id-card-hook" />
              <span className="id-card-swivel" />
              <span className="id-card-eyelet" />
            </span>
          </motion.span>
        </div>

        <motion.div
          animate={cardControls}
          style={{ transformOrigin: '50% 0%' }}
          className="id-card-floating-card relative -mt-1"
>
              <div className="relative [perspective:950px]">
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={flipControls}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="id-card-flip-container relative h-[380px] w-[min(88vw,340px)] sm:h-[410px] md:h-[430px]"
                >
                   <div
                    aria-hidden
                    style={{ backfaceVisibility: 'hidden' }}
                     className={`id-card-front-face absolute inset-0 rounded-xl border shadow-[0_25px_60px_rgba(0,0,0,0.75)]${isGlowing ? ' id-card-glow-active' : ''}`}
                     onMouseEnter={() => setIsGlowing(true)}
                     onMouseLeave={() => setIsGlowing(false)}
                   >
                     {/* Glow z-1: di belakang foto, tetap di dalam overflow-hidden kartu */}
                     <span className="id-card-spotlight" />
                     {/* Subjek PNG transparan z-2: w-full tanpa celah, kepala aman via object-position top */}
                     <img
                       src={photoUrl}
                       alt="Fitri Aulia Insani"
                       draggable={false}
                       className="id-card-photo"
                     />
                   </div>

              <div
                aria-hidden
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                className="id-card-back-face absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-[#d194a2]/30 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.75)] sm:p-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[9px] font-mono tracking-[0.24em] text-[#d194a2]">PERSONAL ACCESS</p>
                    <p className="mt-1 text-[9px] font-mono tracking-[0.18em] text-stone-400">FITRI / 001</p>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[#d194a2]/40 font-serif text-sm text-[#f2c9d2]">F</span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center">
                  <span className="id-card-logo-grid" aria-hidden="true">
                    {SKILL_LOGOS.map((logo) => (
                      <span className="id-card-logo-cell" key={logo.name}>
                        <BrandLogo logo={logo} />
                        <span className="id-card-logo-name">{logo.name}</span>
                      </span>
                    ))}
                  </span>
                  <p className="mt-3 text-center font-serif text-sm tracking-[0.1em] text-[#f2c9d2]">FITRI AULIA INSANI</p>
                  <p className="mt-1 text-center text-[9px] font-mono tracking-[0.2em] text-[#d7a4af]">S1 INFORMATIKA</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono">
                  <span className="text-[8px] tracking-[0.14em] text-stone-500">UNIVERSITAS SAINS AL-QUR&apos;AN</span>
                  <span className="text-[8px] text-stone-400">FI-2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
