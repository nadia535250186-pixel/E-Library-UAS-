'use client';

import { useState } from 'react';
import {
  Trash2,
  Plus,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { useLibrary } from '../components/LibraryProvider';
import { Book } from '../models/library';
import './style.css';

interface CoverResult {
  id: string;
  title: string;
  authors: string;
  year: string;
  cover: string;
  source: string;
}

interface GoogleBookItem {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}

interface OpenLibraryDoc {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

const DEFAULT_COVER = '/images/default-book-cover.svg';

export default function AdminPage() {
  const { books, addBook, deleteBook } = useLibrary();

  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState<Book['category']>(
    'Bidang Ilmu Kedokteran'
  );
  const [pdfUrl, setPdfUrl] = useState('');

  const [cover, setCover] = useState('');
  const [results, setResults] = useState<CoverResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [selectedCover, setSelectedCover] = useState(false);

  const handleManualCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCover(reader.result);
        setSelectedCover(true);
        setSearchMessage(`Menggunakan cover unggahan: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const searchCover = async () => {
    if (!title.trim() && !isbn.trim()) {
      alert('Masukkan judul buku atau ISBN terlebih dahulu.');
      return;
    }

    setIsSearching(true);
    setSearchMessage('');
    setResults([]);
    setCover('');
    setSelectedCover(false);

    const found: CoverResult[] = [];
    const seenCovers = new Set<string>();

    const fetchGoogle = async (query: string) => {
      try {
        const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=15`;
        const response = await fetch(googleUrl);
        if (!response.ok) return;

        const data: { items?: GoogleBookItem[] } = await response.json();
        (data.items || []).forEach((item: GoogleBookItem) => {
          const info = item.volumeInfo || {};
          const image =
            info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
          if (!image) return;

          const secureImg = image.replace(/^http:/, 'https:');
          if (seenCovers.has(secureImg)) return;
          seenCovers.add(secureImg);

          found.push({
            id: `google-${item.id}`,
            title: info.title || 'Judul tidak tersedia',
            authors: (info.authors || []).join(', ') || 'Penulis tidak tersedia',
            year: info.publishedDate || '-',
            cover: secureImg,
            source: 'Google Books',
          });
        });
      } catch (error) {
        console.error('Google Books:', error);
      }
    };

    const fetchOpenLibrary = async (params: string) => {
      try {
        const openLibraryUrl = `https://openlibrary.org/search.json?${params}&fields=key,title,author_name,first_publish_year,cover_i&limit=15`;
        const response = await fetch(openLibraryUrl);
        if (!response.ok) return;

        const data: { docs?: OpenLibraryDoc[] } = await response.json();
        (data.docs || []).forEach((item: OpenLibraryDoc) => {
          if (!item.cover_i) return;
          const coverUrl = `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`;
          if (seenCovers.has(coverUrl)) return;
          seenCovers.add(coverUrl);

          found.push({
            id: `open-${item.key}`,
            title: item.title || 'Judul tidak tersedia',
            authors:
              (item.author_name || []).join(', ') || 'Penulis tidak tersedia',
            year: item.first_publish_year?.toString() || '-',
            cover: coverUrl,
            source: 'Open Library',
          });
        });
      } catch (error) {
        console.error('Open Library:', error);
      }
    };

    // 1. Cari berdasarkan ISBN jika diisi
    if (isbn.trim()) {
      const cleanIsbn = isbn.trim().replace(/[^0-9Xx]/g, '');
      await Promise.all([
        fetchGoogle(`isbn:${cleanIsbn}`),
        fetchOpenLibrary(`isbn=${encodeURIComponent(cleanIsbn)}`),
      ]);
    }

    // 2. Jika ISBN kosong atau tidak menghasilkan cover, otomatis cari berdasarkan Judul Buku
    if (found.length === 0 && title.trim()) {
      await Promise.all([
        fetchGoogle(`intitle:${title.trim()}`),
        fetchOpenLibrary(`title=${encodeURIComponent(title.trim())}`),
      ]);
    }

    setResults(found);

    if (found.length === 0) {
      setSearchMessage(
        'Cover tidak ditemukan. Silakan unggah cover secara manual melalui tombol Upload Cover.'
      );
    } else {
      setSearchMessage(
        `${found.length} cover ditemukan. Klik salah satu gambar cover di bawah untuk memilih.`
      );
    }

    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Judul buku wajib diisi.');
      return;
    }

    const cleanedUrl = pdfUrl.trim();
    if (!cleanedUrl || !/^https?:\/\/.+/i.test(cleanedUrl)) {
      alert(
        'Masukkan URL PDF yang valid (contoh: https://arxiv.org/pdf/1805.05288.pdf).'
      );
      return;
    }

    const finalCover = cover || DEFAULT_COVER;

    addBook({
      title: title.trim(),
      category,
      cover: finalCover,
      pdf: cleanedUrl,
      isPopular: false,
    });

    setTitle('');
    setIsbn('');
    setCategory('Bidang Ilmu Kedokteran');
    setPdfUrl('');
    setCover('');
    setResults([]);
    setSearchMessage('');
    setSelectedCover(false);

    alert('Buku berhasil ditambahkan ke katalog E-Library!');
  };

  return (
    <div className="admin-page space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Panel Admin E-Library
        </h1>
        <p className="text-xs text-slate-500">
          Tambahkan koleksi buku digital melalui URL PDF langsung dan pilih cover otomatis
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Judul Buku *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Drug Discovery and Computational Pharmacology"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Book['category'])
            }
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Bidang Ilmu Kedokteran">
              Bidang Ilmu Kedokteran
            </option>
            <option value="Comic">Comic</option>
            <option value="Farmasi">Farmasi</option>
            <option value="Novel">Novel</option>
            <option value="Psikologi">Psikologi</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            URL PDF Langsung *
          </label>
          <input
            type="url"
            required
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="https://arxiv.org/pdf/1805.05288.pdf"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            ISBN (Opsional untuk mencari cover)
          </label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Masukkan ISBN buku jika tersedia"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={searchCover}
            disabled={isSearching}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer"
          >
            {isSearching ? (
              <>
                <span className="animate-spin">◌</span>
                Mencari Cover...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Cari Cover Otomatis
              </>
            )}
          </button>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-400 px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Cover</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleManualCoverUpload}
              className="hidden"
            />
          </label>
        </div>

        {searchMessage && (
          <div className="md:col-span-2 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg">
            {searchMessage}
          </div>
        )}

        {results.length > 0 && (
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Pilih Cover Buku
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {results.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setCover(item.cover);
                    setSelectedCover(true);
                  }}
                  className={`text-left border rounded-xl p-2 transition-all cursor-pointer ${
                    cover === item.cover
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-44 object-contain bg-slate-50 rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_COVER;
                    }}
                  />

                  <p className="text-xs font-semibold text-slate-700 mt-2 line-clamp-2">
                    {item.title}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {item.authors}
                  </p>

                  <p className="text-[10px] text-blue-600 mt-1">
                    {item.source}
                  </p>

                  <p className="text-[10px] text-slate-400">{item.year}</p>

                  {cover === item.cover && selectedCover && (
                    <span className="block text-[10px] text-blue-700 font-bold mt-2">
                      ✓ Dipilih
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="md:col-span-2 border-t border-slate-100 pt-4">
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Preview Cover Terpilih
          </label>

          {cover ? (
            <div className="flex items-center gap-4">
              <img
                src={cover}
                alt="Preview cover buku"
                className="w-24 h-32 object-contain rounded-lg border border-slate-200 bg-slate-50"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_COVER;
                }}
              />
              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">
                  Cover siap digunakan
                </p>
                <p>Cover ini akan disimpan ke katalog buku.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-4 rounded-lg">
              <ImageIcon className="w-5 h-5" />
              Belum ada cover dipilih.
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-5 py-2.5 rounded-lg cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Buku ke E-Library
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 px-4">Judul</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">URL PDF</th>
              <th className="py-3 px-4 text-right">Hapus</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {books.map((book) => (
              <tr key={book.id}>
                <td className="py-3 px-4 font-medium text-slate-800">
                  {book.title}
                </td>
                <td className="py-3 px-4 text-slate-500">{book.category}</td>
                <td className="py-3 px-4">
                  {book.pdf.startsWith('http') ? (
                    <a
                      href={book.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                    >
                      <span className="truncate max-w-[220px]">{book.pdf}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-400">PDF Lokal</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus buku "${book.title}"?`)) {
                        deleteBook(book.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    aria-label={`Hapus ${book.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
