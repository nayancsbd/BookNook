"use client";

import React, { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { BookCard } from "@/components/books/BookCard";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";

const FALLBACK_BOOKS: Book[] = [
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
];

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>(FALLBACK_BOOKS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchNewArrivals() {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const baseUrl = rawApiUrl.replace(/\/+$/, "");
        const targetUrl = baseUrl.endsWith("/api")
          ? `${baseUrl}/books?sort=newest&limit=6`
          : `${baseUrl}/api/books?sort=newest&limit=6`;

        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          const items: Book[] = Array.isArray(data)
            ? data
            : data.books || data.data || [];

          if (isMounted && items.length > 0) {
            setBooks(items.slice(0, 6));
          }
        }
      } catch {
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchNewArrivals();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="booknook-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold tracking-wider uppercase font-sans mb-3">
            <FiBookOpen className="w-3.5 h-3.5" />
            <span>Curated Sanctuary Shelf</span>
          </div>
          <Heading
            as="h2"
            size="hero"
            align="center"
            subtitle="Explore the latest additions to our communal library, freshly cataloged and ready to borrow."
          >
            New Arrivals
          </Heading>
        </div>

        {isLoading ? (
          <div className="min-h-[340px] flex items-center justify-center">
            <Spinner size="lg" label="Retrieving latest library acquisitions..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.map((book) => (
              <BookCard key={book._id || book.id} book={book} />
            ))}
          </div>
        )}

        <div className="mt-12 sm:mt-16 text-center">
          <Button
            href="/books"
            variant="secondary"
            size="lg"
            icon={<FiArrowRight className="w-4 h-4" />}
            iconPosition="right"
            className="shadow-md"
          >
            See All Books
          </Button>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;

