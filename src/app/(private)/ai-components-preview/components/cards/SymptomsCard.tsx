"use client";

import { SymptomsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SymptomsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: SymptomsCardData;
}

export function SymptomsCard({
  title,
  variant = "rose",
  data,
}: SymptomsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("activity");

  // Detectar formato: genérico (items[]) ou legado (symptoms[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = Array.isArray(data.items) ? data.items : [];

  // Converter formato legado para genérico
  const legacyItems = data.symptoms
    ? data.symptoms.map((symptom) => ({
        primary: symptom.name,
        metadata: [
          symptom.frequency ? { label: "Frequência", value: symptom.frequency } : null,
          symptom.severity ? { label: "Severidade", value: symptom.severity } : null,
        ].filter(Boolean) as Array<{ label: string; value: string }>,
      }))
    : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${styles.border}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 leading-snug truncate">{title}</h3>
          {displayItems.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{displayItems.length} item(ns)</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
        {displayItems.length > 0 ? (
          displayItems.map((item, idx) => {
            const hasMetadata = item.metadata && item.metadata.length > 0;
            const hasTags = "tags" in item && item.tags && Array.isArray(item.tags) && item.tags.length > 0;

            return (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
              >
                <svg
                  viewBox="0 0 8 8"
                  fill="currentColor"
                  className={`mt-1.5 h-2 w-2 shrink-0 ${styles.iconText}`}
                >
                  <circle cx="4" cy="4" r="4" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm leading-snug break-words">
                    {item.primary}
                  </p>
                  {"secondary" in item && item.secondary && (
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed break-words">
                      {item.secondary}
                    </p>
                  )}
                  {(hasMetadata || hasTags) && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {hasTags &&
                        (item as any).tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="rounded border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500 whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      {hasMetadata &&
                        item.metadata!.map((meta, i) => (
                          <span
                            key={i}
                            className="rounded border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500 max-w-full truncate"
                          >
                            {meta.value}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">
            Nenhum item disponível
          </div>
        )}
      </div>
    </div>
  );
}
