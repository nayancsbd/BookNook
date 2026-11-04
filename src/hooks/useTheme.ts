"use client";

import { useSyncExternalStore, useCallback } from "react";
import { THEMES, ThemeType } from "@/lib/styles";

const STORAGE_KEY = "booknook-theme";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): ThemeType {
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeType | null;
  if (saved === THEMES.LIGHT || saved === THEMES.DARK) {
    return saved;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? THEMES.DARK : THEMES.LIGHT;
}

function getServerSnapshot(): ThemeType {
  return THEMES.LIGHT;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event("storage"));
  }, [theme]);

  const setSpecificTheme = useCallback((newTheme: ThemeType) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new Event("storage"));
  }, []);

  return {
    theme,
    isDark: theme === THEMES.DARK,
    toggleTheme,
    setTheme: setSpecificTheme,
    mounted: true,
  };
}
