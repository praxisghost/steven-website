import PageHeader from "@/components/PageHeader";
import { LINKTREE } from "@/lib/nav";

// Source: /website/public/contact.html — "Send a message" + "Newsletter".
// Source backend (Express + Resend) is re-implemented in the Django phase; the form
// is presented statically here with a mailto fallback until the API is wired up.
export const metadata = { title: "Contact — Steven Legg" };

export default function Contact() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title="Contact" />
      <section className="space-y-4">
        <h2 className="text-2xl">Send a message</h2>
        <p className="text-ink-soft">
          The easiest way to reach me is through my links hub, where you&apos;ll find
          the best current contact options.
        </p>
        <a
          href={LINKTREE}
          className="inline-block rounded-lg bg-accent px-5 py-3 text-white transition-opacity hover:opacity-90"
        >
          Find me on linktr.ee/stevenlegg →
        </a>
      </section>
      <section className="mt-12 space-y-3">
        <h2 className="text-2xl">Newsletter</h2>
        <p className="text-ink-soft">
          Occasional updates when I write something worth sharing. No spam. (Sign-up
          form returns once the backend is connected.)
        </p>
      </section>
    </main>
  );
}
