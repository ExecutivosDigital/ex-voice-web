"use client";

import { Activity, Cigarette, Users, Wine } from "lucide-react";
import { SocialHistoryCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface SocialHistoryCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose" | "neutral";
  data: SocialHistoryCardData;
}

export function SocialHistoryCard({
  title,
  variant = "neutral",
  data,
}: SocialHistoryCardProps) {
  const styles = getVariantStyles(variant);
  const UsersIcon = getIcon("users");
  const CigaretteIcon = getIcon("cigarette");
  const WineIcon = getIcon("wine");
  const ActivityIcon = getIcon("activity");

  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
        <UsersIcon className="h-5 w-5 text-gray-400" />
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CigaretteIcon className="mt-0.5 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Tabagismo</p>
            <p className="text-sm text-gray-500">{data.socialHistory.smoking}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <WineIcon className="mt-0.5 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Consumo de Álcool
            </p>
            <p className="text-sm text-gray-500">{data.socialHistory.alcohol}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ActivityIcon className="mt-0.5 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Atividade Física
            </p>
            <p className="text-sm text-gray-500">{data.socialHistory.activity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
