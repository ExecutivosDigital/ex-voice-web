"use client";

import {
  ArrowUp,
  BookOpen,
  Bot,
  Copy,
  Heart,
  Mic,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import {
  mockBusinessConversations,
  mockBusinessMessages,
  mockBusinessSuggestions,
} from "../_mocks";

const iconMap = { TrendingUp, Sparkles, Heart, BookOpen };

export default function ChatBusinessPage() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(mockBusinessMessages);
  const [input, setInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>("b1");

  const hasMessages = messages.length > 0;

  return (
    <>
      <Shell
        breadcrumbs={[{ label: "AI Executivos" }]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Conversations sidebar */}
          <aside className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Suas conversas
              </h2>
              <button
                onClick={() => {
                  setMessages([]);
                  setActiveConversationId(null);
                }}
                aria-label="Nova conversa"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                placeholder="Buscar..."
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <ul className="space-y-1">
              {mockBusinessConversations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setActiveConversationId(c.id);
                      setMessages(mockBusinessMessages);
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition ${
                      activeConversationId === c.id
                        ? "bg-neutral-100"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="truncate font-medium text-neutral-900">
                      {c.title}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-neutral-500">
                      {c.preview}
                    </div>
                    <div className="mt-1 text-[10px] text-neutral-400">{c.date}</div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat area */}
          <div className="flex flex-col">
            {/* Header */}
            <header className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-900 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                    AI Executivos
                  </h1>
                  <p className="text-sm text-neutral-500">
                    Converse com a IA sobre tudo do seu consultório
                  </p>
                </div>
              </div>
            </header>

            {/* Chat container */}
            <div className="flex min-h-[560px] flex-col rounded-2xl border border-neutral-100 bg-white">
              {!hasMessages ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-900 text-white shadow-md">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-neutral-900">
                    Como posso te ajudar hoje?
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-neutral-500">
                    Pergunte sobre seus pacientes, análises cruzadas, padrões, ou
                    peça sugestões de estudos.
                  </p>
                  <div className="mx-auto mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                    {mockBusinessSuggestions.map((s) => {
                      const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Sparkles;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setMessages([
                              { id: `u-${s.id}`, role: "user", text: s.name, time: "agora" },
                              {
                                id: `a-${s.id}`,
                                role: "assistant",
                                text: `Ótima pergunta. Analisando seus dados pra responder "${s.name.toLowerCase()}"...`,
                                time: "agora",
                              },
                            ]);
                            setActiveConversationId(null);
                          }}
                          className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:border-neutral-300 hover:bg-neutral-50"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                            <Icon className="h-4 w-4 text-neutral-700" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-neutral-900">
                              {s.name}
                            </div>
                            <div className="mt-0.5 text-xs text-neutral-500">
                              Sugestão popular
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-5 overflow-y-auto p-6">
                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            isUser
                              ? "bg-neutral-200 text-neutral-700"
                              : "bg-gradient-to-br from-neutral-500 to-neutral-900 text-white"
                          }`}
                        >
                          {isUser ? "RA" : <Bot className="h-4 w-4" />}
                        </div>
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
                              aria-label="Copiar"
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
                    placeholder="Pergunte sobre seus pacientes, padrões, estudos..."
                    className="w-full resize-none bg-transparent px-2 py-1 text-sm placeholder:text-neutral-400 focus:outline-none"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        aria-label="Anexar"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Gravar"
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
                              text: "Processando sua pergunta com base nos dados das suas gravações...",
                              time: "agora",
                            },
                          ]);
                        }, 400);
                      }}
                      disabled={!input.trim()}
                      aria-label="Enviar"
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-neutral-500 to-neutral-900 text-white transition disabled:opacity-40"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
