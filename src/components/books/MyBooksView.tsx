"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Book } from "@/types/book";
import { useAuth } from "@/context/AuthContext";
import { useApiToken } from "@/hooks/useApiToken";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import {
  FiBookOpen,
  FiEdit2,
  FiTrash2,
  FiPlusCircle,
  FiAlertTriangle,
  FiX,
  FiUser,
  FiLayers,
  FiHash,
  FiFileText,
  FiImage,
} from "react-icons/fi";

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export function MyBooksView() {
  const { user } = useAuth();
  const fetchToken = useApiToken();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("Fiction");
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState("1");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMyBooks() {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const baseUrl = rawApiUrl.replace(/\/+$/, "");
        const targetUrl = baseUrl.endsWith("/api")
          ? `${baseUrl}/books?addedBy=${encodeURIComponent(user.email)}`
          : `${baseUrl}/api/books?addedBy=${encodeURIComponent(user.email)}`;

        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          const items: Book[] = Array.isArray(data)
            ? data
            : data.books || data.data || [];

          if (isMounted) {
            setBooks(items);
            setIsLoading(false);
            return;
          }
        }
      } catch {
      }

      if (isMounted) {
        const fallbackBooks: Book[] = [
          {
            _id: "my_b_01",
            title: "The Midnight Library",
            author: "Matt Haig",
            category: "Fiction",
            image:
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
            description:
              "Between life and death there is a library containing infinite books, each telling the story of another reality you could have lived.",
            quantity: 3,
            userName: user.name,
            userEmail: user.email,
          },
          {
            _id: "my_b_02",
            title: "The Little Prince",
            author: "Antoine de Saint-Exupéry",
            category: "Kids",
            image:
              "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
            description:
              "A poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.",
            quantity: 2,
            userName: user.name,
            userEmail: user.email,
          },
        ];

        setBooks(fallbackBooks);
        setIsLoading(false);
      }
    }

    loadMyBooks();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title || "");
    setEditAuthor(book.author || "");
    setEditCategory(book.category || "Fiction");
    setEditDescription(book.description || "");
    setEditQuantity(
      String(book.totalCopies ?? book.copies ?? book.quantity ?? 1)
    );
    setEditImagePreview(book.image || null);
    setEditImageFile(null);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", {
        description: "Please select an image file (PNG, JPG, JPEG, or WEBP).",
      });
      return;
    }

    setEditImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setEditImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    if (!editTitle.trim()) {
      toast.error("Missing Title", { description: "Please enter the book title." });
      return;
    }

    if (!editAuthor.trim()) {
      toast.error("Missing Author", { description: "Please enter the author name." });
      return;
    }

    const copiesCount = Number(editQuantity);
    if (isNaN(copiesCount) || copiesCount < 1) {
      toast.error("Invalid Quantity", { description: "Total copies must be at least 1." });
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = editImagePreview || editingBook.image;
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

      if (editImageFile && imgbbKey) {
        const formData = new FormData();
        formData.append("image", editImageFile);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: "POST",
          body: formData,
        });

        const imgbbData = await imgbbRes.json();
        if (imgbbData?.data?.url) {
          finalImageUrl = imgbbData.data.url;
        }
      }

      const token = await fetchToken();
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = rawApiUrl.replace(/\/+$/, "");
      const bookId = editingBook._id || editingBook.id;

      const targetUrl = baseUrl.endsWith("/api")
        ? `${baseUrl}/books/${bookId}`
        : `${baseUrl}/api/books/${bookId}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const updatePayload = {
        title: editTitle.trim(),
        author: editAuthor.trim(),
        category: editCategory,
        description: editDescription.trim(),
        totalCopies: copiesCount,
        copies: copiesCount,
        quantity: copiesCount,
        image: finalImageUrl,
      };

      const res = await fetch(targetUrl, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || `Server returned error status: ${res.status}`);
      }

      setBooks((prev) =>
        prev.map((b) =>
          (b._id || b.id) === bookId
            ? {
                ...b,
                ...updatePayload,
              }
            : b
        )
      );

      toast.success("Book Updated Successfully!", {
        description: `"${editTitle.trim()}" has been updated on your curator shelf.`,
      });

      setEditingBook(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update book.";
      toast.error("Update Failed", { description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (book: Book) => {
    setDeletingBook(book);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setIsDeleting(true);

    try {
      const token = await fetchToken();
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = rawApiUrl.replace(/\/+$/, "");
      const bookId = deletingBook._id || deletingBook.id;

      const targetUrl = baseUrl.endsWith("/api")
        ? `${baseUrl}/books/${bookId}`
        : `${baseUrl}/api/books/${bookId}`;

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(targetUrl, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || `Server returned error status: ${res.status}`);
      }

      const deletedTitle = deletingBook.title;
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
      setDeletingBook(null);

      toast.success("Book Removed", {
        description: `"${deletedTitle}" was removed from the sanctuary shelves.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete book.";
      toast.error("Delete Failed", { description: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
        <Spinner size="lg" label="Retrieving your contributed books..." />
      </div>
    );
  }

  return (
    <div className="booknook-section">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-base-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold tracking-wider uppercase font-sans mb-2">
              <FiBookOpen className="w-3.5 h-3.5" />
              <span>Curator Dashboard</span>
            </div>
            <Heading as="h1" size="hero" className="text-3xl sm:text-4xl">
              My Contributed Books
            </Heading>
            <p className="text-sm text-base-content/75 font-sans mt-1">
              Manage the volumes you have contributed to the community reading catalog.
            </p>
          </div>

          <Button
            href="/add-book"
            variant="primary"
            size="md"
            icon={<FiPlusCircle className="w-4 h-4" />}
            iconPosition="left"
            className="shadow-sm"
          >
            Add Another Book
          </Button>
        </div>

        {books.length === 0 ? (
          <div className="rounded-3xl border border-base-300 bg-base-100 p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl mb-4">
              <FiBookOpen />
            </div>
            <h3 className="font-serif font-bold text-2xl text-base-content mb-2">
              Your Curator Shelf is Empty
            </h3>
            <p className="text-sm text-base-content/75 font-sans leading-relaxed max-w-md mx-auto mb-6">
              You haven&apos;t added any books to the BookNook sanctuary yet. Share a treasured volume from your collection to help fellow readers discover its story.
            </p>
            <Button
              href="/add-book"
              variant="primary"
              size="md"
              icon={<FiPlusCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              Contribute Your First Book
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden md:block rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full font-sans">
                  <thead className="bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    <tr>
                      <th className="py-4 pl-6">Book Edition</th>
                      <th className="py-4">Category</th>
                      <th className="py-4">Total Copies</th>
                      <th className="py-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-base-300/60">
                    {books.map((book) => {
                      const bookId = book._id || book.id;
                      return (
                        <tr key={bookId} className="hover:bg-base-200/30 transition-colors">
                          <td className="py-4 pl-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-16 rounded-lg overflow-hidden bg-base-300 shrink-0 aspect-[3/4] border border-base-300 shadow-xs relative">
                                {book.image ? (
                                  <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs font-serif font-bold">
                                    📖
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/books/${bookId}`}
                                  className="font-serif font-bold text-base text-base-content hover:text-primary transition-colors block line-clamp-1"
                                >
                                  {book.title}
                                </Link>
                                <span className="text-xs text-base-content/65 font-sans block truncate mt-0.5">
                                  by {book.author}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4">
                            <span className="badge badge-sm font-sans font-medium bg-secondary/15 text-secondary border border-secondary/25">
                              {book.category}
                            </span>
                          </td>

                          <td className="py-4 font-semibold text-base-content">
                            {book.quantity ?? 1} {book.quantity === 1 ? "Copy" : "Copies"}
                          </td>

                          <td className="py-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(book)}
                                className="btn btn-sm btn-ghost border border-base-300 hover:border-primary hover:bg-primary/10 text-primary rounded-xl gap-1.5"
                                aria-label={`Edit ${book.title}`}
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDelete(book)}
                                className="btn btn-sm btn-ghost border border-base-300 hover:border-error hover:bg-error/10 text-error rounded-xl gap-1.5"
                                aria-label={`Delete ${book.title}`}
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {books.map((book) => {
                const bookId = book._id || book.id;
                return (
                  <div
                    key={bookId}
                    className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-22 rounded-xl overflow-hidden bg-base-300 shrink-0 aspect-[3/4] border border-base-300 shadow-xs">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs font-serif font-bold">
                            📖
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/books/${bookId}`}
                          className="font-serif font-bold text-base text-base-content hover:text-primary transition-colors block line-clamp-1"
                        >
                          {book.title}
                        </Link>
                        <span className="text-xs text-base-content/65 font-sans block truncate mt-0.5">
                          by {book.author}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="badge badge-xs font-sans text-secondary bg-secondary/10 border-secondary/20">
                            {book.category}
                          </span>
                          <span className="text-xs text-base-content/75 font-sans font-medium">
                            {book.quantity ?? 1} in stock
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-base-300/70">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(book)}
                        className="btn btn-sm btn-outline border-base-300 hover:border-primary text-primary hover:bg-primary/10 rounded-xl justify-center"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDelete(book)}
                        className="btn btn-sm btn-outline border-base-300 hover:border-error text-error hover:bg-error/10 rounded-xl justify-center"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {editingBook && (
        <dialog className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="modal-box rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60 hover:text-base-content"
              aria-label="Close edit modal"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-xs shrink-0">
                <FiEdit2 />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-base-content">
                  Edit Book Details
                </h3>
                <p className="text-xs text-base-content/70 font-sans">
                  Update edition details in the sanctuary catalog.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4" noValidate>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5">
                  <FiBookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>Book Title</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input input-bordered w-full bg-base-100 border-base-300 font-sans text-sm rounded-xl h-11 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5 text-primary" />
                  <span>Author Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="input input-bordered w-full bg-base-100 border-base-300 font-sans text-sm rounded-xl h-11 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5">
                    <FiLayers className="w-3.5 h-3.5 text-secondary" />
                    <span>Category</span>
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="select select-bordered w-full bg-base-100 border-base-300 font-sans text-sm rounded-xl h-11 focus:border-primary"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5">
                    <FiHash className="w-3.5 h-3.5 text-secondary" />
                    <span>Total Copies</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="input input-bordered w-full bg-base-100 border-base-300 font-sans text-sm rounded-xl h-11 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5">
                  <FiImage className="w-3.5 h-3.5 text-accent" />
                  <span>Cover Image (Optional update)</span>
                </label>

                <div className="p-3 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-base-300 shrink-0 aspect-[3/4] border border-base-300">
                      {editImagePreview ? (
                        <img
                          src={editImagePreview}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs">
                          📖
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-base-content/70 font-sans">
                      <span className="font-semibold block text-base-content">
                        {editImageFile ? editImageFile.name : "Current cover photo"}
                      </span>
                      <span>Click below to choose a new file</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="btn btn-sm btn-outline border-base-300 hover:border-primary rounded-xl"
                  >
                    Change File
                  </button>
                </div>

                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5">
                  <FiFileText className="w-3.5 h-3.5 text-primary" />
                  <span>Short Description</span>
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="textarea textarea-bordered w-full bg-base-100 border-base-300 font-sans text-sm rounded-xl p-3 focus:border-primary"
                />
              </div>

              <div className="modal-action flex items-center justify-end gap-3 pt-4 border-t border-base-300">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setEditingBook(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  className="px-6"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
          <div
            className="modal-backdrop bg-black/45 backdrop-blur-xs"
            onClick={() => {
              if (!isSaving) setEditingBook(null);
            }}
          />
        </dialog>
      )}

      {deletingBook && (
        <dialog className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="modal-box rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 max-w-md shadow-2xl relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center text-2xl mb-4 shadow-xs">
              <FiAlertTriangle />
            </div>

            <h3 className="font-serif font-bold text-2xl text-base-content mb-2">
              Remove Book from Shelf?
            </h3>

            <p className="text-sm text-base-content/75 font-sans leading-relaxed mb-6">
              Are you sure you want to remove <span className="font-semibold text-base-content">&quot;{deletingBook.title}&quot;</span> from the BookNook sanctuary? Readers will no longer be able to borrow this edition.
            </p>

            <div className="modal-action flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
              >
                Keep Book
              </Button>
              <Button
                variant="outline"
                size="md"
                isLoading={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-error text-error-content hover:bg-error/90 border-transparent px-5"
              >
                Remove Book
              </Button>
            </div>
          </motion.div>
          <div
            className="modal-backdrop bg-black/45 backdrop-blur-xs"
            onClick={() => {
              if (!isDeleting) setDeletingBook(null);
            }}
          />
        </dialog>
      )}
    </div>
  );
}

export default MyBooksView;

