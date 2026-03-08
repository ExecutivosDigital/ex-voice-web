"use client";

import { SuggestedExamsCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SuggestedExamsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "indigo";
  data: SuggestedExamsCardData;
}

function priorityColor(value: string) {
  const v = value.toLowerCase();
  if (v.includes("alta")) return "bg-red-400";
  if (v.includes("média") || v.includes("media")) return "bg-yellow-400";
  return "bg-gray-300";
}

export function SuggestedExamsCard({
  title,
  variant = "indigo",
  data,
}: SuggestedExamsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("beaker");

  // Detectar formato: genérico (items[]) ou legado (suggestedExams[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? data.items : [];

  // Converter formato legado para genérico
  const legacyItems =
    data.suggestedExams && Array.isArray(data.suggestedExams)
      ? data.suggestedExams.map((exam) => ({
          primary: exam.name,
          metadata: exam.priority
            ? [{ label: "Prioridade", value: exam.priority }]
            : [],
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
        <TruncatedTooltip content={title}>
          <h3 className="font-semibold text-gray-900 leading-snug truncate">{title}</h3>
        </TruncatedTooltip>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        {displayItems && displayItems.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-50">
            {displayItems.map((item, idx) => {
              const priority =
                item.metadata?.find(
                  (m: { label: string; value: string }) =>
                    m.label && typeof m.label === "string" && m.label.toLowerCase().includes("prioridade")
                )?.value ||
                ("status" in item ? item.status : "") ||
                "";
              const priorityStr = typeof priority === "string" ? priority : String(priority || "");

              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  {priorityStr && (
                    <div className={`h-2 w-2 shrink-0 rounded-full ${priorityColor(priorityStr)}`} />
                  )}
                  <p className="flex-1 min-w-0 text-sm font-medium text-gray-700 leading-snug break-words">
                    {item.primary}
                  </p>
                  {priorityStr && (
                    <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap">{priorityStr}</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">
            Nenhum item disponível
          </div>
        )}
      </div>
    </div>
  );
}
