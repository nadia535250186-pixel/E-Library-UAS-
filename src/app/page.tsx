'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLibrary } from './components/LibraryProvider';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const recommendedBooks = books.slice(0, 5);

  return (
    <main className="home-page w-full px-6 pt-3 pb-8 space-y-6">
      {/* Bagian Atas: Contact & Banner */}
      <div className="space-y-4">
        <div className="home-topline">
          <div>
            <p className="home-eyebrow">Lafenandher E-Library</p>
            <h1 className="home-title">
              Ruang Baca Untuk Bersama
            </h1>
            <p className="home-description">
              Temukan bacaan baru dan nikmati koleksi pilihan dalam satu ruang yang nyaman.
            </p>
          </div>
          <Link
            href="/contact"
            className="home-contact"
          >
            Hubungi Kami <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Hero Banner Carousel dengan Tombol < dan > */}
        <section className="home-banner relative group w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-neutral-100">
          <img
            src={BANNER_SLIDES[currentSlide].src}
            alt={BANNER_SLIDES[currentSlide].alt}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Tombol Panah Kiri (<) */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Slide Sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Tombol Panah Kanan (>) */}
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Slide Berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Indikator Titik Slide */}
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

      {/* Bagian Buku Rekomendasi (Hanya Cover Saja) */}
      <section className="space-y-4">
        <div>
          <h2 className="section-heading text-base sm:text-lg font-bold text-slate-900">
            Buku Rekomendasi
          </h2>
          <p className="text-xs text-slate-500">
            Koleksi buku pilihan yang direkomendasikan untuk Anda
          </p>
        </div>

        {recommendedBooks.length === 0 ? (
          <div className="border border-neutral-200 rounded-2xl p-8 text-center text-xs text-neutral-500">
            Belum ada buku yang tersedia di perpustakaan.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recommendedBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-book-cover.svg';
                  }}
                  className="w-full h-64 sm:h-72 object-cover block"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
