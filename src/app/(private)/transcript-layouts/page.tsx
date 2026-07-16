"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { LayoutAudacity } from "./components/layout-audacity";
import { LayoutBadge } from "./components/layout-badge";
import { LayoutColumns } from "./components/layout-columns";
import { LayoutTimeline } from "./components/layout-timeline";
import { calcularMetricas } from "./lib/overlap";
import { conversaReal } from "./mock/conversa-real";

/**
 * Preview para DECIDIR o layout da transcrição com fala simultânea.
 *
 * Existe porque, desde 16/07, a gravação online separa o microfone do áudio da
 * aba/tela em canais distintos — e o motor passou a reportar sobreposição pela
 * primeira vez (de 0.0s para 49.7s numa gravação de 99s). O layout linear de
 * hoje não tem como mostrar isso: ele enfileira os balões por início e o leitor
 * não sabe que duas pessoas falavam juntas.
 *
 * Os 3 layouts partem da mesma premissa — leitura é linear, ninguém lê dois
 * balões ao mesmo tempo — e discordam em COMO sinalizar a simultaneidade.
 *
 * Rota temporária, para escolha. Depois da decisão, o vencedor vai para
 * recordings/[id] e esta pasta sai.
 */

type LayoutKey = "timeline" | "badge" | "columns" | "audacity";

const LAYOUTS: {
  key: LayoutKey;
  nome: string;
  aposta: string;
  aFavor: string;
  contra: string;
}[] = [
  {
    key: "timeline",
    nome: "A · Régua lateral",
    aposta: "Você LÊ em fila e VÊ a sobreposição de relance.",
    aFavor: "Tira o tempo de dentro do texto e põe onde o olho capta sem ler.",
    contra: "Ocupa uma faixa lateral; some no celular.",
  },
  {
    key: "badge",
    nome: "B · Marca de sobreposição",
    aposta: "Mantém o que existe e só acrescenta o sinal que falta.",
    aFavor: "Menor mudança, sem espaço extra, funciona no celular.",
    contra: "20s de conversa cruzada viram um selo de uma linha.",
  },
  {
    key: "columns",
    nome: "C · Colunas paralelas",
    aposta: "Mostra a simultaneidade no espaço, não em texto.",
    aFavor: "O único que transmite a intensidade do crosstalk.",
    contra: "Quebra a leitura linear; sofre com 3+ locutores e no celular.",
  },
  {
    key: "audacity",
    nome: "D · Timeline (tipo Audacity)",
    aposta:
      "Separa os dois trabalhos: a timeline serve para VER e NAVEGAR; a lista embaixo, para LER.",
    aFavor:
      "Eixo X é o tempo, então sobreposição é literalmente visível — e a altura das linhas mostra o caos.",
    contra:
      "Duas áreas para olhar; a timeline sozinha não se lê (caixa é do tamanho do tempo, não do texto).",
  },
];

export default function TranscriptLayoutsPage() {
  const [layout, setLayout] = useState<LayoutKey>("timeline");
  const m = calcularMetricas(conversaReal);
  const atual = LAYOUTS.find((l) => l.key === layout)!;

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-gray-900">
          Como mostrar fala simultânea?
        </h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Conversa real de 16/07 — a primeira gravação com o microfone e o áudio da
          chamada em canais separados. Antes disso o motor reportava{" "}
          <strong>zero</strong> sobreposição, sempre; nesta gravação ele reporta{" "}
          <strong>{m.overlapSegundos.toFixed(0)}s</strong>. É esse dado novo que o
          layout de hoje não sabe exibir.
        </p>
      </header>

      {/* Números da conversa */}
      <div className="flex flex-wrap gap-2">
        {[
          { l: "duração", v: `${m.duracao.toFixed(0)}s` },
          { l: "locutores", v: String(m.locutores.length) },
          { l: "fala simultânea", v: `${m.overlapSegundos.toFixed(0)}s (${m.overlapPct.toFixed(0)}%)` },
          { l: "turnos sobrepostos", v: String(m.turnosSobrepostos) },
          { l: "interjeições", v: String(m.backchannels) },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-gray-200 bg-white px-3 py-1.5">
            <div className="text-[10px] tracking-wide text-gray-400 uppercase">{s.l}</div>
            <div className="text-sm font-semibold text-gray-800">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Seletor */}
      <div className="flex flex-wrap gap-2">
        {LAYOUTS.map((l) => (
          <button
            key={l.key}
            onClick={() => setLayout(l.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              layout === l.key
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
            )}
          >
            {l.nome}
          </button>
        ))}
      </div>

      {/* Aposta do layout atual */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm">
        <p className="font-medium text-gray-800">{atual.aposta}</p>
        <div className="mt-2 grid gap-1 text-xs text-gray-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-emerald-700">A favor:</span> {atual.aFavor}
          </p>
          <p>
            <span className="font-semibold text-rose-700">Contra:</span> {atual.contra}
          </p>
        </div>
      </div>

      {/* O layout */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 md:p-6">
        {layout === "timeline" && <LayoutTimeline segmentos={conversaReal} />}
        {layout === "badge" && <LayoutBadge segmentos={conversaReal} />}
        {layout === "columns" && <LayoutColumns segmentos={conversaReal} />}
        {layout === "audacity" && <LayoutAudacity segmentos={conversaReal} />}
      </div>

      <p className="text-xs text-gray-400">
        Interjeição = fala curta que não toma a palavra (&ldquo;Isso.&rdquo;,
        &ldquo;uhum&rdquo;). Todos os layouts as tratam como chip discreto — o que
        muda entre eles é como sinalizam turnos inteiros sobrepostos.
      </p>
    </div>
  );
}
