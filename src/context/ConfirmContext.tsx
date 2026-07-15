"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/blocks/dialog";
import { cn } from "@/utils/cn";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

/**
 * Confirmação custom (substitui window.confirm — pedido do Victor na validação).
 * Uso: const confirm = useConfirm(); if (await confirm({ title, ... })) { ... }
 */

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' pinta o botão de confirmação de vermelho (exclusões). */
  tone?: "danger" | "default";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm deve ser usado dentro de <ConfirmProvider>");
  return ctx;
}

export function ConfirmProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    setOpen(false);
    resolveRef.current?.(value);
    resolveRef.current = null;
  }, []);

  const isDanger = options?.tone === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={open} onOpenChange={(o) => !o && settle(false)}>
        <DialogContent className="max-w-sm bg-white">
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl",
                isDanger
                  ? "bg-red-50 text-red-500"
                  : "bg-gray-100 text-gray-600",
              )}
            >
              {isDanger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              {options?.title}
            </h2>
            {options?.description && (
              <p className="text-sm leading-relaxed text-gray-500">
                {options.description}
              </p>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => settle(false)}
              className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              {options?.cancelLabel ?? "Cancelar"}
            </button>
            <button
              onClick={() => settle(true)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]",
                isDanger
                  ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/20"
                  : "bg-gradient-to-r from-gray-900 to-gray-700 shadow-gray-900/20",
              )}
            >
              {options?.confirmLabel ?? "Confirmar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
