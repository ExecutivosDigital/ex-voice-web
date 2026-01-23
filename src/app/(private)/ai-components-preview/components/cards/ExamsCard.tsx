"use client";

import { FileOutput } from "lucide-react";
import { ExamsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface ExamsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: ExamsCardData;
}

export function ExamsCard({
  title,
  variant = "blue",
  data,
}: ExamsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("file-output");

  const totalCount =
    data.totalCount ||
    data.exams.reduce((acc, e) => acc + e.items.length, 0);

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
            {totalCount} exame(s) no total
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.exams.map((ex) => (
          <div
            key={ex.id}
            className={`group relative overflow-hidden rounded-2xl border ${styles.border} bg-white p-5 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="mb-4 flex items-start justify-between border-b border-gray-50 pb-3">
              <div>
                <span className="block text-sm font-bold text-gray-900">
                  {ex.category}
                </span>
                <span className="text-xs text-gray-400">{ex.date}</span>
              </div>
              <span
                className={`rounded-full ${styles.bg} px-2.5 py-1 text-xs font-semibold ${styles.text}`}
              >
                {ex.items.length} itens
              </span>
            </div>
            <div className="space-y-2">
              {ex.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 transition-colors hover:bg-blue-50/50"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.priority === "Alta"
                        ? "bg-red-400"
                        : item.priority === "Média"
                          ? "bg-yellow-400"
                          : "bg-blue-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
