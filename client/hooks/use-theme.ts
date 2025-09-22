import { useCallback, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";
const STORAGE_KEY = "theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const onChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setTheme(media?.matches ? "dark" : "light");
    };
    media?.addEventListener?.("change", onChange);
    return () => media?.removeEventListener?.("change", onChange);
  }, []);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return useMemo(() => ({ theme, setTheme, toggle }), [theme, toggle]);
}
