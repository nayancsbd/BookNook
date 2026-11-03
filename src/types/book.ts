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
  quantity?: number;
  rating?: number;
  createdAt?: string;
}
