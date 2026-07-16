"use client";

import { cn } from "@/utils/cn";
import { Minus, Pause, Play, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PreviewSegment } from "../mock/conversa-real";
import { calcularMetricas, corDoLocutor, ehBackchannel, tempo } from "../lib/overlap";
import { empilhar, faixasDeOverlap } from "../lib/stacking";

/**
 * LAYOUT D — Timeline tipo Audacity + transcrição sincronizada + áudio.
 *
 * A ideia é do Victor, vinda da própria sessão de anotação dele no Audacity:
 * faixa de áudio com scroll lateral e os trechos "se desmontando" em linhas
 * abaixo conforme a conversa se cruza.
 *
 * O QUE O AUDACITY ACERTA: o eixo X é o tempo, então sobreposição é
 * literalmente visível. E o empilhamento em linhas resolve a colisão sem
 * esconder nada — de brinde, o número de linhas vira dado: trecho tranquilo
 * ocupa 1 linha, atropelo ocupa 2+.
 *
 * O QUE ELE ERRA, e o print do Victor prova: a caixa é dimensionada pelo TEMPO,
 * e texto não tem relação com tempo — na sessão dele lê-se "Victor Ogawa | Estou
 * gravando agora, então, né? Estou fazendo algumas al..." truncado. Como
 * transcrição para LER não tem conserto dentro da metáfora.
 *
 * A SAÍDA: a timeline serve para VER e NAVEGAR; a lista abaixo, para LER.
 *
 * DECISÕES DA REUNIÃO DE 16/07 (Victor + Gabriel + João):
 *  - UMA trilha de áudio, não duas. O motor separa mic × chamada e isso é ótimo
 *    para a transcrição, mas o João questionou mostrar isso ao usuário e o
 *    Victor concordou: "separar para transcrição é ótimo, mas para visualização
 *    do usuário não faz sentido". Quem fala é dito pelos blocos e pelas cores;
 *    a onda só precisa mostrar que há som.
 *  - Áudio clicável foi o pedido mais forte ("se eu conseguisse clicar no áudio
 *    e ouvir, seria absurdo" / João: "se for fácil de fazer, é incrível").
 *  - Início E fim nos tempos (Gabriel: "tem lá só 0,02" — um número só é
 *    ambíguo, não dá para saber se é começo ou fim).
 */

const ZOOMS = [1, 2, 4, 8];
const ALTURA_LINHA = 26;

