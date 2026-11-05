import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AddBookForm } from "@/components/books/AddBookForm";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Add Book",
  description: "Contribute a new book to the BookNook community library catalog.",
};

export default function AddBookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
          <Spinner size="lg" label="Preparing catalog intake..." />
        </div>
      }
    >
      <PrivateRoute>
        <AddBookForm />
      </PrivateRoute>
    </Suspense>
  );
}
