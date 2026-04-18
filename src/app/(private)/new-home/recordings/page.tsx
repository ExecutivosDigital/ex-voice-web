"use client";

import { ClientProps, RecordingDetailsProps } from "@/@types/general-client";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderClosed,
  Loader2,
  Mic2,
  Search,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

moment.locale("pt-br");

function statusMeta(status: RecordingDetailsProps["transcriptionStatus"]) {
  switch (status) {
    case "DONE":
      return {
        label: "Concluída",
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        icon: CheckCircle2,
      };
    case "TRANSCRIBING":
      return {
        label: "Transcrevendo",
        dot: "bg-amber-500 animate-pulse",
        text: "text-amber-700",
        bg: "bg-amber-50",
        icon: Loader2,
      };
    default:
      return {
        label: "Pendente",
        dot: "bg-gray-400",
        text: "text-gray-600",
        bg: "bg-gray-50",
        icon: Clock,
      };
  }
}

export default function MinimalRecordingsPage() {
  const {
    recordings,
    isGettingRecordings,
    recordingsFilters,
    setRecordingsFilters,
    recordingsTotalPages,
    setSelectedRecording,
    setSelectedClient,
  } = useGeneralContext();
  const router = useRouter();

  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setRecordingsFilters((prev) => ({
          ...prev,
          query: value || undefined,
          page: 1,
        }));
      }, 500),
    [setRecordingsFilters],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    setRecordingsFilters((prev) => ({
      ...prev,
      clientId: undefined,
      type: undefined,
      page: 1,
    }));
    return () => debouncedSearch.cancel();
  }, [debouncedSearch, setRecordingsFilters]);

  const handleOpen = useCallback(
    (rec: RecordingDetailsProps) => {
      setSelectedRecording(rec);
      if (rec.client) {
        setSelectedClient(rec.client as ClientProps);
      }
      router.push(`/new-home/recordings/${rec.id}`);
    },
    [router, setSelectedClient, setSelectedRecording],
  );

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 capitalize">
          Biblioteca
        </p>
        <h1 className="text-balance text-2xl font-semibold text-gray-900 md:text-3xl">
          Últimas gravações.
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
          Tudo o que você gravou — buscável, organizado e pronto pra revisar
          com IA.
        </p>
      </section>

      <section>
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={handleQueryChange}
            placeholder="Buscar por título ou descrição..."
            className="h-12 w-full rounded-full border border-gray-200 bg-white/70 pr-4 pl-11 text-sm text-gray-800 shadow-sm backdrop-blur-sm outline-none transition focus:border-gray-400 focus:bg-white focus:shadow-md"
          />
        </div>
      </section>

      <section>
        {isGettingRecordings ? (
          <SkeletonGrid />
        ) : recordings.length === 0 ? (
          <EmptyState
            onCreate={() => router.push("/new-home")}
            hasFilters={!!query}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {recordings.map((rec, i) => (
                <RecordingCard
                  key={rec.id}
                  recording={rec}
                  onOpen={() => handleOpen(rec)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {!isGettingRecordings && recordingsTotalPages > 1 && (
        <div className="pt-2">
          <CustomPagination
            currentPage={recordingsFilters.page}
            setCurrentPage={(page) =>
              setRecordingsFilters((prev) => ({ ...prev, page }))
            }
            pages={recordingsTotalPages}
          />
        </div>
      )}
    </div>
  );
}

function RecordingCard({
  recording,
  onOpen,
  index,
}: {
  recording: RecordingDetailsProps;
  onOpen: () => void;
  index: number;
}) {
  const status = statusMeta(recording.transcriptionStatus);
  const StatusIcon = status.icon;

  return (
    <motion.button
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <Mic2 size={16} />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
            status.bg,
            status.text,
          )}
          title={status.label}
        >
          <StatusIcon
            size={9}
            className={cn(
              status.label === "Transcrevendo" && "animate-spin",
            )}
          />
          {status.label}
        </span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {recording.name || "Sem título"}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
          {recording.description || "Sem descrição"}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {recording.duration || "--"}
        </span>
        <span>
          {recording.createdAt ? moment(recording.createdAt).fromNow() : ""}
        </span>
      </div>
    </motion.button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[150px] animate-pulse flex-col justify-between rounded-2xl border border-gray-200/60 bg-white/60 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-gray-100" />
            <div className="h-5 w-16 rounded-full bg-gray-100" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-2/3 rounded-full bg-gray-100" />
            <div className="h-2.5 w-full rounded-full bg-gray-100" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-12 rounded-full bg-gray-100" />
            <div className="h-5 w-20 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  onCreate,
  hasFilters,
}: {
  onCreate: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        <FolderClosed size={26} />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        {hasFilters ? "Nada por aqui" : "Nenhuma gravação ainda"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {hasFilters
          ? "Tente remover filtros ou buscar por outro termo."
          : "Sua próxima conversa pode virar um insight. Comece uma gravação."}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          Começar gravação
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
