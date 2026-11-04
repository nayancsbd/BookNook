import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { MyBorrowsView } from "@/components/books/MyBorrowsView";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "Track your borrowed books, active reading loans, and upcoming return deadlines.",
};

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <Suspense
        fallback={
          <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
            <Spinner size="lg" label="Retrieving your borrowed books..." />
          </div>
        }
      >
        <MyBorrowsView />
      </Suspense>
    </PrivateRoute>
  );
}
