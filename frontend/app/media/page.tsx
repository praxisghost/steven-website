import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import Gallery from "@/components/Gallery";
import Slideshow from "@/components/Slideshow";
import { listImages } from "@/lib/gallery";

// Source: /website/public/{media,photos,audio,music,video}.html — sections preserved.
// Assets migrated to frontend/public/{img,audio} in Phase 3 step 3.
export const metadata = pageMeta({ title: "Media", description: "Photos, audio and video from Steven Legg.", path: "/media" });

// Every photo gallery copied from /website/public/img, surfaced here as
// slideshows (label → folder). Empty folders are skipped automatically.
const PHOTO_GALLERIES: { label: string; folder: string; blurb: string }[] = [
  { label: "Favourite Dog Breeds", folder: "dogs", blurb: "Dog-breed portraits, purely for joy." },
  { label: "Salamanders", folder: "salamanders", blurb: "Salamanders and newts." },
  { label: "Frogs", folder: "frogs", blurb: "Frogs and toads." },
  { label: "Polliwogs", folder: "polliwogs", blurb: "Tadpoles and froglets." },
  { label: "Aquaponics", folder: "aquaponic", blurb: "The home aquaponic setup." },
  { label: "Months", folder: "months", blurb: "A photo for each season." },
  { label: "Miscellany", folder: "misc", blurb: "Odds and ends." },
];

export default function Media() {
  const playlists = listImages("playlists");
  const galleries = PHOTO_GALLERIES.map((g) => ({ ...g, images: listImages(g.folder) })).filter(
    (g) => g.images.length > 0,
  );
  return (
    <main className="mx-auto max-w-wide px-6 py-16">
      <PageHeader title="Media" lead="Photos, audio, and video." />

      <section className="mb-14">
        <h2 className="mb-1 text-2xl">📷 Photos</h2>
        <p className="mb-6 text-ink-soft">
          Slideshows of photos I&apos;ve taken — use the arrows, dots, or your keyboard&apos;s
          ← → keys to browse each set.
        </p>
        <div className="grid gap-10 lg:grid-cols-2">
          {galleries.map((g) => (
            <figure key={g.folder} className="m-0">
              <figcaption className="mb-2">
                <span className="text-lg font-medium">{g.label}</span>{" "}
                <span className="text-sm text-muted">— {g.blurb}</span>
              </figcaption>
              <Slideshow images={g.images} label={g.label} />
            </figure>
          ))}
        </div>
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
