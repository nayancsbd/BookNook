import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BooksCatalog } from "@/components/books/BooksCatalog";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "All Books",
  description: "Browse the full BookNook library collection of novels, non-fiction, philosophy, and poetry.",
};

export default function AllBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-16">
          <Spinner size="lg" label="Opening community library catalog..." />
        </div>
      }
    >
      <BooksCatalog />
    </Suspense>
  );
}
