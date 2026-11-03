import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your BookNook member account to manage borrowed books and collections.",
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none -z-10" />

      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            <Spinner size="lg" label="Preparing the reader desk..." />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

