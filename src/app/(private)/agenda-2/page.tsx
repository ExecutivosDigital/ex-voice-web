"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarPlus,
  Clock,
  MapPin,
  Monitor,
  Pencil,
  Trash2,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { MeetingFormModal } from "../agenda/components/meeting-form-modal";
import {
  Meeting,
  MeetingType,
  meetingTypeLabel,
  sortMeetings,
  useAgendaStore,
} from "../agenda/use-agenda-store";
import { GoogleConnectCard } from "./components/google-connect-card";

type Filter = "upcoming" | "today" | "week" | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "upcoming", label: "Próximas" },
  { value: "today", label: "Hoje" },
  { value: "week", label: "Esta semana" },
  { value: "all", label: "Todas" },
];

const typeAccent: Record<
  MeetingType,
  { cls: string; icon: typeof Video; dot: string }
> = {
  meet: {
    cls: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    icon: Video,
    dot: "bg-emerald-500",
  },
  zoom: {
    cls: "text-sky-700 bg-sky-50 ring-sky-100",
    icon: Video,
    dot: "bg-sky-500",
  },
  teams: {
    cls: "text-indigo-700 bg-indigo-50 ring-indigo-100",
    icon: Monitor,
    dot: "bg-indigo-500",
  },
  presencial: {
    cls: "text-gray-700 bg-gray-100 ring-gray-200",
    icon: MapPin,
    dot: "bg-gray-500",
  },
};

function formatDayHeader(date: string) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const d = new Date(date + "T00:00");
  const long = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  if (date === today) return { primary: "Hoje", secondary: long };
  if (date === tomorrowStr) return { primary: "Amanhã", secondary: long };
  const parts = long.split(",");
  return { primary: parts[0] ?? long, secondary: parts[1]?.trim() ?? "" };
}

function isSameWeek(date: string) {
  const target = new Date(date + "T00:00");
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const diff = (target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff < 7;
}

export default function AgendaPage() {
  const meetings = useAgendaStore((s) => s.meetings);
  const removeMeeting = useAgendaStore((s) => s.removeMeeting);

  const [filter, setFilter] = useState<Filter>("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const sorted = sortMeetings(meetings);
    switch (filter) {
      case "today":
        return sorted.filter((m) => m.date === today);
      case "week":
        return sorted.filter((m) => isSameWeek(m.date));
      case "upcoming":
        return sorted.filter((m) => m.date >= today);
      case "all":
        return sorted;
    }
  }, [meetings, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const m of filtered) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const totalCount = meetings.length;
  const todayCount = meetings.filter(
    (m) => m.date === new Date().toISOString().slice(0, 10),
  ).length;

  const handleDelete = (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      setTimeout(() => {
        setConfirmingId((current) => (current === id ? null : current));
      }, 2500);
      return;
    }
    setConfirmingId(null);
    removeMeeting(id);
  };

  const handleEdit = (meeting: Meeting) => {
    setEditing(meeting);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Agenda
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold text-gray-900 md:text-5xl">
              Sua{" "}
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                agenda
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
              Organize suas reuniões num só lugar: veja o que tem hoje, crie
              compromissos e grave com um toque quando for a hora.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Stat label="Hoje" value={todayCount} />
            <Stat label="Total" value={totalCount} />
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_-12px_rgba(17,24,39,0.55)] transition hover:bg-gray-700"
            >
              <CalendarPlus size={14} />
              Nova reunião
            </button>
          </div>
        </div>
      </section>

      <GoogleConnectCard />

      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
              Compromissos
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900 md:text-2xl">
              {filter === "today"
                ? "Reuniões de hoje"
                : filter === "week"
                  ? "Esta semana"
                  : filter === "all"
                    ? "Todas as reuniões"
                    : "Próximas reuniões"}
            </h2>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-200/70 bg-white/70 p-1 backdrop-blur-md">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                    active
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]" />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {grouped.length === 0 ? (
          <EmptyState onCreate={handleNew} />
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map(([date, items], groupIdx) => {
              const header = formatDayHeader(date);
              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: groupIdx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-end gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 capitalize">
                      {header.primary}
                    </h3>
                    {header.secondary ? (
                      <span className="text-xs text-gray-400 capitalize">
                        · {header.secondary}
                      </span>
                    ) : null}
                    <span className="ml-auto text-[11px] font-medium text-gray-400">
                      {items.length}{" "}
                      {items.length === 1 ? "reunião" : "reuniões"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <AnimatePresence initial={false}>
                      {items.map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          confirming={confirmingId === meeting.id}
                          onEdit={() => handleEdit(meeting)}
                          onDelete={() => handleDelete(meeting.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <MeetingFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-start rounded-2xl border border-gray-200/70 bg-white/70 px-3.5 py-2 backdrop-blur-sm">
      <span className="text-[9px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function MeetingCard({
  meeting,
  confirming,
  onEdit,
  onDelete,
}: {
  meeting: Meeting;
  confirming: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const accent = typeAccent[meeting.type];
  const Icon = accent.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="group relative flex items-stretch gap-4 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 pr-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-gray-300 hover:shadow-[0_8px_24px_-14px_rgba(15,23,42,0.2)]"
    >
      <div className={cn("w-1 rounded-full", accent.dot)} />

      <div className="flex shrink-0 flex-col items-start gap-0.5 pr-2 md:min-w-[72px]">
        <span className="text-sm font-semibold text-gray-900 tabular-nums">
          {meeting.startTime}
        </span>
        <span className="text-[11px] text-gray-400 tabular-nums">
          até {meeting.endTime}
        </span>
      </div>

      <div className="min-w-0 flex-1 border-l border-gray-100 pl-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {meeting.title}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ring-1",
              accent.cls,
            )}
          >
            <Icon size={10} />
            {meetingTypeLabel(meeting.type)}
          </span>
          {meeting.source === "google" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-700 uppercase ring-1 ring-emerald-100">
              Google
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate text-xs text-gray-500">
          Com{" "}
          <span className="font-medium text-gray-700">{meeting.client}</span>
          {meeting.location ? (
            <>
              {" "}
              · <span>{meeting.location}</span>
            </>
          ) : null}
        </p>
        {meeting.notes ? (
          <p className="mt-1 line-clamp-1 text-[11px] text-gray-400">
            {meeting.notes}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="hidden items-center gap-1 text-[11px] text-gray-400 md:flex">
          <Clock size={11} />
          {durationLabel(meeting.startTime, meeting.endTime)}
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar reunião"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-900 group-hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={confirming ? "Confirmar exclusão" : "Excluir reunião"}
          className={cn(
            "inline-flex h-8 items-center justify-center gap-1 rounded-full px-2 text-[10px] font-semibold tracking-wider uppercase transition",
            confirming
              ? "bg-red-50 text-red-600 ring-1 ring-red-200"
              : "w-8 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100",
          )}
        >
          <Trash2 size={13} />
          {confirming ? "Confirmar" : null}
        </button>
      </div>
    </motion.div>
  );
}

function durationLabel(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "--";
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h${m}`;
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        <CalendarPlus size={22} className="text-gray-500" />
      </div>
      <p className="mt-4 text-base font-semibold text-gray-900">
        Nenhuma reunião por aqui
      </p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-500">
        Adicione seu primeiro compromisso e a gente te avisa na hora certa. Ou
        conecte o Google Agenda acima e traga tudo de uma vez.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
      >
        <CalendarPlus size={13} />
        Criar reunião
      </button>
    </div>
  );
}
