"use client";

import { AIComponentResponse } from "../types/component-types";
import { SectionRenderer } from "./SectionRenderer";

interface DynamicComponentRendererProps {
  response: AIComponentResponse;
}

// Componente principal que renderiza a resposta completa da IA com seções
export function DynamicComponentRenderer({
  response,
}: DynamicComponentRendererProps) {
  if (!response.sections || response.sections.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>Nenhuma seção para exibir</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-8 pb-10 duration-500">
      {response.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </div>
  );
}
