"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export function ToastProvider() {
  const { isDark } = useTheme();

  return (
    <SonnerToaster
      richColors
      position="top-right"
      theme={isDark ? "dark" : "light"}
      closeButton
      toastOptions={{
        className: "font-sans border border-base-300 shadow-md",
      }}
    />
  );
}

export default ToastProvider;

