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
  isSwitchingAccount: boolean;
  switchMember: (memberId: string) => void;
  registerMember: (data: RegisterPayload) => { ok: boolean; message?: string };
  loginWithEmail: (
    emailOrNim: string,
    password: string
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

const BOOKS_STORAGE_KEY = 'lafenandher_books_v2';
const MEMBERS_STORAGE_KEY = 'lafenandher_members_v2';

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

  const [allHistory, setAllHistory] = useState<BorrowRecord[]>([
    {
      memberId: 'm3',
      bookId: 'med-1',
      bookTitle: 'Biokimia Harper',
      bookCover: '/covers/Biokimia-Harper-Ed-27.webp',
      borrowDate: '14 Nov 2026, 18:20',
      returnDate: null,
      status: 'Dipinjam',
    },
    {
      memberId: 'm3',
      bookId: 'med-2',
      bookTitle: 'Company Profile Medis',
      bookCover: '/covers/contemporary-dental-pharmacology.png',
      borrowDate: '14 Nov 2026, 18:20',
      returnDate: null,
      status: 'Dipinjam',
    },
  ]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedMember = localStorage.getItem(
          'lafenandher_active_member'
        );
        const savedMembers = localStorage.getItem(MEMBERS_STORAGE_KEY);
        const savedFavs = localStorage.getItem('lafenandher_favs_v2');
        const savedHistory = localStorage.getItem('lafenandher_history_v2');
        const savedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);

        if (savedMember !== null) {
          setCurrentMemberId(savedMember === '' ? null : savedMember);
        }

        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        }

        if (savedFavs) {
          setFavoritesByMember(JSON.parse(savedFavs));
        }

        if (savedHistory) {
          setAllHistory(JSON.parse(savedHistory));
        }

        if (savedBooks) {
          setBooks(JSON.parse(savedBooks));
        } else {
          localStorage.removeItem('lafenandher_books');
        }
      } catch (error) {
        console.error('Gagal memuat data perpustakaan:', error);
      } finally {
        setIsLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      'lafenandher_active_member',
      currentMemberId ?? ''
    );
  }, [currentMemberId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  }, [members, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      'lafenandher_favs_v2',
      JSON.stringify(favoritesByMember)
    );
  }, [favoritesByMember, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      'lafenandher_history_v2',
      JSON.stringify(allHistory)
    );
  }, [allHistory, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  }, [books, isLoaded]);

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
  };

  const clearHistory = () => {
    if (!currentMember) return;

    setAllHistory((prev) =>
      prev.filter(
        (rec) =>
          !(rec.memberId === currentMember.id && rec.status === 'Dikembalikan')
      )
    );
  };

  const addBook = (newBook: Omit<Book, 'id'>) => {
    const book: Book = {
      ...newBook,
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    setBooks((prev) => [book, ...prev]);
  };

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        currentMember,
        isSwitchingAccount,
        switchMember,
        registerMember,
        loginWithEmail,
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
    throw new Error(
      'useLibrary must be used within LibraryProvider'
    );
  }

  return context;
};