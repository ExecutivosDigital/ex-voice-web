"use client";

import { ExamsCardData, GenericListItem } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface ExamsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: ExamsCardData;
}

export function ExamsCard({
  title,
  variant = "blue",
  data,
}: ExamsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("file-output");

  // Detectar formato: genérico (items[]) ou legado (exams[])
  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? (data.items || []) : [];
  
  // Converter formato legado para genérico
  const legacyItems = data.exams ? data.exams.flatMap((ex) => 
    ex.items ? ex.items.map((item) => ({
      id: ex.id,
      primary: item.name,
      secondary: ex.category,
      metadata: [
        { label: "Prioridade", value: item.priority || "Normal" },
      ],
      tags: ex.date ? [ex.date] : [],
    })) : []
  ) : [];

  const displayItems = (isGenericFormat ? items : legacyItems) || [];
  const totalCount = data.totalCount || (displayItems.length || 0);

  // Verificar se secondary é uma categoria curta ou uma descrição longa
  const hasShortCategories = displayItems.some(item => {
    const secondary = item.secondary || '';
    return secondary && typeof secondary === 'string' && secondary.length < 50 && !secondary.includes(':');
  });

  // Agrupar items por secondary (categoria) apenas se for uma categoria curta
  type ItemType = GenericListItem | { id: number; primary: string; secondary: string; metadata: Array<{ label: string; value: string }>; tags: string[] };
  const groupedItems = hasShortCategories ? displayItems.reduce((acc, item) => {
    const groupKey = item.secondary || 'Geral';
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, ItemType[]>) : { 'Geral': displayItems };

  return (
    <section className="w-full max-w-full min-w-0 overflow-hidden">
      <div className="mb-4 flex items-center gap-3 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-md ${styles.shadow}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">{title}</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {totalCount} item(ns) no total
          </p>
        </div>
      </div>
      <div className={`grid gap-4 ${hasShortCategories ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([category, categoryItems]) => {
          if (!categoryItems || categoryItems.length === 0) return null;
          
          // Se não for categoria curta, renderizar cada item individualmente
          if (!hasShortCategories) {
            return categoryItems.map((item, i) => {
              const priority = item.metadata?.find((m: { label: string; value: string }) => 
                m.label && typeof m.label === 'string' && m.label.toLowerCase().includes('prioridade')
              )?.value || ('status' in item ? item.status : '') || '';
              
              const priorityStr = typeof priority === 'string' ? priority : String(priority || '');
              const hasTags = item.tags && Array.isArray(item.tags) && item.tags.length > 0;
              const hasMetadata = item.metadata && Array.isArray(item.metadata) && item.metadata.length > 0;
              const hasSecondary = item.secondary && typeof item.secondary === 'string' && item.secondary.trim().length > 0;
              
              return (
                <div
                  key={item.id || i}
                  className={`group relative overflow-hidden rounded-2xl border ${styles.border} bg-white p-5 shadow-sm transition-all hover:shadow-md w-full min-w-0`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 leading-relaxed mb-1">
                        {item.primary}
                      </h3>
                      {hasTags && item.tags && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {priorityStr && (
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 mt-1 ${
                          priorityStr.toLowerCase().includes("alta")
                            ? "bg-red-400"
                            : priorityStr.toLowerCase().includes("média") || priorityStr.toLowerCase().includes("media")
                              ? "bg-yellow-400"
                              : "bg-blue-400"
                        }`}
                      />
                    )}
                  </div>
                  
                  {hasSecondary && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {item.secondary}
                    </p>
                  )}
                  
                  {hasMetadata && item.metadata && (
                    <div className="space-y-1.5 pt-3 border-t border-gray-100">
                      {item.metadata.map((meta, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <span className="font-medium text-gray-500 shrink-0">{meta.label}:</span>
                          <span className="text-gray-700 leading-relaxed">{meta.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          }
          
          // Renderização com categorias (formato original)
          return (
            <div
              key={category}
              className={`group relative overflow-hidden rounded-2xl border ${styles.border} bg-white p-5 shadow-sm transition-all hover:shadow-md min-w-0`}
            >
              <div className="mb-4 flex items-start justify-between border-b border-gray-50 pb-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-gray-900 leading-relaxed">
                    {category}
                  </span>
                  {categoryItems[0]?.tags?.[0] && (
                    <span className="text-xs text-gray-400 leading-relaxed">{categoryItems[0].tags[0]}</span>
                  )}
                </div>
                <span
                  className={`rounded-full ${styles.bg} px-2.5 py-1 text-xs font-semibold ${styles.text} shrink-0 whitespace-nowrap`}
                >
                  {categoryItems.length} itens
                </span>
              </div>
              <div className="space-y-2">
                {categoryItems.map((item, i) => {
                  const priority = item.metadata?.find((m: { label: string; value: string }) => 
                    m.label && typeof m.label === 'string' && m.label.toLowerCase().includes('prioridade')
                  )?.value || ('status' in item ? item.status : '') || '';
                  
                  const priorityStr = typeof priority === 'string' ? priority : String(priority || '');
                  
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 transition-colors hover:bg-blue-50/50 min-w-0"
                    >
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          priorityStr && priorityStr.toLowerCase().includes("alta")
                            ? "bg-red-400"
                            : priorityStr && (priorityStr.toLowerCase().includes("média") || priorityStr.toLowerCase().includes("media"))
                              ? "bg-yellow-400"
                              : "bg-blue-400"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700 leading-relaxed flex-1 min-w-0">
                        {item.primary}
                      </span>
                    </div>
                  );
                })}
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
