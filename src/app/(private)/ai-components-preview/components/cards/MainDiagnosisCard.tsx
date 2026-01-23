"use client";

import { Activity, AlertTriangle, Clock, FileText, Stethoscope } from "lucide-react";
import { MainDiagnosisCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface MainDiagnosisCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: MainDiagnosisCardData;
}

export function MainDiagnosisCard({
  title,
  variant = "blue",
  data,
}: MainDiagnosisCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("stethoscope");
  const ActivityIcon = getIcon("activity");
  const AlertIcon = getIcon("alert-triangle");
  const ClockIcon = getIcon("clock");
  const FileIcon = getIcon("file-text");

  return (
    <div
      className={`rounded-2xl border ${styles.border} bg-gradient-to-br ${styles.bg} to-white p-6 shadow-sm ring-1 ${styles.border}/50`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-lg ${styles.shadow}`}
          >
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {data.mainCondition}
              </h2>
              <span
                className={`rounded-full border ${styles.border} ${styles.bg} px-2.5 py-0.5 text-xs font-semibold ${styles.text}`}
              >
                CID: {data.cid}
              </span>
            </div>
            <p className="mt-1 text-base text-gray-500">
              Diagnóstico Principal Identificado
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                <ActivityIcon className="h-4 w-4 text-emerald-500" />
                Confiança: <span className="text-gray-900">{data.confidence}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                <AlertIcon className="h-4 w-4 text-amber-500" />
                Severidade: <span className="text-gray-900">{data.severity}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                <ClockIcon className="h-4 w-4 text-blue-500" />
                Evolução: <span className="text-gray-900">{data.evolution}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-6 rounded-xl border ${styles.border} bg-white/60 p-5`}>
        <h3
          className={`mb-2 flex items-center gap-2 text-sm font-semibold ${styles.text}`}
        >
          <FileIcon className="h-4 w-4" />
          Justificativa Clínica
        </h3>
        <p className="leading-relaxed text-gray-700">{data.justification}</p>
      </div>
    </div>
  );
}
