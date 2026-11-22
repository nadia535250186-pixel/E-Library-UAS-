'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Square, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLibrary } from '../../components/LibraryProvider';
import './style.css';

const emptySubscribe = () => () => {};

interface LineHighlight {
  id: number;
  text: string;
  leftRatio: number;
  topRatio: number;
  widthRatio: number;
  heightRatio: number;
}

interface PdfTextItem {
  str?: string;
  transform: number[];
  width: number;
  height?: number;
}

interface PdfViewport {
  width: number;
  height: number;
}

interface PdfPageProxy {
  getViewport: (params: { scale: number }) => PdfViewport;
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }) => { promise: Promise<void>; cancel?: () => void };
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
}

interface PdfDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPageProxy>;
}

declare global {
  interface Window {
    pdfjsLib?: {
      GlobalWorkerOptions: { workerSrc: string };
      getDocument: (src: string) => {
        promise: Promise<PdfDocumentProxy>;
      };
    };
  }
}

export default function ReadPdfPage() {
  const params = useParams();
  const router = useRouter();
  const { books } = useLibrary();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<PdfDocumentProxy | null>(null);
  const renderTaskRef = useRef<{ cancel?: () => void } | null>(null);
  const isSpeakingRef = useRef(false);

  const [audioMode, setAudioMode] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [lines, setLines] = useState<LineHighlight[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const bookId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const book = books.find((b) => String(b.id) === String(bookId));
  const pdfSource = book?.pdf || '';

  const blobUrl = useMemo(() => {
    if (!pdfSource || !pdfSource.startsWith('data:application/pdf')) {
      return null;
    }

    try {
      const base64Part = pdfSource.split(',')[1];
      const binaryString = atob(base64Part);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch {
      return pdfSource;
    }
  }, [pdfSource]);

  const stopAudio = useCallback(() => {
    isSpeakingRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveLineIndex(null);
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
      stopAudio();
    };
  }, [blobUrl, stopAudio]);

  const isExternalUrl = /^https?:\/\//i.test(pdfSource);
  const basePdfSrc = pdfSource.startsWith('data:application/pdf')
    ? blobUrl || pdfSource
    : isExternalUrl
    ? `/api/pdf-proxy?url=${encodeURIComponent(pdfSource)}`
    : pdfSource;

  useEffect(() => {
    if (!audioMode || !basePdfSrc) return;

    let cancelled = false;

    const loadDocument = async () => {
      setIsLoadingPage(true);
      try {
        if (!window.pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
              if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve();
              } else {
                reject(new Error('Gagal memuat pembaca PDF'));
              }
            };
            script.onerror = () => reject(new Error('Gagal memuat PDF.js'));
            document.head.appendChild(script);
          });
        }

        if (!pdfDocRef.current) {
          const doc = await window.pdfjsLib!.getDocument(basePdfSrc).promise;
          if (cancelled) return;
          pdfDocRef.current = doc;
          setNumPages(doc.numPages);
        }
      } finally {
        if (!cancelled) setIsLoadingPage(false);
      }
    };

    loadDocument();

    return () => {
      cancelled = true;
    };
  }, [audioMode, basePdfSrc]);

  useEffect(() => {
    if (!audioMode || !pdfDocRef.current || !canvasRef.current || numPages === 0) return;

    const renderPage = async () => {
      const doc = pdfDocRef.current!;
      const canvas = canvasRef.current!;

      try {
        if (renderTaskRef.current?.cancel) {
          renderTaskRef.current.cancel();
        }

        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.35 });
        const baseViewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const task = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = task;
        await task.promise;

        const textContent = await page.getTextContent();
        const pageW = baseViewport.width;
        const pageH = baseViewport.height;

        interface Segment {
          str: string;
          x: number;
          yTop: number;
          width: number;
          height: number;
        }

        const segments: Segment[] = [];
        for (const item of textContent.items) {
          const text = (item.str || '').trim();
          if (!text) continue;
          const tx = item.transform;
          const fontH = Math.hypot(tx[2], tx[3]) || item.height || 12;
          const x = tx[4];
          const yTop = pageH - tx[5] - fontH;
          segments.push({
            str: text,
            x,
            yTop,
            width: Math.max(item.width || 10, 8),
            height: Math.max(fontH, 10),
          });
        }

        segments.sort((a, b) => {
          if (Math.abs(a.yTop - b.yTop) > 5) return a.yTop - b.yTop;
          return a.x - b.x;
        });

        const grouped: LineHighlight[] = [];
        let bucket: Segment[] = [];

        const flush = () => {
          if (bucket.length === 0) return;
          bucket.sort((a, b) => a.x - b.x);
          const text = bucket.map((s) => s.str).join(' ').trim();
          const minX = Math.min(...bucket.map((s) => s.x));
          const maxX = Math.max(...bucket.map((s) => s.x + s.width));
          const minY = Math.min(...bucket.map((s) => s.yTop));
          const maxH = Math.max(...bucket.map((s) => s.height));

          if (text) {
            grouped.push({
              id: grouped.length,
              text,
              leftRatio: Math.max(0, minX / pageW),
              topRatio: Math.max(0, minY / pageH),
              widthRatio: Math.min(1, (maxX - minX) / pageW),
              heightRatio: Math.min(1, (maxH + 4) / pageH),
            });
          }
          bucket = [];
        };

        for (const seg of segments) {
          if (bucket.length === 0) {
            bucket.push(seg);
          } else {
            const refY = bucket[0].yTop;
            const prevEnd = bucket[bucket.length - 1].x + bucket[bucket.length - 1].width;
            if (Math.abs(seg.yTop - refY) <= 6 && seg.x - prevEnd < 45) {
              bucket.push(seg);
            } else {
              flush();
              bucket.push(seg);
            }
          }
        }
        flush();

        setLines(grouped);
      } catch {
      }
    };

    renderPage();
  }, [audioMode, pageNumber, numPages]);

  const speakFromLine = useCallback((startIndex: number, pageLines: LineHighlight[]) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung fitur pembaca audio.');
      return;
    }

    if (pageLines.length === 0) return;

    window.speechSynthesis.cancel();
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    const sample = pageLines.map((l) => l.text).join(' ');
    const englishWords = (
      sample.match(/\b(the|and|of|to|in|is|for|with|that|you|your|from)\b/gi) || []
    ).length;
    const lang = englishWords > 3 ? 'en-US' : 'id-ID';

    const readNext = (idx: number) => {
      if (!isSpeakingRef.current || idx >= pageLines.length) {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        setActiveLineIndex(null);
        return;
      }

      const current = pageLines[idx];
      setActiveLineIndex(idx);

      const utterance = new SpeechSynthesisUtterance(current.text);
      utterance.lang = lang;
      utterance.rate = 1.0;

      utterance.onend = () => {
        if (isSpeakingRef.current) {
          readNext(idx + 1);
        }
      };

      utterance.onerror = () => {
        if (isSpeakingRef.current) {
          readNext(idx + 1);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    readNext(startIndex);
  }, []);

  const handleToggleAudioMode = () => {
    if (audioMode) {
      stopAudio();
      setAudioMode(false);
    } else {
      setAudioMode(true);
    }
  };

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > numPages) return;
    stopAudio();
    setPageNumber(nextPage);
  };

  if (!book) {
    return (
      <div className="reader-page p-8 text-center">
        <p className="text-neutral-700">Buku tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => router.push('/books')}
          className="mt-4 inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </button>
      </div>
    );
  }

  const pdfViewerSrc = basePdfSrc ? `${basePdfSrc}#navpanes=0&view=FitH` : '';

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
          onClick={() => {
            stopAudio();
            router.push('/books');
          }}
          className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 active:translate-y-0.5 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <h1
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            className="text-xs sm:text-sm font-bold text-black truncate max-w-xl"
          >
            {book.title}
          </h1>

          {audioMode && numPages > 0 && (
            <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md text-xs shrink-0">
              <button
                type="button"
                onClick={() => changePage(pageNumber - 1)}
                disabled={pageNumber <= 1}
                className="p-0.5 hover:bg-neutral-200 rounded disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-black" />
              </button>
              <span className="font-semibold text-black px-1">
                {pageNumber} / {numPages}
              </span>
              <button
                type="button"
                onClick={() => changePage(pageNumber + 1)}
                disabled={pageNumber >= numPages}
                className="p-0.5 hover:bg-neutral-200 rounded disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {audioMode && !isSpeaking && lines.length > 0 && (
            <button
              type="button"
              onClick={() => speakFromLine(0, lines)}
              style={{ backgroundColor: '#1d4ed8', color: '#ffffff' }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
              <span style={{ color: '#ffffff' }}>Mulai dari Atas</span>
            </button>
          )}

          {isSpeaking && (
            <button
              type="button"
              onClick={stopAudio}
              style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
              <span style={{ color: '#ffffff' }}>Stop Audio</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleAudioMode}
            style={{
              backgroundColor: audioMode ? '#92400e' : '#111827',
              color: '#ffffff',
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
            <span style={{ color: '#ffffff' }}>
              {audioMode ? 'Keluar Mode Audio' : 'Audio Baca Teks'}
            </span>
          </button>

          <span className="text-[11px] bg-neutral-100 text-black border border-neutral-200 px-2.5 py-1 rounded-md font-medium">
            {book.category}
          </span>
        </div>
      </div>

      {!pdfViewerSrc ? (
        <div className="flex-1 flex items-center justify-center text-white text-sm">
          File PDF untuk buku ini belum tersedia.
        </div>
      ) : !audioMode ? (
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
      ) : (
        <div className="flex-1 overflow-auto flex flex-col items-center p-4 sm:p-6 bg-neutral-200">
          <div className="mb-3 px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 shadow-xs">
            Arahkan & klik baris kalimat mana saja di bawah ini untuk langsung dibacakan dan lanjut otomatis
          </div>

          {isLoadingPage ? (
            <div className="flex items-center gap-2 text-neutral-700 text-sm my-auto">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Menyiapkan teks interaktif...</span>
            </div>
          ) : (
            <div className="relative inline-block shadow-lg bg-white">
              <canvas ref={canvasRef} className="block max-w-full h-auto" />

              <div className="absolute inset-0">
                {lines.map((line, index) => {
                  const isActive = activeLineIndex === index;
                  return (
                    <div
                      key={line.id}
                      onClick={() => speakFromLine(index, lines)}
                      style={{
                        position: 'absolute',
                        left: `${line.leftRatio * 100}%`,
                        top: `${line.topRatio * 100}%`,
                        width: `${line.widthRatio * 100}%`,
                        height: `${line.heightRatio * 100}%`,
                        backgroundColor: isActive
                          ? 'rgba(59, 130, 246, 0.35)'
                          : 'transparent',
                        borderBottom: isActive ? '2.5px solid #1d4ed8' : 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      className="hover:bg-blue-400/25"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!isClient) {
    return null;
  }

  return createPortal(readerContent, document.body);
}