"use client";

import { SuggestedExamsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SuggestedExamsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "indigo";
  data: SuggestedExamsCardData;
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
  const legacyItems = data.suggestedExams && Array.isArray(data.suggestedExams) 
    ? data.suggestedExams.map((exam) => ({
        primary: exam.name,
        metadata: exam.priority ? [
          { label: "Prioridade", value: exam.priority },
        ] : [],
      }))
    : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  return (
    <div className="h-full w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
      <div className="mb-4 md:mb-5 flex items-center gap-3 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-gray-900 leading-relaxed">{title}</h3>
      </div>
      <div className="space-y-3 md:space-y-4 min-w-0">
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item, idx) => {
            const priority = item.metadata?.find((m: { label: string; value: string }) => 
              m.label && typeof m.label === 'string' && m.label.toLowerCase().includes('prioridade')
            )?.value || ('status' in item ? item.status : '') || '';
            
            const priorityStr = typeof priority === 'string' ? priority : String(priority || '');
            
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0 min-w-0"
              >
                <p className="text-sm font-medium text-gray-700 leading-relaxed flex-1">
                  {item.primary}
                </p>
                {priorityStr && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        priorityStr.toLowerCase().includes("alta")
                          ? "bg-red-400"
                          : priorityStr.toLowerCase().includes("média") || priorityStr.toLowerCase().includes("media")
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                      }`}
                    />
                    <span className="text-xs text-gray-500 whitespace-nowrap">{priorityStr}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhum item sugerido
          </div>
        )}
      </div>
    </div>
  );
}
