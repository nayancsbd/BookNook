"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Book, BookCategory } from "@/types/book";
import { BookCard } from "@/components/books/BookCard";
import { Heading } from "@/components/ui/Heading";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
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

const INITIAL_CATALOG: Book[] = [
  {
    _id: "book_01",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    description:
      "Between life and death there is a library containing infinite books, each telling the story of another reality you could have lived.",
  },
  {
    _id: "book_02",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    description:
      "The story of fifteen billion years of cosmic evolution transforming matter into consciousness.",
  },
  {
    _id: "book_03",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600",
    description:
      "A groundbreaking survey of how human biology and history have defined us and enhanced our understanding of what it means to be human.",
  },
  {
    _id: "book_04",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    description:
      "A poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.",
  },
  {
    _id: "book_05",
    title: "Braiding Sweetgrass",
    author: "Robin Wall Kimmerer",
    category: "Others",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    description:
      "Indigenous wisdom, scientific knowledge, and the teachings of plants reveal how living creatures offer gifts and lessons.",
  },
  {
    _id: "book_06",
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
    description:
      "In a small back alley in Tokyo, there is a café which has been brewing carefully crafted coffee for more than one hundred years.",
  },
  {
    _id: "book_07",
    title: "The Shadow of the Wind",
    author: "Carlos Ruiz Zafón",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600",
    description:
      "Barcelona, 1945: A boy is taken to the secret Cemetery of Forgotten Books to choose a volume that will change his destiny.",
  },
  {
    _id: "book_08",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=600",
    description:
      "A landmark volume in science writing explores the frontiers of time and space, black holes, and the origins of the universe.",
  },
  {
    _id: "book_09",
    title: "The Silk Roads: A New History",
    author: "Peter Frankopan",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
    description:
      "An exhilarating journey through the historical forces that shaped world civilizations along ancient trading routes.",
  },
  {
    _id: "book_10",
    title: "Charlotte's Web",
    author: "E.B. White",
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    description:
      "A tender story of friendship between a livestock pig named Wilbur and an extraordinarily compassionate barn spider named Charlotte.",
  },
  {
    _id: "book_11",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Others",
    image:
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600",
    description:
      "Private reflections and timeless stoic wisdom from the Roman Emperor on discipline, virtue, resilience, and inner peace.",
  },
  {
    _id: "book_12",
    title: "Astrophysics for People in a Hurry",
    author: "Neil deGrasse Tyson",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600",
    description:
      "A mind-expanding overview of cosmic principles, quantum mechanics, and the search for life in the universe.",
  },
];

export function BooksCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [serverBooks, setServerBooks] = useState<Book[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchBooks() {
      setIsLoading(true);
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const baseUrl = rawApiUrl.replace(/\/+$/, "");
        const queryParams = new URLSearchParams();

        if (search.trim()) {
          queryParams.set("search", search.trim());
        }
        if (selectedCategory && selectedCategory !== "All") {
          queryParams.set("category", selectedCategory);
        }

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const targetUrl = baseUrl.endsWith("/api")
          ? `${baseUrl}/books${qs}`
          : `${baseUrl}/api/books${qs}`;

        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          const items: Book[] = Array.isArray(data)
            ? data
            : data.books || data.data || [];
          if (isMounted) {
            setServerBooks(items);
          }
        } else {
          if (isMounted) setServerBooks(null);
        }
      } catch {
        if (isMounted) setServerBooks(null);
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

  const displayedBooks = useMemo(() => {
    if (serverBooks !== null) {
      return serverBooks;
    }

    return INITIAL_CATALOG.filter((book) => {
      const matchesCategory =
        selectedCategory === "All" ||
        book.category.toLowerCase() === selectedCategory.toLowerCase();

      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [serverBooks, search, selectedCategory]);

  return (
    <div className="booknook-section">
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
    </div>
  );
}

export default BooksCatalog;

