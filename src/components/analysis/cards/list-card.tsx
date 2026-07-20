"use client";

import { Check, ClipboardCheck, Copy, Gavel, Handshake } from "lucide-react";
import { useState } from "react";
import { CardShell, CopyAllButton } from "../card-shell";
import type { ActionItem, VariantColor } from "../types";

/**
 * Card de lista copy-paste-ável — ações/to-dos, decisões e compromissos
 * (actions_card, decisions_card, commitments_card). Cada item tem texto
 * principal, detalhe e chips de metadados (Responsável, Prazo, status).
 */

const ICON_BY_TYPE = {
  actions_card: ClipboardCheck,
  decisions_card: Gavel,
  commitments_card: Handshake,
} as const;

function itemToText(item: ActionItem): string {
  const meta = (item.metadata ?? [])
    .map((m) => `${m.label}: ${m.value}`)
    .join(" · ");
  return [`• ${item.primary}`, item.secondary, meta && `  (${meta})`]
    .filter(Boolean)
    .join(" — ");
}

export function ListCard({
  type,
  title,
  variant = "emerald",
  data,
}: {
  type: keyof typeof ICON_BY_TYPE;
  title: string;
  variant?: VariantColor;
  data: { items?: ActionItem[] };
}) {
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
    <CardShell
      icon={ICON_BY_TYPE[type]}
      title={title}
      variant={variant}
      headerAction={
        items.length > 0 ? (
          <CopyAllButton copied={copiedAll} onCopy={copyAll} />
        ) : undefined
      }
    >
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
    </CardShell>
  );
}
