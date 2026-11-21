'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Book } from '../models/library';
import { useLibrary } from './LibraryProvider';
import './style.css';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export default function BookCard({ book, compact = false }: BookCardProps) {
  const { favorites, toggleFavorite, borrowBook, returnBook, isBorrowed } = useLibrary();

  const liked = favorites.includes(book.id);
  const borrowed = isBorrowed(book.id);

  return (
    <div className="library-book-card book-card rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group transition-all">
      <div className="book-cover-frame relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute top-2.5 left-2.5 bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-md max-w-[70%] truncate">
          {book.category}
        </span>

        <button
          onClick={() => toggleFavorite(book.id)}
          aria-label="Favorit"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 ${
              liked ? 'fill-red-500 text-red-500' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-1" title={book.title}>
          {book.title}
        </h3>

        {!compact && (
          <div className="flex flex-col gap-1.5 mt-1">
            {borrowed ? (
              <>
                <Link
                  href={`/read/${book.id}`}
                  className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
                >
                  Baca PDF
                </Link>
                <button
                  onClick={() => returnBook(book.id)}
                  className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium py-1.5 rounded-lg transition-colors"
                >
                  Kembalikan Buku
                </button>
              </>
            ) : (
              <button
                onClick={() => borrowBook(book)}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
              >
                Pinjam Buku
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
