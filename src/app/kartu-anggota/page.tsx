'use client';

import { Printer } from 'lucide-react';
import { useLibrary } from '../components/LibraryProvider';

export default function MemberCardPage() {
  const { currentMember, members, switchMember, borrowHistory, favorites } = useLibrary();

  if (!currentMember) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Kartu Tanda Anggota (KTA)
          </h1>
          <p className="text-xs text-slate-500">
            Identitas resmi keanggotaan digital Lafenandher E-Library
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-sm print:hidden self-start cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Kartu (PDF/Print)</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#1e40af] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-5">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-blue-200">
              Kartu Anggota Perpustakaan Digital
            </p>
            <h2 className="text-lg font-bold tracking-wide">
              LAFENANDHER E-LIBRARY
            </h2>
          </div>
          <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            AKTIF
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          <img
            src={currentMember.avatar}
            alt={currentMember.name}
            className="w-24 h-24 rounded-xl object-cover border-2 border-white/40 bg-white shrink-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 flex-1 text-left w-full">
            <div>
              <p className="text-[10px] text-blue-200 uppercase">Nama Lengkap Anggota</p>
              <p className="font-bold text-sm">{currentMember.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase">No. Telepon</p>
              <p className="font-semibold text-sm">{currentMember.phone}</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase">NIM / ID Anggota</p>
              <p className="font-semibold text-sm">{currentMember.nim}</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase">Terdaftar Sejak</p>
              <p className="font-semibold text-sm">{currentMember.joinDate}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] text-blue-200 uppercase">Status / Jabatan</p>
              <p className="font-semibold text-sm">{currentMember.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-blue-200 font-mono">
          <span>NO. KTA: LFM-{currentMember.nim}</span>
          <span>|||| |||| || ||| |||| |||</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Total Riwayat Pinjam</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {borrowHistory.length} Buku
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Koleksi Buku Favorit</p>
          <p className="text-lg font-bold text-amber-600 mt-1">
            {favorites.length} Buku
          </p>
        </div>
      </div>

      <div className="space-y-3 print:hidden">
        <h2 className="text-sm font-bold text-slate-700">
          Daftar Anggota Terdaftar ({members.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((member) => {
            const isSelected = member.id === currentMember.id;
            return (
              <button
                key={member.id}
                onClick={() => switchMember(member.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-300 shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-500">NIM: {member.nim}</p>
                  <p className="text-[10px] text-blue-600 font-medium truncate">
                    {member.role}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}