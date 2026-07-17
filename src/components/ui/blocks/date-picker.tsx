"use client";

import { cn } from "@/utils/cn";
import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Calendar } from "./calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

/**
 * DatePicker próprio do produto — substituto do `<input type="date">`.
 *
 * Por que existe: o input nativo abre o calendário do navegador, fora do tema
 * do app (pedido do Victor, 17/07 — o print mostra o picker cru do Chrome na
 * tela de Mapas). O `Calendar` (react-day-picker, já em ptBR) existia no
 * projeto SEM nenhum consumidor — este componente só o embrulha num dropdown.
 *
 * A API fala ISO ("yyyy-MM-dd"), o mesmo formato do input nativo — as telas que
 * guardavam a data em string continuam funcionando sem conversão. A exibição é
 * dd/MM/yyyy, como o usuário brasileiro lê.
 */

const ISO = "yyyy-MM-dd";

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecionar data",
  className,
  disabled,
}: {
  /** Data em ISO ("2026-07-17") ou vazio. */
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const parsed = value ? parse(value, ISO, new Date()) : undefined;
  const date = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 text-left text-sm text-gray-800 transition outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarIcon size={15} className="shrink-0 text-gray-400" />
            <span className={cn("truncate", !date && "text-gray-400")}>
              {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
            </span>
          </span>
          <ChevronDown size={15} className="shrink-0 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="rounded-xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-300/40"
      >
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => {
            // O dropdown não fecha sozinho aqui (dias não são menu items — só
            // itens fecham o Radix). Fechamos ao escolher, como um picker deve.
            if (d) onChange(format(d, ISO));
            setOpen(false);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
