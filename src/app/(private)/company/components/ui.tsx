"use client";

import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Primitivos visuais da área Empresa — a resposta ao "tem botões de formatos
 * diferentes" (Victor, 17/07).
 *
 * A tela tinha 5 estilos de botão convivendo: pill com gradiente e hover:scale,
 * pill branco pequeno, rounded-xl escuro, rounded-full médio... Aqui existem
 * DOIS, e toda a área usa só eles:
 *
 *   primary — pill escuro. A ação principal de cada seção.
 *   outline — pill branco com borda. Ações secundárias/cancelar.
 *
 * O mesmo vale para o cabeçalho de seção: um componente só, com o botão de ação
 * DENTRO da seção a que pertence (a raiz da outra reclamação: "botão de novo
 * departamento no topo da tela" agindo numa seção 150 linhas abaixo).
 */

export function ActionButton({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger";
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-white hover:bg-primary-dim",
        variant === "outline" &&
          "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
        variant === "danger" &&
          "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Seção padrão da área: ícone + título em caixa alta + contagem à esquerda,
 * ação à direita — na MESMA linha, sempre. A descrição (quando há) vem logo
 * abaixo do título, nunca solta no meio.
 */
export function Section({
  icon: Icon,
  title,
  count,
  description,
  action,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  count?: number;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <Icon size={14} />
            {title}
            {typeof count === "number" && (
              <span className="text-gray-400">({count})</span>
            )}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-gray-400">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
