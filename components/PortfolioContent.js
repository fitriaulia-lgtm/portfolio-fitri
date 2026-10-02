'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Globe,
  Code2,
  Sparkles,
  Download,
  ArrowDown,
  Eye,
} from 'lucide-react';
import HangingIdCard from '@/components/HangingIdCard';
import DiagonalDots from '@/components/DiagonalDots';

const ACTIVITY_ACCENTS = {
  Organisasi: 'border-sky-300/40 text-sky-200',
  Kepanitiaan: 'border-[#d194a2]/40 text-[#f2c9d2]',
  Sertifikat: 'border-white/30 text-white',
};

const ACTIVITIES = [
  {
    id: 'sekretaris-himpunan',
    category: 'Organisasi',
    title: 'Sekretaris — Himpunan Mahasiswa Program Studi Teknik Informatika',
    year: '2024',
    summary: 'Mengelola administrasi, dokumentasi, dan komunikasi internal himpunan.',
    detail:
      'Bertanggung jawab atas pengarsipan surat dan dokumen himpunan, penyusunan notulen rapat, serta timely penyampaian informasi kepada seluruh anggota.',
    // Berkas diambil dari folder public/lampiran/. Taruh berkasnya
    // di sana lalu samakan path-nya di bawah ini.
    attachments: [
      {
        label: 'SK & Dokumentasi',
        src: '/lampiran/sekretaris.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'mc-webinar-euphoria-22',
    category: 'Kepanitiaan',
    title: 'MC — Webinar Euphoria TI ke-22',
    year: '2024',
    summary: 'Pembawa acara Webinar Euphoria TI ke-22 bertema "Data Science in Social Media Strategy".',
    detail:
      'Memandu alur diskusi bersama penyaji, menjaga ritme acara, serta mengarahkan tanya jawab bersama peserta hingga sesi selesai.',
    attachments: [
      {
        label: 'Dokumentasi',
        src: '/lampiran/mc%20webinar.pdf',
        name: 'mc webinar.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'lkmm-pd',
    category: 'Sertifikat',
    title: 'Latihan Keterampilan Manajemen Mahasiswa Tingkat Pra-Dasar',
    year: '2024',
    summary:
      'Kegiatan yang membantu mengembangkan kemampuan manajemen, komunikasi, kepemimpinan, dan kerja sama dalam kegiatan mahasiswa.',
    attachments: [
      {
        label: 'Sertifikat',
        src: '/lampiran/lkmm-pd.pdf',
        name: 'lkmm-pd.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'lkmm-td',
    category: 'Sertifikat',
    title: 'Latihan Keterampilan Manajemen Mahasiswa Tingkat Dasar',
    year: '2024',
    summary:
      'Kegiatan yang membantu mengembangkan kemampuan manajemen, komunikasi, kepemimpinan, dan kerja sama dalam kegiatan mahasiswa.',
  },
  {
    id: 'sekretaris-ppdb',
    category: 'Kepanitiaan',
    title: 'Sekretaris — PPDB Mikro',
    year: '2024',
    summary: 'Koordinasi administrasi dan komunikasi dengan peserta PPDB.',
    detail:
      'Bertanggung jawab atas pengarsipan berkas pendaftar, penyusunan jadwal seleksi, serta penyampaian informasi hasil seleksi kepada seluruh peserta.',
  },
  {
    id: 'sertifikat-web',
    category: 'Sertifikat',
    title: 'Pemrograman Web Fundamentals',
    year: '2023',
    summary: 'Pelatihan dasar HTML, CSS, dan JavaScript dari platform pembelajaran daring.',
    detail:
      'Materi mencakup struktur semantik HTML, layout responsif dengan Flexbox dan Grid, serta dasar-dasar manipulasi DOM menggunakan JavaScript.',
  },
  {
    id: 'dies-natalis',
    category: 'Kepanitiaan',
    title: 'Panitia Dies Natalis Fakultas',
    year: '2023',
    summary: 'Panitia teknis pada acara mahasiswa di kampus.',
    detail:
      'Menangani pendaftaran peserta, tata tempat, serta persiapan dekorasi dan konsumsi. Berkolaborasi dengan seluruh divisi agar acara berjalan lancar.',
  },
  {
    id: 'sertifikat-python',
    category: 'Sertifikat',
    title: 'Analisis Data dengan Python',
    year: '2024',
    summary: 'Pelatihan pengolahan data menggunakan pandas, NumPy, dan visualisasi.',
    detail:
      'Materi meliputi pembersihan data, manipulasi tabel, perhitungan statistik deskriptif, serta pembuatan visualisasi dasar untuk mendukung interpretasi data.',
  },
  {
    id: 'bendahara',
    category: 'Kepanitiaan',
    title: 'Bendahara — Malam Temu Mahasiswa',
    year: '2022',
    summary: 'Pengelolaan keuangan kegiatan dan penyusunan laporan anggaran.',
    detail:
      'Mencatat pemasukan dan pengeluaran, menyiapkan proposal anggaran kegiatan, serta menyusun laporan pertanggungjawaban keuangan yang transparan dan dapat diaudit.',
  },
  {
    id: 'sertifikat-uiux',
    category: 'Sertifikat',
    title: 'UI/UX Design Fundamentals',
    year: '2025',
    summary: 'Pelatihan principles of user interface design dan prototyping tools.',
    detail:
      'Materi meliputi elemen visual, tipografi, warna, prototyping low fidelity, serta principles of user experience yang diterapkan pada studi kasus aplikasi mobile.',
  },
  {
    id: 'asisten-praktikum',
    category: 'Organisasi',
    title: 'Asisten Praktikum Komputer',
    year: '2023',
    summary: 'Membantu praktikan memahami konsep dasar pemrograman dan penggunaan lab.',
    detail:
      'Mendampingi praktikan saat mengerjakan tugas, menjawab pertanyaan teknis, serta memastikan setiap praktikan dapat menyelesaikan latihan secara mandiri.',
  },
];

const PROJECTS = [
  {
    title: 'Sistem Pendukung Keputusan Menu Makan Bergizi Gratis',
    category: 'Skripsi / Final Thesis',
    desc: 'Sistem Pendukung Keputusan (SPK) berbasis web yang mengintegrasikan metode AHP (Analytic Hierarchy Process) untuk pembobotan kriteria dan TOPSIS untuk pemeringkatan alternatif menu gizi seimbang.',
    tech: ['Laravel', 'Tailwind CSS', 'Python', 'MySQL', 'AHP & TOPSIS'],
  },
  {
    title: 'Sistem Manajemen Perpustakaan Digital',
    category: 'Web Application',
    desc: 'Aplikasi manajemen inventaris & peminjaman buku berbasis web dengan fitur perhitungan denda otomatis, pencatatan transaksi, dan laporan analitik.',
    tech: ['Laravel', 'Blade', 'Tailwind CSS', 'MySQL'],
  },
  {
    title: 'Klasifikasi Penyakit Tanaman Cabai',
    category: 'Computer Vision & Deep Learning',
    desc: 'Model klasifikasi citra digital penyakit daun tanaman menggunakan arsitektur MobileNetV2 dengan fine-tuning yang dilatih menggunakan Python di Google Colab.',
    tech: ['Python', 'MobileNetV2', 'OpenCV', 'Google Colab'],
  }
];

const SKILLS = [
  "Laravel / PHP", "React.js / Next.js", "Python (Sains Data)", 
  "AHP & TOPSIS (SPK)", "Tailwind CSS", "MySQL / Database Design",
  "UML / Extreme Programming", "REST APIs"
];

// Lampiran disimpan sebagai berkas statis di dalam public/lampiran/,
// sehingga bisa dilihat dan diunduh oleh semua pengunjung (juga setelah
// deploy ke Vercel). Tambahkan berkas baru cukup dengan menaruhnya di
// folder tersebut lalu mendaftarkan path-nya di sini.
const ActivityAttachments = ({ files }) => {
  if (!files?.length) return null;

  return (
    <div className="clear-both mt-4 border-t border-white/10 pt-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
        Lampiran
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {files.map((file) => {
          const isImage = file.type === 'image';
          const verb = isImage ? 'Lihat' : 'Unduh';

          return (
            <a
              key={file.src}
              href={file.src}
              download={isImage ? undefined : file.name ?? file.src.split('/').pop()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#d194a2]/40 px-5 py-2.5 text-xs text-stone-200 transition-colors duration-300 hover:border-[#d194a2] hover:bg-[#d194a2]/10 hover:text-white"
            >
              {isImage ? <Eye size={14} aria-hidden="true" /> : <Download size={14} aria-hidden="true" />}
              {file.label}
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
                {verb}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

const Timeline = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <ol className="relative mt-14">
      {/* Garis vertikal di tengah, menebal saat layar lebar */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:left-1/2 md:-translate-x-1/2"
      />

      {ACTIVITIES.map((item, index) => {
        const isLeft = index % 2 === 0;
        const isOpen = openIndex === index;
        const accent = ACTIVITY_ACCENTS[item.category];

        return (
          <li
            key={item.title}
            className="relative grid grid-cols-1 gap-4 pb-10 pl-12 md:grid-cols-2 md:gap-12 md:pl-0"
          >
            {/* Penanda di atas garis timeline */}
            <span
              aria-hidden="true"
              className="absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#0a0a0c] bg-white shadow-[0_0_0_3px_rgba(209,148,162,0.25)] md:left-1/2"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={
                isLeft
                  ? 'md:col-start-1 md:row-start-1 md:pr-2 md:text-right'
                  : 'md:col-start-2 md:row-start-1'
              }
            >
              <div className="rounded-2xl border border-white/10 bg-[#121115]/70 p-5 transition-colors duration-300 hover:border-white/25">
                <div
                  className={`flex flex-wrap items-center gap-3 ${
                    isLeft ? 'md:justify-end' : ''
                  }`}
                >
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] ${accent}`}
                  >
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-stone-500">{item.year}</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-white md:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{item.summary}</p>

                {isOpen && item.detail ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="mt-3 overflow-hidden text-sm leading-relaxed text-stone-500"
                  >
                    {item.detail}
                  </motion.p>
                ) : null}

                {item.detail ? (
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[#d194a2] transition-colors hover:text-white ${
                      isLeft ? 'md:float-right' : ''
                    }`}
                  >
                    {isOpen ? 'Tutup Detail' : 'Lihat Detail'}
                  </button>
                ) : null}

                {item.attachments ? (
                  <ActivityAttachments files={item.attachments} />
                ) : null}
              </div>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
};

export default function PortfolioContent({ photoUrl }) {
  return (
    <div className="relative z-30 text-stone-200">
      
      {/* 01. ABOUT ME SECTION */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#0a0a0c] py-6 lg:py-8">
        {/* Barisan titik diagonal yang renggang: kanvas di layer paling
            belakang, tanpa glow atau gumpalan. */}
        <DiagonalDots />

        {/* Dekorasi latar: blob aura lembut yang bergerak sangat lambat,
            hanya di belakang card dan kotak About Me. */}
        <div className="about-aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 flex min-h-[calc(100svh-3rem)] items-center md:min-h-[calc(100svh-4rem)]">
          {/* Satu kartu besar membungkus teks About Me dan ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="about-panel grid w-full grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-[#121115]/85 p-7 sm:p-9 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)] lg:gap-14"
          >
            <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-xs font-mono uppercase tracking-[0.4em] text-[#d194a2]"
            >
              01 / About Me
            </motion.span>
            <motion.h2
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.38, delay: 0.06, ease: 'easeOut' }}
              className="mt-2 mb-6 font-serif italic text-3xl text-white md:text-4xl"
            >
              Hi, I&apos;m Fitri Aulia Insani
            </motion.h2>
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.38, delay: 0.12, ease: 'easeOut' }}
              className="text-base font-light leading-relaxed text-stone-400 md:text-lg"
            >
              Fresh graduate S1 Informatika Universitas Sains Al-Qur&apos;an dengan minat pada web development, pengolahan data, dan desain. Suka mempelajari hal baru, mengeksplorasi ide, dan mencoba membuat sesuatu yang bermanfaat.
            </motion.p>

            <motion.a
              href="/cv/CV_Fitri%20Aulia%20Insani.pdf"
              download
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.38, delay: 0.18, ease: 'easeOut' }}
              whileHover={{ y: -2 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#d194a2]/40 px-6 py-3 text-sm text-stone-200 transition-colors duration-300 hover:border-[#d194a2] hover:bg-[#d194a2]/10 hover:text-white"
            >
              <Download size={16} aria-hidden="true" />
              Unduh CV
            </motion.a>
            </div>

            <div className="flex min-h-[480px] items-start justify-center overflow-visible pt-2 md:min-h-[520px] md:justify-end md:pt-0">
              <HangingIdCard photoUrl={photoUrl} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 02. ACTIVITIES & CERTIFICATIONS */}
      <section id="activities" className="relative w-full overflow-hidden px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#d194a2]">
            02 / Activities
          </span>
          <h2 className="mt-2 font-serif italic text-3xl text-white md:text-4xl">
            My Activities &amp; Certifications
          </h2>

          <Timeline />
        </div>

        <div className="mt-20 flex justify-center">
          <button
            type="button"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] text-stone-300 transition-colors duration-300 hover:border-[#d194a2]/60 hover:text-white"
          >
            Lanjut ke Proyek Pilihan
            <ArrowDown
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </section>

      {/* 03. PROJECTS SECTION */}
      <section id="projects" className="mx-auto max-w-6xl px-6 mb-32 pt-24">
        <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#d194a2]">
          02 / Featured Work
        </span>
        <h2 className="font-serif italic text-3xl md:text-4xl text-white mt-2 mb-12">
          Proyek Pilihan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((p, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#121115] border border-white/10 rounded-2xl p-8 hover:border-[#d194a2]/40 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-stone-500">{p.category}</span>
                <Sparkles className="w-4 h-4 text-[#d194a2] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f2c9d2] transition-colors">
                {p.title}
              </h3>
              <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t, i) => (
                  <span key={i} className="text-[10px] font-mono px-3 py-1 bg-white/5 border border-white/10 rounded-full text-stone-300">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 03. TECHNICAL SKILLS */}
      <section className="mx-auto max-w-6xl px-6 mb-32">
        <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#d194a2]">
          03 / Technical Stack
        </span>
        <h2 className="font-serif italic text-3xl md:text-4xl text-white mt-2 mb-8">
          Keahlian & Teknologi
        </h2>

        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 bg-[#121115] border border-white/10 rounded-xl text-stone-200 text-sm font-medium"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      {/* 04. FOOTER / CONTACT */}
      <footer className="mx-auto max-w-6xl px-6 border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-serif italic text-2xl text-white">Fitri Aulia Insani</h3>
          <p className="text-xs font-mono text-stone-500 mt-1">Informatics Graduate • Portfolio Website</p>
        </div>
        <div className="flex gap-6 text-stone-400">
          <a href="mailto:fitri@example.com" className="hover:text-[#f2c9d2] transition-colors" title="Email">
            <Mail size={20} />
          </a>
          <a href="#" className="hover:text-[#f2c9d2] transition-colors" title="GitHub / Projects">
            <Code2 size={20} />
          </a>
          <a href="#" className="hover:text-[#f2c9d2] transition-colors" title="Website / Profile">
            <Globe size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}