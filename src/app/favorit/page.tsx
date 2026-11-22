'use client';

import { useLibrary } from '../components/LibraryProvider';
import BookCard from '../components/BookCard';
import './style.css';

export default function FavoritePage() {
  const { books, favorites, currentMember } = useLibrary();

  if (!currentMember) return null;

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  return (
    <div className="favorite-page space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Buku Favorit {currentMember.name}
        </h1>
        <p className="text-xs text-slate-500">
          Koleksi pribadi yang ditandai favorit ({favoriteBooks.length} buku)
        </p>
      </div>

      {favoriteBooks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500">Belum ada buku yang ditandai favorit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

