'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLibrary } from './components/LibraryProvider';
import BookCard from './components/BookCard';

const BANNER_IMAGES = [
  '/images/cover-halaman1.png',
  '/images/cover-halaman2.png',
  '/images/cover-halaman3.png',
  '/images/cover-halaman4.jpg',
  '/images/cover-halaman5.jpg',
];

export default function HomePage() {
  const { books } = useLibrary();
  const popularBooks = books.filter((book) => book.isPopular).slice(0, 5);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Geser otomatis setiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
  };

  return (
    <div className="space-y-8">
      {/* Banner Carousel Otomatis */}
      <div className="relative w-full aspect-[3.3/1] rounded-2xl overflow-hidden shadow-md bg-slate-900 group">
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {BANNER_IMAGES.map((src, index) => (
            <div key={src} className="relative w-full h-full shrink-0">
              <img
                src={src}
                alt={`Lafenandher E-Library Banner ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Tombol Panah Kiri */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Tombol Panah Kanan */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indikator Titik Halaman 1-5 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-full">
          {BANNER_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Pilih banner ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-5 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bagian Buku Populer */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">Buku Populer</h2>
          <p className="text-xs text-slate-500">
            Beberapa judul populer yang paling sering dibaca
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} compact />
          ))}
        </div>
      </section>
    </div>
  );
}