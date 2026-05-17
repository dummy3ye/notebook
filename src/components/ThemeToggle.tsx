"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme on mount
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      Promise.resolve().then(() => setIsDark(true));
    } else {
      document.documentElement.classList.remove("dark");
      Promise.resolve().then(() => setIsDark(false));
    }
    
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
