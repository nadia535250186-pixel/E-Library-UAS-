'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { Book, BorrowRecord, Member } from '../models/library';
import { initialBooks, DEFAULT_MEMBERS } from '../../data/libraryData';

interface RegisterPayload {
  name: string;
  nim: string;
  email: string;
  password: string;
}

interface LibraryContextType {
  books: Book[];
  members: Member[];
  currentMember: Member | null;
  isLoaded: boolean;
  isSwitchingAccount: boolean;
  switchMember: (memberId: string) => void;
  registerMember: (data: RegisterPayload) => { ok: boolean; message?: string };
  loginWithEmail: (
    emailOrNim: string,
    password: string
  ) => { ok: boolean; message?: string };
  resetPassword: (
    nim: string,
    email: string,
    newPassword: string
  ) => { ok: boolean; message?: string };
  logoutMember: () => void;
  favorites: string[];
  borrowHistory: BorrowRecord[];
  toggleFavorite: (bookId: string) => void;
  borrowBook: (book: Book) => void;
  returnBook: (bookId: string) => void;
  clearHistory: () => void;
  isBorrowed: (bookId: string) => boolean;
  addBook: (newBook: Omit<Book, 'id'>) => void;
  deleteBook: (bookId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(
  undefined
);

const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY || 'lafenandher-uas-secret-2026';

async function syncToMongo(action: string, payload: unknown) {
  try {
    await fetch('/api/library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ action, payload }),
    });
  } catch (err) {
    console.error(`Gagal sinkronisasi (${action}) ke MongoDB:`, err);
  }
}

export function LibraryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [favoritesByMember, setFavoritesByMember] = useState<
    Record<string, string[]>
  >({
    m3: ['med-1', 'med-2', 'med-3'],
  });

  const [allHistory, setAllHistory] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const savedMember = localStorage.getItem('lafenandher_active_member');
        const savedFavs = localStorage.getItem('lafenandher_favs_v2');

        if (savedMember !== null) {
          setCurrentMemberId(savedMember === '' ? null : savedMember);
        }
        if (savedFavs) {
          setFavoritesByMember(JSON.parse(savedFavs));
        }

        const res = await fetch('/api/library', {
          headers: { 'x-api-key': API_KEY },
        });

