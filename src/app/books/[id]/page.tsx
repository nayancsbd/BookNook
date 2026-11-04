import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { BookDetailsView } from "@/components/books/BookDetailsView";
import { Spinner } from "@/components/ui/Spinner";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Book Details",
  description: "View full details and borrowing options for this edition in the BookNook sanctuary.",
};

async function BookDetailsContent({ params }: BookDetailsProps) {
  const { id } = await params;
  return <BookDetailsView bookId={id} />;
}

export default function BookDetailsPage({ params }: BookDetailsProps) {
  return (
    <PrivateRoute>
      <Suspense
        fallback={
          <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
            <Spinner size="lg" label="Retrieving volume from sanctuary archives..." />
          </div>
        }
      >
        <BookDetailsContent params={params} />
      </Suspense>
    </PrivateRoute>
  );
}
