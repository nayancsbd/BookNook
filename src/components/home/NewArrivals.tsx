"use client";

import React, { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { BookCard } from "@/components/books/BookCard";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getApiUrl } from "@/lib/utils";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchNewArrivals() {
      try {
        const targetUrl = getApiUrl("/books?sort=newest&limit=6");
        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          const items: Book[] = Array.isArray(data)
            ? data
            : data.books || data.data || [];

          if (isMounted) {
            setBooks(items.slice(0, 6));
          }
        }
      } catch {
        if (isMounted) {
          setBooks([]);
        }
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

