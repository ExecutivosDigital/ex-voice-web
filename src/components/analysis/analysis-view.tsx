"use client";

import { cn } from "@/utils/cn";
import type { AIComponent, AIComponentResponse } from "./types";
import { ChaptersCard } from "./cards/chapters-card";
import { EntitiesCard } from "./cards/entities-card";
import { GenericCard } from "./cards/generic-card";
import { ListCard } from "./cards/list-card";
import { NotesCard, ObservationsCard } from "./cards/notes-card";
import { SentimentCard } from "./cards/sentiment-card";

/**
 * Renderer da análise estruturada — substitui o DynamicComponentRenderer/
 * SectionRenderer herdados do fork health. Tipos de negócio têm card
 * dedicado; qualquer outro tipo (acervo médico legado, tipos futuros) cai
 * no GenericCard, que renderiza por shape.
 */

/** Cards de texto corrido ocupam a linha inteira; o resto divide em 2 colunas. */
const FULL_WIDTH_TYPES = new Set(["clinical_notes_card", "chapters_card"]);

function renderCard(component: AIComponent) {
  const { type, title, variant, data } = component;
  switch (type) {
    case "actions_card":
    case "decisions_card":
    case "commitments_card":
      return (
        <ListCard
          type={type}
          title={title}
          variant={variant ?? (type === "actions_card" ? "emerald" : "blue")}
          data={data}
        />
      );
    case "entities_card":
      return <EntitiesCard title={title} variant={variant} data={data} />;
    case "sentiment_card":
      return <SentimentCard title={title} data={data} />;
    case "chapters_card":
      return <ChaptersCard title={title} variant={variant} data={data} />;
    case "clinical_notes_card":
      return <NotesCard title={title} variant={variant} data={data} />;
    case "observations_card":
      return <ObservationsCard title={title} variant={variant} data={data} />;
    default:
      return <GenericCard title={title} variant={variant} data={data} />;
  }
}

export function AnalysisView({
  response,
  className,
}: {
  response: AIComponentResponse;
  className?: string;
}) {
  const sections = response.sections.filter((s) => s.components.length > 0);

  if (sections.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        Nenhuma seção para exibir.
      </p>
    );
  }

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-8", className)}>
      {sections.map((section, si) => (
        <section key={si} className="flex flex-col gap-4">
          {section.title && (
            <h2 className="text-xs font-semibold tracking-[0.22em] text-gray-400 uppercase">
              {section.title}
            </h2>
          )}
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {section.components.map((component, ci) => (
              <div
                key={ci}
                className={cn(
                  "min-w-0",
                  FULL_WIDTH_TYPES.has(component.type) && "md:col-span-2",
                )}
              >
                {renderCard(component)}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
