"use client";

import type {
  RecordingDetailsProps,
  RecordingSpeakerSpeechProps,
} from "@/@types/general-client";
import { cn } from "@/utils/cn";
import { Minus, Pause, Play, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildSpeakerStyleMap } from "./speaker-palette";
import { SpeechList } from "./speech-list";

/**
 * Timeline da transcrição — a visão "avançada" da aba.
 *
 * Escolhida pelo Victor, Gabriel e João em 16/07 entre 4 propostas. A ideia vem
 * do Audacity: eixo X é o tempo, e trechos que se cruzam se empilham em linhas
 * abaixo. Isso importa porque, desde a separação de canais na gravação online, o
 * motor passou a reportar fala simultânea — dado que a lista linear não sabe
 * exibir (ela enfileira por início e o leitor não percebe que duas pessoas
 * falavam juntas).
 *
 * O QUE ELA NÃO É: um lugar para LER. A caixa é do tamanho do TEMPO, e texto não
 * tem relação com tempo — um turno de 26s pode ter menos texto que um de 2s. É
 * por isso que no Audacity as falas aparecem cortadas, e não tem conserto dentro
 * da metáfora. Aqui a timeline serve para VER o formato e NAVEGAR; a leitura
 * fica na visão padrão.
 */

interface Trecho {
  id: string;
  speakerId: string;
  nome: string;
  start: number;
  end: number;
  texto: string;
}

const ZOOMS = [1, 2, 4, 8];
const ALTURA_LINHA = 26;

function tempo(s: number): string {
  const m = Math.floor(s / 60);
  const seg = Math.floor(s % 60);
  return `${m}:${String(seg).padStart(2, "0")}`;
}

/** Fala curta que não toma a palavra ("Isso.", "uhum"). */
function ehInterjeicao(t: Trecho): boolean {
  return t.end - t.start < 1.5 && t.texto.trim().split(/\s+/).length <= 4;
}

/**
 * Empilha em linhas usando a primeira linha livre (interval graph coloring).
 * O nº de linhas acaba sendo o máximo de vozes simultâneas — a altura conta a
 * história sem ninguém ler.
 */
function empilhar(trechos: Trecho[]): { itens: { t: Trecho; linha: number }[]; linhas: number } {
  const ordenados = [...trechos].sort((a, b) => a.start - b.start);
  const fimDaLinha: number[] = [];
  const itens: { t: Trecho; linha: number }[] = [];
  for (const t of ordenados) {
    let linha = fimDaLinha.findIndex((fim) => fim <= t.start);
    if (linha === -1) {
      linha = fimDaLinha.length;
      fimDaLinha.push(t.end);
    } else {
      fimDaLinha[linha] = t.end;
    }
    itens.push({ t, linha });
  }
  return { itens, linhas: Math.max(1, fimDaLinha.length) };
}

/** Faixas com 2+ locutores DISTINTOS falando (não segmentos: o mesmo locutor cruzando ele mesmo não é conversa cruzada). */
function faixasDeOverlap(trechos: Trecho[]) {
  const pontos = [...new Set(trechos.flatMap((t) => [t.start, t.end]))].sort((a, b) => a - b);
  const faixas: { start: number; end: number; nomes: string[] }[] = [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i];
    const b = pontos[i + 1];
    if (b - a < 0.01) continue;
    const meio = (a + b) / 2;
    const ativos = [
      ...new Set(trechos.filter((t) => t.start <= meio && meio < t.end).map((t) => t.speakerId)),
    ];
    if (ativos.length < 2) continue;
    const nomes = [
      ...new Set(trechos.filter((t) => ativos.includes(t.speakerId)).map((t) => t.nome)),
    ];
    const ultima = faixas[faixas.length - 1];
    if (ultima && Math.abs(ultima.end - a) < 0.01) ultima.end = b;
    else faixas.push({ start: a, end: b, nomes });
  }
  return faixas;
}

