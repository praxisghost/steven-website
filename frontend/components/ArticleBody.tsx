import type { Block } from "@/lib/content";

// Renders extracted article blocks. Groups consecutive <li> into a single list.
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`} className="ml-5 list-disc space-y-2 text-ink-soft">
          {list.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  blocks.forEach((b, i) => {
    if (b.type === "li") {
      list.push(b.text);
      return;
    }
    flush(i);
    if (b.type === "h2") out.push(<h2 key={i} className="pt-4 text-2xl">{b.text}</h2>);
    else if (b.type === "h3") out.push(<h3 key={i} className="pt-2 text-xl">{b.text}</h3>);
    else if (b.type === "quote")
      out.push(
        <blockquote key={i} className="border-l-2 border-accent pl-4 italic text-ink-soft">
          {b.text}
        </blockquote>
      );
    else out.push(<p key={i} className="text-ink-soft">{b.text}</p>);
  });
  flush(blocks.length);
  return <div className="space-y-5 leading-relaxed">{out}</div>;
}
