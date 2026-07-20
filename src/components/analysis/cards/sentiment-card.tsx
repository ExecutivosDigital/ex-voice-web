"use client";

import { cn } from "@/utils/cn";
import { Frown, Meh, Smile } from "lucide-react";
import { CardShell } from "../card-shell";
import type { Sentiment, SentimentHighlight } from "../types";

/** sentiment_card: clima geral da conversa + destaques por trecho. */

const META: Record<
  Sentiment,
  { icon: typeof Smile; label: string; chip: string; ring: string }
> = {
  positivo: {
    icon: Smile,
    label: "Positivo",
    chip: "bg-emerald-50 text-emerald-700",
    ring: "text-emerald-500",
  },
  neutro: {
    icon: Meh,
    label: "Neutro",
    chip: "bg-amber-50 text-amber-700",
    ring: "text-amber-500",
  },
  negativo: {
    icon: Frown,
    label: "Negativo",
    chip: "bg-rose-50 text-rose-600",
    ring: "text-rose-500",
  },
};

export function SentimentCard({
  title,
  data,
}: {
  title: string;
  data: {
    overall?: Sentiment;
    summary?: string;
    highlights?: SentimentHighlight[];
  };
}) {
  const overall = data?.overall ?? "neutro";
  const meta = META[overall] ?? META.neutro;
  const highlights = data?.highlights ?? [];

  return (
    <CardShell
      icon={meta.icon}
      title={title}
      variant="gray"
      headerAction={
        <span
          className={cn(
            "ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            meta.chip,
          )}
        >
          {meta.label}
        </span>
      }
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        {data?.summary && (
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        )}
        {highlights.length > 0 && (
          <div className="flex flex-col gap-2">
            {highlights.map((h, i) => {
              const hm = META[h.sentiment] ?? META.neutro;
              const HIcon = hm.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
                >
                  <HIcon className={cn("mt-0.5 h-4 w-4 shrink-0", hm.ring)} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800">
                      {h.label}
                    </p>
                    <p className="text-xs text-gray-500">{h.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CardShell>
  );
}
