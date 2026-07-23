"use client";

import {
  BriefingView,
  briefingParaTexto,
  PreMeetingBriefing,
} from "@/components/premeeting/briefing-view";
import { useApiContext } from "@/context/ApiContext";
import { useTravarScrollDaPagina } from "@/hooks/useTravarScrollDaPagina";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

/**
 * Pre-meeting da tela do contato — MESMO motor estruturado da Agenda
 * (feedback 22/07: eram dois motores paralelos sem ligação; o antigo
 * /corporate/pre-meeting em markdown saiu daqui).
 *
 * O seletor de IA aqui também É a configuração do contato: trocar a IA
 * salva `premeetingPromptId` no cliente e vira o padrão de todo briefing
 * dele (inclusive nos eventos da Agenda).
 */

const PADRAO = "__padrao__";

interface PromptOption {
  id: string;
  name: string;
  type: string;
}

export function PreMeetingModal({
  clientId,
  clientName,
  open,
  onClose,
}: {
  clientId: string;
  clientName: string;
  open: boolean;
  onClose: () => void;
}) {
  const { GetAPI, PostAPI, PutAPI } = useApiContext();
  const [briefing, setBriefing] = useState<PreMeetingBriefing | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [prompts, setPrompts] = useState<PromptOption[]>([]);
  const [promptId, setPromptId] = useState<string>(PADRAO);

  useEffect(() => setMounted(true), []);
  useTravarScrollDaPagina(open);

  const gerar = useCallback(
    async (prompt?: string) => {
      setGerando(true);
      setErro(false);
      // Sem promptId explícito a API usa a IA configurada no contato
      const response = await PostAPI(
        "/premeeting",
        {
          clientIds: [clientId],
          ...(prompt && prompt !== PADRAO ? { promptId: prompt } : {}),
        },
        true,
      );
      if (response.status === 200 || response.status === 201) {
        const corpo = response.body as PreMeetingBriefing;
        setBriefing(corpo);
        setPromptId(corpo.promptIdUsado ?? PADRAO);
      } else {
        setErro(true);
      }
      setGerando(false);
    },
    [clientId, PostAPI],
  );

  useEffect(() => {
    if (open) {
      setBriefing(null);
      setErro(false);
      gerar();
    }
  }, [open, gerar]);

  useEffect(() => {
    if (!open || prompts.length > 0) return;
    (async () => {
      const response = await GetAPI("/prompts/available", true);
      if (response.status === 200) {
        setPrompts(
          (response.body as PromptOption[]).filter((p) => p.type === "CLIENT"),
        );
      }
    })();
  }, [open, prompts.length, GetAPI]);

  // Trocar a IA aqui CONFIGURA o contato (premeetingPromptId) e regenera
  const trocarIA = async (novo: string) => {
    setPromptId(novo);
    const response = await PutAPI(
      `/client/${clientId}`,
      { premeetingPromptId: novo === PADRAO ? "" : novo },
      true,
    );
    if (response.status === 200) {
      toast.success(
        novo === PADRAO
          ? "Este contato voltou para a IA padrão de briefing"
          : "IA de briefing salva para este contato",
      );
    }
    gerar(novo);
  };

  const copiar = async () => {
    if (!briefing) return;
    try {
      await navigator.clipboard.writeText(
        `Pre-meeting — ${clientName}\n\n${briefingParaTexto(briefing)}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard indisponível
    }
  };

  if (!mounted || !open) return null;

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
                <Sparkles size={11} />
                Pre-meeting
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold text-gray-900">
                Preparar reunião — {clientName}
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
                IA do briefing deste contato
              </span>
              <select
                value={promptId}
                onChange={(e) => trocarIA(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 outline-none transition focus:border-primary"
              >
                <option value={PADRAO}>Padrão</option>
                {prompts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-gray-400">
                A escolha fica salva e vale também na Agenda
              </span>
            </div>

            {erro ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Não foi possível gerar o pre-meeting — tente novamente.
              </p>
            ) : !briefing || gerando ? (
              <div className="flex flex-col items-center gap-3 py-10 text-sm text-gray-500">
                <Loader2 size={20} className="animate-spin" />
                Analisando o histórico das reuniões anteriores...
              </div>
            ) : (
              <BriefingView briefing={briefing} />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
            <p className="text-[11px] text-gray-400">
              Gerado do histórico real — confira antes de usar.
            </p>
            <div className="flex items-center gap-2">
              {briefing && !gerando && (
                <>
                  <button
                    onClick={() => gerar(promptId)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300"
                  >
                    <Sparkles size={12} />
                    Gerar novamente
                  </button>
                  <button
                    onClick={copiar}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary-dim"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
