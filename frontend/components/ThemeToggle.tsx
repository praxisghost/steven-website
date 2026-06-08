"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark switch. The actual class is applied pre-paint by the inline script
 * in app/layout.tsx (no FOUC); this control only reflects + mutates that state
 * and persists the explicit choice to localStorage. Honours prefers-color-scheme
 * until the user makes an explicit choice.
 *
 * A11y: a real <button> with aria-pressed for the toggle state and a clear
 * aria-label; the emoji glyph is aria-hidden so SR users hear only the label.
 * Renders a stable placeholder until mounted to avoid a hydration mismatch.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode) — in-session toggle still works */
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={
        theme === null
          ? "Toggle dark mode"
          : `Switch to ${isDark ? "light" : "dark"} mode`
      }
      title={theme === null ? "Toggle theme" : `Switch to ${isDark ? "light" : "dark"} mode`}
      className="rounded p-2 text-ink-soft transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <span aria-hidden="true" className="block text-base leading-none">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
