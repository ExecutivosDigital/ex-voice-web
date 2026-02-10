"use client";

import { UserPlus } from "lucide-react";
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
  const legacyItems = data.referrals && Array.isArray(data.referrals) && data.referrals.length > 0
    ? data.referrals.map((ref: any) => ({
        id: ref.id,
        primary: ref.specialty || "",
        secondary: ref.reason || "",
        metadata: [
          ref.date && { label: "Data", value: ref.date },
          ref.urgency && { label: "Urgência", value: ref.urgency },
        ].filter(Boolean) as Array<{ label: string; value: string }>,
        tags: ref.professional && ref.professional !== "A definir" ? [`Profissional: ${ref.professional}`] : [],
      }))
    : [];

  const displayItems = isGenericFormat ? items : legacyItems;
  const totalCount = displayItems.length;

  // Não renderizar se não houver dados
  if (totalCount === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-full min-w-0 overflow-hidden">
      <div className="mb-4 md:mb-5 flex items-center gap-3 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-md ${styles.shadow}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">{title}</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {totalCount} encaminhamento(s)
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-5 min-w-0">
        {displayItems.length > 0 ? (
          displayItems.map((item, idx) => {
            // Se for formato genérico, tentar extrair dados do formato legado se disponível
            const ref = isGenericFormat && data.referrals && Array.isArray(data.referrals) 
              ? data.referrals.find((r: any) => r.id === item.id) || data.referrals[idx]
              : isGenericFormat ? null : data.referrals?.[idx];
            
            const specialty = ref?.specialty || item.primary || "";
            const reason = ref?.reason || item.secondary || "";
            const date = ref?.date || item.metadata?.find((m: any) => m.label === "Data")?.value || "";
            const urgency = ref?.urgency || item.metadata?.find((m: any) => m.label === "Urgência")?.value || "";
            const professional = ref?.professional || item.tags?.find((t: string) => t.includes("Profissional"))?.replace("Profissional: ", "") || "";

            return (
              <div
                key={item.id || idx}
                className={`flex flex-col justify-between gap-4 rounded-xl border ${styles.border} bg-white p-5 transition-all hover:opacity-80 sm:flex-row sm:items-start w-full min-w-0`}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${styles.iconBg} text-sm font-bold ${styles.text}`}
                  >
                    {specialty && typeof specialty === 'string' && specialty.length >= 2
                      ? specialty.substring(0, 2).toUpperCase()
                      : specialty && typeof specialty === 'string'
                        ? specialty.substring(0, 1).toUpperCase()
                        : '--'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 leading-relaxed">
                      {specialty || 'N/A'}
                    </h4>
                    {reason && (
                      <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">{reason}</p>
                    )}
                    {professional && professional !== "A definir" && (
                      <p className={`mt-2 text-xs font-medium ${styles.text} leading-relaxed`}>
                        Profissional: {professional}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {urgency && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase whitespace-nowrap ${
                        urgency === "Prioritária" || (typeof urgency === 'string' && urgency.toLowerCase().includes("prioritária"))
                          ? "bg-red-50 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {urgency}
                    </span>
                  )}
                  {date && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">{date}</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-sm text-gray-500">
            Nenhum encaminhamento disponível
          </div>
        )}
      </div>
    </section>
  );
}
