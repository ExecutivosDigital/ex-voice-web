"use client";

import { ChronicConditionsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface ChronicConditionsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "indigo";
  data: ChronicConditionsCardData;
}

export function ChronicConditionsCard({
  title,
  variant = "indigo",
  data,
}: ChronicConditionsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("activity");

  // Detectar formato: genérico (items[]) ou legado (chronicConditions[])
  const isGenericFormat = "items" in data && Array.isArray(data.items) && data.items.length > 0;
  const items = "items" in data && Array.isArray(data.items) ? data.items : [];

  // Converter formato legado para genérico
  const legacyItems =
    data.chronicConditions && Array.isArray(data.chronicConditions) && data.chronicConditions.length > 0
      ? data.chronicConditions.map((condition) => ({
          primary: condition.name || "N/A",
          metadata: [
            condition.since ? { label: "Desde", value: condition.since } : null,
            condition.status ? { label: "Status", value: condition.status } : null,
          ].filter(Boolean) as Array<{ label: string; value: string }>,
        }))
      : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} shadow-sm flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${styles.border}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold leading-snug truncate text-gray-900">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg border ${styles.border} bg-white px-3 py-2.5 shadow-sm`}
            >
              <p className={`text-sm font-semibold leading-snug ${styles.text}`}>
                {item.primary}
              </p>
              {item.metadata && item.metadata.length > 0 && (
                <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">
                  {item.metadata.map((meta: { label: string; value: string }, i: number) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-1">·</span>}
                      {meta.value}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">
            Nenhum item disponível
          </div>
        )}
      </div>
    </div>
  );
}
