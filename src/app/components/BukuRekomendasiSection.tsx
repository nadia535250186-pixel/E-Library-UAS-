'use client';

import Link from 'next/link';
import { Book } from '../models/library';

interface BookShelfSectionProps {
  title: string;
  subtitle: string;
  books: Book[];
}

export default function BukuRekomendasiSection({
  title,
  subtitle,
  books,
}: BookShelfSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-heading text-base sm:text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      {books.length === 0 ? (
        <div className="border border-neutral-200 rounded-2xl p-8 text-center text-xs text-neutral-500">
          Belum ada buku yang tersedia pada kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              title={book.title}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center aspect-[3/4] p-2"
            >
              <img
                src={book.cover}
                alt={book.title}
                onError={(e) => {
                  e.currentTarget.src = '/images/default-book-cover.svg';
                }}
                className="w-full h-full object-contain rounded-lg"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}