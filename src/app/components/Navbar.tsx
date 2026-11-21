'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  FolderOpen,
  Heart,
  History,
  CreditCard,
  Info,
  Shield,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
} from 'lucide-react';
import { useLibrary } from './LibraryProvider';

export default function Navbar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    currentMember,
    logoutMember,
    favorites,
    borrowHistory,
  } = useLibrary();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (!currentMember || isAuthPage) {
    return null;
  }

  const activeBorrows = borrowHistory.filter((r) => r.status === 'Dipinjam');

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Semua Buku', href: '/books', icon: LayoutGrid },
    { label: 'Kategori', href: '/categories', icon: FolderOpen },
    {
      label: `Favorit (${favorites.length})`,
      href: '/favorit',
      icon: Heart,
    },
    {
      label: `Riwayat Saya (${activeBorrows.length})`,
      href: '/riwayat',
      icon: History,
    },
    {
      label: 'Kartu Anggota',
      href: '/kartu-anggota',
      icon: CreditCard,
    },
    {
      label: 'About',
      href: '/about',
      icon: Info,
    },
  ];

  return (
    <aside
      className={`sidebar-shell ${
        isCollapsed ? 'w-20' : 'w-64'
      } sticky top-0 h-screen shrink-0 bg-[#f4f6fb] border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 z-30 overflow-y-auto`}
    >
      <div className="p-4 space-y-6">
        <div
          className={`flex items-center pt-1 ${
            isCollapsed ? 'justify-center' : 'justify-between pl-2 pr-0'
          }`}
        >
          {!isCollapsed && (
            <Link href="/" className="text-base font-bold text-slate-800">
              Lafenadher
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? 'Perluas Menu' : 'Perkecil Menu'}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'nav-active font-semibold'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-500'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="px-2 pt-2 border-t border-slate-200/70">
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              SEDANG DIPINJAM
            </p>
            {activeBorrows.length === 0 ? (
              <p className="text-[11px] italic text-slate-400">
                Tidak ada buku dipinjam
              </p>
            ) : (
              <ul className="space-y-1.5">
                {activeBorrows.map((item) => (
                  <li key={item.bookId}>
                    <Link
                      href={`/read/${item.bookId}`}
                      className="flex items-center gap-2 text-[11px] text-slate-600 hover:text-blue-600 truncate"
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                      <span className="truncate">{item.bookTitle}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-footer p-3 border-t border-slate-200/80 space-y-2.5 mt-auto">
        <Link
          href="/admin"
          title="Panel Admin"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
            isCollapsed ? 'justify-center' : ''
          } ${
            pathname.startsWith('/admin')
              ? 'nav-active font-semibold'
              : 'text-slate-600 hover:bg-white hover:text-blue-600'
          }`}
        >
          <Shield className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Panel Admin</span>}
        </Link>

        {currentMember && !isCollapsed && (
          <div className="profile-card bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentMember.avatar}
                  alt={currentMember.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate uppercase">
                    {currentMember.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    NIM {currentMember.nim}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logoutMember}
                title="Keluar Akun"
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}