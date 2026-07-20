"use client";

import { History, Play } from "lucide-react";
import { CardShell } from "../card-shell";
import type { Chapter, VariantColor } from "../types";

/**
 * chapters_card: capítulos por assunto com timestamp. Clicar num capítulo
 * pula o player de áudio para aquele momento (mesmo evento do playback
 * clicável da transcrição: exvoice:seek).
 */

function fmt(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function seekAudioTo(time: number) {
  window.dispatchEvent(new CustomEvent("exvoice:seek", { detail: { time } }));
}

export function ChaptersCard({
  title,
  variant = "gray",
  data,
}: {
  title: string;
  variant?: VariantColor;
  data: { chapters?: Chapter[] };
}) {
  const chapters = (data?.chapters ?? [])
    .filter((c) => c?.title)
    .sort((a, b) => a.start - b.start);

  return (
    <CardShell icon={History} title={title} variant={variant}>
      <div className="flex flex-1 flex-col p-2">
        {chapters.length === 0 ? (
          <p className="p-3 text-sm text-gray-400 italic">Sem capítulos.</p>
        ) : (
          chapters.map((chapter, i) => (
            <button
              key={i}
              onClick={() => seekAudioTo(chapter.start)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-gray-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition group-hover:bg-gray-900 group-hover:text-white">
                <Play size={12} className="translate-x-[1px]" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                {chapter.title}
              </span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-gray-400">
                {fmt(chapter.start)}
              </span>
            </button>
          ))
        )}
      </div>
    </CardShell>
  );
}
