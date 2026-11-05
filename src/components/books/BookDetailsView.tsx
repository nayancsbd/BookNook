"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Book } from "@/types/book";
import { useAuth } from "@/context/AuthContext";
import { useApiToken } from "@/hooks/useApiToken";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getApiUrl } from "@/lib/utils";
import { toast } from "sonner";
import {
  FiBook,
  FiUser,
  FiMail,
  FiBookmark,
  FiCalendar,
  FiCheckCircle,
  FiCheck,
  FiX,
  FiBookOpen,
} from "react-icons/fi";

interface BookDetailsViewProps {
  bookId: string;
}

export function BookDetailsView({ bookId }: BookDetailsViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const fetchToken = useApiToken();

  const [book, setBook] = useState<Book | null>(null);
  const [copies, setCopies] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDefaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  };

  const [returnDate, setReturnDate] = useState(getDefaultReturnDate);

  useEffect(() => {
    let isMounted = true;

    async function loadBook() {
      setIsLoading(true);
      try {
        const token = await fetchToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const targetUrl = getApiUrl(`/books/${bookId}`);
        const res = await fetch(targetUrl, { headers });
        if (res.ok) {
          const data: Book = await res.json();
          if (isMounted && data) {
            setBook(data);
            const count =
              typeof data.copies === "number"
                ? data.copies
                : typeof data.quantity === "number"
                ? data.quantity
                : typeof data.totalCopies === "number"
                ? data.totalCopies
                : 1;
            setCopies(count);
          }
        } else {
          if (isMounted) {
            setBook(null);
          }
        }
      } catch {
        if (isMounted) {
          setBook(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId, fetchToken]);

  const handleOpenBorrowModal = () => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/books/${bookId}`)}`);
      return;
    }

    if (copies <= 0) {
      toast.error("Volume Unavailable", {
        description: "All copies of this edition are currently on loan.",
      });
      return;
    }

    setIsBorrowModalOpen(true);
  };

  const handleConfirmBorrow = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/books/${bookId}`)}`);
      return;
    }

    if (!book) return;

    setIsSubmitting(true);

    try {
      const token = await fetchToken();
      const targetUrl = getApiUrl("/borrows");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const borrowPayload = {
        bookId: String(book._id || book.id || bookId),
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: user.email,
        userName: user.name,
        returnDate,
      };

      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(borrowPayload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(
          errJson?.message || `Server returned error status: ${res.status}`
        );
      }

      setCopies((prev) => Math.max(0, prev - 1));
      setIsBorrowModalOpen(false);

      toast.success("Book Borrowed Successfully!", {
        description: `"${book.title}" is now checked out to your library account. Due back by ${returnDate}.`,
      });
    } catch (err: unknown) {
      const serverErrorMsg =
        err instanceof Error
          ? err.message
          : "Unable to process borrow request at this time.";

      toast.error("Borrowing Error", {
        description: serverErrorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
        <Spinner size="lg" label="Retrieving volume from sanctuary archives..." />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="booknook-section text-center py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto p-8 sm:p-10 rounded-3xl border border-base-300 bg-base-100 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-3xl mx-auto">
            <FiBookOpen />
          </div>
          <h2 className="font-serif font-bold text-2xl text-base-content">
            Volume Not Found
          </h2>
          <p className="text-sm text-base-content/75 font-sans leading-relaxed">
            The requested book could not be located in our sanctuary archives. It may have been removed or cataloged under a different identifier.
          </p>
          <div className="pt-2">
            <Button href="/books" variant="primary" size="md">
              Browse Library Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = copies > 0;
  const contributorName =
    book.userName ||
    book.addedByName ||
    "Curator Reader";
  const contributorEmail =
    book.userEmail ||
    book.addedByEmail ||
    book.addedBy ||
    "curator@booknook.library";

  return (
    <div className="booknook-section min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-sans text-base-content/65">
          <Link href="/books" className="hover:text-primary transition-colors">
            Library Catalog
          </Link>
          <span>/</span>
          <span className="text-base-content/90 font-medium truncate max-w-xs">
            {book.title}
          </span>
        </div>

        <div className="rounded-3xl border border-base-300 bg-base-100 shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-base-200 relative group">
                {!imageError && book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/15">
                    <FiBookOpen className="w-16 h-16 text-primary/40 mb-3" />
                    <span className="font-serif font-bold text-lg text-base-content/70">
                      {book.title}
                    </span>
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <span className="badge badge-md font-sans font-semibold tracking-wide bg-base-100/95 text-secondary border border-base-300 backdrop-blur-md shadow-md">
                    {book.category}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-sm mt-6 p-5 rounded-2xl bg-base-200/50 border border-base-300 space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-base-content/70 font-semibold uppercase tracking-wider">
                    Circulation Status
                  </span>
                  {isAvailable ? (
                    <span className="badge badge-success badge-sm font-sans font-semibold gap-1 text-white">
                      <FiCheck className="w-3 h-3" />
                      {copies} {copies === 1 ? "Copy" : "Copies"} Available
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm font-sans font-semibold text-white">
                      Not Available
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-base-300/70 text-xs font-sans space-y-1">
                  <span className="text-base-content/60 block font-medium">
                    Cataloged By
                  </span>
                  <div className="flex items-center gap-1.5 text-base-content font-semibold">
                    <FiUser className="w-3.5 h-3.5 text-primary" />
                    <span>{contributorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-base-content/70">
                    <FiMail className="w-3.5 h-3.5 text-secondary" />
                    <span className="truncate">{contributorEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase font-sans mb-3">
                    <FiBook className="w-3.5 h-3.5" />
                    <span>Library Edition</span>
                  </div>

                  <Heading as="h1" size="hero" className="leading-tight">
                    {book.title}
                  </Heading>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-base-content/75 font-sans">
                    <span className="flex items-center gap-1.5 font-medium text-base-content">
                      <FiUser className="w-4 h-4 text-primary" />
                      <span>{book.author}</span>
                    </span>
                    <span className="text-base-content/30">•</span>
                    <span className="badge badge-outline border-base-300 font-sans text-xs">
                      Genre: {book.category}
                    </span>
                    <span className="text-base-content/30">•</span>
                    <span className="font-sans text-xs text-base-content/70">
                      Total Copies: {book.totalCopies || book.quantity || 1}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-base-300">
                  <h2 className="font-serif font-bold text-xl text-base-content flex items-center gap-2">
                    <FiBookOpen className="w-5 h-5 text-primary" />
                    <span>About This Edition</span>
                  </h2>
                  <p className="text-sm sm:text-base text-base-content/80 font-sans leading-relaxed whitespace-pre-line">
                    {book.description ||
                      "This volume has been contributed to the BookNook sanctuary collection. Borrow it to immerse yourself in its thought-provoking prose and captivating literary journey."}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-base-300 space-y-4">
                {isAvailable ? (
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<FiBookmark className="w-5 h-5" />}
                    iconPosition="left"
                    onClick={handleOpenBorrowModal}
                    className="w-full justify-center h-13 text-base shadow-lg"
                  >
                    Borrow This Book
                  </Button>
                ) : (
                  <button
                    disabled
                    className="btn btn-disabled w-full h-13 rounded-xl font-sans text-base opacity-60 cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}

                <div className="flex items-center justify-between text-xs text-base-content/60 font-sans px-2">
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="w-3.5 h-3.5 text-success" />
                    <span>Instant reader confirmation</span>
                  </span>
                  <span>Renewals available upon request</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBorrowModalOpen && (
        <dialog className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="modal-box rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 max-w-lg shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setIsBorrowModalOpen(false)}
              className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60 hover:text-base-content"
              aria-label="Close dialog"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-2xl shadow-xs shrink-0">
                <FiBookmark />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-base-content">
                  Confirm Book Loan
                </h3>
                <p className="text-xs text-base-content/70 font-sans">
                  Review your reader checkout details before borrowing.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300/80 flex items-center gap-3 mb-5">
              <div className="w-12 h-16 rounded-lg overflow-hidden bg-base-300 shrink-0 aspect-[3/4] border border-base-300">
                {!imageError && book.image ? (
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
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-base-content truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-base-content/70 font-sans truncate">
                  by {book.author}
                </p>
                <span className="badge badge-xs font-sans text-secondary mt-1 bg-secondary/10 border-secondary/20">
                  {book.category}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/75 font-sans">
                  Borrower Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                    <FiUser className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={user?.name || "Curator Reader"}
                    className="input input-bordered w-full pl-10 bg-base-200/50 border-base-300 text-base-content font-sans text-sm rounded-xl h-11 cursor-not-allowed opacity-90"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/75 font-sans">
                  Borrower Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                    <FiMail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={user?.email || "reader@booknook.library"}
                    className="input input-bordered w-full pl-10 bg-base-200/50 border-base-300 text-base-content font-sans text-sm rounded-xl h-11 cursor-not-allowed opacity-90"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/75 font-sans">
                  Return Deadline
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                    <FiCalendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="input input-bordered w-full pl-10 bg-base-100 border-base-300 text-base-content font-sans text-sm rounded-xl h-11 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="modal-action flex items-center justify-end gap-3 pt-4 border-t border-base-300">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsBorrowModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                onClick={handleConfirmBorrow}
                className="px-6"
              >
                Confirm Borrow
              </Button>
            </div>
          </motion.div>
          <div
            className="modal-backdrop bg-black/45 backdrop-blur-xs"
            onClick={() => {
              if (!isSubmitting) setIsBorrowModalOpen(false);
            }}
          />
        </dialog>
      )}
    </div>
  );
}

export default BookDetailsView;
