import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Check,
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
  X,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import { mockChatMessages, mockChatSuggestions, mockRecording } from "../_mocks/data";

const suggestionIcons = {
  sparkles: Sparkles,
  list: List,
  heart: Heart,
  "trending-up": TrendingUp,
};

export default function ChatCorporate() {
  return (
    <CorporateShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
      pageTitle="Chat"
      activeHref="/preview/recordings-corporate"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        {/* Header */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Assistente Executivo
                </h1>
                <p className="text-xs text-slate-500">
                  Analisando: <span className="font-medium text-slate-700">{mockRecording.title}</span>
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
              <Plus className="h-3.5 w-3.5" />
              Nova Conversa
            </button>
          </div>
          <nav className="mt-5 flex items-center gap-1 border-b border-slate-200 text-xs">
            <a href="/preview/recording-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Geral</a>
            <a href="/preview/transcription-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Transcrição</a>
            <a className="-mb-px border-b-2 border-blue-600 px-3 py-2 font-semibold text-blue-700">Chat</a>
            <a href="/preview/overview-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Insights</a>
          </nav>
        </div>

        {/* Active chat */}
        <section className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50" aria-label="Voltar">
                <ArrowLeft className="h-3 w-3" />
                Voltar
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                <Sparkles className="h-3 w-3" />
                Modo: Resumir consulta
              </span>
            </div>
            <button aria-label="Expandir" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-4 px-5 py-5">
            {mockChatMessages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                    }`}
                  >
                    {isUser ? "RA" : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`relative max-w-[70%]`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        isUser
                          ? "rounded-br-sm bg-blue-600 text-white"
                          : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
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
                        aria-label="Copiar"
                        className="absolute right-2 top-1.5 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                    <div
                      className={`mt-1 text-[10px] text-slate-400 ${
                        isUser ? "text-right" : ""
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>

          {/* ChatInput */}
          <div className="border-t border-slate-200 bg-slate-50 p-3">
            <div className="rounded-lg border border-slate-200 bg-white p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <textarea
                rows={2}
                placeholder="Faça uma pergunta ou solicitação..."
                className="w-full resize-none bg-transparent px-2 py-1 text-sm placeholder:text-slate-400 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Anexar arquivo"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Gravar áudio"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Imagens, PDF ou áudio · até 10MB
                  </span>
                </div>
                <button
                  aria-label="Enviar"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Empty + suggestions */}
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Comece uma conversa
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Selecione uma das sugestões abaixo ou digite sua própria pergunta para
            começar.
          </p>
          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mockChatSuggestions.map((s) => {
              const Icon = suggestionIcons[s.icon as keyof typeof suggestionIcons];
              return (
                <button
                  key={s.id}
                  className="group flex flex-col items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-blue-300 hover:bg-blue-50/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Input states */}
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Estados do ChatInput
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-red-200 bg-red-50/30 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase text-red-700">
                Gravando
              </p>
              <div className="flex items-center gap-2 rounded-md border border-red-300 bg-white px-2.5 py-1.5">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="flex-1 text-xs italic text-red-600">
                  Gravando áudio...
                </span>
                <button
                  aria-label="Parar"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <rect width="12" height="12" rx="2" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase text-slate-500">
                Arquivo anexado
              </p>
              <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200">
                  <FileText className="h-3.5 w-3.5 text-slate-600" />
                </div>
                <div className="flex-1 truncate">
                  <div className="font-medium">relatorio-sessao.pdf</div>
                  <div className="text-[10px] text-slate-500">2.1 MB</div>
                </div>
                <button className="text-slate-400 hover:text-red-500" aria-label="Remover">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase text-emerald-700">
                Áudio pendente
              </p>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-4 w-4" />
                </button>
                <svg viewBox="0 0 80 16" className="h-4 flex-1">
                  {[4, 8, 14, 6, 10, 4, 12, 8, 14, 6, 10, 16, 8, 4].map((h, i) => (
                    <rect key={i} x={i * 6} y={(16 - h) / 2} width="3" height={h} rx="1" fill="#059669" />
                  ))}
                </svg>
                <span className="text-xs font-medium text-emerald-700">0:14</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CorporateShell>
  );
}
