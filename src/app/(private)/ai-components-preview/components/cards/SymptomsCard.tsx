"use client";

import { Activity } from "lucide-react";
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

  return (
    <div
      className={`h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="mb-5 flex items-center gap-3 border-b border-gray-50 pb-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-400">Identificados na anamnese</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {data.symptoms.map((symptom, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="font-medium text-gray-700">{symptom.name}</span>
            </div>
            <span className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500">
              {symptom.frequency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
