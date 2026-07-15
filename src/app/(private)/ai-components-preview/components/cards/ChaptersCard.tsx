"use client";

import { Play } from "lucide-react";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";
import { TruncatedTooltip } from "../core/TruncatedTooltip";

/**
 * chapters_card (trilha IA): capítulos por assunto com timestamp. Clicar num
 * capítulo pula o player de áudio para o início daquele assunto (mesmo evento
 * do playback clicável: exvoice:seek).
 */

interface Chapter {
  title: string;
  start: number;
}

interface ChaptersCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: { chapters?: Chapter[] };
}

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
}: ChaptersCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("history");
  const chapters = (data?.chapters ?? [])
    .filter((c) => c?.title)
    .sort((a, b) => a.start - b.start);

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm`}
    >
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${styles.border}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <TruncatedTooltip content={title}>
          <h3 className="truncate leading-snug font-semibold text-gray-900">
            {title}
          </h3>
        </TruncatedTooltip>
      </div>

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
    </div>
  );
}
