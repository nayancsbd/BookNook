import React from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Heading } from "@/components/ui/Heading";
import { FiBookOpen, FiBookmark } from "react-icons/fi";

export const metadata: Metadata = {
  title: "My Books",
  description: "View and manage the books you have contributed to the BookNook sanctuary.",
};

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <div className="booknook-section">
        <div className="max-w-3xl mx-auto rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary mx-auto flex items-center justify-center text-3xl mb-4">
            <FiBookOpen />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow="Curator Shelf"
            subtitle="Browse and manage the books you have shared with the reading community."
          >
            My Books
          </Heading>
          <div className="mt-8 p-6 rounded-2xl bg-base-200/50 border border-base-300 flex flex-col items-center gap-3">
            <FiBookmark className="w-8 h-8 text-primary" />
            <p className="text-sm text-base-content/75 font-sans max-w-md">
              Your contributed library collection will appear here. As an authenticated curator, you have access to edit and manage your shelf.
            </p>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}

