"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { useAuth } from "@/context/AuthContext";
import { useApiToken } from "@/hooks/useApiToken";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import {
  FiBook,
  FiUser,
  FiMail,
  FiBookmark,
  FiCalendar,
  FiCheckCircle,
  FiArrowLeft,
  FiCheck,
  FiLayers,
  FiHash,
  FiX,
  FiBookOpen,
} from "react-icons/fi";

const FALLBACK_CATALOG: Book[] = [
  {
    _id: "book_01",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    description:
      "Between life and death there is a library containing infinite books, each telling the story of another reality you could have lived. Nora Seed finds herself faced with the possibility of changing her life for a new one, undoing old regrets and finding the life she truly wanted.",
    quantity: 4,
    userName: "Eleanor Vance",
    userEmail: "eleanor@booknook.library",
  },
  {
    _id: "book_02",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    description:
      "The story of fifteen billion years of cosmic evolution transforming matter into consciousness. Carl Sagan retraces the history of science and humanity's growing awareness of the cosmos with lyrical beauty and profound curiosity.",
    quantity: 3,
    userName: "Julian Thorne",
    userEmail: "julian@booknook.library",
  },
  {
    _id: "book_03",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600",
    description:
      "One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one—Homo sapiens. How did our species succeed in the battle for dominance? An exploration of our origins, societies, and future.",
    quantity: 2,
    userName: "Miriam Gray",
    userEmail: "miriam@booknook.library",
  },
  {
    _id: "book_04",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    description:
      "A poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss with enchanting simplicity and philosophical depth.",
    quantity: 5,
    userName: "Eleanor Vance",
    userEmail: "eleanor@booknook.library",
  },
  {
    _id: "book_05",
    title: "Braiding Sweetgrass",
    author: "Robin Wall Kimmerer",
    category: "Others",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    description:
      "Drawing on her life as an indigenous scientist, and as a woman, Kimmerer shows how other living beings offer us gifts and lessons, even if we've forgotten how to hear their voices.",
    quantity: 3,
    userName: "Sarah Jenkins",
    userEmail: "sarah@booknook.library",
  },
  {
    _id: "book_06",
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
    description:
      "In a small back alley in Tokyo, there is a café which has been brewing carefully crafted coffee for more than one hundred years. But this coffee shop offers its customers a unique experience: the chance to travel back in time, provided they return before the coffee gets cold.",
    quantity: 1,
    userName: "Arthur Pendelton",
    userEmail: "arthur@booknook.library",
  },
];

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
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const baseUrl = rawApiUrl.replace(/\/+$/, "");
        const targetUrl = baseUrl.endsWith("/api")
          ? `${baseUrl}/books/${bookId}`
          : `${baseUrl}/api/books/${bookId}`;

        const res = await fetch(targetUrl);
        if (res.ok) {
          const data: Book = await res.json();
          if (isMounted && data) {
            setBook(data);
            const count = data.quantity ?? 1;
            setCopies(count);
            setIsLoading(false);
            return;
          }
        }
      } catch {
      }

      if (isMounted) {
        const matched =
          FALLBACK_CATALOG.find((b) => b._id === bookId || b.id === bookId) ||
          FALLBACK_CATALOG[0];

        const resolvedBook: Book = {
          ...matched,
          _id: bookId,
        };
        setBook(resolvedBook);
        setCopies(resolvedBook.quantity ?? 1);
        setIsLoading(false);
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

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

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = rawApiUrl.replace(/\/+$/, "");
      const targetUrl = baseUrl.endsWith("/api")
        ? `${baseUrl}/borrows`
        : `${baseUrl}/api/borrows`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const borrowPayload = {
        bookId: book._id || book.id || bookId,
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
      <div className="booknook-section text-center py-20">
        <h2 className="font-serif font-bold text-2xl text-base-content mb-4">
          Volume Not Found
        </h2>
        <p className="text-sm text-base-content/70 font-sans mb-6">
          The requested book could not be located in our sanctuary archives.
        </p>
        <Button href="/books" variant="primary">
          Back to All Books
        </Button>
      </div>
    );
  }

  const isAvailable = copies > 0;
  const contributorName = book.userName || "BookNook Curator";
  const contributorEmail = book.userEmail || "curator@booknook.library";

  return (
    <div className="booknook-section">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-2 text-xs font-sans text-base-content/60">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/books" className="hover:text-primary transition-colors">
            All Books
          </Link>
          <span>/</span>
          <span className="text-base-content/90 font-medium truncate max-w-xs">
            {book.title}
          </span>
        </div>

        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-10 lg:p-12 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-base-200 border border-base-300 shadow-xl group">
                {!imageError && book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
                    <FiBookOpen className="w-16 h-16 text-primary/40 mb-3" />
                    <span className="font-serif font-bold text-lg text-base-content/60">
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

              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-300 space-y-3">
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
                  <div className="flex items-center gap-2 text-base-content font-semibold">
                    <FiUser className="w-3.5 h-3.5 text-primary" />
                    <span>{contributorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/60 text-[11px]">
                    <FiMail className="w-3.5 h-3.5 text-secondary" />
                    <span>{contributorEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold tracking-wider uppercase font-sans mb-3">
                    <FiBook className="w-3.5 h-3.5" />
                    <span>Library Edition</span>
                  </div>
                  <Heading as="h1" size="hero" className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    {book.title}
                  </Heading>
                  <p className="text-base sm:text-lg text-base-content/80 font-sans mt-2 flex items-center gap-2">
                    <span>Written by</span>
                    <span className="font-semibold text-primary">{book.author}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 border-y border-base-300">
                  <div className="p-3 rounded-xl bg-base-200/40 border border-base-300/80">
                    <span className="text-[11px] uppercase tracking-wider text-base-content/60 font-semibold block">
                      Genre
                    </span>
                    <span className="font-semibold text-sm text-base-content mt-0.5 block">
                      {book.category}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-base-200/40 border border-base-300/80">
                    <span className="text-[11px] uppercase tracking-wider text-base-content/60 font-semibold block">
                      In Stock
                    </span>
                    <span className="font-semibold text-sm text-base-content mt-0.5 block">
                      {copies} {copies === 1 ? "Copy" : "Copies"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-base-200/40 border border-base-300/80 col-span-2 sm:col-span-1">
                    <span className="text-[11px] uppercase tracking-wider text-base-content/60 font-semibold block">
                      Loan Duration
                    </span>
                    <span className="font-semibold text-sm text-secondary mt-0.5 block">
                      14 Days Free
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
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
          <div className="modal-box rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 max-w-lg shadow-2xl relative">
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
          </div>
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

