"use client";

import type {
  RecordingDetailsProps,
  RecordingSpeakerSpeechProps,
} from "@/@types/general-client";
import { cn } from "@/utils/cn";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buildSpeakerStyleMap } from "./speaker-palette";
import { SpeechList } from "./speech-list";

/**
 * Agenda — a outra visão avançada da transcrição (ideia do João, 16/07).
 *
 * "Se a fala 1 só tem ela, ela ocupa o espaço inteiro. Se duas pessoas falaram,
 * essa aqui vem até o momento que a outra começou, e aí a fala da outra começa e
 * as duas descem juntos."
 *
 * O tempo é a VERTICAL: quem corta no meio aparece na altura exata do corte, e
 * quem fala junto divide a largura — como dois compromissos no mesmo horário.
 * Diferente da timeline (que deita o tempo e separa VER de LER), aqui dá para
 * ler e ver a simultaneidade no mesmo lugar, ao custo de espaço.
 *
 * O preço, antecipado pelo próprio João: "cinco pessoas vai começar a apertar
 * demais as falas". Com 2-3 é confortável.
 */

interface Trecho {
  id: string;
  speakerId: string;
  nome: string;
  start: number;
  end: number;
  texto: string;
}

const ESCALAS = [1.5, 3, 6, 12]; // pixels por segundo

/**
 * Piso de VISIBILIDADE, não de leitura. Dar altura suficiente para texto faria
 * turno curto invadir o seguinte — e colisão, num layout cuja promessa é mostrar
 * o instante exato do corte, mente sobre a única coisa que ele existe para
 * contar. A altura é sempre o tempo; o texto aparece quando cabe.
 */
const ALTURA_MINIMA = 12;

function tempo(s: number): string {
  const m = Math.floor(s / 60);
  const seg = Math.floor(s % 60);
  return `${m}:${String(seg).padStart(2, "0")}`;
}

function ehInterjeicao(t: Trecho): boolean {
  return t.end - t.start < 1.5 && t.texto.trim().split(/\s+/).length <= 4;
}

function cruzam(a: Trecho, b: Trecho): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Grupos por transitividade + primeira coluna livre (algoritmo clássico de
 * agenda). Interjeição NÃO disputa coluna: um "uhum" de 0.7s dividiria ao meio
 * a largura de um turno de 26s e, como o grupo é conectado por transitividade,
 * espremeria a conversa toda em volta.
 */
function posicionar(trechos: Trecho[]) {
  const ordenados = trechos
    .filter((t) => !ehInterjeicao(t))
    .sort((a, b) => a.start - b.start);
  const usados = new Set<Trecho>();
  const out: { t: Trecho; coluna: number; colunas: number }[] = [];

  for (const t of ordenados) {
    if (usados.has(t)) continue;
    const grupo = [t];
    usados.add(t);
    let cresceu = true;
    while (cresceu) {
      cresceu = false;
      for (const outro of ordenados) {
        if (usados.has(outro)) continue;
        if (grupo.some((g) => cruzam(g, outro))) {
          grupo.push(outro);
          usados.add(outro);
          cresceu = true;
        }
      }
    }
    grupo.sort((a, b) => a.start - b.start);
    const fimDaColuna: number[] = [];
    const colunaDe = new Map<Trecho, number>();
    for (const g of grupo) {
      let c = fimDaColuna.findIndex((f) => f <= g.start);
      if (c === -1) {
        c = fimDaColuna.length;
        fimDaColuna.push(g.end);
      } else {
        fimDaColuna[c] = g.end;
      }
      colunaDe.set(g, c);
    }
    const colunas = Math.max(1, fimDaColuna.length);
    for (const g of grupo) out.push({ t: g, coluna: colunaDe.get(g) ?? 0, colunas });
  }
  return out;
}

