"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Headphones,
  Loader2,
  Mic,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  UserPlus,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { allClients, personalTypes, recentClients } from "../_mocks";

type Step = "setup" | "recording" | "review" | "saving" | "done";
type Kind = "CLIENT" | "PERSONAL";
type ConsultationType = "IN_PERSON" | "ONLINE";

export function RecorderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("setup");
  const [kind, setKind] = useState<Kind>("CLIENT");
  const [consultationType, setConsultationType] =
    useState<ConsultationType>("IN_PERSON");
  const [selectedClientId, setSelectedClientId] = useState<string>("c1");
  const [personalType, setPersonalType] = useState<string>("REMINDER");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (step !== "recording" || paused) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [step, paused]);

  useEffect(() => {
    const body = document.body;
    if (open) body.classList.add("overflow-hidden");
    else body.classList.remove("overflow-hidden");
    return () => body.classList.remove("overflow-hidden");
  }, [open]);

  const client = useMemo(
    () => allClients.find((c) => c.id === selectedClientId) ?? recentClients[0],
    [selectedClientId],
  );

  const filteredClients = useMemo(() => {
    if (!search.trim()) return allClients;
    return allClients.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const derivedTitle = useMemo(() => {
    if (title) return title;
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (kind === "CLIENT") return `${client.name} — ${dateStr}, ${timeStr}`;
    const type = personalTypes.find((p) => p.id === personalType)?.label ?? "Nota";
    return `${type} — ${dateStr}, ${timeStr}`;
  }, [title, kind, client, personalType]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const reset = () => {
    setStep("setup");
    setElapsed(0);
    setTitle("");
    setDescription("");
    setPickerOpen(false);
    setSearch("");
    setPaused(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const start = () => {
    setElapsed(0);
    setPaused(false);
    setStep("recording");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "recording") handleClose();
      }}
    >
      <div className="relative w-full max-w-[580px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-gradient-to-r from-neutral-500 to-neutral-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
              <Mic className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {step === "setup" && "Nova Gravação"}
                {step === "recording" && "Gravando..."}
                {step === "review" && "Revisar gravação"}
                {step === "saving" && "Salvando..."}
                {step === "done" && "Pronto!"}
              </div>
              <div className="text-[11px] text-white/60">
                {step === "setup" && "Configure e comece em segundos"}
                {step === "recording" && "Clique em parar quando terminar"}
                {step === "review" && "Confira antes de salvar"}
                {step === "saving" && "Guardando sua gravação"}
                {step === "done" && "Transcrição em andamento"}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={step === "recording"}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 border-b border-neutral-100 bg-neutral-50 py-2.5">
          {(["setup", "recording", "review", "done"] as const).map((s) => {
            const order = ["setup", "recording", "review", "done"];
            const active = order.indexOf(step) >= order.indexOf(s);
            return (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  active ? "w-6 bg-neutral-700" : "w-1.5 bg-neutral-300"
                }`}
              />
            );
          })}
        </div>

        {/* ─── SETUP ─── */}
        {step === "setup" && (
          <div className="px-6 py-6">
            {/* Kind toggle */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-neutral-800">
                O que você quer gravar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setKind("CLIENT")}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${
                    kind === "CLIENT"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      kind === "CLIENT"
                        ? "bg-gradient-to-br from-neutral-500 to-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Consulta</div>
                    <div className="text-xs text-neutral-500">Com um contato</div>
                  </div>
                </button>
                <button
                  onClick={() => setKind("PERSONAL")}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${
                    kind === "PERSONAL"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      kind === "PERSONAL"
                        ? "bg-gradient-to-br from-neutral-500 to-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Pessoal</div>
                    <div className="text-xs text-neutral-500">Só para você</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Client picker OR personal type */}
            {kind === "CLIENT" ? (
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Com quem é essa consulta?
                </label>
                {!pickerOpen ? (
                  <button
                    onClick={() => setPickerOpen(true)}
                    className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-left transition hover:border-neutral-400"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-semibold text-neutral-700">
                      {client.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-neutral-900">
                        {client.name}
                      </div>
                      <div className="truncate text-xs text-neutral-500">
                        Última sessão {client.lastSession}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
                  </button>
                ) : (
                  <div className="overflow-hidden rounded-xl border-2 border-neutral-400 bg-white">
                    <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2.5">
                      <Search className="h-4 w-4 text-neutral-400" />
                      <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar contato pelo nome..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                      />
                      <button
                        onClick={() => {
                          setPickerOpen(false);
                          setSearch("");
                        }}
                        aria-label="Fechar busca"
                        className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="max-h-[240px] overflow-y-auto p-1.5">
                      {!search && (
                        <div className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                          Recentes
                        </div>
                      )}
                      {filteredClients.length === 0 ? (
                        <div className="p-4 text-center text-xs text-neutral-500">
                          Nenhum contato encontrado
                        </div>
                      ) : (
                        filteredClients.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedClientId(c.id);
                              setPickerOpen(false);
                              setSearch("");
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-neutral-50 ${
                              c.id === selectedClientId ? "bg-neutral-50" : ""
                            }`}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-xs font-semibold text-neutral-700">
                              {c.initials}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-neutral-900">
                                {c.name}
                              </div>
                              <div className="truncate text-xs text-neutral-500">
                                {c.sessions} gravações · {c.lastSession}
                              </div>
                            </div>
                            {c.id === selectedClientId && (
                              <Check className="h-4 w-4 shrink-0 text-neutral-900" />
                            )}
                          </button>
                        ))
                      )}
                      <div className="mt-1 border-t border-neutral-100 pt-1">
                        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium text-neutral-900 transition hover:bg-neutral-50">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neutral-500 to-neutral-900 text-white">
                            <UserPlus className="h-3.5 w-3.5" />
                          </span>
                          Cadastrar novo contato
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Consultation type */}
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-100 p-1">
                  <button
                    onClick={() => setConsultationType("IN_PERSON")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
                      consultationType === "IN_PERSON"
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Mic className="h-3.5 w-3.5" />
                    Presencial
                  </button>
                  <button
                    onClick={() => setConsultationType("ONLINE")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${
                      consultationType === "ONLINE"
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    Online (Google Meet)
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Que tipo de gravação pessoal?
                </label>
                <div className="space-y-2">
                  {personalTypes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersonalType(p.id)}
                      className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition ${
                        personalType === p.id
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">
                          {p.label}
                        </div>
                        <div className="text-xs text-neutral-500">{p.hint}</div>
                      </div>
                      {personalType === p.id && (
                        <Check className="h-4 w-4 text-neutral-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible details */}
            <details className="mb-5 rounded-xl border border-neutral-200 bg-neutral-50 [&[open]>summary>svg]:rotate-90">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700">
                <ArrowRight className="h-3.5 w-3.5 transition" />
                Adicionar título e observações
                <span className="ml-auto text-xs font-normal text-neutral-400">
                  Opcional
                </span>
              </summary>
              <div className="space-y-3 border-t border-neutral-200 px-4 py-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">
                    Título
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={derivedTitle}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">
                    Observações
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Alguma observação sobre essa gravação?"
                    className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
              </div>
            </details>

            {/* Primary CTA */}
            <button
              onClick={start}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-neutral-900/20 transition hover:shadow-xl hover:shadow-neutral-900/30 active:scale-[0.98]"
            >
              <Mic className="h-5 w-5" />
              Iniciar Gravação
            </button>
            <p className="mt-2.5 text-center text-xs text-neutral-500">
              Você pode pausar, cancelar ou editar detalhes depois.
            </p>
          </div>
        )}

        {/* ─── RECORDING ─── */}
        {step === "recording" && (
          <div className="px-6 py-10 text-center">
            {/* Status chip */}
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              <span
                className={`h-2 w-2 rounded-full ${paused ? "bg-neutral-400" : "animate-pulse bg-rose-500"}`}
              />
              {paused ? "Gravação pausada" : "Gravando"}
              {kind === "CLIENT" && ` · ${client.name}`}
            </div>

            {/* Timer */}
            <div
              className="mt-8 font-mono text-7xl font-semibold text-neutral-900"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatTime(elapsed)}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Duração · clique em parar quando terminar
            </div>

            {/* Waveform */}
            <LiveWaveform paused={paused} />

            {/* Controls */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setPaused((p) => !p)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                aria-label={paused ? "Retomar gravação" : "Pausar gravação"}
              >
                {paused ? (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                ) : (
                  <Pause className="h-5 w-5 fill-current" />
                )}
              </button>
              <button
                onClick={() => setStep("review")}
                className="flex h-16 items-center gap-2.5 rounded-full bg-gradient-to-r from-neutral-700 to-neutral-950 px-7 text-sm font-semibold text-white shadow-lg shadow-neutral-900/30 transition hover:shadow-xl active:scale-95"
                aria-label="Parar gravação"
              >
                <Square className="h-4 w-4 fill-current" />
                Parar gravação
              </button>
              <button
                onClick={handleClose}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:border-rose-300 hover:text-rose-600"
                aria-label="Cancelar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500" />
                Microfone ativo
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1.5">
                <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500" />
                Salvamento automático
              </span>
            </div>
          </div>
        )}

        {/* ─── REVIEW ─── */}
        {step === "review" && (
          <div className="px-6 py-6">
            {/* Success chip */}
            <div className="mb-5 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-emerald-900">
                    Gravação concluída
                  </div>
                  <div className="text-xs text-emerald-700">
                    Duração: {formatTime(elapsed)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setElapsed(0);
                  setStep("setup");
                }}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                <RotateCcw className="h-3 w-3" />
                Regravar
              </button>
            </div>

            {/* Audio player */}
            <div className="mb-5 flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4">
              <button
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-500 to-neutral-900 text-white transition hover:opacity-90"
                aria-label="Reproduzir gravação"
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </button>
              <div className="flex-1">
                <StaticWaveform />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-500">
                  <span>00:00</span>
                  <span>{formatTime(elapsed)}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-neutral-800">
                Título
              </label>
              <input
                value={title || derivedTitle}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Título sugerido automaticamente. Você pode editar se quiser.
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-semibold text-neutral-800">
                Observações <span className="font-normal text-neutral-400">(opcional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Ex: Paciente mencionou novo sintoma que vale investigar..."
                className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </div>

            {/* CTAs */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Descartar
              </button>
              <button
                onClick={() => {
                  setStep("saving");
                  setTimeout(() => setStep("done"), 1800);
                }}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-neutral-900/20 transition hover:shadow-lg active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Salvar e transcrever
              </button>
            </div>
          </div>
        )}

        {/* ─── SAVING ─── */}
        {step === "saving" && (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-900">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-neutral-900">
              Salvando sua gravação...
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Isso leva alguns segundos.
            </p>
          </div>
        )}

        {/* ─── DONE ─── */}
        {step === "done" && (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-neutral-900">
              Gravação salva!
            </h3>
            <p className="mt-2 max-w-sm mx-auto text-sm text-neutral-600">
              Estamos transcrevendo em segundo plano.
              <br />
              Você vai receber uma notificação quando estiver pronta.
            </p>

            {/* Mini status card */}
            <div className="mx-auto mt-6 max-w-sm rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-neutral-900">
                    {title || derivedTitle}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                    <span>{formatTime(elapsed)}</span>
                    <span className="text-neutral-300">·</span>
                    <span>Transcrevendo</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-200">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-neutral-500 to-neutral-900" />
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={handleClose}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  reset();
                }}
                className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" />
                Gravar outra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LiveWaveform({ paused }: { paused: boolean }) {
  const bars = Array.from({ length: 36 });
  return (
    <div className="mx-auto mt-8 flex h-14 max-w-sm items-center justify-center gap-[3px]">
      {bars.map((_, i) => {
        const baseHeights = [20, 30, 45, 60, 72, 60, 50, 36, 44, 64, 75, 54, 38, 28, 40, 58, 68, 75, 58, 36, 22, 32, 50, 64, 70, 50, 34, 54, 74, 62, 44, 28, 20, 30, 44, 52];
        const h = baseHeights[i % baseHeights.length];
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-neutral-400 to-neutral-800"
            style={{
              height: `${h}%`,
              opacity: paused ? 0.4 : 1,
              animation: paused
                ? "none"
                : `wave-pulse ${0.5 + Math.random() * 0.7}s ease-in-out ${i * 0.025}s infinite alternate`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes wave-pulse {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
}

function StaticWaveform() {
  const bars = [16, 26, 38, 52, 62, 52, 40, 28, 34, 50, 64, 44, 28, 20, 32, 48, 58, 64, 46, 26, 14, 22, 36, 52, 58, 40, 26, 40, 62, 50, 34, 20, 14, 22, 34, 42];
  return (
    <div className="flex h-8 items-center gap-[2px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${i < 12 ? "bg-neutral-700" : "bg-neutral-300"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}
