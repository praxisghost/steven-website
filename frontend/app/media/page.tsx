import PageHeader from "@/components/PageHeader";
import Gallery from "@/components/Gallery";
import { listImages } from "@/lib/gallery";

// Source: /website/public/{media,photos,audio,music,video}.html — sections preserved.
// Assets migrated to frontend/public/{img,audio} in Phase 3 step 3.
export const metadata = { title: "Media — Steven Legg" };

export default function Media() {
  const dogs = listImages("dogs");
  const playlists = listImages("playlists");
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader title="Media" lead="Photos, audio, and video." />

      <section className="mb-14">
        <h2 className="mb-1 text-2xl">📷 Photos</h2>
        <p className="mb-5 text-ink-soft">
          A rotating set of dog-breed portraits. Purely for joy.
        </p>
        <Gallery images={dogs} cols={3} />
      </section>

      <section className="mb-14">
        <h2 className="mb-1 text-2xl">🎧 Audio</h2>
        <p className="mb-5 text-ink-soft">
          Covers, recordings, and works in progress. More coming over time.
        </p>
        <div className="space-y-5">
          <figure>
            <figcaption className="mb-2 text-sm text-muted">I&apos;d Love to Change the World</figcaption>
            <audio controls preload="none" className="w-full max-w-content">
              <source src="/audio/IdLoveToChangeTheWorld.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </figure>
          <figure>
            <figcaption className="mb-2 text-sm text-muted">Super Organism</figcaption>
            <audio controls preload="none" className="w-full max-w-content">
              <source src="/audio/SuperOrganism.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </figure>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-1 text-2xl">🎵 Music</h2>
        <p className="mb-5 text-ink-soft">
          Instruments I play (guitar, mandolin, ocarina) and the playlists I keep
          coming back to, one per year.
        </p>
        <Gallery images={playlists} cols={4} />
      </section>

      <section>
        <h2 className="mb-1 text-2xl">🎬 Video</h2>
        <p className="mb-3 text-ink-soft">
          Edits, clips, and a running log of films I&apos;ve watched. More coming over time.
        </p>
        <a
          href="https://letterboxd.com/stovenboui/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-4 hover:underline"
        >
          Follow my film diary on Letterboxd ↗
        </a>
      </section>
    </main>
  );
}
