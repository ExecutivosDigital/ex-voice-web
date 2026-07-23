"use client";

import { useTravarScrollDaPagina } from "@/hooks/useTravarScrollDaPagina";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ActionItem, AIComponent, NotesSection } from "./types";

/**
 * Edição de um card da análise (pedido do João, 21/07). A IA erra e o usuário
 * precisa poder corrigir — a edição grava por cima do structuredSummary e o
 * card ganha o selo "Editado" (via `_editadoEm` dentro do data do componente).
 *
 * v1 edita os cards de conteúdo (listas e texto corrido); cards derivados
 * (entidades, sentimento, capítulos) ficam para depois.
 */

export const TIPOS_EDITAVEIS = new Set([
  "actions_card",
  "decisions_card",
  "commitments_card",
  "observations_card",
  "clinical_notes_card",
]);

interface ItemEditavel {
  primary: string;
  secondary: string;
  original?: ActionItem;
}

type Caminho = Array<string | number>;

interface CampoGenerico {
  caminho: Caminho;
  rotulo: string;
  valor: string;
  original: unknown;
  listaDeTextos: boolean;
}

const TIPOS_COM_RENDERER_DEDICADO = new Set([
  ...TIPOS_EDITAVEIS,
  "entities_card",
  "sentiment_card",
  "chapters_card",
]);

function rotuloLegivel(valor: string): string {
  return valor
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/^./, (letra) => letra.toUpperCase());
}

function extrairCamposGenericos(
  valor: unknown,
  caminho: Caminho = [],
  rotulos: string[] = [],
): CampoGenerico[] {
  if (valor === null || valor === undefined) return [];

  if (
    typeof valor === "string" ||
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return [
      {
        caminho,
        rotulo: rotulos.join(" · ") || "Conteúdo",
        valor: String(valor),
        original: valor,
        listaDeTextos: false,
      },
    ];
  }

  if (Array.isArray(valor)) {
    if (
      valor.every(
        (item) =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean",
      )
    ) {
      return [
        {
          caminho,
          rotulo: rotulos.join(" · ") || "Itens",
          valor: valor.map(String).join("\n"),
          original: valor,
          listaDeTextos: true,
        },
      ];
    }

    return valor.flatMap((item, index) => {
      if (
        item &&
        typeof item === "object" &&
        "label" in item &&
        "value" in item
      ) {
        const itemComRotulo = item as { label: unknown; value: unknown };
        return extrairCamposGenericos(
          itemComRotulo.value,
          [...caminho, index, "value"],
          [
            ...rotulos,
            typeof itemComRotulo.label === "string"
              ? itemComRotulo.label
              : `Item ${index + 1}`,
          ],
        );
      }
      return extrairCamposGenericos(
        item,
        [...caminho, index],
        [...rotulos, `Item ${index + 1}`],
      );
    });
  }

  if (typeof valor === "object") {
    return Object.entries(valor as Record<string, unknown>)
      .filter(([chave]) => chave !== "_editadoEm")
      .flatMap(([chave, item]) =>
        extrairCamposGenericos(
          item,
          [...caminho, chave],
          [...rotulos, rotuloLegivel(chave)],
        ),
      );
  }

  return [];
}

function definirNoCaminho(
  objeto: Record<string, unknown>,
  caminho: Caminho,
  valor: unknown,
) {
  let atual: unknown = objeto;
  caminho.forEach((parte, index) => {
    if (index === caminho.length - 1) {
      (atual as Record<string | number, unknown>)[parte] = valor;
      return;
    }
    atual = (atual as Record<string | number, unknown>)[parte];
  });
}

