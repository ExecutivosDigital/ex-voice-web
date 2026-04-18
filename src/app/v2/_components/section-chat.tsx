"use client";

import {
  ArrowUp,
  Copy,
  Heart,
  List,
  Maximize2,
  Mic,
  Paperclip,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { mockChatMessages, mockChatSuggestions } from "../_mocks";

const iconMap = {
  Sparkles,
  List,
  Heart,
  TrendingUp,
};

export function SectionChat({ recordingName }: { recordingName: string }) {
  const [messages, setMessages] = useState(mockChatMessages);
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const hasMessages = messages.length > 0;

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Assistente Executivo
          </h2>
          <p className="text-xs text-neutral-500">Analisando: {recordingName}</p>
        </div>
        <div className="flex items-center gap-1">
          {hasMessages && (
            <button
              onClick={() => {
                setMessages([]);
                setSuggestion(null);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <Plus className="h-3 w-3" />
              Nova conversa
            </button>
          )}
          <button
            aria-label="Expandir"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[420px] flex-col">
        {!hasMessages ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-900 text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900">
              Comece uma conversa
            </h3>
            <p className="mt-1 max-w-sm text-xs text-neutral-500">
              Selecione uma sugestão ou digite sua própria pergunta.
            </p>
            <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
              {mockChatSuggestions.map((s) => {
                const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Sparkles;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSuggestion(s.name);
                      setMessages([
                        { id: `user-${s.id}`, role: "user", text: s.name, time: "agora" },
                        {
                          id: `ai-${s.id}`,
                          role: "assistant",
                          text: `Claro, vou ${s.name.toLowerCase()}. Deixa eu processar o conteúdo da gravação...`,
                          time: "agora",
                        },
                      ]);
                    }}
                    className="flex flex-col items-start gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-left transition hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100">
                      <Icon className="h-3.5 w-3.5 text-neutral-700" />
                    </div>
                    <span className="text-xs font-medium text-neutral-900">
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 p-5">
            {suggestion && (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                  <Sparkles className="h-3 w-3" />
                  Modo: {suggestion}
                </span>
              </div>
            )}
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`relative max-w-[80%]`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        isUser
                          ? "rounded-br-sm bg-gradient-to-br from-neutral-500 to-neutral-900 text-white"
                          : "rounded-bl-sm border border-neutral-100 bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      {m.text.split("\n").map((line, i) => {
                        if (line.startsWith("- ")) {
                          return (
                            <div key={i} className="pl-2">
                              • {line.replace(/^- /, "")}
                            </div>
                          );
                        }
                        if (/^\d+\. /.test(line)) {
                          return <div key={i}>{line}</div>;
                        }
                        return (
                          <p
                            key={i}
                            className={i > 0 ? "mt-1.5" : ""}
                            dangerouslySetInnerHTML={{
                              __html: line.replace(
                                /\*\*(.+?)\*\*/g,
                                `<strong class="font-semibold ${isUser ? "text-white" : "text-neutral-900"}">$1</strong>`,
                              ),
                            }}
                          />
                        );
                      })}
                    </div>
                    {!isUser && (
                      <button
                        aria-label="Copiar mensagem"
                        className="absolute -right-8 top-1 text-neutral-300 transition hover:text-neutral-700"
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
          </div>
        )}

        {/* Input */}
        <div className="border-t border-neutral-100 p-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Faça uma pergunta ou solicitação..."
              className="w-full resize-none bg-transparent px-2 py-1 text-sm placeholder:text-neutral-400 focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  aria-label="Anexar arquivo"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  aria-label="Gravar áudio"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  if (!input.trim()) return;
                  setMessages([
                    ...messages,
                    { id: `u-${Date.now()}`, role: "user", text: input, time: "agora" },
                  ]);
                  setInput("");
                  setTimeout(() => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `a-${Date.now()}`,
                        role: "assistant",
                        text: "Obrigado pela pergunta. Vou processar o contexto e te responder em instantes...",
                        time: "agora",
                      },
                    ]);
                  }, 400);
                }}
                aria-label="Enviar"
                disabled={!input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-neutral-500 to-neutral-900 text-white transition disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
