"use client";

import { LayoutList } from "lucide-react";
import { CardShell } from "../card-shell";
import type { VariantColor } from "../types";

/**
 * Fallback para tipos de card sem renderer dedicado — na prática, o acervo
 * legado do motor multi-domínio (tipos médicos herdados do fork health) e
 * qualquer tipo novo que a IA invente antes do front conhecer.
 *
 * Renderiza best-effort por SHAPE, não por tipo: strings viram parágrafos,
 * arrays viram listas/chips, objetos viram pares rótulo→valor. Substitui os
 * 18 cards médicos dedicados que existiam na pasta de preview.
 */

const HIDDEN_KEYS = new Set(["id", "type", "variant", "icon"]);

function label(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function isLabelValue(v: unknown): v is { label: string; value: unknown } {
  return (
    !!v && typeof v === "object" && "label" in v && "value" in v
  );
}

function Entry({ name, value }: { name?: string; value: unknown }) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return (
      <div className="min-w-0">
        {name && (
          <span className="mr-1.5 text-xs font-semibold text-gray-500">
            {label(name)}:
          </span>
        )}
        <span className="text-sm leading-relaxed break-words text-gray-700">
          {String(value)}
        </span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    // Lista de strings → chips
    if (value.every((v) => typeof v === "string")) {
      return (
        <div className="min-w-0">
          {name && (
            <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
              {label(name)}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(value as string[]).map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    }
    // Lista de objetos → itens empilhados
    return (
      <div className="min-w-0">
        {name && (
          <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
            {label(name)}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {value.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5"
            >
              {isLabelValue(item) ? (
                <Entry name={item.label} value={item.value} />
              ) : typeof item === "object" && item !== null ? (
                <div className="flex flex-col gap-1">
                  {Object.entries(item as Record<string, unknown>)
                    .filter(([k]) => !HIDDEN_KEYS.has(k))
                    .map(([k, v]) => (
                      <Entry key={k} name={k} value={v} />
                    ))}
                </div>
              ) : (
                <Entry value={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([k, v]) => !HIDDEN_KEYS.has(k) && v !== null && v !== undefined && v !== "",
    );
    if (entries.length === 0) return null;
    return (
      <div className="min-w-0">
        {name && (
          <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
            {label(name)}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {entries.map(([k, v]) => (
            <Entry key={k} name={k} value={v} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export function GenericCard({
  title,
  variant = "gray",
  data,
}: {
  title: string;
  variant?: VariantColor;
  data: Record<string, unknown>;
}) {
  const entries = Object.entries(data ?? {}).filter(
    ([k, v]) => !HIDDEN_KEYS.has(k) && v !== null && v !== undefined && v !== "",
  );

  return (
    <CardShell icon={LayoutList} title={title} variant={variant}>
      <div className="flex flex-1 flex-col gap-3 p-4">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Sem conteúdo.</p>
        ) : (
          entries.map(([k, v]) => (
            // Chave única de dado string não precisa do rótulo (é "o conteúdo")
            <Entry
              key={k}
              name={entries.length === 1 && typeof v === "string" ? undefined : k}
              value={v}
            />
          ))
        )}
      </div>
    </CardShell>
  );
}
