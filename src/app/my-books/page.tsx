import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { MyBooksView } from "@/components/books/MyBooksView";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "My Books",
  description: "View and manage the books you have contributed to the BookNook sanctuary.",
};

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <Suspense
        fallback={
          <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
            <Spinner size="lg" label="Retrieving your contributed books..." />
          </div>
        }
      >
        <MyBooksView />
      </Suspense>
    </PrivateRoute>
  );
}
