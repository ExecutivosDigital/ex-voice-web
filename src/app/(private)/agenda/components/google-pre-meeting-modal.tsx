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
  Plus,
  Search,
  Sparkles,
  Target,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { GoogleEvent } from "../use-google-calendar";

/**
 * Pre-meeting REAL v2 (direção do João, call de 21/07):
 * - E-mails de convidados NUNCA aparecem na UI (LGPD) — só o vínculo com o
 *   contato; quem quiser o e-mail vê no próprio Google Calendar.
 * - Evento sem contato reconhecido abre o VÍNCULO MANUAL: escolher/criar o
 *   contato ali mesmo e gerar o briefing na sequência. Opcionalmente salva o
 *   e-mail do convite no contato para reconhecer sozinho da próxima vez —
 *   escolha explícita, desligada por padrão.
 * - IA do pre-meeting selecionável (≠ IA de transcrição): as IAs de
 *   /prompts/available guiam o foco/tom do briefing.
 */

const PADRAO = "__padrao__";

interface Briefing {
  primeiraConversa: boolean;
  objetivo: string;
  retomar: string[];
  cuidados: string[];
  perguntas: string[];
  baseadoEm: { recordingId: string; name: string; date: string }[];
  contatos: { id: string; name: string; empresa: string | null }[];
}

interface PromptOption {
  id: string;
  name: string;
  type: string;
}

interface ContatoOption {
  id: string;
  name: string;
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
  const { GetAPI, PostAPI, PutAPI } = useApiContext();

  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [prompts, setPrompts] = useState<PromptOption[]>([]);
  const [promptId, setPromptId] = useState<string>(PADRAO);

