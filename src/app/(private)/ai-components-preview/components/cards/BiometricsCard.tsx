"use client";

import { User } from "lucide-react";
import { BiometricsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface BiometricsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: BiometricsCardData;
}

export function BiometricsCard({
  title,
  variant = "blue",
  data,
}: BiometricsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("user");

  return (
    <div
      className={`h-full rounded-2xl border ${styles.border} bg-white p-4 shadow-sm`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
          <span className="text-sm text-gray-500">Tipo Sanguíneo</span>
          <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
            {data.personal.bloodType}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
          <span className="text-sm text-gray-500">IMC</span>
          <span className="text-sm font-medium text-gray-900">
            {data.personal.bmi}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Peso / Altura</span>
          <span className="text-sm font-medium text-gray-900">
            {data.personal.weight} / {data.personal.height}
          </span>
        </div>
      </div>
    </div>
  );
}
