"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { useChatEngine } from "@/hooks/useChatEngine";
import { cn } from "@/utils/cn";
import { generalPrompt } from "@/utils/prompts";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Check,
  Copy,
  ListChecks,
  Loader2,
  MessageSquare,
  Sparkles,
  StopCircle,
  Target,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Placeholder } from "./placeholder";

const QUICK_PROMPTS = [
  {
    icon: ListChecks,
    label: "Pontos principais",
    prompt: "Quais foram os pontos principais dessa conversa?",
  },
  {
    icon: Target,
    label: "Próximas ações",
    prompt: "Resuma as próximas ações em tópicos.",
  },
  {
    icon: Sparkles,
    label: "Decisões e prazos",
    prompt: "Extraia decisões tomadas e prazos.",
  },
];

export function ChatTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  const canChat =
    recording.transcriptionStatus === "DONE" && !!recording.transcription;

  const engine = useChatEngine({
    promptContent: generalPrompt.prompt,
    skipPersistence: true,
  });

  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSentContext = useRef(false);

  useEffect(() => {
    if (hasSentContext.current) return;
    if (canChat && recording.transcription) {
      engine.setMessages([
        {
          role: "system",
          content: `Contexto da gravação "${recording.name || "Gravação"}":\n\n${recording.transcription}`,
        },
      ]);
      hasSentContext.current = true;
    }
  }, [canChat, recording.transcription, recording.name, engine]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [engine.messages, engine.streamingContent, engine.loading]);

  // auto-grow do textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  if (recording.transcriptionStatus === "NOT_REQUESTED") {
    return (
      <Placeholder
        icon={<MessageSquare size={22} />}
        title="Converse com a IA"
        description="Peça transcrição da gravação para desbloquear o chat com contexto completo."
        action={<RequestTranscription />}
      />
    );
  }

  if (
    recording.transcriptionStatus === "TRANSCRIBING" ||
    recording.transcriptionStatus === "PENDING"
  ) {
    return (
      <Placeholder
        icon={<Loader2 size={22} className="animate-spin" />}
        title="Preparando o contexto"
        description="Assim que a transcrição finalizar, você já pode conversar com a IA aqui."
      />
    );
  }

  const send = () => {
    if (!input.trim() || engine.loading) return;
    engine.sendMessage(input);
    setInput("");
  };

  const visibleMessages = engine.messages.filter((m) => m.role !== "system");
  const isEmpty = visibleMessages.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-[85vh] min-h-[520px] flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-5 md:px-4 md:py-6"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
      >
        {isEmpty ? (
          <EmptyState
            onPick={(q) => {
              if (!engine.loading) engine.sendMessage(q);
            }}
          />
        ) : (
          <div className="flex flex-col gap-8">
            <AnimatePresence initial={false}>
              {visibleMessages.map((m, i) => (
                <MessageBubble
                  key={`${m.role}-${i}`}
                  role={m.role}
                  content={m.content}
                />
              ))}
            </AnimatePresence>

            {engine.streamingContent && (
              <MessageBubble role="ai" content={engine.streamingContent} />
            )}
            {engine.loading && !engine.streamingContent && <ThinkingDots />}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3 md:px-4 md:py-3.5">
        <div>
          <div
            className={cn(
              "flex items-end gap-2 rounded-2xl border bg-white px-3.5 py-2.5 transition-all",
              "border-gray-200 focus-within:border-gray-400 focus-within:shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)]",
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Pergunte alguma coisa sobre esta gravação..."
              rows={1}
              className="max-h-[180px] min-h-[24px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-400"
            />
            {engine.loading ? (
              <button
                onClick={engine.stopGeneration}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200"
                aria-label="Parar"
              >
                <StopCircle size={16} />
              </button>
            ) : (
              <button
                onClick={send}
                disabled={!input.trim()}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.45)] transition",
                  !input.trim()
                    ? "cursor-not-allowed opacity-30"
                    : "hover:scale-[1.05]",
                )}
                aria-label="Enviar"
              >
                <ArrowUp size={15} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-gray-400">
            <span>
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-sans">
                Enter
              </kbd>{" "}
              enviar ·{" "}
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-sans">
                Shift
              </kbd>
              <span className="mx-0.5">+</span>
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-sans">
                Enter
              </kbd>{" "}
              nova linha
            </span>
            <span className="hidden md:inline">IA com contexto da transcrição</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-8 py-12 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-900/20">
        <span className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 opacity-40 blur-lg" />
        <Sparkles size={24} className="relative" />
      </div>

      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">
          Converse sobre esta gravação
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          A IA já tem o contexto completo da transcrição. Escolha uma sugestão
          abaixo ou escreva sua pergunta.
        </p>
      </div>

      <div className="grid w-full gap-2.5 sm:grid-cols-3">
        {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
          <button
            key={prompt}
            onClick={() => onPick(prompt)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-gray-200 bg-white p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-900 group-hover:text-white">
              <Icon size={15} strokeWidth={2.2} />
            </span>
            <span className="text-xs font-semibold text-gray-900">{label}</span>
            <span className="line-clamp-2 text-[11px] leading-snug text-gray-500">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <Sparkles size={13} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
        <span className="h-1.5 w-1.5 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "ai" | "system";
  content: string;
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group flex w-full gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
          isUser
            ? "bg-gradient-to-br from-gray-700 to-gray-900"
            : "bg-gradient-to-br from-gray-900 to-gray-700",
        )}
      >
        {isUser ? (
          <span className="text-[11px] font-semibold">Eu</span>
        ) : (
          <Sparkles size={13} />
        )}
      </div>

      <div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col gap-1.5",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "max-w-full rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
            isUser
              ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-[0_4px_14px_-6px_rgba(17,24,39,0.35)]"
              : "bg-gray-50 text-gray-800 ring-1 ring-gray-100",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm prose-p:my-1.5 prose-headings:my-2 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:my-0.5 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        <button
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100",
            copied && "text-emerald-600 opacity-100 hover:text-emerald-600",
          )}
          aria-label="Copiar"
        >
          {copied ? (
            <>
              <Check size={10} /> copiado
            </>
          ) : (
            <>
              <Copy size={10} /> copiar
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
