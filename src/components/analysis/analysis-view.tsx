"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import type { AIComponent, AIComponentResponse } from "./types";
import { ChaptersCard } from "./cards/chapters-card";
import { EntitiesCard } from "./cards/entities-card";
import { GenericCard } from "./cards/generic-card";
import { ListCard } from "./cards/list-card";
import { NotesCard, ObservationsCard } from "./cards/notes-card";
import { SentimentCard } from "./cards/sentiment-card";
import { EditarCardModal, TIPOS_EDITAVEIS } from "./editar-card-modal";

/**
 * Renderer da análise estruturada — substitui o DynamicComponentRenderer/
 * SectionRenderer herdados do fork health. Tipos de negócio têm card
 * dedicado; qualquer outro tipo (acervo médico legado, tipos futuros) cai
 * no GenericCard, que renderiza por shape.
 *
 * Layout um card por linha, largura total (call do João, 21/07). Com
 * `onSalvarComponente`, os cards de conteúdo ganham edição (lápis no header
 * + selo "Editado" via `_editadoEm` no data).
 */

interface Edicao {
  si: number;
  ci: number;
  component: AIComponent;
}

function renderCard(
  component: AIComponent,
  extra: { editadoEm?: string; onEditar?: () => void },
) {
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
          editadoEm={extra.editadoEm}
          onEditar={extra.onEditar}
        />
      );
    case "entities_card":
      return <EntitiesCard title={title} variant={variant} data={data} />;
    case "sentiment_card":
      return <SentimentCard title={title} data={data} />;
    case "chapters_card":
      return <ChaptersCard title={title} variant={variant} data={data} />;
    case "clinical_notes_card":
      return (
        <NotesCard
          title={title}
          variant={variant}
          data={data}
          editadoEm={extra.editadoEm}
          onEditar={extra.onEditar}
        />
      );
    case "observations_card":
      return (
        <ObservationsCard
          title={title}
          variant={variant}
          data={data}
          editadoEm={extra.editadoEm}
          onEditar={extra.onEditar}
        />
      );
    default:
      return <GenericCard title={title} variant={variant} data={data} />;
  }
}

export function AnalysisView({
  response,
  className,
  onSalvarComponente,
}: {
  response: AIComponentResponse;
  className?: string;
  /**
   * Persiste o data novo do componente [si][ci]; resolve true no sucesso.
   * Sem este handler a análise é somente leitura (ex.: PDF/share).
   */
  onSalvarComponente?: (
    si: number,
    ci: number,
    novoData: Record<string, unknown>,
  ) => Promise<boolean>;
}) {
  const [edicao, setEdicao] = useState<Edicao | null>(null);
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
          <div className="flex flex-col gap-4">
            {section.components.map((component, ci) => {
              const editavel =
                !!onSalvarComponente && TIPOS_EDITAVEIS.has(component.type);
              const editadoEm =
                typeof component.data._editadoEm === "string"
                  ? component.data._editadoEm
                  : undefined;
              return (
                <div key={ci} className="min-w-0">
                  {renderCard(component, {
                    editadoEm,
                    onEditar: editavel
                      ? () => setEdicao({ si, ci, component })
                      : undefined,
                  })}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <EditarCardModal
        component={edicao?.component ?? null}
        onClose={() => setEdicao(null)}
        onSalvar={async (novoData) => {
          if (!edicao || !onSalvarComponente) return false;
          return onSalvarComponente(edicao.si, edicao.ci, novoData);
        }}
      />
    </div>
  );
}
