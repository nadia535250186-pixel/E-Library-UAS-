'use client';

import { useState } from 'react';
import { Trash2, Plus, Search, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useLibrary } from '../components/LibraryProvider';
import { Book } from '../models/library';

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
  const [doi, setDoi] = useState('');

  const [cover, setCover] = useState('');
  const [results, setResults] = useState<CoverResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [selectedCover, setSelectedCover] = useState(false);

  const normalizeDoiUrl = (raw: string) => {
    const cleaned = raw.trim().replace(/^doi:\s*/i, '');
    if (!cleaned) return '';
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    return `https://doi.org/${cleaned}`;
  };

  const searchCover = async () => {
    if (!title.trim() && !isbn.trim()) {
      alert('Masukkan judul buku/jurnal atau ISBN terlebih dahulu.');
      return;
    }

    setIsSearching(true);
    setSearchMessage('');
    setResults([]);
    setCover('');
    setSelectedCover(false);

    const found: CoverResult[] = [];

    // 1. Pencarian Google Books
    try {
      const query = isbn.trim()
        ? `isbn:${isbn.trim()}`
        : `intitle:${title.trim()}`;

      const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=20`;

      const response = await fetch(googleUrl);

      if (!response.ok) {
        throw new Error('Google Books tidak dapat diakses.');
      }

      const data: { items?: GoogleBookItem[] } = await response.json();

      const googleResults: CoverResult[] = (data.items || [])
        .map((item: GoogleBookItem) => {
          const info = item.volumeInfo || {};
          const image =
            info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;

          if (!image) return null;

          return {
            id: `google-${item.id}`,
            title: info.title || 'Judul tidak tersedia',
            authors: (info.authors || []).join(', ') || 'Penulis tidak tersedia',
            year: info.publishedDate || '-',
            cover: image.replace(/^http:/, 'https:'),
            source: 'Google Books',
          };
        })
        .filter((item): item is CoverResult => item !== null);

      found.push(...googleResults);
    } catch (error) {
      console.error('Google Books:', error);
    }

    // 2. Pencarian Open Library
    try {
      const openLibraryUrl = isbn.trim()
        ? `https://openlibrary.org/search.json?isbn=${encodeURIComponent(
            isbn.trim()
          )}&fields=key,title,author_name,first_publish_year,cover_i&limit=20`
        : `https://openlibrary.org/search.json?title=${encodeURIComponent(
            title.trim()
          )}&fields=key,title,author_name,first_publish_year,cover_i&limit=20`;

      const response = await fetch(openLibraryUrl);

      if (!response.ok) {
        throw new Error('Open Library tidak dapat diakses.');
      }

      const data: { docs?: OpenLibraryDoc[] } = await response.json();

      const libraryResults: CoverResult[] = (data.docs || [])
        .filter((item: OpenLibraryDoc) => Boolean(item.cover_i))
        .map((item: OpenLibraryDoc) => ({
          id: `open-${item.key}`,
          title: item.title || 'Judul tidak tersedia',
          authors:
            (item.author_name || []).join(', ') || 'Penulis tidak tersedia',
          year: item.first_publish_year?.toString() || '-',
          cover: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`,
          source: 'Open Library',
        }));

      found.push(...libraryResults);
    } catch (error) {
      console.error('Open Library:', error);
    }

    setResults(found);

    if (found.length === 0) {
      setSearchMessage(
        'Cover tidak ditemukan. Sistem akan menggunakan cover default.'
      );
      setCover(DEFAULT_COVER);
      setSelectedCover(true);
    } else {
      setSearchMessage(
        `${found.length} cover ditemukan. Pilih cover yang sesuai dengan buku.`
      );
    }

    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Judul buku / jurnal wajib diisi.');
      return;
    }

    const formattedDoi = normalizeDoiUrl(doi);
    if (!formattedDoi || !/^https?:\/\/(dx\.)?doi\.org\/10\..+/i.test(formattedDoi)) {
      alert('Masukkan link DOI yang valid (contoh: https://doi.org/10.1016/xxxx atau 10.1016/xxxx).');
      return;
    }

    const finalCover = cover || DEFAULT_COVER;

    addBook({
      title: title.trim(),
      category,
      cover: finalCover,
      pdf: formattedDoi,
      doi: formattedDoi,
      isPopular: false,
    });

    setTitle('');
    setIsbn('');
    setCategory('Bidang Ilmu Kedokteran');
    setDoi('');
    setCover('');
    setResults([]);
    setSearchMessage('');
    setSelectedCover(false);

    alert('Buku / Jurnal DOI berhasil ditambahkan ke katalog!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Panel Admin E-Library
        </h1>
        <p className="text-xs text-slate-500">
          Tambahkan koleksi buku digital & jurnal ilmiah langsung melalui Link DOI
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Judul Buku / Jurnal *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Gray's Anatomy for Students"
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
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Link / Nomor DOI *
          </label>
          <input
            type="text"
            required
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="https://doi.org/10.xxxx/xxxxx atau 10.xxxx/xxxxx"
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

          <button
            type="button"
            onClick={() => {
              setCover(DEFAULT_COVER);
              setSelectedCover(true);
              setSearchMessage('Menggunakan cover default perpustakaan.');
            }}
            className="text-xs text-slate-600 hover:text-blue-600 border border-slate-200 px-3.5 py-2.5 rounded-lg cursor-pointer"
          >
            Pakai Cover Default
          </button>
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
            Preview Cover Terpilih (Opsional — otomatis default jika tidak dipilih)
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
                  {selectedCover ? 'Cover siap digunakan' : 'Cover default'}
                </p>
                <p>Cover ini akan disimpan ke katalog buku.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-4 rounded-lg">
              <ImageIcon className="w-5 h-5" />
              Belum ada cover dipilih (akan memakai cover default saat disimpan).
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-5 py-2.5 rounded-lg cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Buku DOI ke E-Library
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 px-4">Judul</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Link DOI</th>
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
                  {book.doi ? (
                    <a
                      href={book.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                    >
                      <span className="truncate max-w-[200px]">{book.doi}</span>
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