"use client";

import { SymptomsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SymptomsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: SymptomsCardData;
}

export function SymptomsCard({
  title,
  variant = "rose",
  data,
}: SymptomsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("activity");

  // Detectar formato: genérico (items[]) ou legado (symptoms[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = Array.isArray(data.items) ? data.items : [];
  
  // Converter formato legado para genérico
  const legacyItems = data.symptoms ? data.symptoms.map((symptom) => ({
    primary: symptom.name,
    metadata: [
      symptom.frequency && { label: "Frequência", value: symptom.frequency },
      symptom.severity && { label: "Severidade", value: symptom.severity },
    ].filter(Boolean) as Array<{ label: string; value: string }>,
  })) : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  // Calcular se precisa de mais espaço baseado no conteúdo
  const itemCount = displayItems.length;
  const hasManyTags = displayItems.some(item => 
    (item.metadata && item.metadata.length > 1) || 
    ('tags' in item && item.tags && item.tags.length > 1)
  );
  
  return (
    <div
      className="h-full w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-5 flex items-center gap-3 border-b border-gray-50 pb-4 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 leading-relaxed">{title}</h3>
          <p className="text-xs text-gray-400">Itens identificados</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 min-w-0">
        {displayItems.length > 0 ? (
          displayItems.map((item, idx) => {
            const hasMetadata = item.metadata && item.metadata.length > 0;
            const hasTags = 'tags' in item && item.tags && item.tags.length > 0;
            const hasBadges = hasMetadata || hasTags;
            
            return (
              <div
                key={idx}
                className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 w-full"
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  <div className="h-2 w-2 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-start justify-between gap-2 w-full">
                          <p className="font-medium text-gray-700 text-sm leading-relaxed flex-1 min-w-0">{item.primary}</p>
                          {hasBadges && (
                            <div className="flex items-start gap-2 shrink-0 flex-wrap">
                              {hasTags && item.tags && item.tags.map((tag: string, i: number) => (
                                <span key={i} className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500 whitespace-nowrap">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {hasMetadata && item.metadata && (
                          <div className="flex flex-wrap gap-2">
                            {item.metadata.map((meta: { label: string; value: string }, i: number) => (
                              <span key={i} className="inline-flex items-center rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500 max-w-full">
                                <span className="truncate">{meta.value}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {'secondary' in item && item.secondary && (
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">{item.secondary}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhum item identificado
          </div>
        )}
      </div>
    </div>
  );
}
