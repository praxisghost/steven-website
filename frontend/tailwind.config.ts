import type { Config } from "tailwindcss";

/**
 * Design tokens for the "Editorial Minimal" aesthetic (DESIGN_SYSTEM.md Option A).
 * Deliberately divergent from website3.0 (black bg + rainbow nav): light, content-forward,
 * serif display + sans body, a single restrained accent. Refined in Phase 4.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        // ~65ch reading measure for long-form content (F-pattern legibility).
        content: "42rem",
        wide: "72rem",
      },
      colors: {
        // Semantic tokens resolve through CSS variables (channel triplets) so the
        // whole site flips light<->dark via the `.dark` class with no per-component
        // `dark:` churn. The `/ <alpha-value>` shim keeps Tailwind opacity modifiers
        // (e.g. bg-hairline/60) working. Values are defined in app/globals.css.
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-dark": "#0E0E10",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--color-ink-soft) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        // Single accent (Hick's Law: limit choices / visual noise).
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
