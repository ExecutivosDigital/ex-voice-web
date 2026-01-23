"use client";

import { AlertCircle } from "lucide-react";
import { AllergiesCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface AllergiesCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "red";
  data: AllergiesCardData;
}

export function AllergiesCard({
  title,
  variant = "red",
  data,
}: AllergiesCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("alert-circle");

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
        <h3 className={`font-semibold ${variant === "red" ? "text-red-900" : "text-gray-900"}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {data.allergies.map((allergy, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between rounded-lg border ${styles.border} bg-white p-2 shadow-sm`}
          >
            <span
              className={`text-sm font-medium ${variant === "red" ? "text-red-900" : "text-gray-900"}`}
            >
              {allergy.name}
            </span>
            {allergy.severity === "Alta" && (
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-red-500"
                title="Alta Severidade"
              ></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
