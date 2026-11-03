import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { BookDetailsView } from "@/components/books/BookDetailsView";
import { Spinner } from "@/components/ui/Spinner";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailsProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Book Details",
    description: `View full details and borrowing options for edition #${id}.`,
  };
}

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params;

  return (
    <PrivateRoute>
      <Suspense
        fallback={
          <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
            <Spinner size="lg" label="Retrieving volume from sanctuary archives..." />
          </div>
        }
      >
        <BookDetailsView bookId={id} />
      </Suspense>
    </PrivateRoute>
  );
}
