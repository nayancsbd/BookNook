"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { FiSun, FiMoon } from "react-icons/fi";

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`btn btn-circle btn-ghost btn-sm sm:btn-md border border-base-300 text-base-content hover:bg-base-200 transition-transform active:scale-95 ${
        className || ""
      }`}
      aria-label={isDark ? "Switch to light cozy theme" : "Switch to dark cozy theme"}
      title={isDark ? "Switch to booknook-light" : "Switch to booknook-dark"}
    >
      {isDark ? (
        <FiSun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
      ) : (
        <FiMoon className="w-5 h-5 text-emerald-800 transition-transform hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}

export default ThemeToggle;

