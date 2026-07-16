"use client";

import { cn } from "@/utils/cn";
import type { PreviewSegment } from "../mock/conversa-real";
import {
  calcularMetricas,
  corDoLocutor,
  ehBackchannel,
  segundosCruzados,
  sobreposicoesDe,
  tempo,
} from "../lib/overlap";

/**
 * LAYOUT B — Balões como hoje + marca de sobreposição.
 *
 * A aposta conservadora: mantém o layout que já existe e só acrescenta o sinal
 * que falta. Quando dois balões se cruzam no tempo, aparece uma barra lateral
 * ligando-os e um selo dizendo com quem e por quanto tempo.
 *
 * A favor: é a menor mudança, não pede espaço extra e funciona no celular.
 * Contra: 20s de conversa cruzada viram um selo de uma linha — fiel ao fato,
 * mas sem transmitir a intensidade.
 */
export function LayoutBadge({ segmentos }: { segmentos: PreviewSegment[] }) {
  const m = calcularMetricas(segmentos);

  return (
    <div className="space-y-2">
      {segmentos.map((s, i) => {
        const cor = corDoLocutor(s.speaker, m.locutores);
        const cruzados = sobreposicoesDe(s, segmentos);
        const temOverlap = cruzados.length > 0;

        if (ehBackchannel(s)) {
          return (
            <div key={i} className="flex items-center gap-2 py-0.5 pl-8">
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cor.dot)} />
              <span className="text-xs text-gray-500">
                <span className={cn("font-medium", cor.text)}>{s.speaker}</span>{" "}
                &ldquo;{s.text}&rdquo;
              </span>
              <span className="text-[10px] text-gray-300">{tempo(s.start)}</span>
            </div>
          );
        }

        // Quanto tempo, e com quem. Agrega POR LOCUTOR somando os segundos:
        // a mesma pessoa pode cruzar com este trecho em falas separadas, e
        // deduplicar pela string formatada deixaria "Bruno (8s) e Bruno (2s)".
        const porLocutor = new Map<string, number>();
        for (const c of cruzados) {
          if (ehBackchannel(c)) continue;
          porLocutor.set(
            c.speaker,
            (porLocutor.get(c.speaker) ?? 0) + segundosCruzados(s, c),
          );
        }
        const detalhe = [...porLocutor.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([loc, seg]) => `${loc} (${Math.round(seg)}s)`);

        return (
          <div key={i} className={cn("relative", temOverlap && "pl-4")}>
            {temOverlap && (
              <span className="absolute top-1 bottom-1 left-0 w-[3px] rounded-full bg-gray-300" />
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", cor.dot)} />
                <span className={cn("text-sm font-semibold", cor.text)}>{s.speaker}</span>
                <span className="text-[11px] text-gray-400">
                  {tempo(s.start)}–{tempo(s.end)}
                </span>
                {detalhe.length > 0 && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                    ⇄ falando junto com {detalhe.join(" e ")}
                  </span>
                )}
              </div>
              <div className={cn("rounded-2xl border px-4 py-2.5 text-sm leading-relaxed text-gray-700", cor.bg, cor.border)}>
                {s.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
