import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HealthBanner from "@/components/HealthBanner";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_DEFAULT } from "@/lib/seo";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Newsreader({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Steven Legg — Writing, projects & language learning",
    template: "%s · Steven Legg",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  // No layout-level canonical: each page sets its own self-canonical (via
  // pageMeta/articleMeta) so hubs/articles don't all canonicalise to "/".
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_GB",
    title: "Steven Legg — Writing, projects & language learning",
    description: SITE_DESCRIPTION,
    images: [{ url: OG_DEFAULT, width: 1200, height: 630, alt: "Steven Legg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steven Legg",
    description: SITE_DESCRIPTION,
    images: [OG_DEFAULT],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E10" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* No-FOUC theme init: set .dark before first paint from the user's saved
            choice, falling back to the OS prefers-color-scheme. Must run inline in
            <head> ahead of the body so the correct palette paints immediately. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();",
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        <HealthBanner />
        <SiteHeader />
        {/* Skip-link target. A focusable wrapper (not <main>) so it doesn't
            duplicate each page's own <main> landmark. */}
        <div id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
