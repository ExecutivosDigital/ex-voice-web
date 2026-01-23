"use client";

import { Activity } from "lucide-react";
import { ChronicConditionsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface ChronicConditionsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "indigo";
  data: ChronicConditionsCardData;
}

export function ChronicConditionsCard({
  title,
  variant = "indigo",
  data,
}: ChronicConditionsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("activity");

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
        <h3 className={`font-semibold ${variant === "indigo" ? "text-indigo-900" : "text-gray-900"}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {data.chronicConditions.map((condition, idx) => (
          <div
            key={idx}
            className={`rounded-lg border ${styles.border} bg-white p-2 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <span
                className={`text-sm font-medium ${variant === "indigo" ? "text-indigo-900" : "text-gray-900"}`}
              >
                {condition.name}
              </span>
            </div>
            <span className="mt-0.5 block text-[10px] text-gray-500">
              {condition.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
