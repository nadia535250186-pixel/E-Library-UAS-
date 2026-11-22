export interface Book {
  id: string;
  title: string;
  category: string;
  cover: string;
  pdf: string;
  doi?: string;
  isPopular?: boolean;
}

export interface Member {
  id: string;
  name: string;
  nim: string;
  phone: string;
  email?: string;
  password?: string;
  avatar: string;
  role: string;
  joinDate: string;
}

export interface BorrowRecord {
  memberId: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  borrowDate: string;
  returnDate: string | null;
  status: 'Dipinjam' | 'Dikembalikan';
}
