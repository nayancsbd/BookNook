import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { ProfileView } from "@/components/profile/ProfileView";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your BookNook reader profile, library card credentials, and reading history.",
};

export default function MyProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
          <Spinner size="lg" label="Accessing reader profile..." />
        </div>
      }
    >
      <PrivateRoute>
        <ProfileView />
      </PrivateRoute>
    </Suspense>
  );
}