export function TranscriptionTimeline({
  recording,
  speeches,
}: {
  recording: RecordingDetailsProps;
  speeches: RecordingSpeakerSpeechProps[];
}) {
  const [zoom, setZoom] = useState(1);
  const [posicao, setPosicao] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const trilhaRef = useRef<HTMLDivElement>(null);

  const estilos = useMemo(
    () => buildSpeakerStyleMap(recording.speakers),
    [recording.speakers],
  );
  const nomePorId = useMemo(() => {
    const m = new Map<string, string>();
    recording.speakers?.forEach((s) => m.set(s.id, s.name));
    return m;
  }, [recording.speakers]);

  const trechos: Trecho[] = useMemo(
    () =>
      speeches
        .map((s) => ({
          // RecordingSpeakerSpeechProps nao tem id proprio; a chave natural
          // (locutor + instante de inicio) e unica e estavel.
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
  const { itens, linhas } = useMemo(() => empilhar(trechos), [trechos]);
  const overlaps = useMemo(() => faixasDeOverlap(trechos), [trechos]);
  const onda = recording.waveform ?? null;

  const pct = (s: number) => (duracao ? (s / duracao) * 100 : 0);

  /**
   * Acompanha o player do topo para mover o cursor. Ele é dono do áudio; aqui
   * só se observa. Pega o <audio> da página em vez de manter um próprio — ver
   * `tocarEm`.
   */
  useEffect(() => {
    const el = document.querySelector("audio");
    if (!el) return;
    const onTime = () => setPosicao(el.currentTime);
    const onPlay = () => setTocando(true);
    const onPause = () => setTocando(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    setPosicao(el.currentTime);
    setTocando(!el.paused);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  /**
   * Pula o player do topo da página — NÃO cria um segundo.
   *
   * O `waveform-audio-player` já escuta "exvoice:seek" (contrato usado também
   * pela lista de transcrição e pelo ChaptersCard). Ter um <audio> próprio aqui
   * daria dois players independentes na mesma tela: o usuário toca o de cima,
   * clica num bloco daqui, e os dois tocam juntos.
   */
  function tocarEm(segundo: number) {
    setPosicao(segundo);
    window.dispatchEvent(
      new CustomEvent("exvoice:seek", { detail: { time: segundo } }),
    );
  }

  function cliqueNaTrilha(e: React.MouseEvent<HTMLDivElement>) {
    const box = trilhaRef.current?.getBoundingClientRect();
    if (!box || !duracao) return;
    const frac = (e.clientX - box.left) / box.width;
    tocarEm(Math.max(0, Math.min(duracao, frac * duracao)));
  }

  const marcas = useMemo(() => {
    const passo = duracao > 600 ? 120 : duracao > 300 ? 60 : 15;
    const out: number[] = [];
    for (let t = 0; t <= duracao; t += passo) out.push(t);
    return out;
  }, [duracao]);

  const emReproducao = useMemo(
    () => new Set(trechos.filter((t) => t.start <= posicao && posicao < t.end).map((t) => t.id)),
    [trechos, posicao],
  );

  if (!trechos.length) return null;

  return (
    <div className="space-y-3">
      {/* Faixa de áudio FIXA no topo enquanto a página rola (ideia do Victor,
          21/07): controles + trilha ficam sticky; a lista de falas abaixo é
          conteúdo normal da página, sem scroll próprio. */}
      <div className="sticky top-0 z-30 -mx-2 space-y-3 rounded-b-2xl bg-white/95 px-2 pt-2 pb-3 shadow-[0_12px_20px_-16px_rgba(15,23,42,0.25)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const el = document.querySelector("audio");
              if (!el) return;
              if (el.paused) void el.play().catch(() => {});
              else el.pause();
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-gray-900 px-3 text-xs font-medium text-white transition hover:bg-gray-700"
          >
            {tocando ? <Pause size={13} /> : <Play size={13} />}
            {tocando ? "Pausar" : "Tocar"}
          </button>
          <span className="text-[11px] tabular-nums text-gray-500">
            {tempo(posicao)} / {tempo(duracao)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 hidden text-[11px] text-gray-400 sm:inline">
            clique para ouvir
          </span>
          <button
            onClick={() => setZoom((z) => ZOOMS[Math.max(0, ZOOMS.indexOf(z) - 1)])}
            disabled={zoom === ZOOMS[0]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
            aria-label="Diminuir zoom"
          >
            <Minus size={13} />
          </button>
          <span className="w-7 text-center text-[11px] text-gray-500">{zoom}×</span>
          <button
            onClick={() => setZoom((z) => ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(z) + 1)])}
            disabled={zoom === ZOOMS[ZOOMS.length - 1]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
            aria-label="Aumentar zoom"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <div ref={trilhaRef} className="relative" style={{ width: `${zoom * 100}%`, minWidth: "100%" }}>
          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-px bg-gray-900"
            style={{ left: `${pct(posicao)}%` }}
          >
            <div className="-ml-1 h-2 w-2 rounded-full bg-gray-900" />
          </div>

          <div onClick={cliqueNaTrilha} className="relative h-5 cursor-pointer border-b border-gray-100 bg-gray-50/60">
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

          {/* Onda: só quando existe. Acervo anterior a 17/07 não tem — a timeline
              funciona sem ela (blocos + marcas + áudio), só fica menos bonita. */}
          {onda && onda.length > 0 && (
            <div onClick={cliqueNaTrilha} className="relative cursor-pointer border-b border-gray-100">
              <div className="flex h-12 items-center gap-px px-px">
                {onda.map((p, i) => {
                  const t = (i / onda.length) * duracao;
                  return (
                    <div
                      key={i}
                      className={cn("flex-1 rounded-full", t <= posicao ? "bg-gray-800" : "bg-gray-300")}
                      style={{ height: `${Math.max(2, p * 100)}%` }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {overlaps.length > 0 && (
            <div onClick={cliqueNaTrilha} className="relative h-3 cursor-pointer border-b border-gray-100 bg-gray-50/40">
              {overlaps.map((f, i) => (
                <div
                  key={i}
                  title={`${f.nomes.join(" + ")} · ${(f.end - f.start).toFixed(1)}s`}
                  className="absolute inset-y-0 bg-rose-400/50"
                  style={{ left: `${pct(f.start)}%`, width: `${pct(f.end - f.start)}%` }}
                />
              ))}
              <span className="absolute top-0 left-1.5 text-[8px] font-medium text-gray-400 uppercase">
                falando junto
              </span>
            </div>
          )}

          <div className="relative" style={{ height: linhas * ALTURA_LINHA + 8 }}>
            {itens.map(({ t, linha }) => {
              const cor = estilos[t.speakerId];
              const larguraRelativa = duracao ? ((t.end - t.start) / duracao) * zoom : 0;
              const cabeNome = larguraRelativa > 0.035;
              const cabeTexto = larguraRelativa > 0.12;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelecionado(t.id);
                    tocarEm(t.start);
                  }}
                  title={`${t.nome} · ${tempo(t.start)}–${tempo(t.end)}\n${t.texto}`}
                  className={cn(
                    "absolute overflow-hidden rounded border text-left text-[10px] whitespace-nowrap transition",
                    cabeNome ? "px-1.5" : "px-0",
                    cor?.bg ?? "bg-gray-50", cor?.ring ?? "ring-gray-200",
                    ehInterjeicao(t) && "italic opacity-70",
                    emReproducao.has(t.id) && "ring-1 ring-gray-500",
                    selecionado === t.id && "ring-2 ring-gray-900 ring-offset-1",
                  )}
                  style={{
                    left: `${pct(t.start)}%`,
                    width: `${pct(t.end - t.start)}%`,
                    top: linha * ALTURA_LINHA + 4,
                    height: ALTURA_LINHA - 6,
                  }}
                >
                  {cabeNome && <span className={cn("font-semibold", cor?.text)}>{t.nome}</span>}
                  {cabeTexto && <span className="text-gray-500"> {t.texto}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* A leitura acompanha a navegação: a página segue a fala em reprodução
          (quando o usuário está perto dela), e clicar num bloco da trilha
          seleciona a fala aqui. */}
      <SpeechList
        trechos={trechos}
        estilos={estilos}
        posicao={posicao}
        selecionadoId={selecionado}
        onSeek={tocarEm}
        scrollDaPagina
      />

      <p className="text-[11px] text-gray-400">
        A trilha mostra o <strong>formato</strong> da conversa (onde as vozes se
        cruzam, quem dominou); a lista abaixo acompanha o áudio para leitura.
        Clique em qualquer bloco ou fala para ouvir daquele ponto.
      </p>
    </div>
  );
}
