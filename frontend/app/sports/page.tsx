import PageHeader from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";

// Source: /website/public/sports.html — full prose preserved.
export const metadata = pageMeta({ title: "Sports", description: "The sports Steven Legg plays and wants to play more of.", path: "/sports" });

const SPORTS: { name: string; paras: string[] }[] = [
  {
    name: "Bowling",
    paras: [
      "I started bowling when the Catholic school I attended in grades 4–6 had biweekly Friday trips to the local bowling alley. At first I just thought it was a lot of fun — getting to have snacks, relax, and still become competitive in a friendly environment. I always found bowling suspenseful and genuinely fun.",
      "The biggest barrier, I think, is using a real bowling ball instead of a house ball. Once you use a resin ball with a core, the game feels completely different. Most people are unaware there's even a difference. The first time I saw my mentor, Mike H., throw one of his crazy early-hook strikes, I was hooked immediately. He basically threw the ball directly toward the gutter, but it hooked back early into the pocket with incredible power. I thought that was amazing and knew I wanted to be able to do it too.",
      "Eventually I joined the Saturday morning youth bowling league and continued bowling until around age 17. I still bowl from time to time, but it's no longer a major focus of mine. My high game is 256 — I think I had 7 or 8 strikes that game — although many of the other kids in my league were far more impressive than I was. Even today I still can't quite hook the ball as early or as dramatically as Mike did. Still, I love it.",
    ],
  },
  {
    name: "Ultimate Frisbee",
    paras: [
      "I started playing Ultimate Frisbee with a few kids at my summer camp: Sam and Charles from Quebec, and my friend Paul from France. We loved just throwing the disc around.",
    ],
  },
  {
    name: "Soccer",
    paras: [
      "I played soccer as a kid because it was basically the default elementary school sport. Don't get me wrong — I genuinely liked it. But a lot of the New England screaming soccer parent culture really ruined parts of the experience for me at a young age.",
      "This was probably the first time I experienced pressure and a more negative kind of competitiveness around team sports. As an only child, I sometimes struggled trying to make team environments work, even though I tried my best.",
      "Today I mostly follow the Bundesliga. My favorite team is Eintracht Frankfurt. I love how universal soccer is and how widely it's played throughout the world. I'll admit I'm not particularly good at it, but I still enjoy playing. Honestly, some of my best soccer experiences were at summer camp playing casually with Spanish speakers and other international students.",
    ],
  },
  {
    name: "Kayaking",
    paras: [
      "I love a good arm workout and also just how fun it is exploring ponds, rivers, lakes, marshes, and shallow waterways with a kayak.",
      "One of my favorite parts about kayaking is being able to reach places that are only accessible by small waterways. I think it's one of the best ways to observe wildlife and experience nature quietly.",
      "Kayaking is one of my favorite outdoor activities, especially in warm, shallow water that's absolutely bursting with plants, insects, fish, frogs, and birds.",
    ],
  },
  {
    name: "Badminton",
    paras: [
      "I don't know what it is about badminton, but it's just really fun. I also have a tendency to take it overly seriously.",
      "There's something hilarious and strangely intense about badminton once people start becoming competitive. Honestly, I think I prefer it over volleyball.",
    ],
  },
  {
    name: "Racquetball",
    paras: [
      "Racquetball is hard, and honestly I think part of the fun is treating it almost like a reflex training exercise.",
      "I haven't played it very much, but I'd still much rather play racquetball than padel, squash, or pickleball.",
    ],
  },
  {
    name: "Rock Climbing",
    paras: [
      "I don't think I would ever seriously rock climb outdoors on cliffs or ice. The risk just doesn't really appeal to me personally.",
      "What I would love to do is join a rock climbing gym or do indoor climbing training. I don't really need the risk of climbing dangerous outdoor environments when I can still enjoy climbing indoors in a controlled environment with harnesses.",
      "I'll happily stick to indoor rock walls and climbing gyms.",
    ],
  },
  {
    name: "Handball",
    paras: [
      "I first played handball at summer camp, and then later while I was in Germany because my liaison there played it.",
      "Honestly, I love playing handball. I don't even fully know why — it's just incredibly fun. The pace and energy of the game make it exciting almost immediately.",
      "I really wish handball were more popular in the United States, although I'm glad it's so widely played in Europe. I really hope I get the chance to play again soon.",
    ],
  },
  {
    name: "Skiing",
    paras: [
      "I didn't ski until 2022, but honestly it felt incredibly freeing coming from being a snowboarder.",
      "Personally I find skiing easier, although I know not everyone agrees with that. I genuinely loved skiing almost immediately.",
      "My first time skiing is honestly one of my favorite memories.",
    ],
  },
  {
    name: "Snowboarding",
    paras: [
      "I started snowboarding when I was around 15 and I always enjoyed it, but I also found it punishing and frustrating to improve at.",
      "I haven't snowboarded in a long time mostly because whenever I go to the mountains now, I almost always want to ski instead.",
      "Sorry snowboarders — I've officially been converted to the dark side.",
    ],
  },
  {
    name: "Skateboarding",
    paras: [
      "I honestly think skateboarding is one of the most difficult sports there is.",
      "I mostly just cruised around my college campus on a cruiser board, but skateboarding is always fun because you can make a great time out of almost nothing — a parking lot, a sidewalk, or a campus path.",
      "I mostly skateboarded in college, but I'd really love to continue learning more. At the same time, I also find it taxing on the ankles and knees, and becoming genuinely good at it takes a huge amount of time and dedication.",
      "Realistically, I'm not trying to become an elite skater — I mostly just want to learn how to kickflip properly.",
    ],
  },
];

export default function Sports() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title="Sports" lead="Activities I play, have played, or want to play more of." />
      <div className="space-y-10">
        {SPORTS.map((s) => (
          <section key={s.name}>
            <h2 className="mb-3 text-2xl">{s.name}</h2>
            <div className="space-y-4 text-ink-soft leading-relaxed">
              {s.paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
