// Primary navigation. Source of truth for header + home grid.
// Derived from /website/public/index.html nav (content preserved; emoji retained as labels).
export type NavItem = { href: string; label: string; emoji: string; blurb: string };

export const NAV: NavItem[] = [
  { href: "/about", label: "About", emoji: "🧭", blurb: "Who I am & how I ended up here." },
  { href: "/writing", label: "Writing", emoji: "✍️", blurb: "Written work across a few areas." },
  { href: "/projects", label: "Projects", emoji: "🔧", blurb: "Things I'm building & tinkering with." },
  { href: "/language-learning", label: "Language Learning", emoji: "🗣️", blurb: "Methods, tools & study guides." },
  { href: "/book-reviews", label: "Book Reviews", emoji: "📚", blurb: "Books I've read & what they meant." },
  { href: "/resources", label: "Resources", emoji: "🧰", blurb: "Guides & reference material." },
  { href: "/career", label: "Career", emoji: "💼", blurb: "Interests & aspirations." },
  { href: "/sports", label: "Sports", emoji: "⚽", blurb: "What I play & want to play more." },
  { href: "/art", label: "Art", emoji: "🎨", blurb: "Visual work." },
  { href: "/media", label: "Media", emoji: "🎬", blurb: "Photos, audio & video." },
  { href: "/misc", label: "Misc", emoji: "🗂️", blurb: "Odds & ends." },
  { href: "/contact", label: "Contact", emoji: "✉️", blurb: "Get in touch." },
];

export const LINKTREE = "https://linktr.ee/stevenlegg";
