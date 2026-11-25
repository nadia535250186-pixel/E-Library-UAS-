'use client';

import Link from 'next/link';
import { useLibrary } from '../components/LibraryProvider';

interface RecommendedDetail {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  language: string;
  category: string;
  format: string;
  pdf: string;
  description: string;
  cover: string;
}

const STATIC_RECOMMENDATIONS: RecommendedDetail[] = [
  {
    id: 'sengsara-membawa-nikmat',
    title: 'Sengsara Membawa Nikmat',
    author: 'Sutan Sati',
    publisher: 'Balai Pustaka',
    year: 1929,
    language: 'Indonesia',
    category: 'Novel',
    format: 'PDF',
    pdf: '/books/sengsara-membawa-nikmat.pdf',
    description:
      'Pengembaraan Midun dalam kisah klasik yang melintasi Sumatra hingga Jawa.',
    cover: '/images/sengsara-membawa-nikmat.jpg',
  },
  {
    id: 'royan-revolusi',
    title: 'Royan Revolusi',
    author: 'Ramadhan K.H.',
    publisher: 'Gunung Agung',
    year: 1970,
    language: 'Indonesia',
    category: 'Novel',
    format: 'PDF',
    pdf: '/books/royan-revolusi.pdf',
    description:
      'Idrus berusaha mempertahankan nuraninya ketika kembali ke desa yang dipenuhi manipulasi dan perebutan kepentingan.',
    cover: '/images/royan-revolusi.jpg',
  },
  {
    id: 'di-atas-sajadah-cinta',
    title: 'Di Atas Sajadah Cinta',
    author: 'Habiburrahman El Shirazy',
    publisher: 'Republika',
    year: 2006,
    language: 'Indonesia',
    category: 'Spiritualitas',
    format: 'PDF',
    pdf: '/books/di atas-sajadah-cinta.pdf',
    description:
      'Kumpulan kisah teladan Islami yang menguatkan iman dan menenteramkan hati.',
    cover: '/images/di atas-sajadah-cinta.jpg',
  },
  {
    id: 'the-seven-spirits-of-god',
    title: 'The Seven Spirits of God',
    author: 'Ron Auch',
    publisher: 'New Leaf Press',
    year: 1993,
    language: 'English',
    category: 'Spiritualitas',
    format: 'PDF',
    pdf: '/books/the-seven-spirits-of-god.pdf',
    description:
      'Pembahasan mengenai tujuh roh Allah dalam ajaran Alkitab dan kaitannya dengan kehidupan rohani.',
    cover: '/images/the-seven-spirits-of-god.jpg',
  },
];

export default function RecommendationsPage() {
  const { books } = useLibrary();

  return (
    <div className="w-full px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Buku Rekomendasi</h1>
        <p className="text-xs text-slate-500">
          Jelajahi koleksi buku rekomendasi pilihan LAFENADHER E-Library.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATIC_RECOMMENDATIONS.map((book) => (
          <div
            key={book.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <img
                src={book.cover}
                alt={book.title}
                onError={(e) => {
                  e.currentTarget.src = '/images/default-book-cover.svg';
                }}
                className="w-full h-56 object-cover rounded-xl bg-neutral-100"
              />
              <span className="inline-block text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {book.category} • {book.year}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{book.title}</h3>
              <p className="text-xs text-slate-600">
                Penulis: {book.author} ({book.publisher})
              </p>
              <p className="text-xs text-slate-500 line-clamp-3">
                {book.description}
              </p>
            </div>

            <a
              href={book.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              Baca Buku
            </a>
          </div>
        ))}
      </div>

      {books.length > 0 && (
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            Rekomendasi dari Katalog Utama
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {books.slice(0, 5).map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm block"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-60 object-cover block"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}