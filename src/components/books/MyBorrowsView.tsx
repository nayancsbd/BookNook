"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BorrowRecord } from "@/types/book";
import { useAuth } from "@/context/AuthContext";
import { useApiToken } from "@/hooks/useApiToken";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getApiUrl } from "@/lib/utils";
import { toast } from "sonner";
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiRotateCcw,
  FiArrowRight,
  FiX,
  FiBookmark,
} from "react-icons/fi";

export function MyBorrowsView() {
  const { user } = useAuth();
  const fetchToken = useApiToken();

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningBorrow, setReturningBorrow] = useState<BorrowRecord | null>(null);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadBorrows() {
      setIsLoading(true);

      try {
        const token = await fetchToken();
        const targetUrl = getApiUrl(
          user?.email
            ? `/borrows?userEmail=${encodeURIComponent(user.email)}`
            : "/borrows"
        );

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(targetUrl, {
          method: "GET",
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          const items: BorrowRecord[] = Array.isArray(data)
            ? data
            : data.borrows || data.data || [];

          if (isMounted) {
            setBorrows(items);
          }
        } else {
          if (isMounted) {
            setBorrows([]);
          }
        }
      } catch {
        if (isMounted) {
          setBorrows([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBorrows();

    return () => {
      isMounted = false;
    };
  }, [user?.email, user?.name, fetchToken]);

  const handleOpenReturnModal = (borrow: BorrowRecord) => {
    setReturningBorrow(borrow);
  };

  const handleCloseReturnModal = () => {
    if (!isSubmittingReturn) {
      setReturningBorrow(null);
    }
  };

  const handleConfirmReturn = async () => {
    if (!returningBorrow) return;

    const recordId = returningBorrow._id || returningBorrow.id;
    const bookTitle = returningBorrow.title || returningBorrow.bookTitle || "this book";

    setIsSubmittingReturn(true);

    try {
      const token = await fetchToken();
      const targetUrl = getApiUrl(`/borrows/${recordId}`);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(targetUrl, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(
          errJson?.message || `Server returned error status: ${res.status}`
        );
      }

      setBorrows((prev) => prev.filter((b) => (b._id || b.id) !== recordId));
      setReturningBorrow(null);

      toast.success("Book Returned Successfully", {
        description: `"${bookTitle}" has been returned to the BookNook sanctuary.`,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to return book to shelves.";
      toast.error("Return Failed", {
        description: message,
      });
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  return (
    <div className="booknook-section min-h-[70vh]">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center sm:text-left">
          <Heading
            as="h1"
            size="section"
            eyebrow="Reader Loans"
            subtitle="Track your borrowed editions, view return schedules, and return volumes to the community shelves."
          >
            My Borrowed Books
          </Heading>
        </div>

        {isLoading ? (
          <div className="flex-1 min-h-[40vh] flex flex-col items-center justify-center py-16 px-4">
            <Spinner size="lg" label="Retrieving your borrowed books..." />
          </div>
        ) : borrows.length === 0 ? (
          <div className="rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl shadow-inner">
              <FiBookOpen />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl text-base-content">
                No Books Currently Borrowed
              </h3>
              <p className="text-sm text-base-content/75 font-sans leading-relaxed max-w-md mx-auto">
                You do not have any active reading loans at this moment. Explore our community catalog to discover your next favorite story.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/books">
                <Button variant="primary" size="md" className="gap-2 shadow-sm">
                  <span>Browse Books</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-base-content/70 px-1 font-sans">
              <span className="flex items-center gap-1.5 font-medium">
                <FiBookmark className="w-4 h-4 text-primary" />
                <span>
                  {borrows.length} {borrows.length === 1 ? "Book" : "Books"} currently on loan
                </span>
              </span>
              <span className="text-xs text-base-content/50 hidden sm:inline">
                Scroll horizontally on mobile devices to view all details
              </span>
            </div>

            <div className="overflow-x-auto w-full rounded-3xl border border-base-300 bg-base-100 shadow-sm">
              <table className="table w-full min-w-[680px] text-left">
                <thead>
                  <tr className="border-b border-base-300 bg-base-200/50 text-xs font-semibold uppercase tracking-wider text-base-content/75 font-sans">
                    <th className="py-4 px-6 w-24">Image</th>
                    <th className="py-4 px-6">Book Title</th>
                    <th className="py-4 px-6 w-44">Borrow Date</th>
                    <th className="py-4 px-6 w-44">Return Date</th>
                    <th className="py-4 px-6 text-right w-40">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/60 font-sans">
                  {borrows.map((borrow) => {
                    const recordId = borrow._id || borrow.id || "";
                    const title = borrow.title || borrow.bookTitle || "Untitled Volume";
                    const image =
                      borrow.image ||
                      borrow.bookImage ||
                      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                    const borrowDateFormatted = formatDate(
                      borrow.borrowDate || borrow.borrowedAt || borrow.createdAt
                    );
                    const returnDateFormatted = formatDate(
                      borrow.returnDate || borrow.dueDate
                    );

                    return (
                      <tr
                        key={recordId}
                        className="hover:bg-base-200/40 transition-colors"
                      >
                        <td className="py-4 px-6 align-middle">
                          <div className="w-14 h-20 rounded-xl overflow-hidden shadow-xs border border-base-300 bg-base-200 shrink-0">
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                              }}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-1">
                            <h4 className="font-serif font-bold text-base sm:text-lg text-base-content line-clamp-2 leading-snug">
                              {title}
                            </h4>
                            <span className="text-xs text-base-content/60 font-sans flex items-center gap-1">
                              <span>Loan ID:</span>
                              <span className="font-mono text-[11px] text-base-content/80">
                                {recordId.slice(-8) || "N/A"}
                              </span>
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/85">
                            <FiCalendar className="w-4 h-4 text-primary shrink-0" />
                            <span>{borrowDateFormatted}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-secondary">
                            <FiClock className="w-4 h-4 text-secondary shrink-0" />
                            <span>{returnDateFormatted}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenReturnModal(borrow)}
                            className="btn btn-sm btn-outline border-base-300 hover:border-primary text-primary hover:bg-primary/10 rounded-xl font-sans inline-flex items-center gap-1.5 transition-all"
                          >
                            <FiRotateCcw className="w-3.5 h-3.5" />
                            <span>Return Book</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {returningBorrow && (
        <dialog className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="modal-box rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 max-w-md shadow-2xl relative"
          >
            <button
              type="button"
              onClick={handleCloseReturnModal}
              disabled={isSubmittingReturn}
              className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60 hover:text-base-content"
              aria-label="Close dialog"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-2xl mb-4 shadow-xs">
              <FiRotateCcw />
            </div>

            <h3 className="font-serif font-bold text-2xl text-base-content mb-2">
              Return Book to Library?
            </h3>

            <p className="text-sm text-base-content/75 font-sans leading-relaxed mb-6">
              Are you ready to return{" "}
              <span className="font-semibold text-base-content">
                &quot;{returningBorrow.title || returningBorrow.bookTitle}&quot;
              </span>{" "}
              back to the BookNook sanctuary? This loan record will be closed and the edition will become available for other community readers.
            </p>

            <div className="modal-action flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={handleCloseReturnModal}
                disabled={isSubmittingReturn}
              >
                Keep Reading
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmittingReturn}
                onClick={handleConfirmReturn}
                className="px-5 gap-2"
              >
                <span>Confirm Return</span>
              </Button>
            </div>
          </motion.div>
          <div
            className="modal-backdrop bg-black/45 backdrop-blur-xs"
            onClick={handleCloseReturnModal}
          />
        </dialog>
      )}
    </div>
  );
}
