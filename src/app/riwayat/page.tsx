'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useLibrary } from '../components/LibraryProvider';
import './style.css';

export default function HistoryPage() {
  const { borrowHistory, returnBook, clearHistory, currentMember } = useLibrary();

  if (!currentMember) return null;

  const hasReturnedHistory = borrowHistory.some(
    (item) => item.status === 'Dikembalikan'
  );

  const handleClearHistory = () => {
    if (
      confirm(
        'Hapus semua riwayat buku yang sudah dikembalikan? (Buku yang sedang dipinjam tidak akan dihapus)'
      )
    ) {
      clearHistory();
    }
  };

  return (
    <div className="history-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Riwayat Bacaan & Peminjaman: {currentMember.name}
          </h1>
          <p className="text-xs text-slate-500">
            NIM {currentMember.nim} • Riwayat bersifat pribadi dan terpisah dari akun anggota lain
          </p>
        </div>

        {hasReturnedHistory && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Riwayat</span>
          </button>
        )}
      </div>

      {borrowHistory.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500">
            Belum ada riwayat peminjaman atau bacaan.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase bg-slate-50">
                  <th className="py-3.5 px-4">Judul Buku</th>
                  <th className="py-3.5 px-4">Tanggal Pinjam</th>
                  <th className="py-3.5 px-4">Tanggal Kembali</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {borrowHistory.map((item, idx) => (
                  <tr key={`${item.bookId}-${idx}`} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.bookCover}
                          alt={item.bookTitle}
                          className="w-9 h-12 object-cover rounded shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{item.bookTitle}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{item.bookId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.borrowDate}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.returnDate || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          item.status === 'Dipinjam'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {item.status === 'Dipinjam' && (
                        <>
                          <Link
                            href={`/read/${item.bookId}`}
                            className="inline-block px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                          >
                            Baca PDF
                          </Link>
                          <button
                            onClick={() => returnBook(item.bookId)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium cursor-pointer"
                          >
                            Kembalikan
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
