"use client";

import { FileText, Info } from "lucide-react";
import { CardShell } from "../card-shell";
import type { NotesSection, VariantColor } from "../types";

/**
 * Cards de texto corrido:
 * - NotesCard (clinical_notes_card — o LLM usa como "anotações" da reunião)
 * - ObservationsCard (observations_card — observação livre)
 */

export function NotesCard({
  title,
  variant = "gray",
  data,
}: {
  title: string;
  variant?: VariantColor;
  data: { content?: string; notes?: string; sections?: NotesSection[] };
}) {
  const content = data.content || data.notes || "";
  const sections = (data.sections ?? []).filter((s) => s?.content);

  return (
    <CardShell icon={FileText} title={title} variant={variant}>
      <div className="flex-1 p-5">
        {sections.length > 0 ? (
          <div className="flex flex-col gap-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
              >
                {section.title && (
                  <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    {section.title}
                  </h4>
                )}
                <p className="text-sm leading-relaxed break-words text-gray-700">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        ) : content ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <p className="text-sm leading-relaxed break-words text-gray-700">
              {content}
            </p>
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-gray-400 italic">
            Nenhum conteúdo disponível.
          </p>
        )}
      </div>
    </CardShell>
  );
}

export function ObservationsCard({
  title,
  variant = "amber",
  data,
}: {
  title: string;
  variant?: VariantColor;
  data: { observations?: string };
}) {
  return (
    <CardShell icon={Info} title={title} variant={variant}>
      <div className="flex-1 p-5">
        {data.observations ? (
          <p className="text-sm leading-relaxed break-words text-gray-700">
            {data.observations}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Nenhuma observação disponível.
          </p>
        )}
      </div>
    </CardShell>
  );
}
