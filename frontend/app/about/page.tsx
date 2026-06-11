import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import Gallery from "@/components/Gallery";
import { listImages } from "@/lib/gallery";

// Source: /website/public/about.html — full prose preserved + salamander slideshow
// (img/salamanders) migrated to a gallery in Phase 3 step 3.
export const metadata = pageMeta({ title: "About", description: "About Steven Legg — who I am, what I do, and how I ended up here.", path: "/about" });

export default function About() {
  const salamanders = listImages("salamanders");
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader
        title="About"
        lead="A bit about who I am & how I ended up here."
      />
      <div className="space-y-6 text-ink-soft leading-relaxed">
        <p>
          This site is a personal portfolio, blog, learning-resource hub, &amp; just
          a fun project for myself — a place to document what I&apos;m working on,
          share things I&apos;ve found useful, &amp; build something that reflects how
          I actually think and learn. I love learning, teaching, enjoying life, &amp;
          meeting new people. This is the part of the site where I try to sound
          interesting without sounding like a LinkedIn profile.
        </p>

        <Section title="Education">
          <p>
            I graduated in 2022 with a Bachelor of Arts in German Studies from
            Wheaton College Massachusetts.
          </p>
        </Section>

        <Section title="Work">
          <p>
            I currently teach at EF International Language Center in Boston,
            Massachusetts. I love helping students learn to enjoy learning and
            introducing them to tools I wish I knew about earlier.
          </p>
        </Section>

        <Section title="Programs & Grants">
          <p>
            I&apos;m both a Congress-Bundestag Youth Exchange 2016 alumnus &amp; a
            Fulbright Germany English Teaching Assistant grant recipient
            (2024–2025).
          </p>
        </Section>

        <Section title="Places I've Lived">
          <p>Hessen, Germany &middot; Sachsen-Anhalt, Germany.</p>
          <p>
            My favorite city in Germany is Marburg an der Lahn — partly for the
            castle on the hill, also for the way the old town feels at dusk or when
            it&apos;s foggy. I really love the alleyways and wooden beam houses. It
            feels medieval, charming, &amp; some of my favorite people in the world
            live there or nearby.
          </p>
        </Section>

        <Section title="Hobbies">
          <p>
            I enjoy mountain biking &amp; playing guitar — although I&apos;m not
            great at either (especially guitar).
          </p>
        </Section>

        <Section title="Languages I'm Learning">
          <p>
            I love learning languages. My current focus languages are Chinese,
            German, Spanish, &amp; Turkish. I&apos;m also learning web application
            development while building this site.
          </p>
        </Section>

        <Section title="Family & Animals">
          <p>
            I&apos;m the son of a public librarian &amp; have always loved learning —
            despite never reading the books she tried to get me to read. I love
            animals, &amp; I&apos;ve always had pets of some kind: hamsters, dogs,
            cats, lizards, &amp; frogs. I especially love frogs.
          </p>
          <p>
            I&apos;m still figuring out my Plans A through C in life. I&apos;d like to
            earn a decent salary, get a property on a river, start a family — but if
            all that doesn&apos;t work out maybe Plan D is to become King of Frogs
            &amp; maintain a massive pond full of African Bullfrogs. I&apos;m not
            entirely sure if I&apos;m joking.
          </p>
        </Section>

        <Section title="Other Interests">
          <p>
            I also enjoy learning about Linux, aquaponics, hobby engineering &amp;
            projects, and technology experimentation.
          </p>
        </Section>

        <Section title="Why This Site Exists">
          <p>
            This site is both a portfolio/blog &amp; a place to share useful things
            I&apos;ve discovered along the way. If something I write here saves
            someone else a few hours of confusion or sparks some interest in
            something — then I&apos;m happy. I&apos;ll add more to this page and to
            this site in general soon. Thanks all!
          </p>
        </Section>

        <Section title="No Ads. No Sponsors. Ever.">
          <p>
            This site is — and always will be — completely free of advertisements.
            Every opinion expressed here is my own, formed without sponsorship,
            affiliate deals, or anyone paying me to say something nice about their
            product. I&apos;m just a guy with a website and some thoughts.
          </p>
        </Section>

        <Section title="Salamanders I Like">
          <p className="mb-5">
            A small gallery of salamanders — another lifelong soft spot, right
            alongside the frogs.
          </p>
          <Gallery images={salamanders} cols={2} />
        </Section>

        <p className="text-sm text-muted">Dedicated to my mother &amp; my father.</p>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-4">
      <h2 className="mb-2 text-2xl">{title}</h2>
      {children}
    </section>
  );
}
