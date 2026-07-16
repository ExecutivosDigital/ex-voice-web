"use client";

import { cn } from "@/utils/cn";
import { Minus, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PreviewSegment } from "../mock/conversa-real";
import { waveform } from "../mock/waveform";
import { calcularMetricas, corDoLocutor, ehBackchannel, tempo } from "../lib/overlap";
import { empilhar, faixasDeOverlap } from "../lib/stacking";

/**
 * LAYOUT D — Timeline tipo Audacity + transcrição sincronizada.
 *
 * A ideia é do Victor, vinda da própria sessão de anotação dele no Audacity:
 * faixa de áudio com scroll lateral e os trechos "se desmontando" em linhas
 * abaixo conforme a conversa se cruza.
 *
 * O QUE O AUDACITY ACERTA: o eixo X é o tempo, então sobreposição é
 * literalmente visível — dois blocos na mesma coluna. E o empilhamento em
 * linhas resolve a colisão sem esconder nada.
 *
 * O QUE ELE ERRA, e o print prova: a caixa é dimensionada pelo TEMPO, e texto
 * não tem relação com tempo. Na sessão do Victor lê-se "Victor Ogawa | Estou
 * gravando agora, então, né? Estou fazendo algumas al..." — truncado. Um turno
 * de 26s vira uma faixa larga com pouco texto; um "Uhum" de 0.7s vira uma
 * caixinha ilegível. Como transcrição para LER, é ruim, e não tem conserto
 * dentro da metáfora.
 *
 * A SAÍDA: não usar a timeline para ler. Ela é para VER a estrutura e NAVEGAR
 * ("onde eles se atropelaram?" → clica → a transcrição embaixo pula pra lá).
 * A leitura fica na lista abaixo, onde o texto manda no espaço. Cada metade faz
 * o que sabe, em vez de uma tentar fazer as duas e falhar nas duas.
 */

const ZOOMS = [1, 2, 4, 8];
const ALTURA_LINHA = 26;

