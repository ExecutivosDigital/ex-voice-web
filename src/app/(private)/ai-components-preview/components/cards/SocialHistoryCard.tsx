"use client";

import { SocialHistoryCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SocialHistoryCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "neutral";
  data: SocialHistoryCardData;
}

export function SocialHistoryCard({
  title,
  variant = "neutral",
  data,
}: SocialHistoryCardProps) {
  const styles = getVariantStyles(variant);
  const UsersIcon = getIcon("users");

  // Detectar formato: genérico (fields[]) ou legado (socialHistory{})
  const isGenericFormat = data.fields && Array.isArray(data.fields) && data.fields.length > 0;
  const fields = Array.isArray(data.fields)
    ? data.fields.sort((a, b) => (a.priority || 0) - (b.priority || 0))
    : [];

  // Converter formato legado para genérico
  const legacyFields = data.socialHistory
    ? [
        data.socialHistory.smoking
          ? { label: "Tabagismo", value: data.socialHistory.smoking, priority: 1 }
          : null,
        data.socialHistory.alcohol
          ? { label: "Consumo de Álcool", value: data.socialHistory.alcohol, priority: 2 }
          : null,
        data.socialHistory.activity
          ? { label: "Atividade Física", value: data.socialHistory.activity, priority: 3 }
          : null,
        data.socialHistory.diet
          ? { label: "Dieta", value: data.socialHistory.diet, priority: 4 }
          : null,
      ].filter(Boolean) as typeof fields
    : [];

  const displayFields = isGenericFormat ? fields : legacyFields;

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${styles.border}`}>
        <UsersIcon className="h-5 w-5 shrink-0 text-gray-400" />
        <TruncatedTooltip content={title}>
          <h3 className="font-semibold text-gray-900 leading-snug truncate">{title}</h3>
        </TruncatedTooltip>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        {displayFields.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-50">
            {displayFields.map((field, idx) => (
              <div key={idx} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-800 break-words leading-relaxed">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">
            Dados não disponíveis
          </div>
        )}
      </div>
    </div>
  );
}