export function TranscriptionAgenda({
  recording,
  speeches,
}: {
  recording: RecordingDetailsProps;
  speeches: RecordingSpeakerSpeechProps[];
}) {
  const [escala, setEscala] = useState(ESCALAS[2]);
  const [posicao, setPosicao] = useState(0);

  const estilos = useMemo(() => buildSpeakerStyleMap(recording.speakers), [recording.speakers]);
  const nomePorId = useMemo(() => {
    const m = new Map<string, string>();
    recording.speakers?.forEach((s) => m.set(s.id, s.name));
    return m;
  }, [recording.speakers]);

  const trechos: Trecho[] = useMemo(
    () =>
      speeches
        .map((s) => ({
          id: `${s.speakerId}@${s.startTime}`,
          speakerId: s.speakerId,
          nome: nomePorId.get(s.speakerId) ?? "Locutor",
          start: s.startTime,
          end: s.endTime,
          texto: s.transcription,
        }))
        .sort((a, b) => a.start - b.start),
    [speeches, nomePorId],
  );

  const duracao = useMemo(
    () => (trechos.length ? Math.max(...trechos.map((t) => t.end)) : 0),
    [trechos],
  );
  const posicionados = useMemo(() => posicionar(trechos), [trechos]);
  const altura = duracao * escala;

  /** Observa o player do topo — ele é dono do áudio (contrato "exvoice:seek"). */
  useEffect(() => {
    const el = document.querySelector("audio");
    if (!el) return;
    const onTime = () => setPosicao(el.currentTime);
    el.addEventListener("timeupdate", onTime);
    setPosicao(el.currentTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, []);

  function tocarEm(segundo: number) {
    window.dispatchEvent(new CustomEvent("exvoice:seek", { detail: { time: segundo } }));
  }

  const marcas = useMemo(() => {
    const passo = duracao > 600 ? 120 : duracao > 300 ? 60 : 30;
    const out: number[] = [];
    for (let t = 0; t <= duracao; t += passo) out.push(t);
    return out;
  }, [duracao]);

  if (!trechos.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-500">
          A altura é o tempo. Clique numa fala para ouvir.
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEscala((e) => ESCALAS[Math.max(0, ESCALAS.indexOf(e) - 1)])}
            disabled={escala === ESCALAS[0]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
            aria-label="Diminuir escala"
          >
            <Minus size={13} />
          </button>
          <span className="w-12 text-center text-[11px] text-gray-500">{escala}px/s</span>
          <button
            onClick={() => setEscala((e) => ESCALAS[Math.min(ESCALAS.length - 1, ESCALAS.indexOf(e) + 1)])}
            disabled={escala === ESCALAS[ESCALAS.length - 1]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
            aria-label="Aumentar escala"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto rounded-2xl border border-gray-200 bg-white">
        <div className="relative flex">
          {/* eixo do tempo */}
          <div
            className="relative w-12 shrink-0 border-r border-gray-100 bg-gray-50/50"
            style={{ height: altura }}
          >
            {marcas.map((t) => (
              <div key={t} className="absolute right-1.5 -translate-y-1/2" style={{ top: t * escala }}>
                <span className="text-[9px] tabular-nums text-gray-400">{tempo(t)}</span>
              </div>
            ))}
          </div>

          <div className="relative flex-1" style={{ height: altura }}>
            {marcas.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 border-t border-dashed border-gray-100"
                style={{ top: t * escala }}
              />
            ))}

            {/* cursor do player */}
            <div
              className="pointer-events-none absolute inset-x-0 z-10 border-t border-gray-900"
              style={{ top: posicao * escala }}
            />

            {posicionados.map(({ t, coluna, colunas }) => {
              const cor = estilos[t.speakerId];
              const alturaDoBloco = Math.max(ALTURA_MINIMA, (t.end - t.start) * escala);
              const cabeNome = alturaDoBloco >= 18;
              const cabeTexto = alturaDoBloco > 44;
              const soando = t.start <= posicao && posicao < t.end;

              return (
                <button
                  key={t.id}
                  onClick={() => tocarEm(t.start)}
                  title={`${t.nome} · ${tempo(t.start)}–${tempo(t.end)}\n${t.texto}`}
                  className={cn(
                    "absolute overflow-hidden rounded-lg border text-left transition",
                    cabeNome ? "px-2 py-1" : "px-0 py-0",
                    cor?.bg ?? "bg-gray-50",
                    cor?.ring ?? "ring-gray-200",
                    soando && "ring-2 ring-gray-900",
                  )}
                  style={{
                    top: t.start * escala,
                    height: alturaDoBloco,
                    left: `${(coluna / colunas) * 100}%`,
                    width: `calc(${(1 / colunas) * 100}% - 4px)`,
                  }}
                >
                  {cabeNome && (
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cor?.dot)} />
                      <span className={cn("truncate text-[10px] font-semibold", cor?.text)}>
                        {t.nome}
                      </span>
                      <span className="shrink-0 text-[9px] tabular-nums text-gray-400">
                        {tempo(t.start)} – {tempo(t.end)}
                      </span>
                    </div>
                  )}
                  {cabeTexto && (
                    <p className="mt-0.5 line-clamp-[8] text-[11px] leading-snug text-gray-600">
                      {t.texto}
                    </p>
                  )}
                </button>
              );
            })}

            {/* interjeições por cima, no seu instante — não disputam coluna */}
            {trechos.filter(ehInterjeicao).map((t) => {
              const cor = estilos[t.speakerId];
              return (
                <button
                  key={`bc-${t.id}`}
                  onClick={() => tocarEm(t.start)}
                  title={`${t.nome} · ${tempo(t.start)}\n"${t.texto}"`}
                  className="absolute right-1 flex items-center gap-1 rounded bg-white/85 px-1"
                  style={{ top: t.start * escala - 6 }}
                >
                  <span className={cn("h-2 w-1 shrink-0 rounded-full", cor?.dot)} />
                  <span className="text-[9px] whitespace-nowrap text-gray-500 italic">
                    {t.nome}: &ldquo;{t.texto}&rdquo;
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <SpeechList
        trechos={trechos}
        estilos={estilos}
        posicao={posicao}
        onSeek={tocarEm}
      />

      <p className="text-[11px] text-gray-400">
        Duas pessoas falando dividem a largura, como dois compromissos no mesmo
        horário. Falas curtas viram barras — a leitura delas fica na lista acima,
        que acompanha o áudio.
      </p>
    </div>
  );
}
