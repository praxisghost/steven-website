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
    else if (b.type === "table")
      out.push(
        <div key={i} className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-ink-soft">
            {b.headers.length > 0 && (
              <thead>
                <tr>
                  {b.headers.map((h, j) => (
                    <th key={j} className="border-b border-accent/40 px-3 py-2 text-left font-semibold text-ink">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-b border-ink/10">
                  {row.map((c, j) => (
                    <td key={j} className="px-3 py-2 align-top">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    else out.push(<p key={i} className="text-ink-soft">{b.text}</p>);
  });
  flush(blocks.length);
  return <div className="space-y-5 leading-relaxed">{out}</div>;
}
