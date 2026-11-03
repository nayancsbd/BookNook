import React from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Heading } from "@/components/ui/Heading";
import { FiBookOpen, FiBookmark } from "react-icons/fi";

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
      <div className="booknook-section">
        <div className="max-w-3xl mx-auto rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl mb-4">
            <FiBookOpen />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow={`Edition #${id.slice(-6)}`}
            subtitle="Full edition details, reader reviews, and borrow checkout desk."
          >
            Book Details
          </Heading>
          <div className="mt-8 p-6 rounded-2xl bg-base-200/50 border border-base-300 flex flex-col items-center gap-3">
            <FiBookmark className="w-8 h-8 text-secondary" />
            <p className="text-sm text-base-content/75 font-sans max-w-md">
              You are authenticated to view private edition notes, borrower records, and check out this volume.
            </p>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
