"use client";

import { ObservationsCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface ObservationsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: ObservationsCardData;
}

export function ObservationsCard({
  title,
  variant = "amber",
  data,
}: ObservationsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("info");

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
      <div className="p-5 flex-1">
        {data.observations ? (
          <p className="text-sm leading-relaxed text-gray-700 break-words">{data.observations}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">Nenhuma observação disponível</p>
        )}
      </div>
    </div>
  );
}