  // Vínculo manual (evento sem contato reconhecido)
  const [escolhidos, setEscolhidos] = useState<ContatoOption[]>([]);
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<ContatoOption[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [criando, setCriando] = useState(false);
  const [lembrarVinculo, setLembrarVinculo] = useState(false);

  useEffect(() => setMounted(true), []);

  const idsReconhecidos =
    evento?.attendees
      .map((c) => c.contactId)
      .filter((id): id is string => Boolean(id)) ?? [];
  const semContato = !!evento && idsReconhecidos.length === 0;
  const clientIds = semContato ? escolhidos.map((c) => c.id) : idsReconhecidos;

  // Um único convidado com e-mail + um único contato escolhido = vínculo sem
  // ambiguidade; só aí oferecemos persistir o reconhecimento.
  const emailsDoConvite =
    evento?.attendees
      .map((c) => c.email)
      .filter((e): e is string => Boolean(e)) ?? [];
  const podeLembrar =
    semContato && emailsDoConvite.length === 1 && escolhidos.length === 1;

  const gerar = useCallback(
    async (ids: string[], prompt: string) => {
      if (!evento || ids.length === 0) return;
      setGerando(true);
      setErro(null);
      const response = await PostAPI(
        "/premeeting",
        {
          clientIds: ids,
          eventTitle: evento.title,
          ...(prompt !== PADRAO ? { promptId: prompt } : {}),
        },
        true,
      );
      if (response.status === 200 || response.status === 201) {
        setBriefing(response.body as Briefing);
      } else {
        setErro("Não foi possível gerar o pre-meeting — tente novamente.");
      }
      setGerando(false);
    },
    [evento, PostAPI],
  );

  // Reset + geração automática quando há contatos reconhecidos
  useEffect(() => {
    setBriefing(null);
    setErro(null);
    setEscolhidos([]);
    setBusca("");
    setResultados([]);
    setLembrarVinculo(false);
    setPromptId(PADRAO);
    if (!evento) return;
    const ids = evento.attendees
      .map((c) => c.contactId)
      .filter((id): id is string => Boolean(id));
    if (ids.length > 0) gerar(ids, PADRAO);
  }, [evento, gerar]);

  // IAs disponíveis (mesma fonte da re-análise)
  useEffect(() => {
    if (!evento || prompts.length > 0) return;
    (async () => {
      const response = await GetAPI("/prompts/available", true);
      if (response.status === 200) {
        setPrompts(
          (response.body as PromptOption[]).filter((p) => p.type === "CLIENT"),
        );
      }
    })();
  }, [evento, prompts.length, GetAPI]);

  // Busca de contatos para o vínculo manual
  useEffect(() => {
    if (!semContato) return;
    const q = busca.trim();
    if (q.length < 2) {
      setResultados([]);
      return;
    }
    const timer = setTimeout(async () => {
      setBuscando(true);
      const response = await GetAPI(
        `/client?query=${encodeURIComponent(q)}&page=1`,
        true,
      );
      if (response.status === 200) {
        const lista = (response.body?.clients ?? []) as ContatoOption[];
        setResultados(
          lista.filter((c) => !escolhidos.some((e) => e.id === c.id)).slice(0, 6),
        );
      }
      setBuscando(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [busca, semContato, escolhidos, GetAPI]);

  const criarContato = async () => {
    const nome = busca.trim();
    if (!nome) return;
    setCriando(true);
    const response = await PostAPI("/client", { name: nome }, true);
    setCriando(false);
    if (response.status === 200 || response.status === 201) {
      const bruto = (response.body?.client ?? response.body) as ContatoOption;
      if (bruto?.id) {
        setEscolhidos((prev) => [...prev, { id: bruto.id, name: bruto.name }]);
        setBusca("");
        setResultados([]);
        return;
      }
    }
    toast.error("Não foi possível criar o contato");
  };

  const gerarComVinculo = async () => {
    if (clientIds.length === 0) return;
    // Persistir o reconhecimento é escolha explícita do usuário (LGPD):
    // grava o e-mail do convite no contato escolhido.
    if (podeLembrar && lembrarVinculo) {
      await PutAPI(
        `/client/${escolhidos[0].id}`,
        { email: emailsDoConvite[0] },
        true,
      );
    }
    gerar(clientIds, promptId);
  };

  if (!mounted || !evento) return null;

  const trocarIA = (novo: string) => {
    setPromptId(novo);
    if (briefing || gerando) gerar(clientIds, novo);
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
            {semContato && !briefing ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-gray-600">
                  Nenhum convidado deste evento é um contato seu ainda.{" "}
                  <span className="font-medium text-gray-800">
                    Com quem é esta reunião?
                  </span>{" "}
                  Vincule (ou crie) o contato para gerar o briefing com o
                  histórico dele.
                </p>

                {escolhidos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {escolhidos.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
                      >
                        <UserCheck size={11} />
                        {c.name}
                        <button
                          onClick={() =>
                            setEscolhidos((prev) =>
                              prev.filter((e) => e.id !== c.id),
                            )
                          }
                          className="text-emerald-600/60 transition hover:text-emerald-800"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <Search
                    size={14}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar contato pelo nome..."
                    className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pr-3.5 pl-9 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>

                {busca.trim().length >= 2 && (
                  <div className="flex flex-col gap-1">
                    {buscando ? (
                      <p className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-400">
                        <Loader2 size={12} className="animate-spin" />
                        Buscando...
                      </p>
                    ) : (
                      <>
                        {resultados.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setEscolhidos((prev) => [...prev, c]);
                              setBusca("");
                              setResultados([]);
                            }}
                            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3.5 py-2 text-left text-sm text-gray-800 transition hover:border-gray-300"
                          >
                            {c.name}
                            <Plus size={13} className="text-gray-400" />
                          </button>
                        ))}
                        <button
                          onClick={criarContato}
                          disabled={criando}
                          className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3.5 py-2 text-left text-sm text-gray-600 transition hover:border-gray-400 hover:text-gray-900 disabled:opacity-60"
                        >
                          {criando ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Plus size={13} />
                          )}
                          Criar contato &quot;{busca.trim()}&quot;
                        </button>
                      </>
                    )}
                  </div>
                )}

                {podeLembrar && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl bg-gray-50 px-3.5 py-3">
                    <input
                      type="checkbox"
                      checked={lembrarVinculo}
                      onChange={(e) => setLembrarVinculo(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-gray-900"
                    />
                    <span className="text-xs leading-relaxed text-gray-600">
                      <span className="font-medium text-gray-800">
                        Reconhecer automaticamente da próxima vez
                      </span>{" "}
                      — salva o e-mail do convite neste contato. Sem marcar,
                      nada do convite é gravado.
                    </span>
                  </label>
                )}

                <button
                  onClick={gerarComVinculo}
                  disabled={clientIds.length === 0 || gerando}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
                >
                  {gerando ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Sparkles size={13} />
                  )}
                  Gerar pre-meeting
                </button>
                {erro && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                  </p>
                )}
              </div>
            ) : erro ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </p>
            ) : !briefing || gerando ? (
              <div className="flex flex-col items-center gap-3 py-10 text-sm text-gray-500">
                <Loader2 size={20} className="animate-spin" />
                Analisando o histórico das reuniões anteriores...
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {prompts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
                      IA do briefing
                    </span>
                    <select
                      value={promptId}
                      onChange={(e) => trocarIA(e.target.value)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 outline-none transition focus:border-gray-900"
                    >
                      <option value={PADRAO}>Padrão</option>
                      {prompts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
              {briefing
                ? "Gerado do histórico real — confira antes de usar."
                : "O briefing usa só o que já foi gravado com o contato."}
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
          className={cn("rounded-xl px-3 py-2 text-xs leading-relaxed", tom)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
