"use client";

import { AllergiesCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface AllergiesCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "red";
  data: AllergiesCardData;
}

export function AllergiesCard({
  title,
  variant = "red",
  data,
}: AllergiesCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("alert-circle");

  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? data.items : [];

  // Converter formato legado para genérico
  const legacyItems =
    data.allergies && Array.isArray(data.allergies)
      ? data.allergies.map((allergy) => ({
          primary: allergy.name,
          metadata: [
            allergy.reaction ? { label: "Reação", value: allergy.reaction } : null,
            allergy.severity ? { label: "Severidade", value: allergy.severity } : null,
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
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold leading-snug truncate ${variant === "red" ? "text-red-900" : "text-gray-900"}`}>
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item, idx) => {
            const severityMeta = item.metadata?.find(
              (m: { label: string; value: string }) =>
                m.label && typeof m.label === "string" && m.label.toLowerCase().includes("severidade")
            )?.value || ("status" in item ? item.status : "") || "";

            const severityStr = typeof severityMeta === "string" ? severityMeta : String(severityMeta || "");
            const isHighSeverity =
              severityStr &&
              (severityStr.toLowerCase().includes("alta") || severityStr.toLowerCase().includes("high"));

            return (
              <div
                key={idx}
                className={`flex items-center justify-between gap-2 rounded-lg border ${styles.border} bg-white px-3 py-2.5 shadow-sm`}
              >
                <p
                  className={`text-sm font-medium flex-1 leading-snug min-w-0 break-words ${
                    variant === "red" ? "text-red-900" : "text-gray-900"
                  }`}
                >
                  {item.primary}
                </p>
                {/* Metadata secundária */}
                {item.metadata && item.metadata.length > 0 && (
                  <p className="text-xs text-gray-400 shrink-0 whitespace-nowrap max-w-[120px] truncate">
                    {item.metadata.map((m, i) => (
                      <span key={i}>
                        {i > 0 && " · "}
                        {m.value}
                      </span>
                    ))}
                  </p>
                )}
                {isHighSeverity && (
                  <span
                    className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500"
                    title="Alta Severidade"
                  />
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
