import React from "react";
import type { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your BookNook reader profile, library card credentials, and reading history.",
};

export default function MyProfilePage() {
  return (
    <PrivateRoute>
      <ProfileView />
    </PrivateRoute>
  );
}

