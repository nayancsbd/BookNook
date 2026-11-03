import React from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Heading } from "@/components/ui/Heading";
import { FiClock, FiBook } from "react-icons/fi";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "Track your borrowed books, active reading loans, and upcoming return deadlines.",
};

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <div className="booknook-section">
        <div className="max-w-3xl mx-auto rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent mx-auto flex items-center justify-center text-3xl mb-4">
            <FiClock />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow="Reader Loans"
            subtitle="Keep track of your borrowed editions and manage book returns."
          >
            My Borrowed Books
          </Heading>
          <div className="mt-8 p-6 rounded-2xl bg-base-200/50 border border-base-300 flex flex-col items-center gap-3">
            <FiBook className="w-8 h-8 text-secondary" />
            <p className="text-sm text-base-content/75 font-sans max-w-md">
              Your active reading loans and borrow history are kept safely in your personal library record.
            </p>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}

