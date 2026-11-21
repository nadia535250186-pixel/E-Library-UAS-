'use client';

import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLibrary } from '../../components/LibraryProvider';
import './style.css';

export default function ReadPdfPage() {
  const { id } = useParams();
  const router = useRouter();
  const { books } = useLibrary();

  const book = books.find((b) => b.id === id);

  const blobUrl = useMemo(() => {
    if (!book || !book.pdf.startsWith('data:application/pdf')) {
      return null;
    }

    try {
      const base64Part = book.pdf.split(',')[1];
      const binaryString = atob(base64Part);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Gagal memproses file PDF unggahan:', error);
      return book.pdf;
    }
  }, [book]);

  useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  if (!book) {
    return (
      <div className="reader-page p-8 text-center">
        <p className="text-neutral-700">Buku tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>
    );
  }

  const isExternalUrl = /^https?:\/\//i.test(book.pdf);

  const basePdfSrc = book.pdf.startsWith('data:application/pdf')
    ? blobUrl || book.pdf
    : isExternalUrl
    ? `/api/pdf-proxy?url=${encodeURIComponent(book.pdf)}`
    : book.pdf;

  const pdfViewerSrc = `${basePdfSrc}#navpanes=0&view=FitH`;

  const readerContent = (
    <div
      className="reader-page"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e293b',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '10px 16px',
          borderBottom: '1px solid #e5e5e5',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 active:translate-y-0.5 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </button>

        <h1
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          className="text-xs sm:text-sm font-bold text-black truncate max-w-xl"
        >
          {book.title}
        </h1>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] bg-neutral-100 text-black border border-neutral-200 px-2.5 py-1 rounded-md font-medium">
            {book.category}
          </span>
        </div>
      </div>

      <iframe
        src={pdfViewerSrc}
        title={book.title}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          border: 'none',
          backgroundColor: '#ffffff',
        }}
      />
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(readerContent, document.body);
}