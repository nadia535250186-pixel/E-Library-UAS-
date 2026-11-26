'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLibrary } from './components/LibraryProvider';
import BukuRekomendasiSection from './components/BukuRekomendasiSection';
import './style.css';

const BANNER_SLIDES = [
  {
    src: '/images/cover-halaman1.png',
    alt: 'Cover Halaman 1',
  },
  {
    src: '/images/cover-halaman2.png',
    alt: 'Cover Halaman 2',
  },
  {
    src: '/images/cover-halaman3.png',
    alt: 'Cover Halaman 3',
  },
  {
    src: '/images/cover-halaman4.jpg',
    alt: 'Cover Halaman 4',
  },
  {
    src: '/images/cover-halaman5.jpg',
    alt: 'Cover Halaman 5',
  },
];

const TEAM_AUTHORS = [
  {
    id: 'm3',
    name: 'Laudy Sildy',
    nim: '535250173',
    avatar: '/icons/profile3.jpg',
  },
  {
    id: 'm1',
    name: 'Heru Teguh Pratama',
    nim: '535250165',
    avatar: '/icons/profile1.png',
  },
  {
    id: 'm2',
    name: 'Carolin Tiurma Febrianti',
    nim: '535250169',
    avatar: '/icons/profile2.jpg',
  },
  {
    id: 'm4',
    name: 'Nadia Rizka Arfitasari Zulaeqah',
    nim: '535250186',
    avatar: '/icons/profile4.jpg',
  },
  {
    id: 'm5',
    name: 'Felisia Aprila',
    nim: '535250190',
    avatar: '/icons/profile5.jpg',
  },
];

export default function HomePage() {
  const { books } = useLibrary();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? BANNER_SLIDES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const popularBooks = books.filter((b) => b.isPopular).slice(0, 5);
  const displayPopular =
    popularBooks.length > 0 ? popularBooks : books.slice(0, 5);

  const nonPopularBooks = books.filter((b) => !b.isPopular);
  const recommendedBooks =
    nonPopularBooks.length >= 5
      ? nonPopularBooks.slice(0, 5)
      : books.slice(5, 10);

  const latestBooks = [...books].reverse().slice(0, 5);

  return (
    <main className="home-page w-full px-6 pt-3 pb-12 space-y-10">
      <div className="space-y-4">
        <div className="home-topline">
          <div>
            <p className="home-eyebrow">Lafenandher E-Library</p>
            <h1 className="home-title">Ruang Baca Untuk Bersama</h1>
            <p className="home-description">
              Temukan bacaan baru dan nikmati koleksi pilihan dalam satu ruang yang nyaman.
            </p>
          </div>
          <Link href="/contact" className="home-contact">
            Hubungi Kami <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <section className="home-banner relative group w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-neutral-100">
          <img
            src={BANNER_SLIDES[currentSlide].src}
            alt={BANNER_SLIDES[currentSlide].alt}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Slide Sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Slide Berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-full">
            {BANNER_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === index
                    ? 'w-5 bg-white'
                    : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </section>
      </div>

      <BukuRekomendasiSection
        title="Buku Rekomendasi"
        subtitle="Koleksi buku pilihan yang direkomendasikan untuk Anda"
        books={recommendedBooks}
      />

      <BukuRekomendasiSection
        title="Buku Populer"
        subtitle="Koleksi buku yang paling banyak dibaca dan diminati anggota"
        books={displayPopular}
      />

      <BukuRekomendasiSection
        title="Buku Terbaru"
        subtitle="Koleksi bacaan terbaru yang baru ditambahkan ke perpustakaan"
        books={latestBooks}
      />

      <section className="pt-8 border-t border-[#e6dccb] space-y-5">
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4a2e1b]/10 text-[#4a2e1b] text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Authors</span>
          </div>
          <h2 className="section-heading text-lg sm:text-xl font-bold text-slate-900">
            Tim Pengembang Lafenandher
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TEAM_AUTHORS.map((author, index) => (
            <div
              key={author.id}
              className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1.5 hover:shadow-lg ${
                index === 0
                  ? 'bg-gradient-to-br from-[#4a2e1b] via-[#3c2313] to-[#261409] text-white border-[#4a2e1b]'
                  : 'bg-white text-slate-900 border-[#e6dccb] hover:border-[#4a2e1b]/50'
              }`}
            >
              <div
                className={`pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-30 transition-opacity duration-300 group-hover:opacity-50 ${
                  index === 0 ? 'bg-amber-300' : 'bg-[#c8a987]'
                }`}
              />

              <div
                className={`relative w-24 h-24 rounded-full p-1 mb-4 shadow-md transition-transform duration-300 group-hover:scale-105 ${
                  index === 0
                    ? 'bg-gradient-to-tr from-amber-400 via-amber-100 to-amber-300'
                    : 'bg-gradient-to-tr from-[#4a2e1b]/40 via-[#e6dccb] to-[#c8a987]'
                }`}
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full rounded-full object-cover bg-neutral-100"
                />
              </div>

              <h3
                className={`text-sm font-bold leading-snug line-clamp-2 min-h-[2.5rem] flex items-center justify-center ${
                  index === 0 ? 'text-white' : 'text-slate-900'
                }`}
              >
                {author.name}
              </h3>

              <span
                className={`mt-2.5 inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider ${
                  index === 0
                    ? 'bg-white/15 text-amber-200 border border-amber-200/25'
                    : 'bg-[#f6efe4] text-[#4a2e1b] border border-[#e6dccb]'
                }`}
              >
                {author.nim}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}