"use client";

import { Dna } from "lucide-react";
import { FamilyHistoryCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface FamilyHistoryCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "neutral";
  data: FamilyHistoryCardData;
}

export function FamilyHistoryCard({
  title,
  variant = "neutral",
  data,
}: FamilyHistoryCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("dna");

  return (
    <div className="h-full w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 min-w-0">
        <Icon className="h-5 w-5 shrink-0 text-gray-400" />
        <span className="leading-relaxed">{title}</span>
      </h3>
      <div className="space-y-4 min-w-0">
        {data.familyHistory && Array.isArray(data.familyHistory) && data.familyHistory.length > 0 ? (
          data.familyHistory.map((item, idx) => (
            <div
              key={idx}
              className="relative border-l-2 border-dashed border-gray-200 pl-4 min-w-0"
            >
              <p className="text-sm font-bold text-gray-800 leading-relaxed">{item.relation || 'N/A'}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.condition || 'N/A'}</p>
              {item.age && (
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  Diagnóstico: {item.age}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhum histórico familiar disponível
          </div>
        )}
      </div>
    </div>
  );
}
