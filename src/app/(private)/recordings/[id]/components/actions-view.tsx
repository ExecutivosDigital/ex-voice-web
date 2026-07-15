"use client";

import { ActionItemsCard } from "@/app/(private)/ai-components-preview/components/cards/ActionItemsCard";
import type { AIComponentResponse } from "@/app/(private)/ai-components-preview/types/component-types";
import { ListChecks } from "lucide-react";

/**
 * Aba "Ações" de verdade (achado da reunião: "nas ações não temos nada"):
 * extrai SÓ os cards de negócio (ações, decisões, compromissos) de ambos os
 * resumos (estruturado + específico), destacados e copiáveis. Ignora os cards
 * puramente analíticos — esses ficam na aba Análise.
 */

const BUSINESS_TYPES = new Set([
  "actions_card",
  "decisions_card",
  "commitments_card",
]);

const GROUP_LABEL: Record<string, string> = {
  actions_card: "Ações e tarefas",
  decisions_card: "Decisões",
  commitments_card: "Compromissos e próximos passos",
};

interface BusinessCard {
  type: string;
  title: string;
  variant?: string;
  data: unknown;
}

function collectBusinessCards(
  ...summaries: (AIComponentResponse | null | undefined)[]
): BusinessCard[] {
  const out: BusinessCard[] = [];
  for (const summary of summaries) {
    for (const section of summary?.sections ?? []) {
      for (const component of section.components ?? []) {
        if (BUSINESS_TYPES.has(component.type)) {
          out.push(component as BusinessCard);
        }
      }
    }
  }
  return out;
}

export function ActionsView({
  structuredSummary,
  specificSummary,
}: {
  structuredSummary?: AIComponentResponse | null;
  specificSummary?: AIComponentResponse | null;
}) {
  const cards = collectBusinessCards(structuredSummary, specificSummary);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <ListChecks size={24} />
        </div>
        <p className="mt-4 max-w-sm text-sm text-gray-500">
          A IA não identificou ações, decisões ou compromissos nesta conversa.
          Você ainda pode ver o resumo completo na aba Análise.
        </p>
      </div>
    );
  }

  // Ordena por tipo (ações → decisões → compromissos) para leitura consistente
  const order = ["actions_card", "decisions_card", "commitments_card"];
  const sorted = [...cards].sort(
    (a, b) => order.indexOf(a.type) - order.indexOf(b.type),
  );

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((card, i) => (
        <ActionItemsCard
          key={i}
          title={card.title || GROUP_LABEL[card.type] || "Itens"}
          variant={
            (card.variant as never) ??
            (card.type === "decisions_card"
              ? "violet"
              : card.type === "commitments_card"
                ? "blue"
                : "emerald")
          }
          data={card.data as { items?: never[] }}
        />
      ))}
    </div>
  );
}
