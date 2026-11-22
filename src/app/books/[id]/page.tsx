'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Tag,
  Heart,
  FileText,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useLibrary } from '../../components/LibraryProvider';

interface ExtendedBookFields {
  author?: string;
  publisher?: string;
  year?: string | number;
  pages?: string | number;
  synopsis?: string;
  description?: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    books,
    favorites,
    toggleFavorite,
    borrowBook,
    returnBook,
    isBorrowed,
  } = useLibrary();

  const book = books.find((b) => String(b.id) === String(bookId));

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Buku Tidak Ditemukan
        </h1>
        <p className="text-xs text-slate-500">
          Koleksi buku yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Semua Buku
        </Link>
      </div>
    );
  }

  const liked = favorites.includes(book.id);
  const borrowed = isBorrowed(book.id);
  const bookData = book as unknown as ExtendedBookFields;

  const handlePinjamDanBaca = () => {
    if (!borrowed) {
      borrowBook(book);
    }
    router.push(`/read/${book.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigasi Atas */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(book.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
            liked
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          {liked ? 'Tersimpan di Favorit' : 'Tambah ke Favorit'}
        </button>
      </div>

      {/* Kartu Utama Detail Buku */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sampul Buku */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {borrowed && (
              <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sedang Anda Pinjam
              </span>
            )}
          </div>

          {/* Informasi Lengkap & Sinopsis */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2 border-b border-slate-200 pb-5">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                {book.category || 'Umum'}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                {book.title}
              </h1>
              <p className="text-sm font-medium text-slate-600">
                Penulis:{' '}
                <span className="font-semibold text-slate-900">
                  {bookData.author || 'Penulis Koleksi Lafenadher'}
                </span>
              </p>
            </div>

            {/* Grid Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Penerbit</span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {bookData.publisher || 'Lafenadher Press'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tahun Terbit</span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {bookData.year || '2024'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Kategori</span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {book.category || 'Umum'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Format / Halaman</span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {bookData.pages ? `${bookData.pages} Hlm (PDF)` : 'Digital PDF'}
                </p>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">
                Sinopsis Buku
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {bookData.synopsis ||
                  bookData.description ||
                  `Buku "${book.title}" memuat pembahasan komprehensif dalam bidang ${book.category || 'ilmu pengetahuan'} yang disusun secara sistematis sebagai referensi bacaan dan kajian akademik di Lafenadher E-Library.`}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePinjamDanBaca}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                {borrowed ? 'Lanjut Baca PDF' : 'Pinjam & Baca PDF'}
              </button>

              {borrowed && (
                <button
                  type="button"
                  onClick={() => returnBook(book.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Kembalikan Buku
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}