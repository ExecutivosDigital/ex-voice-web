"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useApiContext } from "@/context/ApiContext";
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

moment.locale("pt-br");

/**
 * Pre-meeting v1 (o mock virou funcional): briefing gerado na hora para a
 * próxima conversa com o contato — última reunião, pendências e pauta.
 */

interface PreMeetingData {
  meetingsAnalyzed: number;
  lastMeetingAt: string | null;
  markdown: string;
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
  const { GetAPI } = useApiContext();
  const [data, setData] = useState<PreMeetingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    const response = await GetAPI(`/corporate/pre-meeting/${clientId}`, true);
    if (response.status === 200 && response.body?.markdown) {
      setData(response.body);
    } else {
      setFailed(true);
    }
    setLoading(false);
  }, [GetAPI, clientId]);

  useEffect(() => {
    if (open && !data && !loading) load();
    if (!open) {
      setData(null);
      setFailed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const copy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle>Preparar reunião — {clientName}</DialogTitle>
          <DialogDescription>
            {data
              ? data.meetingsAnalyzed > 0
                ? `Com base nas últimas ${data.meetingsAnalyzed} reunião(ões)${
                    data.lastMeetingAt
                      ? ` · última em ${moment(data.lastMeetingAt).format("DD/MM/YYYY")}`
                      : ""
                  }.`
                : "Sem reuniões anteriores — sugestões para a primeira conversa."
              : "A IA monta o briefing com o histórico e o contexto do negócio."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500">Preparando o briefing...</p>
          </div>
        ) : failed ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-gray-500">
              Não foi possível gerar agora.
            </p>
            <button
              onClick={load}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw size={13} /> Tentar de novo
            </button>
          </div>
        ) : data ? (
          <>
            <div className="prose prose-sm max-h-[55vh] max-w-none overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-gray-800 prose-headings:text-gray-900">
              <ReactMarkdown>{data.markdown}</ReactMarkdown>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={load}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <RefreshCw size={13} /> Regerar
              </button>
              <button
                onClick={copy}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  copied
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copiado" : "Copiar briefing"}
              </button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
