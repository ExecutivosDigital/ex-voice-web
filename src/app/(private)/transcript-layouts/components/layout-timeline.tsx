"use client";

import { cn } from "@/utils/cn";
import type { PreviewSegment } from "../mock/conversa-real";
import {
  calcularMetricas,
  corDoLocutor,
  ehBackchannel,
  sobreposicoesDe,
  tempo,
} from "../lib/overlap";

/**
 * LAYOUT A — Mapa da conversa + balões lineares.
 *
 * Premissa: leitura é inevitavelmente linear — ninguém lê dois balões ao mesmo
 * tempo. Então o texto vira uma fila (legível) e a simultaneidade é mostrada
 * fora do texto.
 *
 * ⚠ O mapa NÃO se alinha com os balões, e não tem como: ele é proporcional ao
 * TEMPO e o texto é proporcional ao TAMANHO DA FALA. Um turno de 26s pode ter
 * menos texto que um de 2s. Fingir alinhamento seria mentir para o olho.
 * Ele é um mapa: mostra o FORMATO da conversa (quem dominou, onde ficou
 * caótico, quem só pontuou) — coisa que nenhum selo por balão entrega.
 *
 * Backchannels ("Isso.", "uhum") viram chips discretos: não tomam a palavra,
 * então não podem tomar um balão inteiro e quebrar o fluxo.
 */
export function LayoutTimeline({ segmentos }: { segmentos: PreviewSegment[] }) {
  const m = calcularMetricas(segmentos);

  return (
    <div className="flex gap-5">
      {/* Mapa da conversa: uma faixa por locutor, tempo no eixo vertical */}
      <aside className="sticky top-24 hidden h-fit shrink-0 md:block">
        <p className="mb-2 text-[10px] font-medium tracking-wide text-gray-400 uppercase">
          mapa da conversa
        </p>
        <div className="flex gap-1.5">
          {m.locutores.map((loc) => {
            const cor = corDoLocutor(loc, m.locutores);
            return (
              <div key={loc} className="flex flex-col items-center gap-1.5">
                <div className="relative h-[420px] w-4 overflow-hidden rounded-full bg-gray-100">
                  {segmentos
                    .filter((s) => s.speaker === loc)
                    .map((s, i) => (
                      <div
                        key={i}
                        title={`${loc} · ${tempo(s.start)}–${tempo(s.end)}`}
                        className={cn("absolute w-full rounded-full", cor.dot)}
                        style={{
                          top: `${(s.start / m.duracao) * 100}%`,
                          height: `${Math.max(1, ((s.end - s.start) / m.duracao) * 100)}%`,
                          opacity: ehBackchannel(s) ? 0.4 : 1,
                        }}
                      />
                    ))}
                </div>
                <span className={cn("text-[10px] font-medium", cor.text)}>
                  {loc.slice(0, 3)}
                </span>
              </div>
            );
          })}
          <div className="flex flex-col justify-between py-0.5 text-[9px] text-gray-400">
            <span>0:00</span>
            <span>{tempo(m.duracao)}</span>
          </div>
        </div>
      </aside>

      {/* Transcrição linear */}
      <div className="min-w-0 flex-1 space-y-3">
        {segmentos.map((s, i) => {
          const cor = corDoLocutor(s.speaker, m.locutores);
          const cruzados = sobreposicoesDe(s, segmentos);

          if (ehBackchannel(s)) {
            return (
              <div key={i} className="flex items-center gap-2 pl-6">
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
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", cor.dot)} />
                <span className={cn("text-sm font-semibold", cor.text)}>{s.speaker}</span>
                <span className="text-[11px] text-gray-400">
                  {tempo(s.start)}–{tempo(s.end)}
                </span>
                {cruzados.filter((c) => !ehBackchannel(c)).length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    ⇄ junto com{" "}
                    {[
                      ...new Set(
                        cruzados.filter((c) => !ehBackchannel(c)).map((c) => c.speaker),
                      ),
                    ].join(", ")}
                  </span>
                )}
              </div>
              <div className={cn("rounded-2xl border px-4 py-2.5 text-sm leading-relaxed text-gray-700", cor.bg, cor.border)}>
                {s.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
