import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FiHome, FiBook } from "react-icons/fi";

export const metadata: Metadata = {
  title: "BookNook | Page Not Found",
  description:
    "The chapter or page you are looking for has wandered off our library shelves.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 text-base-content px-4">
      <Section spacing="compact" className="text-center max-w-xl mx-auto flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-4xl mb-6 shadow-sm">
          <FiBook />
        </div>

        <Heading
          as="h1"
          size="main"
          align="center"
          eyebrow="Lost Between the Pages"
          subtitle="It appears this volume has been misplaced or never existed in our catalogue. Let's guide you back to the reading lounge."
        >
          404 — Chapter Not Found
        </Heading>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            href="/"
            variant="primary"
            size="lg"
            icon={<FiHome />}
            iconPosition="left"
          >
            Back to Home
          </Button>
          <Button
            href="/books"
            variant="outline"
            size="lg"
          >
            Browse Books
          </Button>
        </div>
      </Section>
    </div>
  );
}

