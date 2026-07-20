"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";

/**
 * Lista de falas sincronizada com o player — o "ler" que acompanha o "ver"
 * das visões Timeline e Agenda (feedback 20/07: a timeline precisava ter a
 * transcrição de cada bloco abaixo, como no protótipo original; e na agenda
 * as falas curtas não tinham onde ser lidas).
 *
 * A fala em reprodução é destacada e rola para o centro da lista sozinha.
 * Clicar numa fala pula o áudio (mesmo contrato exvoice:seek de sempre).
 */

export interface SpeechListItem {
  id: string;
  speakerId: string;
  nome: string;
  start: number;
  end: number;
  texto: string;
}

function tempo(s: number): string {
  const m = Math.floor(s / 60);
  const seg = Math.floor(s % 60);
  return `${m}:${String(seg).padStart(2, "0")}`;
}

export function SpeechList({
  trechos,
  estilos,
  posicao,
  selecionadoId,
  onSeek,
}: {
  trechos: SpeechListItem[];
  estilos: Record<string, { bg?: string; text?: string; dot?: string }>;
  /** Posição atual do player (segundos) — destaca e acompanha a fala ativa. */
  posicao: number;
  /** Fala escolhida na visualização acima (clique num bloco) — rola até ela. */
  selecionadoId?: string | null;
  onSeek: (segundo: number) => void;
}) {
  const listaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  const ativa =
    trechos.find((t) => t.start <= posicao && posicao < t.end)?.id ?? null;
  const alvo = selecionadoId ?? ativa;

  useEffect(() => {
    if (!alvo) return;
    const el = itemRefs.current.get(alvo);
    const lista = listaRef.current;
    if (!el || !lista) return;
    // Rola DENTRO da lista (nunca a página) até a fala ativa/selecionada.
    const topoRelativo = el.offsetTop - lista.offsetTop;
    lista.scrollTo({
      top: topoRelativo - lista.clientHeight / 2 + el.clientHeight / 2,
      behavior: "smooth",
    });
  }, [alvo]);

  if (!trechos.length) return null;

  return (
    <div
      ref={listaRef}
      className="max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white"
    >
      <div className="flex flex-col">
        {trechos.map((t) => {
          const cor = estilos[t.speakerId];
          const destaque = t.id === ativa;
          const selecionada = t.id === selecionadoId;
          return (
            <button
              key={t.id}
              ref={(el) => {
                if (el) itemRefs.current.set(t.id, el);
                else itemRefs.current.delete(t.id);
              }}
              onClick={() => onSeek(t.start)}
              className={cn(
                "flex items-start gap-3 border-b border-gray-50 px-4 py-2.5 text-left transition last:border-b-0",
                destaque || selecionada ? "bg-gray-50" : "hover:bg-gray-50/60",
                selecionada && "ring-1 ring-gray-300 ring-inset",
              )}
            >
              <span className="w-12 shrink-0 pt-0.5 text-right font-mono text-[10px] tabular-nums text-gray-400">
                {tempo(t.start)}
              </span>
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  cor?.dot ?? "bg-gray-300",
                )}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    cor?.text ?? "text-gray-700",
                  )}
                >
                  {t.nome}
                </span>
                <span
                  className={cn(
                    "block text-[13px] leading-relaxed break-words",
                    destaque ? "text-gray-900" : "text-gray-600",
                  )}
                >
                  {t.texto}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
