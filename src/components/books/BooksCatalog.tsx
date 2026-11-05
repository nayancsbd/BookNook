"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Book } from "@/types/book";
import { BookCard } from "@/components/books/BookCard";
import { Heading } from "@/components/ui/Heading";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/utils";
import {
  FiSearch,
  FiX,
  FiBookOpen,
  FiFilter,
  FiRotateCcw,
} from "react-icons/fi";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "All" },
  { label: "Fiction", value: "Fiction" },
  { label: "Science", value: "Science" },
  { label: "History", value: "History" },
  { label: "Kids", value: "Kids" },
  { label: "Others", value: "Others" },
];

export function BooksCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchBooks() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (search.trim()) {
          queryParams.set("search", search.trim());
        }
        if (selectedCategory && selectedCategory !== "All") {
          queryParams.set("category", selectedCategory);
        }

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const targetUrl = getApiUrl(`/books${qs}`);

        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          const items: Book[] = Array.isArray(data)
            ? data
            : data.books || data.data || [];
          if (isMounted) {
            setBooks(items);
          }
        } else {
          if (isMounted) setBooks([]);
        }
      } catch {
        if (isMounted) setBooks([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [search, selectedCategory]);

  const updateUrlParams = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }
    if (newCategory && newCategory !== "All") {
      params.set("category", newCategory);
    }
    const queryString = params.toString();
    const newPath = queryString ? `/books?${queryString}` : "/books";
    router.replace(newPath, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateUrlParams(val, selectedCategory);
  };

  const handleClearSearch = () => {
    setSearch("");
    updateUrlParams("", selectedCategory);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    updateUrlParams(search, cat);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    updateUrlParams("", "All");
  };

  const displayedBooks = books;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="booknook-section"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase font-sans">
            <FiBookOpen className="w-3.5 h-3.5" />
            <span>Open Library Collection</span>
          </div>

          <Heading
            as="h1"
            size="hero"
            align="center"
            subtitle="Browse our full inventory of shared editions, timeless literature, and thought-provoking nonfiction."
          >
            All Books
          </Heading>
        </div>

        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                <FiSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by title or author name..."
                className="input input-bordered w-full pl-10 pr-10 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-base-content/70 font-sans w-full md:w-auto justify-between md:justify-end">
              <span className="flex items-center gap-1.5">
                <FiFilter className="w-3.5 h-3.5 text-secondary" />
                <span>Showing:</span>
              </span>
              <span className="badge badge-neutral badge-sm font-sans">
                {displayedBooks.length} {displayedBooks.length === 1 ? "Book" : "Books"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-base-300/60 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all duration-150 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-content shadow-xs"
                      : "bg-base-200/60 text-base-content/80 hover:bg-base-200 hover:text-base-content border border-base-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Spinner size="lg" label="Searching sanctuary bookshelves..." />
          </div>
        ) : displayedBooks.length === 0 ? (
          <div className="rounded-3xl border border-base-300 bg-base-100 p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-secondary/15 text-secondary mx-auto flex items-center justify-center text-3xl mb-4">
              <FiBookOpen />
            </div>
            <h3 className="font-serif font-bold text-2xl text-base-content mb-2">
              No books found on this shelf
            </h3>
            <p className="text-sm text-base-content/75 font-sans leading-relaxed max-w-md mx-auto mb-6">
              We couldn&apos;t find any volumes matching your search terms or selected genre. Try refining your keywords or clearing the filter.
            </p>
            <Button
              variant="outline"
              size="md"
              icon={<FiRotateCcw className="w-4 h-4" />}
              iconPosition="left"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedBooks.map((book) => (
              <BookCard key={book._id || book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BooksCatalog;