        if (res.ok && active) {
          const data = await res.json();
          if (Array.isArray(data.books) && data.books.length > 0) {
            const normalizedBooks = data.books.map(
              (b: Book & { _id?: string }) => ({
                ...b,
                id: b.id || String(b._id),
              })
            );
            setBooks(normalizedBooks);
          }
          if (Array.isArray(data.members) && data.members.length > 0) {
            const merged = data.members.map(
              (m: Member & { _id?: string }) => {
                const normalizedMember = {
                  ...m,
                  id: m.id || String(m._id),
                };
                const def = DEFAULT_MEMBERS.find(
                  (d) => d.nim === normalizedMember.nim
                );
                return def
                  ? {
                      ...def,
                      ...normalizedMember,
                      email: normalizedMember.email || def.email,
                    }
                  : normalizedMember;
              }
            );
            setMembers(merged);
          }
          if (Array.isArray(data.history)) {
            setAllHistory(data.history);
          }
        }
      } catch (error) {
        console.error('Gagal memuat data dari MongoDB:', error);
      } finally {
        if (active) setIsLoaded(true);
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lafenandher_active_member', currentMemberId ?? '');
  }, [currentMemberId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      'lafenandher_favs_v2',
      JSON.stringify(favoritesByMember)
    );
  }, [favoritesByMember, isLoaded]);

  const currentMember =
    members.find((m) => m.id === currentMemberId) || null;

  const favorites = currentMember
    ? favoritesByMember[currentMember.id] || []
    : [];

  const borrowHistory = currentMember
    ? allHistory.filter((r) => r.memberId === currentMember.id)
    : [];

  const switchMember = (memberId: string) => {
    if (memberId === currentMemberId) return;
    setIsSwitchingAccount(true);
    setTimeout(() => {
      setCurrentMemberId(memberId);
      setIsSwitchingAccount(false);
    }, 600);
  };

  const registerMember = ({
    name,
    nim,
    email,
    password,
  }: RegisterPayload) => {
    const cleanNim = nim.trim();
    const cleanEmail = email.trim().toLowerCase();

    const exists = members.some(
      (m) =>
        m.nim === cleanNim ||
        (m.email && m.email.toLowerCase() === cleanEmail)
    );

    if (exists) {
      return {
        ok: false,
        message: 'NIM atau Email sudah terdaftar. Silakan Login.',
      };
    }

    const today = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      nim: cleanNim,
      email: cleanEmail,
      password,
      phone: '-',
      avatar: '/icons/profile1.png',
      role: 'Anggota E-Library',
      joinDate: today,
    };

    setMembers((prev) => [...prev, newMember]);
    setCurrentMemberId(newMember.id);
    syncToMongo('REGISTER_MEMBER', newMember);

    return { ok: true };
  };

  const loginWithEmail = (emailOrNim: string, password: string) => {
    const query = emailOrNim.trim().toLowerCase();

    const found = members.find(
      (m) =>
        m.nim.toLowerCase() === query ||
        (m.email && m.email.toLowerCase() === query)
    );

    if (!found) {
      return {
        ok: false,
        message: 'Akun tidak ditemukan. Silakan Register terlebih dahulu.',
      };
    }

    if (found.password && found.password !== password) {
      return {
        ok: false,
        message: 'Password yang Anda masukkan salah.',
      };
    }

    setCurrentMemberId(found.id);
    return { ok: true };
  };

  const resetPassword = (
    nim: string,
    email: string,
    newPassword: string
  ) => {
    const cleanNim = nim.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    const found = members.find((member) => {
      const def = DEFAULT_MEMBERS.find((d) => d.nim === member.nim);
      const memberEmail = (member.email || def?.email || '').toLowerCase();
      return (
        member.nim.trim().toLowerCase() === cleanNim &&
        memberEmail === cleanEmail
      );
    });

    if (!found) {
      return {
        ok: false,
        message: 'NIM atau Email tidak ditemukan atau tidak cocok.',
      };
    }

    const def = DEFAULT_MEMBERS.find((d) => d.nim === found.nim);
    const updatedEmail = found.email || def?.email || cleanEmail;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === found.id
          ? { ...member, email: updatedEmail, password: newPassword }
          : member
      )
    );

    syncToMongo('RESET_PASSWORD', {
      id: found.id,
      email: updatedEmail,
      password: newPassword,
    });

    return {
      ok: true,
      message: 'Password berhasil diubah. Silakan Login.',
    };
  };

  const logoutMember = () => {
    setIsSwitchingAccount(true);
    setTimeout(() => {
      setCurrentMemberId(null);
      setIsSwitchingAccount(false);
    }, 400);
  };

  const toggleFavorite = (bookId: string) => {
    if (!currentMember) return;

    setFavoritesByMember((prev) => {
      const currentFavs = prev[currentMember.id] || [];
      const updated = currentFavs.includes(bookId)
        ? currentFavs.filter((id) => id !== bookId)
        : [...currentFavs, bookId];

      return {
        ...prev,
        [currentMember.id]: updated,
      };
    });
  };

  const isBorrowed = (bookId: string) => {
    return borrowHistory.some(
      (r) => r.bookId === bookId && r.status === 'Dipinjam'
    );
  };

  const borrowBook = (book: Book) => {
    if (!currentMember || isBorrowed(book.id)) return;

    const now = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: BorrowRecord = {
      memberId: currentMember.id,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.cover,
      borrowDate: now,
      returnDate: null,
      status: 'Dipinjam',
    };

    setAllHistory((prev) => [newRecord, ...prev]);
    syncToMongo('BORROW_BOOK', newRecord);
  };

  const returnBook = (bookId: string) => {
    if (!currentMember) return;

    const now = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setAllHistory((prev) =>
      prev.map((rec) =>
        rec.memberId === currentMember.id &&
        rec.bookId === bookId &&
        rec.status === 'Dipinjam'
          ? {
              ...rec,
              status: 'Dikembalikan',
              returnDate: now,
            }
          : rec
      )
    );

    syncToMongo('RETURN_BOOK', {
      memberId: currentMember.id,
      bookId,
      returnDate: now,
    });
  };

  const clearHistory = () => {
    if (!currentMember) return;

    setAllHistory((prev) =>
      prev.filter(
        (rec) =>
          !(rec.memberId === currentMember.id && rec.status === 'Dikembalikan')
      )
    );

    syncToMongo('CLEAR_HISTORY', { memberId: currentMember.id });
  };

  const addBook = (newBook: Omit<Book, 'id'>) => {
    const book: Book = {
      ...newBook,
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    setBooks((prev) => [book, ...prev]);
    syncToMongo('ADD_BOOK', book);
  };

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    syncToMongo('DELETE_BOOK', { bookId });
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        currentMember,
        isLoaded,
        isSwitchingAccount,
        switchMember,
        registerMember,
        loginWithEmail,
        resetPassword,
        logoutMember,
        favorites,
        borrowHistory,
        toggleFavorite,
        borrowBook,
        returnBook,
        clearHistory,
        isBorrowed,
        addBook,
        deleteBook,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }

  return context;
};