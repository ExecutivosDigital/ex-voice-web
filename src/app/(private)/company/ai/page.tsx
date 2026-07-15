"use client";

import { useApiContext } from "@/context/ApiContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useCorporate } from "@/context/corporateContext";
import { cn } from "@/utils/cn";
import { translateError } from "@/utils/translate-error";
import { Bot, Building2, Globe2, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CompanyTabs } from "../components/company-tabs";
import { AiEditorDrawer, CompanyAi } from "./components/ai-editor-drawer";

/**
 * Fase 2 — Gestão de IAs pelo Controlador: lista as IAs da empresa (gerais e
 * por departamento), cria/edita/exclui e abre o editor com painel de teste.
 */

interface Department {
  id: string;
  name: string;
}

export default function CompanyAiPage() {
  const { loaded, isController } = useCorporate();
  const { GetAPI, DeleteAPI } = useApiContext();
  const confirm = useConfirm();

  const [ais, setAis] = useState<CompanyAi[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CompanyAi | "new" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [aiRes, deptRes] = await Promise.all([
      GetAPI("/corporate/ai", true),
      GetAPI("/corporate/departments", true),
    ]);
    if (aiRes.status === 200) setAis(aiRes.body);
    if (deptRes.status === 200)
      setDepartments(
        deptRes.body.map((d: { id: string; name: string }) => ({
          id: d.id,
          name: d.name,
        })),
      );
    setLoading(false);
  }, [GetAPI]);

  useEffect(() => {
    if (loaded && isController) load();
  }, [loaded, isController, load]);

  async function handleDelete(ai: CompanyAi) {
    const ok = await confirm({
      title: `Excluir a IA "${ai.name}"?`,
      description:
        "As gravações que usam esta IA continuam existindo, apenas perdem o vínculo com ela.",
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    const response = await DeleteAPI(`/corporate/ai/${ai.id}`, true);
    if (response.status === 200) {
      toast.success("IA excluída");
      load();
    } else {
      toast.error(translateError(response.body?.message, "Não foi possível excluir"));
    }
  }

  if (loaded && !isController) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
        <p className="text-sm text-gray-500">
          Somente o controlador da empresa acessa esta área.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            IAs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            As inteligências que resumem e analisam as conversas da empresa.
            Crie uma por etapa do seu processo.
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          <Plus size={16} /> Nova IA
        </button>
      </div>

      <CompanyTabs />

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-gray-200/60 bg-white/60"
            />
          ))}
        </div>
      ) : ais.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <Bot size={24} />
          </div>
          <p className="mt-4 max-w-md text-sm text-gray-500">
            Nenhuma IA ainda. Uma IA é um conjunto de instruções que orienta como
            a conversa é resumida — você pode ter uma geral e outras específicas
            por departamento ou etapa do processo.
          </p>
          <button
            onClick={() => setEditing("new")}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
          >
            <Plus size={16} /> Criar a primeira IA
          </button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {ais.map((ai) => (
            <div
              key={ai.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white p-4 transition hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                    <Bot size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-900">
                      {ai.name}
                    </h3>
                    <span
                      className={cn(
                        "mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        ai.scope === "DEPARTMENT"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-emerald-50 text-emerald-700",
                      )}
                    >
                      {ai.scope === "DEPARTMENT" ? (
                        <>
                          <Building2 size={9} />
                          {ai.department?.name ?? "Departamento"}
                        </>
                      ) : (
                        <>
                          <Globe2 size={9} /> Empresa toda
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setEditing(ai)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
                    aria-label={`Editar ${ai.name}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(ai)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Excluir ${ai.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                {ai.content}
              </p>
              <div className="flex gap-2 text-[10px] text-gray-400">
                {ai.structuredPrompt && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5">
                    análise estruturada
                  </span>
                )}
                {ai.specificPrompt && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5">
                    pontos de atenção
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <AiEditorDrawer
          ai={editing === "new" ? null : editing}
          departments={departments}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
