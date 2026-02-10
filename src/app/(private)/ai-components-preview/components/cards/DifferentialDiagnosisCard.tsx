"use client";

import { GitBranch } from "lucide-react";
import { DifferentialDiagnosisCardData, GenericListItem } from "../../types/component-types";
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
  const legacyItems = data.differentials && Array.isArray(data.differentials)
    ? data.differentials.map((diff) => ({
        primary: diff.name,
        metadata: [
          diff.probability && { label: "Probabilidade", value: diff.probability },
        ].filter(Boolean) as Array<{ label: string; value: string }>,
        status: diff.excluded ? "Excluído" : "Possível",
      }))
    : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  return (
    <div className="h-full w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-gray-900 leading-relaxed">{title}</h3>
      </div>
      <div className="space-y-3 min-w-0">
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item, index) => {
            const statusStr = item.status && typeof item.status === 'string' ? item.status : String(item.status || '');
            const isExcluded = statusStr && (
              statusStr.toLowerCase().includes('excluído') || 
              statusStr.toLowerCase().includes('excluido') ||
              statusStr.toLowerCase().includes('excluded')
            );
            const probability = item.metadata?.find((m: { label: string; value: string }) => 
              m.label && typeof m.label === 'string' && m.label.toLowerCase().includes('probabilidade')
            )?.value || '';
            
            return (
              <div
                key={index}
                className={`flex flex-col rounded-xl border p-3 transition-colors w-full ${
                  isExcluded
                    ? "border-gray-100 bg-gray-50 opacity-70"
                    : `${styles.border} ${styles.bg}`
                }`}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p
                    className={`font-medium leading-relaxed flex-1 ${
                      isExcluded ? "text-gray-500 line-through" : "text-gray-900"
                    }`}
                  >
                    {item.primary}
                  </p>
                  {isExcluded ? (
                    <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase shrink-0 whitespace-nowrap">
                      Excluído
                    </span>
                  ) : (
                    <span
                      className={`rounded-md ${styles.iconBg} px-2 py-0.5 text-[10px] font-bold tracking-wide ${styles.text} uppercase shrink-0 whitespace-nowrap`}
                    >
                      Possível
                    </span>
                  )}
                </div>
                {probability && (
                  <div className="mt-2 flex items-center justify-between gap-2 min-w-0">
                    <span className="text-xs text-gray-500 shrink-0">Probabilidade:</span>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed">
                      {probability}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhum item disponível
          </div>
        )}
      </div>
    </div>
  );
}
