"use client";

import { DifferentialDiagnosisCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface DifferentialDiagnosisCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "purple";
  data: DifferentialDiagnosisCardData;
}

export function DifferentialDiagnosisCard({
  title,
  variant = "purple",
  data,
}: DifferentialDiagnosisCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("git-branch");

  // Detectar formato: genérico (items[]) ou legado (differentials[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? data.items : [];

  // Converter formato legado para genérico
  const legacyItems =
    data.differentials && Array.isArray(data.differentials)
      ? data.differentials.map((diff) => ({
          primary: diff.name,
          metadata: [
            diff.probability ? { label: "Probabilidade", value: diff.probability } : null,
          ].filter(Boolean) as Array<{ label: string; value: string }>,
          status: diff.excluded ? "Excluído" : "Possível",
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
      <div className="flex flex-col gap-2 p-5">
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item, index) => {
            const statusStr =
              item.status && typeof item.status === "string"
                ? item.status
                : String(item.status || "");
            const isExcluded =
              statusStr &&
              (statusStr.toLowerCase().includes("excluído") ||
                statusStr.toLowerCase().includes("excluido") ||
                statusStr.toLowerCase().includes("excluded"));
            const probability =
              item.metadata?.find(
                (m: { label: string; value: string }) =>
                  m.label && typeof m.label === "string" && m.label.toLowerCase().includes("probabilidade")
              )?.value || "";

            return (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  isExcluded
                    ? "border-gray-100 bg-gray-50 opacity-60"
                    : `${styles.border} ${styles.bg}`
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium leading-snug ${
                      isExcluded ? "text-gray-400 line-through" : "text-gray-900"
                    }`}
                  >
                    {item.primary}
                  </p>
                  {probability && (
                    <p className="mt-0.5 text-xs text-gray-500">Probabilidade: {probability}</p>
                  )}
                </div>
                {isExcluded ? (
                  <span className="shrink-0 rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase whitespace-nowrap">
                    Excluído
                  </span>
                ) : (
                  <span
                    className={`shrink-0 rounded-md ${styles.iconBg} px-2 py-0.5 text-[10px] font-bold tracking-wide ${styles.text} uppercase whitespace-nowrap`}
                  >
                    Possível
                  </span>
                )}
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
