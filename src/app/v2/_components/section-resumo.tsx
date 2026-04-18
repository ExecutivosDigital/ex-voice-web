import { Copy, Pencil, Sparkles } from "lucide-react";

export function SectionResumo({ summary }: { summary: string }) {
  // simple markdown-ish render for mock
  const blocks = summary.split("\n\n");
  return (
    <div className="group space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <Sparkles className="h-3 w-3" />
          Resumo gerado por IA
        </div>
        <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
          <button
            aria-label="Editar resumo"
            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Copiar resumo"
            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <article className="space-y-4 text-[15px] leading-relaxed text-neutral-700">
        {blocks.map((block, i) => {
          if (block.startsWith("# ")) {
            return (
              <h1
                key={i}
                className="text-2xl font-semibold tracking-tight text-neutral-900"
              >
                {block.replace(/^# /, "")}
              </h1>
            );
          }
          if (block.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="mt-6 text-sm font-semibold uppercase tracking-wider text-neutral-500"
              >
                {block.replace(/^## /, "")}
              </h2>
            );
          }
          if (block.startsWith("- ")) {
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.split("\n").map((line, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                    <span>{line.replace(/^- /, "")}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (/^\d+\. /.test(block)) {
            return (
              <ol key={i} className="space-y-2 pl-1">
                {block.split("\n").map((line, j) => {
                  const match = line.match(/^(\d+)\. (.*)$/);
                  if (!match) return null;
                  return (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="mt-0.5 font-mono text-[11px] text-neutral-400">
                        {match[1].padStart(2, "0")}
                      </span>
                      <span>{match[2]}</span>
                    </li>
                  );
                })}
              </ol>
            );
          }
          return (
            <p
              key={i}
              dangerouslySetInnerHTML={{
                __html: block.replace(
                  /\*\*(.+?)\*\*/g,
                  '<strong class="font-semibold text-neutral-900">$1</strong>',
                ),
              }}
            />
          );
        })}
      </article>
    </div>
  );
}
