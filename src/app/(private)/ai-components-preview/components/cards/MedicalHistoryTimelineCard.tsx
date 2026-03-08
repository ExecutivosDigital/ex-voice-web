"use client";

import { MedicalHistoryTimelineCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface MedicalHistoryTimelineCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "neutral";
  data: MedicalHistoryTimelineCardData;
}

export function MedicalHistoryTimelineCard({
  title,
  variant = "neutral",
  data,
}: MedicalHistoryTimelineCardProps) {
  const styles = getVariantStyles(variant);
  const HistoryIcon = getIcon("history");
  const FileIcon = getIcon("file-text");

  const records = data.history && Array.isArray(data.history) ? data.history : [];

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b ${styles.border}`}>
        <div className="flex items-center gap-3 min-w-0">
          <HistoryIcon className="h-5 w-5 shrink-0 text-gray-400" />
          <TruncatedTooltip content={title}>
            <h3 className="font-semibold text-gray-900 leading-snug truncate">{title}</h3>
          </TruncatedTooltip>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          Ver completo
        </button>
      </div>

      {/* Timeline */}
      <div className="p-5">
        {records.length > 0 ? (
          <div className="relative ml-3 flex flex-col gap-8 border-l-2 border-gray-100 pb-2">
            {records.map((record, index) => (
              <div key={index} className="relative pl-7">
                {/* Dot */}
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500 ring-4 ring-blue-50" />

                {/* Meta (tipo + data) */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-gray-900 leading-snug">
                      {record.type || "N/A"}
                    </span>
                    {(record.specialty || record.doctor) && (
                      <span className="text-xs text-gray-500">
                        {[record.specialty, record.doctor].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                  {record.date && (
                    <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 whitespace-nowrap">
                      {record.date}
                    </span>
                  )}
                </div>

                {/* Card de nota */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-sm">
                  {record.note && (
                    <p className="text-sm leading-relaxed text-gray-600 break-words">
                      {record.note}
                    </p>
                  )}
                  {record.attachments && Array.isArray(record.attachments) && record.attachments.length > 0 && (
                    <div
                      className={`${record.note ? "mt-3 border-t border-gray-100 pt-3" : ""} flex flex-wrap gap-1.5`}
                    >
                      {record.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm whitespace-nowrap"
                        >
                          <FileIcon className="h-3 w-3 shrink-0 text-gray-400" />
                          {att}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">
            Nenhum histórico disponível
          </div>
        )}
      </div>
    </div>
  );
}
