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
        bg: "#FAFAF8",
        "bg-dark": "#0E0E10",
        ink: "#16161A",
        "ink-soft": "#3A3A40",
        muted: "#6B6B72",
        hairline: "#E6E6E1",
        // Single accent (Hick's Law: limit choices / visual noise).
        accent: "#0F766E",
        "accent-soft": "#14B8A6",
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
