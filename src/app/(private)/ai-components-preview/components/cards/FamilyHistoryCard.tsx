"use client";

import { FamilyHistoryCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface FamilyHistoryCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "neutral";
  data: FamilyHistoryCardData;
}

export function FamilyHistoryCard({
  title,
  variant = "neutral",
  data,
}: FamilyHistoryCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("dna");

  const items =
    data.familyHistory && Array.isArray(data.familyHistory) ? data.familyHistory : [];

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${styles.border}`}>
        <Icon className="h-5 w-5 shrink-0 text-gray-400" />
        <TruncatedTooltip content={title}>
          <h3 className="font-semibold text-gray-900 leading-snug truncate">{title}</h3>
        </TruncatedTooltip>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 border-l-2 border-dashed border-gray-200 pl-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-snug break-words">
                  {item.relation || "N/A"}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {item.condition || "N/A"}
                </p>
                {item.age && (
                  <p className="mt-0.5 text-xs text-gray-400">{item.age}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">
            Nenhum histórico familiar disponível
          </div>
        )}
      </div>
    </div>
  );
}
