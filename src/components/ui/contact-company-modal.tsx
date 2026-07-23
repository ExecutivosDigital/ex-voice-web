"use client";

import { ContactCompanyProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useTravarScrollDaPagina } from "@/hooks/useTravarScrollDaPagina";
import { handleApiError } from "@/utils/error-handler";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Loader2, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

export function ContactCompanyModal({
  open,
  company,
  onClose,
  onSaved,
  onDeleted,
}: {
  open: boolean;
  company: ContactCompanyProps | null;
  onClose: () => void;
  onSaved: (company: ContactCompanyProps) => void;
  onDeleted: (id: string) => void;
}) {
  const { PostAPI, PatchAPI, DeleteAPI } = useApiContext();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useTravarScrollDaPagina(open);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    setName(company?.name ?? "");
    setDetails(company?.details ?? "");
  }, [company, open]);

  if (!mounted) return null;

  const save = async () => {
    if (name.trim().length < 2) {
      toast.error("Informe o nome da empresa cliente.");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      details: details.trim() || undefined,
    };
    const response = company
      ? await PatchAPI(
          `/corporate/contact-companies/${company.id}`,
          payload,
          true,
        )
      : await PostAPI("/corporate/contact-companies", payload, true);
    setSaving(false);

    if (response.status !== 200) {
      toast.error(
        handleApiError(response, "Não foi possível salvar a empresa cliente."),
      );
      return;
    }

    onSaved({
      ...(company ?? {}),
      ...response.body,
      name: payload.name,
      details: payload.details ?? null,
      _count: company?._count ?? { clients: 0 },
    } as ContactCompanyProps);
    toast.success(company ? "Empresa atualizada." : "Empresa cliente criada.");
    onClose();
  };

  const remove = async () => {
    if (!company) return;
    const confirmed = window.confirm(
      `Excluir ${company.name}? Os contatos não serão apagados, apenas ficarão sem empresa vinculada.`,
    );
    if (!confirmed) return;
    setDeleting(true);
    const response = await DeleteAPI(
      `/corporate/contact-companies/${company.id}`,
      true,
    );
    setDeleting(false);
    if (response.status !== 200) {
      toast.error(
        handleApiError(response, "Não foi possível excluir a empresa cliente."),
      );
      return;
    }
    onDeleted(company.id);
    toast.success("Empresa cliente excluída.");
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving && !deleting) {
              onClose();
            }
          }}
          className="fixed inset-0 z-[9999999] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
                  <Building2 size={19} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {company
                      ? "Editar empresa cliente"
                      : "Nova empresa cliente"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Agrupe os contatos que compartilham o mesmo contexto.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={saving || deleting}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Fechar"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex flex-col gap-5 px-6 py-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Nome da empresa
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex. Empresa A"
                  className="h-11 rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Contexto inicial
                  <span className="ml-2 text-[10px] font-medium tracking-normal text-gray-400 normal-case">
                    opcional
                  </span>
                </span>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="O que a empresa faz, relação comercial e informações úteis..."
                  rows={5}
                  className="resize-y rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                />
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Além deste texto, o Voice mantém automaticamente um contexto
                  acumulado das reuniões ligadas aos contatos da empresa.
                </p>
              </label>
              {company?.resume && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-700 uppercase">
                    Contexto aprendido nas reuniões
                  </p>
                  <p className="mt-2 max-h-32 overflow-y-auto text-xs leading-relaxed whitespace-pre-wrap text-blue-950/75">
                    {company.resume}
                  </p>
                  <p className="mt-2 text-[10px] text-blue-700/70">
                    Atualizado automaticamente; não é necessário editar.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4">
              {company ? (
                <button
                  type="button"
                  onClick={remove}
                  disabled={saving || deleting}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Excluir
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving || deleting}
                  className="h-10 rounded-xl px-4 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || deleting}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Salvar empresa
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
