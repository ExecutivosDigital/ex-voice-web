"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";
import { TruncatedTooltip } from "../core/TruncatedTooltip";

/**
 * Card de negócio (trilha IA): ações/to-dos, decisões e compromissos —
 * itens copy-paste-áveis com Responsável/Prazo/status. Usado pelos tipos
 * actions_card, decisions_card e commitments_card.
 */

interface ActionItem {
  id?: string | number;
  primary: string;
  secondary?: string;
  metadata?: { label: string; value: string }[];
  tags?: string[];
  status?: string;
}

interface ActionItemsCardProps {
  title: string;
  variant?:
    | "emerald"
    | "blue"
    | "violet"
    | "amber"
    | "teal"
    | "gray"
    | "rose";
  data: { items?: ActionItem[] };
}

function itemToText(item: ActionItem): string {
  const meta = (item.metadata ?? [])
    .map((m) => `${m.label}: ${m.value}`)
    .join(" · ");
  return [`• ${item.primary}`, item.secondary, meta && `  (${meta})`]
    .filter(Boolean)
    .join(" — ");
}

export function ActionItemsCard({
  title,
  variant = "emerald",
  data,
}: ActionItemsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("clipboard-check");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const items = data?.items ?? [];

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(
        [title, ...items.map(itemToText)].join("\n"),
      );
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    } catch {}
  };

  const copyItem = async (item: ActionItem, index: number) => {
    try {
      await navigator.clipboard.writeText(itemToText(item));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {}
  };

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 border-b px-5 py-4 ${styles.border}`}
      >
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
        {items.length > 0 && (
          <button
            onClick={copyAll}
            className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition ${
              copiedAll
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800"
            }`}
            aria-label="Copiar tudo"
          >
            {copiedAll ? <Check size={12} /> : <Copy size={12} />}
            {copiedAll ? "copiado" : "copiar tudo"}
          </button>
        )}
      </div>

      {/* Itens */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nenhum item.</p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id ?? index}
              className="group flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 transition hover:border-gray-200 hover:bg-white"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug font-medium break-words text-gray-900">
                  {item.primary}
                </p>
                {item.secondary && (
                  <p className="mt-0.5 text-xs leading-relaxed break-words text-gray-500">
                    {item.secondary}
                  </p>
                )}
                {((item.metadata?.length ?? 0) > 0 || item.status) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {item.metadata?.map((meta, mi) => (
                      <span
                        key={mi}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        <span className="text-gray-400">{meta.label}:</span>
                        {meta.value}
                      </span>
                    ))}
                    {item.status && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          /conclu/i.test(item.status)
                            ? "bg-emerald-50 text-emerald-700"
                            : /andamento/i.test(item.status)
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => copyItem(item, index)}
                className={`mt-0.5 shrink-0 rounded-md p-1 opacity-0 transition group-hover:opacity-100 ${
                  copiedIndex === index
                    ? "text-emerald-600 opacity-100"
                    : "text-gray-400 hover:text-gray-800"
                }`}
                aria-label="Copiar item"
              >
                {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