export function LayoutAudacity({ segmentos }: { segmentos: PreviewSegment[] }) {
  const m = calcularMetricas(segmentos);
  const [zoom, setZoom] = useState(1);
  const [selecionado, setSelecionado] = useState<PreviewSegment | null>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  const { trechos, linhas } = useMemo(() => empilhar(segmentos), [segmentos]);
  const overlaps = useMemo(() => faixasDeOverlap(segmentos), [segmentos]);

  const pct = (s: number) => (s / m.duracao) * 100;

  function irPara(seg: PreviewSegment) {
    setSelecionado(seg);
    const el = listaRef.current?.querySelector(`[data-seg="${seg.start}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Marcas de tempo a cada 15s
  const marcas = useMemo(() => {
    const out: number[] = [];
    for (let t = 0; t <= m.duracao; t += 15) out.push(t);
    return out;
  }, [m.duracao]);

  return (
    <div className="space-y-4">
      {/* Zoom */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-500">
          Clique num bloco para ler a fala inteira embaixo.
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => ZOOMS[Math.max(0, ZOOMS.indexOf(z) - 1)])}
            disabled={zoom === ZOOMS[0]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
          >
            <Minus size={13} />
          </button>
          <span className="w-8 text-center text-[11px] text-gray-500">{zoom}×</span>
          <button
            onClick={() => setZoom((z) => ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(z) + 1)])}
            disabled={zoom === ZOOMS[ZOOMS.length - 1]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* TIMELINE — scroll lateral */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <div style={{ width: `${zoom * 100}%`, minWidth: "100%" }}>
          {/* régua de tempo */}
          <div className="relative h-5 border-b border-gray-100 bg-gray-50/60">
            {marcas.map((t) => (
              <span
                key={t}
                className="absolute top-0.5 -translate-x-1/2 text-[9px] text-gray-400"
                style={{ left: `${pct(t)}%` }}
              >
                {tempo(t)}
              </span>
            ))}
          </div>

          {/* forma de onda — uma faixa por canal */}
          {(["local", "remote"] as const).map((canal) => {
            const picos = waveform[canal];
            const locutoresDoCanal = [
              ...new Set(segmentos.filter((s) => s.channel === canal).map((s) => s.speaker)),
            ];
            const cor = corDoLocutor(locutoresDoCanal[0] ?? "", m.locutores);
            return (
              <div key={canal} className="relative border-b border-gray-100">
                <span className="absolute top-1 left-1.5 z-10 rounded bg-white/80 px-1 text-[8px] font-medium text-gray-400 uppercase">
                  {canal === "local" ? "seu microfone" : "chamada"}
                </span>
                <div className="flex h-9 items-center gap-px px-px">
                  {picos.map((p, i) => (
                    <div
                      key={i}
                      className={cn("flex-1 rounded-full", cor.dot)}
                      style={{ height: `${Math.max(2, p * 100)}%`, opacity: 0.5 }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* faixas de conversa cruzada */}
          <div className="relative h-3 border-b border-gray-100 bg-gray-50/40">
            {overlaps.map((f, i) => (
              <div
                key={i}
                title={`${f.locutores.join(" + ")} · ${(f.end - f.start).toFixed(1)}s`}
                className="absolute inset-y-0 bg-rose-400/40"
                style={{ left: `${pct(f.start)}%`, width: `${pct(f.end - f.start)}%` }}
              />
            ))}
            <span className="absolute top-0 left-1.5 text-[8px] font-medium text-gray-400 uppercase">
              falando junto
            </span>
          </div>

          {/* trechos empilhados — o "desmontando em linhas" do Audacity */}
          <div className="relative" style={{ height: linhas * ALTURA_LINHA + 8 }}>
            {trechos.map(({ seg, linha }, i) => {
              const cor = corDoLocutor(seg.speaker, m.locutores);
              const ativo = selecionado === seg;
              return (
                <button
                  key={i}
                  onClick={() => irPara(seg)}
                  title={`${seg.speaker} · ${tempo(seg.start)}–${tempo(seg.end)}\n${seg.text}`}
                  className={cn(
                    "absolute overflow-hidden rounded border px-1.5 text-left text-[10px] whitespace-nowrap transition",
                    cor.bg,
                    cor.border,
                    ehBackchannel(seg) && "italic opacity-70",
                    ativo && "ring-2 ring-gray-900 ring-offset-1",
                  )}
                  style={{
                    left: `${pct(seg.start)}%`,
                    width: `${pct(seg.end - seg.start)}%`,
                    top: linha * ALTURA_LINHA + 4,
                    height: ALTURA_LINHA - 6,
                  }}
                >
                  <span className={cn("font-semibold", cor.text)}>{seg.speaker}</span>
                  <span className="text-gray-500"> {seg.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400">
        A timeline mostra o <strong>formato</strong> da conversa: onde as vozes se
        cruzam, quem dominou, quem só pontuou. Ela <strong>não</strong> serve para
        ler — a caixa é do tamanho do tempo, não do texto (é por isso que no
        Audacity as falas aparecem cortadas). A leitura fica abaixo.
      </p>

      {/* TRANSCRIÇÃO — aqui o texto manda no espaço */}
      <div ref={listaRef} className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/40 p-3">
        {segmentos.map((s, i) => {
          const cor = corDoLocutor(s.speaker, m.locutores);
          const ativo = selecionado === s;
          return (
            <div
              key={i}
              data-seg={s.start}
              className={cn(
                "rounded-xl p-2 transition",
                ativo && "bg-white ring-2 ring-gray-900",
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", cor.dot)} />
                <span className={cn("text-xs font-semibold", cor.text)}>{s.speaker}</span>
                <span className="text-[10px] text-gray-400">
                  {tempo(s.start)}–{tempo(s.end)}
                </span>
              </div>
              <p className={cn("mt-0.5 text-sm leading-relaxed text-gray-700", ehBackchannel(s) && "text-xs text-gray-500 italic")}>
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
