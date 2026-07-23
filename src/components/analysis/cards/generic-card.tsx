"use client";

import { LayoutList } from "lucide-react";
import { useState } from "react";
import { CardShell, CopyAllButton } from "../card-shell";
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

const HIDDEN_KEYS = new Set(["id", "type", "variant", "icon", "_editadoEm"]);

function label(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function isLabelValue(v: unknown): v is { label: string; value: unknown } {
  return !!v && typeof v === "object" && "label" in v && "value" in v;
}

function valueToText(
  name: string | undefined,
  value: unknown,
  depth = 0,
): string[] {
  if (value === null || value === undefined || value === "") return [];
  const prefix = name ? `${"  ".repeat(depth)}${label(name)}: ` : "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [`${prefix}${String(value)}`];
  }

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item !== "object" || item === null)) {
      return [
        ...(name ? [`${"  ".repeat(depth)}${label(name)}:`] : []),
        ...value.map((item) => `${"  ".repeat(depth + 1)}• ${String(item)}`),
      ];
    }
    return [
      ...(name ? [`${"  ".repeat(depth)}${label(name)}:`] : []),
      ...value.flatMap((item, index) =>
        isLabelValue(item)
          ? valueToText(item.label, item.value, depth + 1)
          : typeof item === "object" && item !== null
            ? [
                `${"  ".repeat(depth + 1)}Item ${index + 1}:`,
                ...Object.entries(item as Record<string, unknown>)
                  .filter(([key]) => !HIDDEN_KEYS.has(key))
                  .flatMap(([key, itemValue]) =>
                    valueToText(key, itemValue, depth + 2),
                  ),
              ]
            : valueToText(undefined, item, depth + 1),
      ),
    ];
  }

  if (typeof value === "object") {
    return [
      ...(name ? [`${"  ".repeat(depth)}${label(name)}:`] : []),
      ...Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !HIDDEN_KEYS.has(key))
        .flatMap(([key, itemValue]) =>
          valueToText(key, itemValue, name ? depth + 1 : depth),
        ),
    ];
  }

  return [];
}

function Entry({ name, value }: { name?: string; value: unknown }) {
  if (value === null || value === undefined || value === "") return null;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
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
      ([k, v]) =>
        !HIDDEN_KEYS.has(k) && v !== null && v !== undefined && v !== "",
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
  editadoEm,
  onEditar,
}: {
  title: string;
  variant?: VariantColor;
  data: Record<string, unknown>;
  editadoEm?: string;
  onEditar?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const entries = Object.entries(data ?? {}).filter(
    ([k, v]) =>
      !HIDDEN_KEYS.has(k) && v !== null && v !== undefined && v !== "",
  );

  const copyAll = async () => {
    try {
      const content = entries.flatMap(([key, value]) =>
        valueToText(key, value),
      );
      await navigator.clipboard.writeText([title, ...content].join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <CardShell
      icon={LayoutList}
      title={title}
      variant={variant}
      editadoEm={editadoEm}
      onEditar={onEditar}
      headerAction={
        entries.length > 0 ? (
          <CopyAllButton copied={copied} onCopy={copyAll} />
        ) : undefined
      }
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Sem conteúdo.</p>
        ) : (
          entries.map(([k, v]) => (
            // Chave única de dado string não precisa do rótulo (é "o conteúdo")
            <Entry
              key={k}
              name={
                entries.length === 1 && typeof v === "string" ? undefined : k
              }
              value={v}
            />
          ))
        )}
      </div>
    </CardShell>
  );
}
