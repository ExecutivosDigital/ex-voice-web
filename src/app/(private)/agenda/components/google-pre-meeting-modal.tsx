"use client";

import { useApiContext } from "@/context/ApiContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  Lightbulb,
  Loader2,
  MessageCircle,
  Mic,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GoogleEvent } from "../use-google-calendar";

/**
 * Pre-meeting REAL: briefing gerado pela API (POST /premeeting) a partir das
 * gravações anteriores com os contatos reconhecidos no evento do Google.
 */

interface Briefing {
  primeiraConversa: boolean;
  objetivo: string;
  retomar: string[];
  cuidados: string[];
  perguntas: string[];
  baseadoEm: { recordingId: string; name: string; date: string }[];
  contatos: { id: string; name: string; empresa: string | null }[];
}

export function GooglePreMeetingModal({
  evento,
  onClose,
  onGravar,
}: {
  evento: GoogleEvent | null;
  onClose: () => void;
  onGravar: (evento: GoogleEvent) => void;
}) {
  const { PostAPI } = useApiContext();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [semContato, setSemContato] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!evento) {
      setBriefing(null);
      setErro(null);
      setSemContato(false);
      return;
    }
    const clientIds = evento.attendees
      .map((c) => c.contactId)
      .filter((id): id is string => Boolean(id));
    if (clientIds.length === 0) {
      setSemContato(true);
      return;
    }
    setSemContato(false);

    let ativo = true;
    (async () => {
      const response = await PostAPI(
        "/premeeting",
        { clientIds, eventTitle: evento.title },
        true,
      );
      if (!ativo) return;
      if (response.status === 200 || response.status === 201) {
        setBriefing(response.body as Briefing);
      } else {
        setErro("Não foi possível gerar o pre-meeting — tente novamente.");
      }
    })();
    return () => {
      ativo = false;
    };
  }, [evento, PostAPI]);

  if (!mounted || !evento) return null;

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
                {evento.title}
              </h3>
              {briefing && briefing.contatos.length > 0 && (
                <p className="mt-0.5 text-xs text-gray-500">
                  Com{" "}
                  {briefing.contatos
                    .map((c) => `${c.name}${c.empresa ? ` (${c.empresa})` : ""}`)
                    .join(", ")}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {erro ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </p>
            ) : semContato ? (
              <div className="rounded-2xl bg-gray-50 px-4 py-4 text-sm leading-relaxed text-gray-600">
                Nenhum convidado deste evento é um contato seu ainda — por isso
                não há histórico para preparar o briefing. Cadastre o convidado
                em Contatos com o e-mail do convite e ele passa a ser
                reconhecido automaticamente. A gravação funciona normalmente.
              </div>
            ) : !briefing ? (
              <div className="flex flex-col items-center gap-3 py-10 text-sm text-gray-500">
                <Loader2 size={20} className="animate-spin" />
                Analisando o histórico das reuniões anteriores...
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {briefing.primeiraConversa && (
                  <p className="rounded-2xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
                    Ainda não há reuniões gravadas com este contato — este é um
                    roteiro de primeira conversa.
                  </p>
                )}

                <Bloco icone={Target} titulo="Objetivo da reunião">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {briefing.objetivo}
                  </p>
                </Bloco>

                {briefing.retomar.length > 0 && (
                  <Bloco icone={ArrowRight} titulo="Retomar (ficou em aberto)">
                    <Lista itens={briefing.retomar} tom="bg-gray-50 text-gray-700" />
                  </Bloco>
                )}

                {briefing.cuidados.length > 0 && (
                  <Bloco icone={AlertTriangle} titulo="Cuidados">
                    <Lista
                      itens={briefing.cuidados}
                      tom="bg-amber-50 text-amber-800"
                    />
                  </Bloco>
                )}

                {briefing.perguntas.length > 0 && (
                  <Bloco icone={MessageCircle} titulo="Perguntas sugeridas">
                    <Lista
                      itens={briefing.perguntas}
                      tom="bg-emerald-50/60 text-emerald-900"
                    />
                  </Bloco>
                )}

                {briefing.baseadoEm.length > 0 && (
                  <Bloco icone={FileText} titulo="Baseado nas gravações">
                    <div className="flex flex-col gap-1">
                      {briefing.baseadoEm.map((r) => (
                        <Link
                          key={r.recordingId}
                          href={`/recordings/${r.recordingId}`}
                          className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-700 transition hover:border-gray-300"
                        >
                          <span className="truncate font-medium">{r.name}</span>
                          <span className="ml-2 shrink-0 text-gray-400">
                            {new Date(r.date).toLocaleDateString("pt-BR")}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </Bloco>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Lightbulb size={11} />
              Gerado do histórico real — confira antes de usar.
            </p>
            <button
              onClick={() => onGravar(evento)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
            >
              <Mic size={12} />
              Gravar esta reunião
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function Bloco({
  icone: Icone,
  titulo,
  children,
}: {
  icone: typeof Target;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
        <Icone size={11} />
        {titulo}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Lista({ itens, tom }: { itens: string[]; tom: string }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {itens.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-xl px-3 py-2 text-xs leading-relaxed",
            tom,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
