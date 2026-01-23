"use client";

import { GitBranch } from "lucide-react";
import { DifferentialDiagnosisCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface DifferentialDiagnosisCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "purple";
  data: DifferentialDiagnosisCardData;
}

export function DifferentialDiagnosisCard({
  title,
  variant = "purple",
  data,
}: DifferentialDiagnosisCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("git-branch");

  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {data.differentials.map((diff, index) => (
          <div
            key={index}
            className={`flex flex-col rounded-xl border p-3 transition-colors ${
              diff.excluded
                ? "border-gray-100 bg-gray-50 opacity-70"
                : `${styles.border} ${styles.bg}`
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-medium ${
                  diff.excluded ? "text-gray-500 line-through" : "text-gray-900"
                }`}
              >
                {diff.name}
              </span>
              {diff.excluded ? (
                <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                  Excluído
                </span>
              ) : (
                <span
                  className={`rounded-md ${styles.iconBg} px-2 py-0.5 text-[10px] font-bold tracking-wide ${styles.text} uppercase`}
                >
                  Possível
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Probabilidade:</span>
              <span className="text-xs font-medium text-gray-700">
                {diff.probability}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
