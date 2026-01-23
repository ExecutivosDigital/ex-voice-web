"use client";

import { Beaker } from "lucide-react";
import { SuggestedExamsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SuggestedExamsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "indigo";
  data: SuggestedExamsCardData;
}

export function SuggestedExamsCard({
  title,
  variant = "indigo",
  data,
}: SuggestedExamsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("beaker");

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
        {data.suggestedExams.map((exam, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
          >
            <span className="text-sm font-medium text-gray-700">
              {exam.name}
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  exam.priority === "Alta"
                    ? "bg-red-400"
                    : exam.priority === "Média"
                      ? "bg-yellow-400"
                      : "bg-blue-400"
                }`}
              />
              <span className="text-xs text-gray-500">{exam.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
