import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/Heading";
import { FiBook, FiSearch } from "react-icons/fi";

export const metadata: Metadata = {
  title: "All Books",
  description: "Browse the full BookNook library collection of novels, non-fiction, philosophy, and poetry.",
};

export default function AllBooksPage() {
  return (
    <div className="booknook-section">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl mb-4">
          <FiBook />
        </div>
        <Heading
          as="h1"
          size="hero"
          align="center"
          eyebrow="Community Library"
          subtitle="Explore handpicked volumes, literary classics, and modern discoveries shared by our readers."
        >
          All Books
        </Heading>
      </div>

      <div className="max-w-3xl mx-auto rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-12 shadow-md text-center">
        <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary mx-auto flex items-center justify-center text-2xl mb-4">
          <FiSearch />
        </div>
        <h2 className="font-serif font-bold text-xl text-base-content mb-2">
          Sanctuary Catalog
        </h2>
        <p className="text-sm text-base-content/75 font-sans max-w-md mx-auto">
          Welcome to the open reading shelves. Browse freely without an account, or sign in to borrow editions and contribute your own volumes.
        </p>
      </div>
    </div>
  );
}

