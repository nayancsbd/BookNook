"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/Button";
import { FiBookOpen, FiUser, FiArrowRight } from "react-icons/fi";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className = "" }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  const bookId = book._id || (book as { id?: string }).id;
  const detailsHref = `/books/${bookId}`;

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`group h-full flex flex-col rounded-2xl border border-base-300 bg-base-100 shadow-xs hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
    >
      <Link
        href={detailsHref}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-base-200"
      >
        {!imageError && book.image ? (
          <img
            src={book.image}
            alt={book.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
            <FiBookOpen className="w-12 h-12 text-primary/40 mb-2" />
            <span className="font-serif font-bold text-sm text-base-content/60 line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="badge badge-sm font-sans font-semibold tracking-wide bg-base-100/90 text-secondary border border-base-300 backdrop-blur-md shadow-xs">
            {book.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge badge-sm font-sans font-semibold tracking-wide bg-base-100/90 text-secondary border border-base-300 backdrop-blur-md shadow-xs">
            {(book.copies ?? 0) > 0
              ? `${book.copies} copies`
              : "Out of stock"}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <Link href={detailsHref} className="block group/link">
            <h3 className="font-serif font-bold text-lg text-base-content line-clamp-2 leading-snug group-hover/link:text-primary transition-colors">
              {book.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-base-content/70 mt-1.5 font-sans">
            <FiUser className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-base-300/60">
          <Button
            href={detailsHref}
            variant="primary"
            size="sm"
            icon={<FiArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
            className="w-full justify-center"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export default BookCard;
