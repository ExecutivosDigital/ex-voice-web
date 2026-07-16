"use client";

import { cn } from "@/utils/cn";
import type { PreviewSegment } from "../mock/conversa-real";
import { calcularMetricas, corDoLocutor, cruzam, ehBackchannel, tempo } from "../lib/overlap";

/**
 * LAYOUT C — Colunas paralelas nos trechos de conversa cruzada.
 *
 * A aposta fiel: quando as pessoas falam junto, o texto aparece lado a lado —
 * a simultaneidade é mostrada no espaço, não descrita por um selo.
 *
 * A favor: é o único que transmite a INTENSIDADE (20s de crosstalk parecem 20s
 * de crosstalk).
 * Contra: quebra a leitura linear, e com 3+ locutores simultâneos as colunas
 * ficam estreitas. No celular vira coluna única e o layout perde o sentido.
 */

interface Bloco {
  tipo: "solo" | "cruzado";
  segmentos: PreviewSegment[];
  start: number;
  end: number;
}

/**
 * Agrupa os trechos em blocos: fala solo ou conversa cruzada.
 *
 * Um bloco cruzado cresce por transitividade — se A cruza com B e B cruza com
 * C, os três entram no mesmo bloco mesmo que A e C não se toquem. Sem isso, uma
 * conversa cruzada contínua se partiria em blocos arbitrários no meio.
 *
 * Backchannels não abrem bloco: um "uhum" não transforma um monólogo em
 * conversa cruzada.
 */
function agruparEmBlocos(segs: PreviewSegment[]): Bloco[] {
  const blocos: Bloco[] = [];
  const usados = new Set<PreviewSegment>();

  for (const seg of segs) {
    if (usados.has(seg)) continue;

    // fecho transitivo dos que cruzam
    const grupo = [seg];
    usados.add(seg);
    let cresceu = true;
    while (cresceu) {
      cresceu = false;
      for (const outro of segs) {
        if (usados.has(outro)) continue;
        if (grupo.some((g) => cruzam(g, outro))) {
          grupo.push(outro);
          usados.add(outro);
          cresceu = true;
        }
      }
    }

    grupo.sort((a, b) => a.start - b.start);
    const naoBackchannel = grupo.filter((g) => !ehBackchannel(g));
    const locutoresReais = new Set(naoBackchannel.map((g) => g.speaker));

    blocos.push({
      tipo: locutoresReais.size > 1 ? "cruzado" : "solo",
      segmentos: grupo,
      start: Math.min(...grupo.map((g) => g.start)),
      end: Math.max(...grupo.map((g) => g.end)),
    });
  }

  return blocos.sort((a, b) => a.start - b.start);
}

export function LayoutColumns({ segmentos }: { segmentos: PreviewSegment[] }) {
  const m = calcularMetricas(segmentos);
  const blocos = agruparEmBlocos(segmentos);

  return (
    <div className="space-y-4">
      {blocos.map((bloco, i) => {
        if (bloco.tipo === "solo") {
          return (
            <div key={i} className="space-y-2">
              {bloco.segmentos.map((s, j) => {
                const cor = corDoLocutor(s.speaker, m.locutores);

                // Um bloco é "solo" quando só uma pessoa toma a palavra — mas
                // ele PODE conter a interjeição de outra ("Isso." por cima da
                // fala do Madu). Sem este ramo, o "Isso." virava balão inteiro
                // e parecia um turno, quebrando o fluxo justamente onde a ideia
                // era não quebrar.
                if (ehBackchannel(s)) {
                  return (
                    <div key={j} className="flex items-center gap-2 pl-6">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cor.dot)} />
                      <span className="text-xs text-gray-500">
                        <span className={cn("font-medium", cor.text)}>{s.speaker}</span>{" "}
                        &ldquo;{s.text}&rdquo;
                      </span>
                      <span className="text-[10px] text-gray-300">{tempo(s.start)}</span>
                    </div>
                  );
                }

                return (
                  <div key={j} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", cor.dot)} />
                      <span className={cn("text-sm font-semibold", cor.text)}>{s.speaker}</span>
                      <span className="text-[11px] text-gray-400">{tempo(s.start)}</span>
                    </div>
                    <div className={cn("rounded-2xl border px-4 py-2.5 text-sm leading-relaxed text-gray-700", cor.bg, cor.border)}>
                      {s.text}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Bloco cruzado: uma coluna por locutor
        const porLocutor = new Map<string, PreviewSegment[]>();
        for (const s of bloco.segmentos) {
          if (!porLocutor.has(s.speaker)) porLocutor.set(s.speaker, []);
          porLocutor.get(s.speaker)!.push(s);
        }

        return (
          <div key={i} className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-gray-500">
              <span>⇄ falando ao mesmo tempo</span>
              <span className="text-gray-400">
                {tempo(bloco.start)}–{tempo(bloco.end)} · {(bloco.end - bloco.start).toFixed(0)}s
              </span>
            </div>
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${porLocutor.size}, minmax(0, 1fr))` }}
            >
              {[...porLocutor.entries()].map(([loc, falas]) => {
                const cor = corDoLocutor(loc, m.locutores);
                return (
                  <div key={loc} className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", cor.dot)} />
                      <span className={cn("text-xs font-semibold", cor.text)}>{loc}</span>
                    </div>
                    {falas.map((s, j) => (
                      <div
                        key={j}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-[13px] leading-relaxed text-gray-700",
                          cor.bg,
                          cor.border,
                          ehBackchannel(s) && "opacity-70 italic",
                        )}
                      >
                        <span className="mr-1 text-[10px] text-gray-400">{tempo(s.start)}</span>
                        {s.text}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
