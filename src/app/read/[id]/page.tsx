'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, BookOpen } from 'lucide-react';
import { useLibrary } from '../../components/LibraryProvider';

export default function ReadPdfPage() {
  const { id } = useParams();
  const router = useRouter();
  const { books } = useLibrary();

  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Buku tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 text-sm underline cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  const isDoiOrExternal =
    Boolean(book.doi) ||
    book.pdf.startsWith('http://') ||
    book.pdf.startsWith('https://');

  const targetUrl = book.doi || book.pdf;

  return (
    <div className="flex flex-col min-h-[82vh] space-y-4">
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <h1 className="text-sm font-bold text-slate-800 truncate max-w-md">
          {book.title}
        </h1>

        <span className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-medium shrink-0">
          {book.category}
        </span>
      </div>

      {isDoiOrExternal ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="w-36 h-48 object-cover rounded-xl border border-slate-200 shadow-md mb-5"
          />

          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Koleksi Digital Terhubung DOI
          </span>

          <h2 className="text-lg font-bold text-slate-800 max-w-lg">
            {book.title}
          </h2>

          <p className="text-xs text-slate-500 mt-1 break-all max-w-md">
            Sumber Resmi: <span className="text-blue-600 font-mono">{targetUrl}</span>
          </p>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
          >
            <span>Baca Full Text di Situs DOI</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <p className="text-[11px] text-slate-400 mt-3 max-w-sm">
            Tautan akan membuka halaman penerbit resmi DOI pada tab baru agar seluruh isi jurnal/e-book dapat dibaca penuh.
          </p>
        </div>
      ) : (
        <iframe
          src={book.pdf}
          title={book.title}
          className="w-full h-[78vh] rounded-xl border border-slate-200 bg-white shadow-sm"
        />
      )}
    </div>
  );
}