"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarPlus,
  Clock,
  MapPin,
  Monitor,
  Trash2,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  getUpcoming,
  Meeting,
  MeetingType,
  meetingTypeLabel,
  useAgendaStore,
} from "../agenda/use-agenda-store";

const typeAccent: Record<MeetingType, { cls: string; icon: typeof Video }> = {
  meet: { cls: "text-emerald-700 bg-emerald-50 ring-emerald-100", icon: Video },
  zoom: { cls: "text-sky-700 bg-sky-50 ring-sky-100", icon: Video },
  teams: { cls: "text-indigo-700 bg-indigo-50 ring-indigo-100", icon: Monitor },
  presencial: { cls: "text-gray-700 bg-gray-100 ring-gray-200", icon: MapPin },
};

function formatDayLabel(date: string) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  if (date === today) return "Hoje";
  if (date === tomorrowStr) return "Amanhã";
  const d = new Date(date + "T00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

export function UpcomingMeetings() {
  const router = useRouter();
  const meetings = useAgendaStore((s) => s.meetings);
  const removeMeeting = useAgendaStore((s) => s.removeMeeting);

  const upcoming = useMemo(() => getUpcoming(meetings).slice(0, 3), [meetings]);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
            Agenda
          </p>
          <h2 className="mt-1 text-xl font-semibold whitespace-nowrap text-gray-900 md:text-2xl">
            Próximas reuniões
          </h2>
        </div>
        <button
          onClick={() => router.push("/new-home/agenda")}
          className="group flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          Ver agenda
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {upcoming.length === 0 ? (
        <EmptyState onCreate={() => router.push("/new-home/agenda?new=1")} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {upcoming.map((meeting, i) => (
              <MeetingRow
                key={meeting.id}
                meeting={meeting}
                index={i}
                onOpen={() => router.push("/new-home/agenda")}
                onDelete={() => removeMeeting(meeting.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
        <CalendarPlus size={20} className="text-gray-500" />
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-800">
        Sem reuniões na agenda
      </p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">
        Adicione um compromisso e a gente te lembra quando for a hora.
      </p>
      <button
        onClick={onCreate}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
      >
        <CalendarPlus size={13} />
        Nova reunião
      </button>
    </div>
  );
}

function MeetingRow({
  meeting,
  index,
  onOpen,
  onDelete,
}: {
  meeting: Meeting;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accent = typeAccent[meeting.type];
  const Icon = accent.icon;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 2500);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    onDelete();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onOpen}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ring-1",
            accent.cls,
          )}
        >
          <Icon size={10} />
          {meetingTypeLabel(meeting.type)}
        </span>
        <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600">
          {formatDayLabel(meeting.date)}
        </span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {meeting.title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
          Com {meeting.client}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {meeting.startTime} – {meeting.endTime}
        </span>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={confirming ? "Confirmar exclusão" : "Excluir reunião"}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase transition",
            confirming
              ? "bg-red-50 text-red-600 ring-1 ring-red-200"
              : "text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100",
          )}
        >
          {confirming ? (
            <>
              <Trash2 size={11} />
              Confirmar
            </>
          ) : (
            <Trash2 size={12} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
