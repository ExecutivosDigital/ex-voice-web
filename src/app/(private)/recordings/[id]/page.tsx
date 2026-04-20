"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import { useRecordingData } from "@/hooks/useRecordingData";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  FileText,
  ListChecks,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ActionsTab } from "./components/actions-tab";
import { ChatTab } from "./components/chat-tab";
import { DetailHeader } from "./components/hero";
import { InsightsTab } from "./components/insights-tab";
import { SummaryTab } from "./components/summary-tab";
import { TranscriptionTab } from "./components/transcription-tab";

type Tab = "summary" | "actions" | "insights" | "chat" | "transcription";

const TABS: { key: Tab; label: string; icon: typeof Sparkles }[] = [
  { key: "summary", label: "Resumo", icon: Sparkles },
  { key: "actions", label: "Ações", icon: ListChecks },
  { key: "insights", label: "Análise", icon: Brain },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "transcription", label: "Transcrição", icon: FileText },
];

export default function RecordingDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const { loading, error } = useRecordingData(id);
  const { selectedRecording } = useGeneralContext();
  const [tab, setTab] = useState<Tab>("summary");

  if (loading && !selectedRecording) {
    return <LoadingState />;
  }

  if (error || !selectedRecording) {
    return <ErrorState message={error || "Gravação não encontrada."} />;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <DetailHeader recording={selectedRecording} />

      <section className="flex flex-col gap-5">
        <div className="flex w-full">
          <div className="inline-flex items-center gap-1 overflow-x-auto rounded-full border border-gray-200/80 bg-white/70 p-1 shadow-sm backdrop-blur-md">
            {TABS.map((t) => {
              const active = tab === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "text-white" : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="recording-tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    <Icon size={14} />
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <SummaryTab recording={selectedRecording} />
            </motion.div>
          )}
          {tab === "actions" && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <ActionsTab recording={selectedRecording} />
            </motion.div>
          )}
          {tab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <InsightsTab recording={selectedRecording} />
            </motion.div>
          )}
          {tab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <ChatTab recording={selectedRecording} />
            </motion.div>
          )}
          {tab === "transcription" && (
            <motion.div
              key="transcription"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <TranscriptionTab recording={selectedRecording} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="h-3 w-40 animate-pulse rounded-full bg-gray-100" />
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/2 animate-pulse rounded-full bg-gray-100" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <div className="flex items-center gap-2">
        <Loader2 size={14} className="animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Carregando gravação…</span>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
        <AlertCircle size={22} />
      </div>
      <h3 className="mt-5 text-base font-semibold text-gray-900">
        Não foi possível carregar
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-gray-500">{message}</p>
      <button
        onClick={() => router.push("/recordings")}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
      >
        Voltar para a lista
      </button>
    </div>
  );
}
