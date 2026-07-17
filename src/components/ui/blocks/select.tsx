"use client";

import { cn } from "@/utils/cn";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

/**
 * Select próprio do produto — substituto do `<select>` nativo.
 *
 * Por que existe: o `<select>` nativo renderiza o menu do sistema operacional,
 * que ignora o tema do app (pedido do Victor, 17/07 — print
 * nao-utilizar-componentes-padroes). Construído sobre o DropdownMenu (Radix) que
 * o projeto já usa — sem dependência nova, com teclado e fechamento por clique
 * fora herdados de graça.
 *
 * API compatível com o uso que as telas já faziam do nativo: `value` +
 * `onChange(value)` + options. Trocar um pelo outro é mecânico.
 */

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  className,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  /** Classes do BOTÃO (o gatilho) — largura, altura etc. */
  className?: string;
  disabled?: boolean;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 text-left text-sm text-gray-800 transition outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className={cn("truncate", !selected && "text-gray-400")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown size={15} className="shrink-0 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        // Mesma largura do gatilho: menu mais estreito que o botão parece quebrado.
        className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-300/40"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
              option.value === value && "font-medium text-gray-900",
            )}
          >
            <span className="truncate">{option.label}</span>
            {option.value === value && (
              <Check size={14} className="shrink-0 text-gray-900" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
