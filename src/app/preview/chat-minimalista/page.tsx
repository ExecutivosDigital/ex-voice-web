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
import { MinimalistaShell } from "../_components/minimalista/chrome";
import { mockChatMessages, mockChatSuggestions, mockRecording } from "../_mocks/data";

const suggestionIcons = {
  sparkles: Sparkles,
  list: List,
  heart: Heart,
  "trending-up": TrendingUp,
};

export default function ChatMinimalista() {
  return (
    <MinimalistaShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
    >
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
                Assistente Executivo
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Analisando: {mockRecording.title}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
              <Plus className="h-4 w-4" />
              Nova Conversa
            </button>
          </div>
          <nav className="mt-8 flex items-center gap-8 border-b border-neutral-200 text-sm">
            <a href="/preview/recording-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Geral</a>
            <a href="/preview/transcription-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Transcrição</a>
            <a className="border-b border-neutral-900 pb-2 font-medium text-neutral-900">Chat</a>
            <a href="/preview/overview-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Insights</a>
          </nav>
        </div>

        {/* Chat container — active */}
        <section className="rounded-md border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-xs text-neutral-700" aria-label="Voltar">
                <ArrowLeft className="h-3 w-3" />
                Sugestões
              </button>
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Sparkles className="h-3 w-3" />
                Modo <span className="text-neutral-900">Resumir consulta</span> ativado
              </span>
            </div>
            <button aria-label="Expandir" className="text-neutral-400 hover:text-neutral-900">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-4 px-5 py-6">
            {mockChatMessages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[70%]`}>
                    <div
                      className={`rounded-md px-4 py-3 text-sm ${
                        isUser
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      {m.text.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                    {!isUser && (
                      <button
                        aria-label="Copiar mensagem"
                        className="absolute -right-8 top-1 text-neutral-300 hover:text-neutral-900"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <div
                      className={`mt-1 text-[10px] text-neutral-400 ${
                        isUser ? "text-right" : ""
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm">
                <span className="inline-flex gap-0.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          </div>

          {/* ChatInput */}
          <div className="border-t border-neutral-200 p-4">
            <div className="rounded-md border border-neutral-200 bg-white p-2 focus-within:border-neutral-900">
              <textarea
                rows={2}
                placeholder="Faça uma pergunta ou solicitação..."
                className="w-full resize-none bg-transparent px-2 py-1 text-sm placeholder:text-neutral-400 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Anexar arquivo"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Gravar áudio"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button
                  aria-label="Enviar"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Empty state (no messages yet) */}
        <section className="rounded-md border border-neutral-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
            <Sparkles className="h-6 w-6 text-neutral-700" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            Comece uma conversa
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Selecione uma das sugestões abaixo ou digite sua própria pergunta para
            começar.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mockChatSuggestions.map((s) => {
              const Icon = suggestionIcons[s.icon as keyof typeof suggestionIcons];
              return (
                <button
                  key={s.id}
                  className="group flex flex-col items-center gap-2 rounded-md border border-neutral-200 p-4 text-left hover:border-neutral-900"
                >
                  <Icon className="h-5 w-5 text-neutral-700 group-hover:text-neutral-900" />
                  <span className="text-xs font-medium text-neutral-900">{s.name}</span>
                </button>
              );
            })}
          </div>
          {/* Minimal chat input under suggestions */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="rounded-md border border-neutral-200 p-2 focus-within:border-neutral-900">
              <textarea
                rows={2}
                placeholder="Faça uma pergunta ou solicitação..."
                className="w-full resize-none bg-transparent px-2 py-1 text-sm placeholder:text-neutral-400 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button aria-label="Anexar" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button aria-label="Gravar" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button
                  aria-label="Enviar"
                  disabled
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-200 text-neutral-400"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ChatInput variants sample */}
        <section className="rounded-md border border-dashed border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-xs uppercase tracking-wider text-neutral-500">
            Estados do ChatInput
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Recording state */}
            <div className="rounded-md border border-red-200 bg-red-50/40 p-3">
              <p className="mb-2 text-xs text-neutral-500">Gravando</p>
              <div className="flex items-center gap-2">
                <input
                  disabled
                  value="Gravando áudio..."
                  className="flex-1 border-0 bg-transparent text-sm italic text-red-500 focus:outline-none"
                />
                <button
                  aria-label="Parar gravação"
                  className="flex h-8 w-8 animate-pulse items-center justify-center rounded-md bg-red-500 text-white"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <rect width="12" height="12" rx="2" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>

            {/* File attached */}
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="mb-2 text-xs text-neutral-500">Arquivo anexado</p>
              <div className="flex items-center gap-2 rounded-md bg-neutral-100 px-2.5 py-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-neutral-500" />
                <span className="flex-1 truncate">relatorio-sessao.pdf</span>
                <span className="text-neutral-400">2.1 MB</span>
              </div>
            </div>

            {/* Audio pending */}
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="mb-2 text-xs text-neutral-500">Áudio pendente</p>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 80 16" className="h-4 flex-1">
                  {[4, 8, 14, 6, 10, 4, 12, 8, 14, 6, 10, 16, 8, 4].map((h, i) => (
                    <rect key={i} x={i * 6} y={(16 - h) / 2} width="3" height={h} rx="1" fill="#171717" />
                  ))}
                </svg>
                <span className="text-xs text-neutral-500">0:14</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MinimalistaShell>
  );
}
