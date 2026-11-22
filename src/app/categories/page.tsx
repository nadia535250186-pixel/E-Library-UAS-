'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useLibrary } from '../components/LibraryProvider';
import BookCard from '../components/BookCard';
import './style.css';

const CATEGORIES = [
  'Bidang Ilmu Kedokteran',
  'Comic',
  'Farmasi',
  'Novel',
  'Psikologi',
];

export default function CategoriesPage() {
  const { books } = useLibrary();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES[0]
  );
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchCategory = book.category === selectedCategory;
      const matchTitle = book.title
        .toLowerCase()
        .includes(activeSearch.trim().toLowerCase());
      return matchCategory && matchTitle;
    });
  }, [books, selectedCategory, activeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
  };

  return (
    <div className="categories-page space-y-6">
      {/* Header & Kolom Pencarian */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Kategori Koleksi</h1>
          <p className="text-xs text-slate-500">
            Pilih kategori di bawah ini untuk melihat koleksi buku digital
          </p>
        </div>

        {/* Input Pencarian: Tunggu Enter atau Klik Tombol Cari */}
        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full md:w-80 bg-white border border-slate-200 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari judul buku..."
            className="flex-1 text-xs text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none pr-2"
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Hapus pencarian"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Cari buku"
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Pilihan Kategori */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
          {filteredBooks.length} Buku
        </span>
      </div>

      {/* Grid Daftar Buku */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500">
            Tidak ada buku yang cocok di kategori{' '}
            <span className="font-semibold text-slate-700">
              {selectedCategory}
            </span>
            {activeSearch ? ` untuk kata kunci "${activeSearch}"` : ''}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

