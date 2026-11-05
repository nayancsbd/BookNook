export type BookCategory =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Others"
  | string;

export interface Book {
  _id: string;
  id?: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description?: string;
  totalCopies?: number;
  copies?: number;
  quantity?: number;
  rating?: number;
  userName?: string;
  userEmail?: string;
  addedBy?: string;
  addedByEmail?: string;
  addedByName?: string;
  createdAt?: string;
}

export interface BorrowRecord {
  _id: string;
  id?: string;
  bookId: string;
  bookTitle?: string;
  title?: string;
  bookImage?: string;
  image?: string;
  category?: string;
  userEmail: string;
  userName?: string;
  borrowDate?: string;
  borrowedAt?: string;
  createdAt?: string;
  returnDate: string;
  dueDate?: string;
}

