import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import { getCollection } from "@/lib/content";

// Source: /website/public/blog/*.html — index of posts, newest first.
export const metadata = pageMeta({ title: "Blog", description: "The blog of Steven Legg — posts on culture, education, technology, politics and whatever else is on my mind.", path: "/blog" });

export default function BlogIndex() {
  const posts = getCollection("blog");
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <PageHeader title="Blog" lead="Notes, essays, and monthly updates." />
      <ul className="divide-y divide-hairline">
        {posts.map((p) => (
          <li key={p.slug} className="py-5">
            <Link href={`/blog/${p.slug}`} className="group block">
              <h2 className="text-xl group-hover:text-accent">{p.title}</h2>
              {p.date ? <p className="mt-1 text-sm text-muted">{p.date}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
