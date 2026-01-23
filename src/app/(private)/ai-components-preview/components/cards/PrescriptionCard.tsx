"use client";

import { Pill } from "lucide-react";
import { PrescriptionCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface PrescriptionCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: PrescriptionCardData;
}

export function PrescriptionCard({
  title,
  variant = "emerald",
  data,
}: PrescriptionCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("pill");

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-md ${styles.shadow}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400">
            {data.prescriptions.length} receita(s) emitida(s)
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.prescriptions.map((p) => (
          <div
            key={p.id}
            className={`group relative overflow-hidden rounded-2xl border ${styles.border} bg-white p-5 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="block text-sm font-bold text-gray-900">
                  {p.type}
                </span>
                <span className="text-xs text-gray-400">{p.date}</span>
              </div>
            </div>
            <div className="space-y-3">
              {p.items.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg border ${styles.border} ${styles.bg} p-3`}
                >
                  <div className="flex items-start justify-between">
                    <p className={`font-semibold ${styles.text}`}>{item.name}</p>
                    <span
                      className={`rounded border ${styles.border} bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${styles.text} uppercase`}
                    >
                      {item.duration}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${styles.text} opacity-80`}>
                    {item.dosage} • {item.frequency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
