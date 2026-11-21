'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLibrary } from '../components/LibraryProvider';
import BookCard from '../components/BookCard';
import './style.css';

export default function AllBooksPage() {
  const { books } = useLibrary();
  const [inputSearch, setInputSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(inputSearch);
  };

  const handleClearSearch = () => {
    setInputSearch('');
    setAppliedSearch('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSearch(value);
    if (value === '') {
      setAppliedSearch('');
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      b.category.toLowerCase().includes(appliedSearch.toLowerCase())
  );

  return (
    <div className="books-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Katalog Lengkap E-Library
          </h1>
          <p className="text-xs text-slate-500">
            Menampilkan {filteredBooks.length} dari {books.length} koleksi buku digital
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari judul buku..."
            value={inputSearch}
            onChange={handleInputChange}
            className="w-full pl-4 pr-20 py-2.5 text-sm bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {inputSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Hapus Pencarian"
              className="absolute right-11 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Cari Buku"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500">
            Buku dengan kata kunci &quot;{appliedSearch}&quot; tidak ditemukan.
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
