"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Loader2,
  Mic,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allClients, personalTypes, recentClients } from "../_mocks";

type Step = "idle" | "quick-start" | "recording" | "review" | "saving" | "done";
type Kind = "CLIENT" | "PERSONAL";
type ConsultationType = "IN_PERSON" | "ONLINE";

export default function RecorderPage() {
  const [step, setStep] = useState<Step>("quick-start");
  const [kind, setKind] = useState<Kind>("CLIENT");
  const [consultationType, setConsultationType] =
    useState<ConsultationType>("IN_PERSON");
  const [selectedClientId, setSelectedClientId] = useState<string>("c1");
  const [personalType, setPersonalType] = useState<string>("REMINDER");
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (step !== "recording" || paused) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [step, paused]);

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

  const start = () => {
    setElapsed(0);
    setPaused(false);
    setStep("recording");
  };

  const stop = () => setStep("review");
  const retake = () => {
    setElapsed(0);
    setStep("quick-start");
  };
  const save = () => {
    setStep("saving");
    setTimeout(() => setStep("done"), 1600);
  };
  const reset = () => {
    setStep("quick-start");
    setElapsed(0);
    setTitle("");
    setDescription("");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0E0D0B] text-[#ECE9E2]"
      style={{ fontFamily: "var(--silencio-sans)" }}
    >
      {/* Preview chrome — just so user sees context */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <PreviewChrome />
      </div>

      {/* Dark overlay with subtle grain */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" />

      {/* Ambient aura */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#C9A961]/10 to-transparent blur-3xl" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[480px]">
          {/* Close */}
          <button
            onClick={() => reset()}
            aria-label="Fechar"
            className="absolute -top-12 right-0 flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#6B6458] transition hover:text-[#ECE9E2]"
          >
            Fechar <X className="h-3 w-3" />
          </button>

          {/* ───── STEP: QUICK-START ───── */}
          {step === "quick-start" && (
            <div className="rounded-[28px] border border-[#2A2824] bg-[#151310] px-8 pb-10 pt-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              {/* Kind toggle */}
              <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-[#2A2824] bg-[#0E0D0B] p-1">
                {[
                  { id: "CLIENT" as const, label: "Consulta" },
                  { id: "PERSONAL" as const, label: "Pessoal" },
                ].map((k) => (
                  <button
                    key={k.id}
                    onClick={() => setKind(k.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      kind === k.id
                        ? "bg-[#ECE9E2] text-[#0E0D0B]"
                        : "text-[#8B857A] hover:text-[#ECE9E2]"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>

              {/* Big record button */}
              <div className="mb-8 flex flex-col items-center">
                <button
                  onClick={start}
                  className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-[#C9A961] to-[#A68846] text-[#0E0D0B] shadow-[0_20px_40px_-10px_rgba(201,169,97,0.5)] transition hover:scale-105 active:scale-95"
                  aria-label="Iniciar gravação"
                >
                  <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                  <span className="absolute -inset-3 rounded-full ring-1 ring-[#C9A961]/20 transition group-hover:ring-[#C9A961]/40" />
                  <Mic className="h-9 w-9" strokeWidth={2.2} />
                </button>
                <div
                  className="mt-6 text-2xl text-[#ECE9E2]"
                  style={{ fontFamily: "var(--silencio-serif)" }}
                >
                  Toque para gravar.
                </div>
                <div className="mt-1 text-xs text-[#6B6458]">
                  Começa em um clique. Detalhes depois.
                </div>
              </div>

              {/* Context selector */}
              {kind === "CLIENT" ? (
                <div className="space-y-4">
                  {/* Client picker */}
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#6B6458]">
                      Com quem é essa conversa?
                    </div>
                    {!clientPickerOpen ? (
                      <button
                        onClick={() => setClientPickerOpen(true)}
                        className="flex w-full items-center gap-3 rounded-xl border border-[#2A2824] bg-[#0E0D0B] px-4 py-3 text-left transition hover:border-[#4A4740]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2824] text-xs font-medium text-[#C9A961]">
                          {client.initials}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-[#ECE9E2]">{client.name}</div>
                          <div className="text-[11px] text-[#6B6458]">
                            Última sessão {client.lastSession}
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-[#6B6458]" />
                      </button>
                    ) : (
                      <div className="rounded-xl border border-[#C9A961]/30 bg-[#0E0D0B]">
                        <div className="flex items-center gap-2 border-b border-[#2A2824] px-4 py-2.5">
                          <Search className="h-3.5 w-3.5 text-[#6B6458]" />
                          <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar contato..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#4A4740]"
                          />
                          <button
                            onClick={() => {
                              setClientPickerOpen(false);
                              setSearch("");
                            }}
                            className="text-[#6B6458] hover:text-[#ECE9E2]"
                            aria-label="Fechar busca"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="max-h-[220px] overflow-y-auto p-1">
                          {!search && (
                            <div className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.2em] text-[#4A4740]">
                              Recentes
                            </div>
                          )}
                          {filteredClients.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => {
                                setSelectedClientId(c.id);
                                setClientPickerOpen(false);
                                setSearch("");
                              }}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-[#2A2824] ${
                                c.id === selectedClientId ? "bg-[#2A2824]" : ""
                              }`}
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2A2824] text-[10px] font-medium text-[#C9A961]">
                                {c.initials}
                              </span>
                              <div className="flex-1">
                                <div className="text-sm">{c.name}</div>
                                <div className="text-[11px] text-[#6B6458]">
                                  {c.lastSession}
                                </div>
                              </div>
                              {c.id === selectedClientId && (
                                <Check className="h-3.5 w-3.5 text-[#C9A961]" />
                              )}
                            </button>
                          ))}
                          <div className="border-t border-[#2A2824]">
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[#C9A961] transition hover:bg-[#2A2824]">
                              <Plus className="h-3.5 w-3.5" />
                              Cadastrar novo contato
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Consultation type — subtle */}
                  <div className="flex items-center justify-center gap-4 text-xs text-[#6B6458]">
                    <span>Tipo:</span>
                    <button
                      onClick={() => setConsultationType("IN_PERSON")}
                      className={`flex items-center gap-1.5 transition ${
                        consultationType === "IN_PERSON"
                          ? "text-[#ECE9E2]"
                          : "hover:text-[#ECE9E2]"
                      }`}
                    >
                      <Mic
                        className={`h-3 w-3 ${
                          consultationType === "IN_PERSON" ? "text-[#C9A961]" : ""
                        }`}
                      />
                      Presencial
                    </button>
                    <span className="text-[#2A2824]">·</span>
                    <button
                      onClick={() => setConsultationType("ONLINE")}
                      className={`flex items-center gap-1.5 transition ${
                        consultationType === "ONLINE"
                          ? "text-[#ECE9E2]"
                          : "hover:text-[#ECE9E2]"
                      }`}
                    >
                      <Video
                        className={`h-3 w-3 ${
                          consultationType === "ONLINE" ? "text-[#C9A961]" : ""
                        }`}
                      />
                      Online
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#6B6458]">
                    Que tipo de nota?
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {personalTypes.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPersonalType(p.id)}
                        className={`rounded-xl border px-3 py-3 text-left transition ${
                          personalType === p.id
                            ? "border-[#C9A961]/40 bg-[#C9A961]/5"
                            : "border-[#2A2824] bg-[#0E0D0B] hover:border-[#4A4740]"
                        }`}
                      >
                        <div
                          className={`text-sm ${
                            personalType === p.id ? "text-[#C9A961]" : "text-[#ECE9E2]"
                          }`}
                        >
                          {p.label}
                        </div>
                        <div className="mt-0.5 text-[10px] leading-tight text-[#6B6458]">
                          {p.hint}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional details — collapsed */}
              <div className="mt-8 border-t border-[#2A2824] pt-5">
                {!detailsOpen ? (
                  <button
                    onClick={() => setDetailsOpen(true)}
                    className="flex w-full items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#6B6458] transition hover:text-[#ECE9E2]"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar título e descrição agora
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#6B6458]">
                      <span>Detalhes (opcional)</span>
                      <button
                        onClick={() => setDetailsOpen(false)}
                        className="hover:text-[#ECE9E2]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={derivedTitle}
                      className="w-full border-b border-[#2A2824] bg-transparent pb-2 text-sm outline-none transition focus:border-[#C9A961] placeholder:text-[#4A4740]"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      placeholder="Uma observação rápida, se quiser..."
                      className="w-full resize-none border-b border-[#2A2824] bg-transparent pb-2 text-sm outline-none transition focus:border-[#C9A961] placeholder:text-[#4A4740]"
                    />
                  </div>
                )}
              </div>

              {/* Hint: keyboard */}
              <div className="mt-8 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[#4A4740]">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-[#2A2824] px-1.5 py-0.5 text-[#6B6458]">␣</kbd>
                  Gravar
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-[#2A2824] px-1.5 py-0.5 text-[#6B6458]">ESC</kbd>
                  Fechar
                </span>
              </div>
            </div>
          )}

          {/* ───── STEP: RECORDING ───── */}
          {step === "recording" && (
            <div className="rounded-[28px] border border-[#2A2824] bg-[#151310] px-8 py-14 text-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="mb-8 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#6B6458]">
                <span className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-[#6B6458]" : "animate-pulse bg-red-500"}`} />
                {paused ? "Pausada" : "Gravando"}
                {kind === "CLIENT" && ` · ${client.name}`}
              </div>

              <div
                className="font-mono text-7xl tracking-tight text-[#ECE9E2]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatTime(elapsed)}
              </div>

              <LiveWaveform paused={paused} />

              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2824] text-[#ECE9E2] transition hover:border-[#4A4740] hover:bg-[#0E0D0B]"
                  aria-label={paused ? "Retomar" : "Pausar"}
                >
                  {paused ? (
                    <Play className="h-4 w-4" strokeWidth={2.2} />
                  ) : (
                    <Pause className="h-4 w-4" strokeWidth={2.2} />
                  )}
                </button>
                <button
                  onClick={stop}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECE9E2] text-[#0E0D0B] shadow-lg transition hover:scale-105 active:scale-95"
                  aria-label="Parar"
                >
                  <Square className="h-5 w-5 fill-current" />
                </button>
                <button
                  onClick={retake}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2824] text-[#6B6458] transition hover:border-[#4A4740] hover:text-[#ECE9E2]"
                  aria-label="Cancelar"
                >
                  <X className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>

              <div
                className="mt-10 text-sm italic text-[#6B6458]"
                style={{ fontFamily: "var(--silencio-serif)" }}
              >
                Estamos aqui. Fale no seu tempo.
              </div>
            </div>
          )}

          {/* ───── STEP: REVIEW ───── */}
          {step === "review" && (
            <div className="rounded-[28px] border border-[#2A2824] bg-[#151310] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="px-8 pt-10">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#6B6458]">
                  <span className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-[#C9A961]" />
                    Gravado · {formatTime(elapsed)}
                  </span>
                  <button
                    onClick={retake}
                    className="flex items-center gap-1 hover:text-[#ECE9E2]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Regravar
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <button
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C9A961]/40 bg-[#C9A961]/10 text-[#C9A961] transition hover:bg-[#C9A961]/20"
                    aria-label="Reproduzir"
                  >
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  </button>
                  <div className="flex-1">
                    <StaticWaveform />
                    <div className="mt-1.5 flex justify-between text-[10px] font-mono text-[#6B6458]">
                      <span>00:00</span>
                      <span>{formatTime(elapsed)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#2A2824] pt-6">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6458]">
                    Título
                  </div>
                  <input
                    value={title || derivedTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full bg-transparent text-lg text-[#ECE9E2] outline-none"
                    style={{ fontFamily: "var(--silencio-serif)" }}
                  />
                  <div className="mt-1 text-xs text-[#6B6458]">
                    Sugerido automaticamente. Edite se quiser.
                  </div>
                </div>

                <div className="mt-6 border-t border-[#2A2824] pt-6">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6458]">
                    Observações
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Opcional. Deixa em branco que tá tudo bem."
                    className="mt-1 w-full resize-none bg-transparent text-sm text-[#ECE9E2] outline-none placeholder:text-[#4A4740]"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-b-[28px] border-t border-[#2A2824] bg-[#0E0D0B] px-8 py-4">
                <button
                  onClick={() => setStep("quick-start")}
                  className="flex items-center gap-1.5 text-xs text-[#6B6458] transition hover:text-[#ECE9E2]"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Voltar
                </button>
                <button
                  onClick={save}
                  className="flex items-center gap-2 rounded-full bg-[#ECE9E2] px-5 py-2 text-sm font-medium text-[#0E0D0B] transition hover:bg-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Salvar e transcrever
                </button>
              </div>
            </div>
          )}

          {/* ───── STEP: SAVING ───── */}
          {step === "saving" && (
            <div className="rounded-[28px] border border-[#2A2824] bg-[#151310] px-8 py-16 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#C9A961]" />
              <div
                className="mt-5 text-xl text-[#ECE9E2]"
                style={{ fontFamily: "var(--silencio-serif)" }}
              >
                Guardando sua gravação...
              </div>
              <div className="mt-1 text-xs text-[#6B6458]">
                Em alguns segundos.
              </div>
            </div>
          )}

          {/* ───── STEP: DONE ───── */}
          {step === "done" && (
            <div className="rounded-[28px] border border-[#C9A961]/30 bg-[#151310] px-8 py-14 text-center shadow-[0_40px_80px_-20px_rgba(201,169,97,0.15)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A961]/40 bg-[#C9A961]/10">
                <Check className="h-5 w-5 text-[#C9A961]" />
              </div>
              <div
                className="mt-5 text-2xl text-[#ECE9E2]"
                style={{ fontFamily: "var(--silencio-serif)" }}
              >
                Pronto.
              </div>
              <div className="mt-2 text-sm text-[#8B857A]">
                Estamos transcrevendo em segundo plano.<br />
                Te aviso quando estiver pronta.
              </div>

              <div className="mt-8 rounded-xl border border-[#2A2824] bg-[#0E0D0B] p-4 text-left">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#6B6458]">
                  Salvo
                </div>
                <div
                  className="mt-1 text-sm text-[#ECE9E2]"
                  style={{ fontFamily: "var(--silencio-serif)" }}
                >
                  {title || derivedTitle}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#6B6458]">
                  <span>{formatTime(elapsed)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    Transcrevendo
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={reset}
                  className="text-xs text-[#6B6458] transition hover:text-[#ECE9E2]"
                >
                  Gravar outra
                </button>
                <button className="flex items-center gap-1.5 text-xs text-[#C9A961] transition hover:text-[#ECE9E2]">
                  Ver gravação
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Step indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {(["quick-start", "recording", "review", "done"] as const).map((s) => {
              const order = ["quick-start", "recording", "review", "done"];
              const active = order.indexOf(step as string) >= order.indexOf(s);
              return (
                <span
                  key={s}
                  className={`h-0.5 transition-all duration-500 ${
                    active ? "w-8 bg-[#C9A961]" : "w-4 bg-[#2A2824]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Explainer panel — bottom */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-[#2A2824] bg-[#151310]/80 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#6B6458] backdrop-blur">
        Protótipo interativo · clica no mic pra gravar · tudo em mock
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */

function LiveWaveform({ paused }: { paused: boolean }) {
  const bars = Array.from({ length: 40 });
  return (
    <div className="mt-10 flex h-16 items-center justify-center gap-1">
      {bars.map((_, i) => {
        const baseHeights = [12, 24, 36, 48, 56, 48, 40, 28, 36, 52, 60, 44, 30, 20, 32, 48, 56, 60, 48, 28, 16, 24, 40, 52, 56, 40, 28, 44, 60, 52, 36, 20, 12, 24, 36, 44, 32, 20, 12, 8];
        const h = baseHeights[i % baseHeights.length];
        return (
          <span
            key={i}
            className="w-1 rounded-full bg-[#C9A961]"
            style={{
              height: `${h}%`,
              opacity: paused ? 0.3 : 0.5 + Math.random() * 0.5,
              animation: paused
                ? "none"
                : `waveform-pulse ${0.4 + Math.random() * 0.6}s ease-in-out ${i * 0.02}s infinite alternate`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes waveform-pulse {
          from { transform: scaleY(0.6); opacity: 0.4; }
          to   { transform: scaleY(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function StaticWaveform() {
  const bars = [8, 14, 20, 28, 34, 28, 22, 16, 20, 32, 40, 36, 22, 14, 20, 32, 38, 40, 32, 20, 10, 16, 24, 34, 38, 28, 18, 26, 40, 34, 24, 14, 8, 16, 24, 30, 22, 14, 8, 6];
  return (
    <div className="flex h-10 items-center gap-[2px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${i < 10 ? "bg-[#C9A961]" : "bg-[#2A2824]"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function PreviewChrome() {
  return (
    <div className="absolute inset-0 flex items-start justify-center p-8">
      <div className="text-center text-xs uppercase tracking-[0.3em] text-[#4A4740]">
        EX Voice · recorder preview
      </div>
    </div>
  );
}
