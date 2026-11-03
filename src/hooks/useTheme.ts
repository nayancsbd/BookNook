"use client";

import { useEffect, useState, useCallback } from "react";
import { THEMES, ThemeType } from "@/lib/styles";

const STORAGE_KEY = "booknook-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeType | null;
    if (saved && (saved === THEMES.LIGHT || saved === THEMES.DARK)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initial = prefersDark ? THEMES.DARK : THEMES.LIGHT;
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const setSpecificTheme = useCallback((newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }, []);

  return {
    theme,
    isDark: theme === THEMES.DARK,
    toggleTheme,
    setTheme: setSpecificTheme,
    mounted,
  };
}

