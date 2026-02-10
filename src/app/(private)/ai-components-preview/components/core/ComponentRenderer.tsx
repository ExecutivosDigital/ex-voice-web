"use client";

import { AIComponent } from "../../types/component-types";
import { getComponent, hasComponent } from "./ComponentRegistry";
import { validateComponent, validateComponentData } from "../../utils/validators";
import { hasValidComponentData } from "../../utils/component-data-checker";

interface ComponentRendererProps {
  component: AIComponent;
}

/**
 * Componente que renderiza um único componente baseado no tipo
 * Usa o ComponentRegistry para mapear tipos para componentes
 */
export function ComponentRenderer({ component }: ComponentRendererProps) {
  // Validação básica
  const validation = validateComponent(component);
  if (!validation.valid) {
    console.error("[ComponentRenderer] Validation errors:", validation.errors);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm font-semibold">
          Componente inválido: {validation.errors.join(", ")}
        </p>
      </div>
    );
  }

  // Verificar se o tipo existe no registry
  if (!hasComponent(component.type)) {
    console.warn(
      "[ComponentRenderer] Unknown component type:",
      component.type
    );
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          Tipo de componente desconhecido: {component.type}
        </p>
      </div>
    );
  }

  // Obter o componente do registry
  const CardComponent = getComponent(component.type);
  if (!CardComponent) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm font-semibold">
          Erro ao carregar componente: {component.type}
        </p>
      </div>
    );
  }

  // Normalizar dados para garantir que sempre seja um objeto válido
  const normalizedData =
    component.data && typeof component.data === "object"
      ? component.data
      : {};

  // Garantir que component.title existe
  const normalizedTitle = component.title || "Componente";

  // Verificar se o componente tem dados válidos antes de renderizar
  if (!hasValidComponentData(component)) {
    // Não renderizar cards vazios
    return null;
  }

  // Validação de dados específicos (não bloqueia renderização, apenas loga)
  if (process.env.NODE_ENV === "development") {
    const dataValidation = validateComponentData(component);
    if (!dataValidation.valid) {
      console.warn(
        `[ComponentRenderer] Data validation warnings for ${component.type}:`,
        dataValidation.errors
      );
    }
  }

  try {
    return (
      <CardComponent
        title={normalizedTitle}
        variant={component.variant as any}
        data={normalizedData}
      />
    );
  } catch (error: any) {
    console.error(
      "[ComponentRenderer] Error rendering component:",
      component.type,
      error
    );
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm font-semibold">
          Erro ao renderizar componente: {component.type}
        </p>
        <p className="text-red-600 text-xs mt-1">
          {error?.message || String(error)}
        </p>
      </div>
    );
  }
}
