"use client";

import { RiskFactorsCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface RiskFactorsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "orange";
  data: RiskFactorsCardData;
}

export function RiskFactorsCard({
  title,
  variant = "orange",
  data,
}: RiskFactorsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("alert-triangle");

  const factors =
    data.riskFactors && Array.isArray(data.riskFactors) ? data.riskFactors : [];

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
          <h3 className="font-semibold text-gray-900 leading-snug truncate min-w-0 flex-1">{title}</h3>
        </TruncatedTooltip>
      </div>

      {/* Content */}
      <div className="p-5">
        {factors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {factors.map((factor, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center rounded-lg border ${styles.border} ${styles.bg} px-3 py-1.5 text-sm font-medium ${styles.text} break-words`}
              >
                {factor}
              </span>
            ))}
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
