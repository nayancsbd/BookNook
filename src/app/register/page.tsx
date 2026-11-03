import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Register",
  description: "Join BookNook to borrow books, exchange reading notes, and explore community shelves.",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            <Spinner size="lg" label="Preparing registration desk..." />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}

