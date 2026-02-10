"use client";

import { PrescriptionCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface PrescriptionCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: PrescriptionCardData;
}

export function PrescriptionCard({
  title,
  variant = "emerald",
  data,
}: PrescriptionCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("pill");

  // Detectar formato: genérico (items[]) ou legado (prescriptions[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? data.items : [];
  
  // Converter formato legado para genérico
  const legacyItems = data.prescriptions ? data.prescriptions.flatMap((p) => 
    p.items ? p.items.map((item) => ({
      id: p.id,
      primary: item.name,
      secondary: p.type,
      metadata: [
        { label: "Dosagem", value: item.dosage },
        { label: "Frequência", value: item.frequency },
        { label: "Duração", value: item.duration },
      ],
      tags: p.date ? [p.date] : [],
    })) : []
  ) : [];

  const displayItems = isGenericFormat ? items : legacyItems;
  const itemCount = displayItems?.length || 0;

  return (
    <section className="w-full max-w-full min-w-0 overflow-hidden">
      <div className={`mb-4 flex items-center gap-3 min-w-0 rounded-xl bg-gradient-to-br ${styles.gradientFrom}/75 ${styles.gradientTo}/35 p-4`}>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-md`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-white leading-relaxed">{title}</h2>
          <p className="text-xs text-white/80 leading-relaxed">
            {itemCount} item(ns)
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 min-w-0">
        {displayItems && displayItems.length > 0 ? displayItems.map((item, idx) => {
          // Agrupar items por secondary (tipo/data) se disponível
          const groupKey = item.secondary || item.tags?.[0] || `group-${idx}`;
          const isFirstInGroup = idx === 0 || displayItems[idx - 1]?.secondary !== item.secondary;
          
          return (
            <div
              key={item.id || idx}
              className={`group relative overflow-hidden rounded-2xl border ${styles.border} bg-white p-5 md:p-6 shadow-sm transition-all hover:shadow-md w-full min-w-0`}
            >
              {isFirstInGroup && (item.secondary || item.tags?.[0]) && (
                <div className="mb-4 md:mb-5 flex items-start justify-between">
                  <div>
                    {item.secondary && (
                      <span className="block text-sm font-bold text-gray-900 leading-relaxed">
                        {item.secondary}
                      </span>
                    )}
                    {item.tags?.[0] && (
                      <span className="text-xs text-gray-400 leading-relaxed">{item.tags[0]}</span>
                    )}
                  </div>
                </div>
              )}
              <div className={`space-y-3 md:space-y-4 ${!isFirstInGroup ? 'mt-0' : ''}`}>
                <div
                  className={`rounded-lg border ${styles.border} ${styles.bg} p-3 md:p-4`}
                >
                  <div className="flex items-start justify-between">
                    <p className={`font-semibold ${styles.text}`}>{item.primary}</p>
                    {'status' in item && item.status && (
                      <span
                        className={`rounded border ${styles.border} bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${styles.text} uppercase`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  {item.metadata && item.metadata.length > 0 && (
                    <p className={`mt-1 text-sm ${styles.text} opacity-80`}>
                      {item.metadata.map((meta, i) => (
                        <span key={i}>
                          {i > 0 && ' • '}
                          {meta.value}
                        </span>
                      ))}
                    </p>
                  )}
                  {item.secondary && !isFirstInGroup && (
                    <p className={`mt-1 text-xs ${styles.text} opacity-60`}>
                      {item.secondary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-2 text-center py-8 text-sm text-gray-500">
            Nenhum item disponível
          </div>
        )}
      </div>
    </section>
  );
}
