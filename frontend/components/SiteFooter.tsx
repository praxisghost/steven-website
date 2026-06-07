import { LINKTREE } from "@/lib/nav";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto max-w-wide px-6 py-10 text-sm text-muted">
        <p>
          No ads. No sponsors. Ever. Every opinion here is my own.{" "}
          <a href={LINKTREE} className="text-accent hover:underline">
            linktr.ee/stevenlegg
          </a>
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Steven Legg.</p>
      </div>
    </footer>
  );
}
