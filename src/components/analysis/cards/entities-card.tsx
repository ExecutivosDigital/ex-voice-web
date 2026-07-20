"use client";

import { Users } from "lucide-react";
import { CardShell } from "../card-shell";
import type { EntityGroup, VariantColor } from "../types";

/**
 * entities_card: entidades detectadas na conversa, agrupadas por tipo
 * (pessoas, empresas, datas, valores, lugares).
 */
export function EntitiesCard({
  title,
  variant = "blue",
  data,
}: {
  title: string;
  variant?: VariantColor;
  data: { groups?: EntityGroup[] };
}) {
  const groups = (data?.groups ?? []).filter((g) => g.items?.length > 0);

  return (
    <CardShell icon={Users} title={title} variant={variant}>
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
    </CardShell>
  );
}
