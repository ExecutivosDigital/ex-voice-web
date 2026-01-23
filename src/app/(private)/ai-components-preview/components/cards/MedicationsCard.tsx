"use client";

import { Pill } from "lucide-react";
import { MedicationsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface MedicationsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: MedicationsCardData;
}

export function MedicationsCard({
  title,
  variant = "teal",
  data,
}: MedicationsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("pill");

  return (
    <div
      className={`h-full rounded-2xl border ${styles.border} ${styles.bg} p-4 shadow-sm`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className={`font-semibold ${variant === "teal" ? "text-teal-900" : "text-gray-900"}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {data.medications.map((med, idx) => (
          <div
            key={idx}
            className={`rounded-lg border ${styles.border} bg-white p-2 shadow-sm`}
          >
            <span
              className={`block text-sm font-medium ${variant === "teal" ? "text-teal-900" : "text-gray-900"}`}
            >
              {med.name}
            </span>
            <span className="text-[10px] text-gray-500">{med.frequency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
