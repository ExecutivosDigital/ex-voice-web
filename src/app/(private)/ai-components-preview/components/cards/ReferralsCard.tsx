"use client";

import { ReferralsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface ReferralsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: ReferralsCardData;
}

export function ReferralsCard({
  title,
  variant = "violet",
  data,
}: ReferralsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("user-plus");

  // Detectar formato: genérico (items[]) ou legado (referrals[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = Array.isArray(data.items) ? data.items : [];

  // Converter formato legado para genérico
  const legacyItems =
    data.referrals && Array.isArray(data.referrals) && data.referrals.length > 0
      ? data.referrals.map((ref: any) => ({
          id: ref.id,
          primary: ref.specialty || "",
          secondary: ref.reason || "",
          metadata: [
            ref.date ? { label: "Data", value: ref.date } : null,
            ref.urgency ? { label: "Urgência", value: ref.urgency } : null,
          ].filter(Boolean) as Array<{ label: string; value: string }>,
          tags:
            ref.professional && ref.professional !== "A definir"
              ? [`Profissional: ${ref.professional}`]
              : [],
        }))
      : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  if (displayItems.length === 0) return null;

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
          <p className="text-xs text-gray-400 mt-0.5">
            {displayItems.length} encaminhamento(s)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {displayItems.map((item, idx) => {
          // Extrair campos ricos do legado se disponível
          const ref =
            isGenericFormat && data.referrals && Array.isArray(data.referrals)
              ? data.referrals.find((r: any) => r.id === item.id) || data.referrals[idx]
              : isGenericFormat
              ? null
              : data.referrals?.[idx];

          const specialty = ref?.specialty || item.primary || "";
          const reason = ref?.reason || item.secondary || "";
          const urgency =
            ref?.urgency ||
            item.metadata?.find((m: any) => m.label === "Urgência")?.value ||
            "";
          const date =
            ref?.date ||
            item.metadata?.find((m: any) => m.label === "Data")?.value ||
            "";
          const professional =
            ref?.professional ||
            item.tags
              ?.find((t: string) => t.includes("Profissional"))
              ?.replace("Profissional: ", "") ||
            "";

          const initials =
            specialty && typeof specialty === "string"
              ? specialty.substring(0, 2).toUpperCase()
              : "--";

          const isUrgent =
            urgency &&
            (urgency === "Prioritária" ||
              (typeof urgency === "string" && urgency.toLowerCase().includes("prioritária")));

          return (
            <div
              key={item.id || idx}
              className={`flex items-start gap-4 rounded-xl border ${styles.border} bg-white p-4 transition-shadow hover:shadow-sm`}
            >
              {/* Avatar */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${styles.iconBg} ${styles.text}`}
              >
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 leading-snug">{specialty || "N/A"}</p>
                  {urgency && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${
                        isUrgent ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {urgency}
                    </span>
                  )}
                </div>
                {reason && (
                  <p className="mt-0.5 text-sm text-gray-500 leading-relaxed break-words">
                    {reason}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {professional && professional !== "A definir" && (
                    <span className={`text-xs font-medium ${styles.text}`}>
                      {professional}
                    </span>
                  )}
                  {date && (
                    <span className="text-xs text-gray-400">{date}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
