"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { useChatEngine } from "@/hooks/useChatEngine";
import { cn } from "@/utils/cn";
import { generalPrompt } from "@/utils/prompts";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Loader2,
  MessageSquare,
  Sparkles,
  StopCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Placeholder } from "./placeholder";

const QUICK_PROMPTS = [
  "Quais foram os pontos principais dessa conversa?",
  "Resuma as próximas ações em tópicos.",
  "Extraia decisões tomadas e prazos.",
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
      className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm"
    >
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-5 py-6 md:px-7"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
      >
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Converse sobre esta gravação
              </h3>
              <p className="mt-1.5 max-w-md text-sm text-gray-500">
                A IA já tem o contexto da transcrição. Faça perguntas, peça
                resumos ou extraia ações.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    if (!engine.loading) engine.sendMessage(q);
                  }}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-left text-xs text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white"
                >
                  <span className="truncate">{q}</span>
                  <ArrowUp
                    size={13}
                    className="shrink-0 rotate-90 text-gray-400 transition group-hover:text-gray-900"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
            {engine.loading && !engine.streamingContent && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 size={13} className="animate-spin" />
                Pensando…
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
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
              className="max-h-32 min-h-[42px] w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:shadow-sm"
            />
          </div>
          {engine.loading ? (
            <button
              onClick={engine.stopGeneration}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 transition hover:bg-gray-200"
              aria-label="Parar"
            >
              <StopCircle size={16} />
            </button>
          ) : (
            <button
              onClick={send}
              disabled={!input.trim()}
              className={cn(
                "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)] transition",
                !input.trim()
                  ? "cursor-not-allowed opacity-40"
                  : "hover:scale-[1.03]",
              )}
              aria-label="Enviar"
            >
              <ArrowUp size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.section>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex w-full gap-2.5", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <Sparkles size={13} />
        </div>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.35)]"
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
    </motion.div>
  );
}
