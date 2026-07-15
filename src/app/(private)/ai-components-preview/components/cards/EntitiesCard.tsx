"use client";

import { getIcon, getVariantStyles } from "../../utils/icon-mapper";
import { TruncatedTooltip } from "../core/TruncatedTooltip";

/**
 * entities_card (trilha IA): entidades detectadas na conversa, agrupadas por
 * tipo (pessoas, empresas, datas, valores, lugares).
 */

interface EntityGroup {
  label: string;
  items: string[];
}

interface EntitiesCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: { groups?: EntityGroup[] };
}

export function EntitiesCard({
  title,
  variant = "blue",
  data,
}: EntitiesCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("user");
  const groups = (data?.groups ?? []).filter((g) => g.items?.length > 0);

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm`}
    >
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${styles.border}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <TruncatedTooltip content={title}>
          <h3 className="truncate leading-snug font-semibold text-gray-900">
            {title}
          </h3>
        </TruncatedTooltip>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {groups.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            Nenhuma entidade detectada.
          </p>
        ) : (
          groups.map((group, gi) => (
            <div key={gi}>
              <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item, ii) => (
                  <span
                    key={ii}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