export function EditarCardModal({
  component,
  onSalvar,
  onClose,
}: {
  component: AIComponent | null;
  /** Recebe o data novo (já com _editadoEm); resolve true quando persistiu. */
  onSalvar: (novoData: Record<string, unknown>) => Promise<boolean>;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [salvando, setSalvando] = useState(false);
  useTravarScrollDaPagina(!!component);

  const ehLista = component
    ? ["actions_card", "decisions_card", "commitments_card"].includes(
        component.type,
      )
    : false;
  const ehGenerico = component
    ? !TIPOS_COM_RENDERER_DEDICADO.has(component.type)
    : false;

  const [itens, setItens] = useState<ItemEditavel[]>([]);
  const [textos, setTextos] = useState<{ rotulo: string; valor: string }[]>([]);
  const [camposGenericos, setCamposGenericos] = useState<CampoGenerico[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!component) return;
    if (ehLista) {
      const brutos = (component.data.items as ActionItem[] | undefined) ?? [];
      setItens(
        brutos.map((item) => ({
          primary: item.primary ?? "",
          secondary: item.secondary ?? "",
          original: item,
        })),
      );
    } else if (ehGenerico) {
      setCamposGenericos(extrairCamposGenericos(component.data));
    } else {
      const data = component.data as Record<string, unknown>;
      const sections = (data.sections as NotesSection[] | undefined)?.filter(
        (s) => s?.content,
      );
      if (sections?.length) {
        setTextos(
          sections.map((s, i) => ({
            rotulo: s.title ?? `Seção ${i + 1}`,
            valor: s.content,
          })),
        );
      } else {
        const valor =
          (data.content as string) ??
          (data.notes as string) ??
          (data.observations as string) ??
          "";
        setTextos([{ rotulo: "Conteúdo", valor }]);
      }
    }
  }, [component, ehGenerico, ehLista]);

  if (!mounted || !component) return null;

  const salvar = async () => {
    setSalvando(true);
    const data = { ...component.data } as Record<string, unknown>;

    if (ehLista) {
      data.items = itens
        .filter((item) => item.primary.trim())
        .map((item) => ({
          ...(item.original ?? {}),
          primary: item.primary.trim(),
          secondary: item.secondary.trim() || undefined,
        }));
    } else if (ehGenerico) {
      const dataClonado = JSON.parse(JSON.stringify(component.data)) as Record<
        string,
        unknown
      >;
      camposGenericos.forEach((campo) => {
        let valor: unknown = campo.valor;
        if (campo.listaDeTextos) {
          valor = campo.valor
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
        } else if (typeof campo.original === "number") {
          const numero = Number(campo.valor.replace(",", "."));
          valor = Number.isFinite(numero) ? numero : campo.original;
        } else if (typeof campo.original === "boolean") {
          valor = campo.valor === "true";
        }
        definirNoCaminho(dataClonado, campo.caminho, valor);
      });
      Object.assign(data, dataClonado);
    } else {
      const sections = (data.sections as NotesSection[] | undefined)?.filter(
        (s) => s?.content,
      );
      if (sections?.length) {
        data.sections = sections.map((s, i) => ({
          ...s,
          content: textos[i]?.valor ?? s.content,
        }));
      } else if (data.observations !== undefined) {
        data.observations = textos[0]?.valor ?? "";
      } else if (data.notes !== undefined && data.content === undefined) {
        data.notes = textos[0]?.valor ?? "";
      } else {
        data.content = textos[0]?.valor ?? "";
      }
    }

    data._editadoEm = new Date().toISOString();
    const ok = await onSalvar(data);
    setSalvando(false);
    if (ok) onClose();
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]"
        >
          <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                <Pencil size={11} />
                Editar
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold text-gray-900">
                {component.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {ehLista ? (
              <div className="flex flex-col gap-3">
                {itens.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-3"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <input
                        value={item.primary}
                        onChange={(e) =>
                          setItens((prev) =>
                            prev.map((p, j) =>
                              j === i ? { ...p, primary: e.target.value } : p,
                            ),
                          )
                        }
                        placeholder="Item"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                      />
                      <input
                        value={item.secondary}
                        onChange={(e) =>
                          setItens((prev) =>
                            prev.map((p, j) =>
                              j === i ? { ...p, secondary: e.target.value } : p,
                            ),
                          )
                        }
                        placeholder="Detalhe (opcional)"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 transition outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setItens((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remover item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setItens((prev) => [
                      ...prev,
                      { primary: "", secondary: "" },
                    ])
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-500 transition hover:border-gray-400 hover:text-gray-800"
                >
                  <Plus size={13} />
                  Adicionar item
                </button>
              </div>
            ) : ehGenerico ? (
              <div className="flex flex-col gap-4">
                {camposGenericos.length === 0 ? (
                  <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                    Este card não possui campos de texto editáveis.
                  </p>
                ) : (
                  camposGenericos.map((campo, i) => (
                    <label
                      key={campo.caminho.join(".")}
                      className="flex flex-col gap-1.5"
                    >
                      <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                        {campo.rotulo}
                      </span>
                      {typeof campo.original === "boolean" ? (
                        <select
                          value={campo.valor}
                          onChange={(e) =>
                            setCamposGenericos((prev) =>
                              prev.map((item, j) =>
                                j === i
                                  ? { ...item, valor: e.target.value }
                                  : item,
                              ),
                            )
                          }
                          className="h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 transition outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                        >
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      ) : (
                        <textarea
                          value={campo.valor}
                          onChange={(e) =>
                            setCamposGenericos((prev) =>
                              prev.map((item, j) =>
                                j === i
                                  ? { ...item, valor: e.target.value }
                                  : item,
                              ),
                            )
                          }
                          rows={
                            campo.listaDeTextos
                              ? Math.min(
                                  10,
                                  Math.max(
                                    3,
                                    campo.valor.split("\n").length + 1,
                                  ),
                                )
                              : Math.min(
                                  10,
                                  Math.max(
                                    2,
                                    campo.valor.split("\n").length + 1,
                                  ),
                                )
                          }
                          className="w-full resize-y rounded-2xl border border-gray-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-gray-900 transition outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                        />
                      )}
                    </label>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {textos.map((t, i) => (
                  <label key={i} className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                      {t.rotulo}
                    </span>
                    <textarea
                      value={t.valor}
                      onChange={(e) =>
                        setTextos((prev) =>
                          prev.map((p, j) =>
                            j === i ? { ...p, valor: e.target.value } : p,
                          ),
                        )
                      }
                      rows={Math.min(
                        14,
                        Math.max(4, t.valor.split("\n").length + 2),
                      )}
                      className="w-full resize-y rounded-2xl border border-gray-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-gray-900 transition outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
            <p className="text-[11px] text-gray-400">
              A edição substitui o conteúdo gerado pela IA e fica marcada como
              editada.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
              >
                {salvando && <Loader2 size={12} className="animate-spin" />}
                Salvar edição
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