export function LayoutAudacity({
  segmentos,
  waveform,
  audioUrl,
}: {
  segmentos: PreviewSegment[];
  waveform: { local: number[]; remote: number[] };
  audioUrl?: string;
}) {
  const m = calcularMetricas(segmentos);
  const [zoom, setZoom] = useState(1);
  const [selecionado, setSelecionado] = useState<PreviewSegment | null>(null);
  const [posicao, setPosicao] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const trilhaRef = useRef<HTMLDivElement>(null);

  const { trechos, linhas } = useMemo(() => empilhar(segmentos), [segmentos]);
  const overlaps = useMemo(() => faixasDeOverlap(segmentos), [segmentos]);

  /**
   * Uma onda só: o máximo dos dois canais em cada ponto.
   *
   * `max` e não soma: a soma de dois canais quase-mudos vira uma onda "gorda"
   * falsa, e o pico somado estoura a escala justamente onde os dois falam
   * junto — bem no trecho que já é destacado pela faixa vermelha. O máximo
   * responde a pergunta certa: "tinha som aqui?".
   */
  const onda = useMemo(
    () => waveform.local.map((p, i) => Math.max(p, waveform.remote[i] ?? 0)),
    [waveform],
  );

  const pct = (s: number) => (s / m.duracao) * 100;

  // Acompanha o áudio para mover o cursor
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setPosicao(el.currentTime);
    const onPlay = () => setTocando(true);
    const onPause = () => setTocando(false);
    const onWaiting = () => setCarregando(true);
    const onPlaying = () => setCarregando(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onPlaying);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
    };
  }, []);

  function tocarEm(segundo: number) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = segundo;
    setPosicao(segundo);
    void el.play().catch(() => setCarregando(false));
  }

  function irPara(seg: PreviewSegment, comAudio = true) {
    setSelecionado(seg);
    listaRef.current
      ?.querySelector(`[data-seg="${seg.start}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (comAudio && audioUrl) tocarEm(seg.start);
  }

  /** Clique na régua/onda: pula para aquele instante. */
  function cliqueNaTrilha(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioUrl) return;
    const box = trilhaRef.current?.getBoundingClientRect();
    if (!box) return;
    const frac = (e.clientX - box.left) / box.width;
    tocarEm(Math.max(0, Math.min(m.duracao, frac * m.duracao)));
  }

  const marcas = useMemo(() => {
    const passo = m.duracao > 300 ? 60 : 15;
    const out: number[] = [];
    for (let t = 0; t <= m.duracao; t += passo) out.push(t);
    return out;
  }, [m.duracao]);

  /** O trecho tocando agora — destacado na lista. */
  const emReproducao = useMemo(
    () => segmentos.filter((s) => s.start <= posicao && posicao < s.end),
    [segmentos, posicao],
  );

  return (
    <div className="space-y-4">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* Controles */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {audioUrl && (
            <button
              onClick={() => {
                const el = audioRef.current;
                if (!el) return;
                if (el.paused) void el.play().catch(() => {});
                else el.pause();
              }}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-gray-900 px-3 text-xs font-medium text-white transition hover:bg-gray-700"
            >
              {tocando ? <Pause size={13} /> : <Play size={13} />}
              {tocando ? "Pausar" : "Tocar"}
            </button>
          )}
          <span className="text-[11px] tabular-nums text-gray-500">
            {tempo(posicao)} / {tempo(m.duracao)}
            {carregando && <span className="ml-1 text-gray-300">carregando…</span>}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="mr-1 text-[11px] text-gray-400">
            {audioUrl ? "clique na onda ou num bloco para ouvir" : "sem áudio"}
          </span>
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

      {/* TIMELINE */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <div ref={trilhaRef} className="relative" style={{ width: `${zoom * 100}%`, minWidth: "100%" }}>
          {/* cursor de reprodução */}
          {audioUrl && (
            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-px bg-gray-900"
              style={{ left: `${pct(posicao)}%` }}
            >
              <div className="-ml-1 h-2 w-2 rounded-full bg-gray-900" />
            </div>
          )}

          {/* régua */}
          <div
            onClick={cliqueNaTrilha}
            className={cn("relative h-5 border-b border-gray-100 bg-gray-50/60", audioUrl && "cursor-pointer")}
          >
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

          {/* onda única (decisão da reunião: não expor os 2 canais ao usuário) */}
          <div
            onClick={cliqueNaTrilha}
            className={cn("relative border-b border-gray-100", audioUrl && "cursor-pointer")}
          >
            <div className="flex h-12 items-center gap-px px-px">
              {onda.map((p, i) => {
                const t = (i / onda.length) * m.duracao;
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

          {/* faixas de conversa cruzada */}
          <div
            onClick={cliqueNaTrilha}
            className={cn("relative h-3 border-b border-gray-100 bg-gray-50/40", audioUrl && "cursor-pointer")}
          >
            {overlaps.map((f, i) => (
              <div
                key={i}
                title={`${f.locutores.join(" + ")} · ${(f.end - f.start).toFixed(1)}s`}
                className="absolute inset-y-0 bg-rose-400/50"
                style={{ left: `${pct(f.start)}%`, width: `${pct(f.end - f.start)}%` }}
              />
            ))}
            <span className="absolute top-0 left-1.5 text-[8px] font-medium text-gray-400 uppercase">
              falando junto
            </span>
          </div>

          {/* trechos empilhados */}
          <div className="relative" style={{ height: linhas * ALTURA_LINHA + 8 }}>
            {trechos.map(({ seg, linha }, i) => {
              const cor = corDoLocutor(seg.speaker, m.locutores);
              const ativo = selecionado === seg;
              const soando = emReproducao.includes(seg);

              // Texto só quando cabe. Numa reunião de 10min com 200 trechos, a
              // 1x cada bloco vira uma lasca de poucos pixels e o texto sai
              // picado ("Loc", "L") — ruído que atrapalha justamente o que a
              // timeline faz bem: mostrar o FORMATO da conversa. Zoom revela.
              const larguraRelativa = ((seg.end - seg.start) / m.duracao) * zoom;
              const cabeNome = larguraRelativa > 0.035;
              const cabeTexto = larguraRelativa > 0.12;

              return (
                <button
                  key={i}
                  onClick={() => irPara(seg)}
                  title={`${seg.speaker} · ${tempo(seg.start)}–${tempo(seg.end)}\n${seg.text}`}
                  className={cn(
                    "absolute overflow-hidden rounded border text-left text-[10px] whitespace-nowrap transition",
                    cabeNome ? "px-1.5" : "px-0",
                    cor.bg,
                    cor.border,
                    ehBackchannel(seg) && "italic opacity-70",
                    soando && "ring-1 ring-gray-500",
                    ativo && "ring-2 ring-gray-900 ring-offset-1",
                  )}
                  style={{
                    left: `${pct(seg.start)}%`,
                    width: `${pct(seg.end - seg.start)}%`,
                    top: linha * ALTURA_LINHA + 4,
                    height: ALTURA_LINHA - 6,
                  }}
                >
                  {cabeNome && (
                    <span className={cn("font-semibold", cor.text)}>{seg.speaker}</span>
                  )}
                  {cabeTexto && <span className="text-gray-500"> {seg.text}</span>}
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

      {/* TRANSCRIÇÃO */}
      <div
        ref={listaRef}
        className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/40 p-3"
      >
        {segmentos.map((s, i) => {
          const cor = corDoLocutor(s.speaker, m.locutores);
          const ativo = selecionado === s;
          const soando = emReproducao.includes(s);
          return (
            <div
              key={i}
              data-seg={s.start}
              onClick={() => audioUrl && tocarEm(s.start)}
              className={cn(
                "rounded-xl p-2 transition",
                audioUrl && "cursor-pointer hover:bg-white",
                soando && "bg-white",
                ativo && "bg-white ring-2 ring-gray-900",
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", cor.dot)} />
                <span className={cn("text-xs font-semibold", cor.text)}>{s.speaker}</span>
                {/* início E fim: um número só é ambíguo (pedido do Gabriel) */}
                <span className="text-[10px] tabular-nums text-gray-400">
                  {tempo(s.start)} – {tempo(s.end)}
                </span>
                {soando && <span className="text-[9px] font-medium text-gray-900">▶ tocando</span>}
              </div>
              <p
                className={cn(
                  "mt-0.5 text-sm leading-relaxed text-gray-700",
                  ehBackchannel(s) && "text-xs text-gray-500 italic",
                )}
              >
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
