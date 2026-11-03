import React from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Heading } from "@/components/ui/Heading";
import { FiPlusCircle, FiBookOpen } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Add Book",
  description: "Contribute a new book to the BookNook community library catalog.",
};

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <div className="booknook-section">
        <div className="max-w-2xl mx-auto rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl mb-4">
            <FiPlusCircle />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow="Library Contribution"
            subtitle="Share a treasured book with fellow readers in our community catalog."
          >
            Add New Book
          </Heading>
          <div className="mt-8 p-6 rounded-2xl bg-base-200/50 border border-base-300 flex flex-col items-center gap-3">
            <FiBookOpen className="w-8 h-8 text-secondary" />
            <p className="text-sm text-base-content/75 font-sans max-w-md">
              The contribution shelf is protected and ready for book submissions. You are signed in and authorized to add books to the collection.
            </p>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}

