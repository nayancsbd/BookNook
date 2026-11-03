import React from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AddBookForm } from "@/components/books/AddBookForm";

export const metadata: Metadata = {
  title: "Add Book",
  description: "Contribute a new book to the BookNook community library catalog.",
};

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <AddBookForm />
    </PrivateRoute>
  );
}
