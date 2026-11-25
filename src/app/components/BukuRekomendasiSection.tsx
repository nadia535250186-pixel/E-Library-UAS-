'use client';

import React from 'react';
import { Book } from '../models/library';

interface BukuRekomendasiSectionProps {
  title: string;
  subtitle: string;
  books: Book[];
}

export default function BukuRekomendasiSection({
  title,
  subtitle,
  books,
}: BukuRekomendasiSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-heading text-lg sm:text-xl font-bold text-slate-900">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl p-3 border border-[#e6dccb] shadow-sm select-none cursor-default"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full aspect-[3/4] object-cover rounded-xl block"
            />
          </div>
        ))}
      </div>
    </section>
  );
}