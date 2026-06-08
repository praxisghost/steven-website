import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";
import { LINKTREE } from "@/lib/nav";

// Source: /website/public/contact.html — "Send a message" + "Newsletter".
// Forms POST to the Django API (backend/api/views.py: /api/contact, /api/newsletter).
export const metadata = { title: "Contact — Steven Legg" };

export default function Contact() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title="Contact" />

      <section className="space-y-4">
        <h2 className="text-2xl">Send a message</h2>
        <p className="text-ink-soft">
          Have a question, an opportunity, or just want to say hello? Send a note below.
        </p>
        <ContactForm />
        <p className="text-sm text-muted">
          Prefer something else? Find me on{" "}
          <a href={LINKTREE} className="text-accent hover:underline">
            linktr.ee/stevenlegg
          </a>
          .
        </p>
      </section>

      <section className="mt-12 space-y-3">
        <h2 className="text-2xl">Newsletter</h2>
        <p className="text-ink-soft">
          Occasional updates when I write something worth sharing. No spam.
        </p>
        <NewsletterForm />
      </section>
    </main>
  );
}
