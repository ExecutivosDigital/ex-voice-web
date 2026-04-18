import {
  ArrowLeft,
  ArrowUp,
  Copy,
  FileText,
  Heart,
  List,
  Maximize2,
  Mic,
  Paperclip,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import { mockChatMessages, mockChatSuggestions, mockRecording } from "../_mocks/data";

const suggestionIcons = {
  sparkles: Sparkles,
  list: List,
  heart: Heart,
  "trending-up": TrendingUp,
};

export default function ChatMonocromatico() {
  return (
    <MonocromaticoShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
    >
      <div className="flex flex-col gap-12">
        <div>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Conversa com a IA
              </span>
              <h1
                className="mt-3 text-5xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Assistente <em>Executivo</em>.
              </h1>
              <p
                className="mt-2 italic text-neutral-500"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Analisando: {mockRecording.title}
              </p>
            </div>
            <button className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
              <Plus className="h-4 w-4" />
              Nova conversa
            </button>
          </div>
          <nav className="mt-10 flex items-center gap-10 border-b border-neutral-200 text-sm">
            <a href="/preview/recording-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Geral</a>
            <a href="/preview/transcription-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Transcrição</a>
            <a className="border-b border-neutral-900 pb-3 text-neutral-900">Chat</a>
            <a href="/preview/overview-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Insights</a>
          </nav>
        </div>

        {/* Active chat */}
        <section>
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900" aria-label="Voltar">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="italic" style={{ fontFamily: "var(--preview-font-instrument)" }}>
                  Voltar
                </span>
              </button>
              <span
                className="text-sm text-neutral-700"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Modo <em>Resumir consulta</em> ativado
              </span>
            </div>
            <button aria-label="Expandir" className="text-neutral-500 hover:text-neutral-900">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 space-y-8">
            {mockChatMessages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative max-w-[70%]">
                    {isUser ? (
                      <p
                        className="rounded-sm bg-neutral-900 px-5 py-3 text-base text-neutral-50"
                        style={{ fontFamily: "var(--preview-font-instrument)" }}
                      >
                        &ldquo;{m.text}&rdquo;
                      </p>
                    ) : (
                      <div className="space-y-2 text-base leading-relaxed text-neutral-900" style={{ fontFamily: "var(--preview-font-instrument)" }}>
                        {m.text.split("\n").map((line, i) =>
                          line.trim() ? (
                            line.startsWith("- ") || line.match(/^\d\./) ? (
                              <div key={i} className="pl-6 text-neutral-700">
                                {line.replace(/^- /, "· ")}
                              </div>
                            ) : (
                              <p key={i}>{line}</p>
                            )
                          ) : (
                            <div key={i} className="h-2" />
                          ),
                        )}
                        <button
                          aria-label="Copiar mensagem"
                          className="absolute -right-8 top-0 text-neutral-400 hover:text-neutral-900"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    <div
                      className={`mt-1 text-xs italic text-neutral-400 ${isUser ? "text-right" : ""}`}
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing */}
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:300ms]" />
            </div>
          </div>

          {/* ChatInput */}
          <div className="mt-10 border-t border-neutral-200 pt-6">
            <div className="border border-neutral-300 bg-white p-3 focus-within:border-neutral-900">
              <textarea
                rows={2}
                placeholder="Faça uma pergunta ou solicitação..."
                className="w-full resize-none bg-transparent px-2 py-1 text-base placeholder:italic placeholder:text-neutral-400 focus:outline-none"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button aria-label="Anexar" className="text-neutral-500 hover:text-neutral-900">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button aria-label="Gravar" className="text-neutral-500 hover:text-neutral-900">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button
                  aria-label="Enviar"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-50 hover:bg-neutral-800"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Empty + suggestions */}
        <section className="border-y border-neutral-200 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-300 bg-white">
            <Sparkles className="h-6 w-6 text-neutral-700" />
          </div>
          <h3
            className="mt-6 text-3xl text-neutral-900"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Comece uma conversa.
          </h3>
          <p
            className="mt-2 italic text-neutral-500"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Selecione uma sugestão ou digite sua própria pergunta.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockChatSuggestions.map((s) => {
              const Icon = suggestionIcons[s.icon as keyof typeof suggestionIcons];
              return (
                <button
                  key={s.id}
                  className="group flex flex-col items-center gap-3 border border-neutral-200 px-4 py-6 text-left transition hover:border-neutral-900 hover:bg-neutral-100"
                >
                  <Icon className="h-5 w-5 text-neutral-700" />
                  <span
                    className="text-base text-neutral-900 group-hover:italic"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Input states */}
        <section>
          <h3 className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Estados do ChatInput
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border border-neutral-300 p-4">
              <p
                className="mb-2 text-xs italic text-neutral-500"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Gravando
              </p>
              <div className="flex items-center justify-between">
                <span className="italic text-neutral-700" style={{ fontFamily: "var(--preview-font-instrument)" }}>
                  Gravando áudio...
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-50 animate-pulse">
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <rect width="12" height="12" rx="2" fill="currentColor" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="border border-neutral-300 p-4">
              <p
                className="mb-2 text-xs italic text-neutral-500"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Arquivo anexado
              </p>
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 text-sm">
                <FileText className="h-3.5 w-3.5 text-neutral-500" />
                <span className="flex-1 truncate">relatorio-sessao.pdf</span>
                <span className="text-xs text-neutral-500">2.1 MB</span>
              </div>
            </div>

            <div className="border border-neutral-300 p-4">
              <p
                className="mb-2 text-xs italic text-neutral-500"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Áudio pendente
              </p>
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 80 16" className="h-4 flex-1">
                  {[4, 8, 14, 6, 10, 4, 12, 8, 14, 6, 10, 16, 8, 4].map((h, i) => (
                    <rect key={i} x={i * 6} y={(16 - h) / 2} width="3" height={h} rx="1" fill="#171717" />
                  ))}
                </svg>
                <span className="text-xs italic text-neutral-500" style={{ fontFamily: "var(--preview-font-instrument)" }}>
                  0:14
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MonocromaticoShell>
  );
}
