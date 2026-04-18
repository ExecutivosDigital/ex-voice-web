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
import { MeetingFormModal } from "./components/meeting-form-modal";
import { GoogleConnectChip } from "./components/google-connect-chip";
import { MonthCalendar } from "./components/month-calendar";
import {
  Meeting,
  MeetingType,
  meetingTypeLabel,
  sortMeetings,
  useAgendaStore,
} from "./use-agenda-store";

const typeAccent: Record<
  MeetingType,
  { cls: string; icon: typeof Video; bar: string }
> = {
  meet: {
    cls: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    icon: Video,
    bar: "bg-emerald-500",
  },
  zoom: {
    cls: "text-sky-700 bg-sky-50 ring-sky-100",
    icon: Video,
    bar: "bg-sky-500",
  },
  teams: {
    cls: "text-indigo-700 bg-indigo-50 ring-indigo-100",
    icon: Monitor,
    bar: "bg-indigo-500",
  },
  presencial: {
    cls: "text-gray-700 bg-gray-100 ring-gray-200",
    icon: MapPin,
    bar: "bg-gray-500",
  },
};

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function formatLongDate(iso: string) {
  const d = new Date(iso + "T00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function dayLabel(iso: string) {
  const today = toISO(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (iso === today) return "Hoje";
  if (iso === toISO(tomorrow)) return "Amanhã";
  const d = new Date(iso + "T00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function AgendaPage() {
  const meetings = useAgendaStore((s) => s.meetings);
  const removeMeeting = useAgendaStore((s) => s.removeMeeting);

  const todayISO = toISO(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const sortedMeetings = useMemo(() => sortMeetings(meetings), [meetings]);

  const selectedDayMeetings = useMemo(
    () => sortedMeetings.filter((m) => m.date === selectedDate),
    [sortedMeetings, selectedDate],
  );

  const upcomingDays = useMemo(() => {
    const future = sortedMeetings.filter((m) => m.date >= todayISO);
    const map = new Map<string, Meeting[]>();
    for (const m of future) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    return Array.from(map.entries()).slice(0, 8);
  }, [sortedMeetings, todayISO]);

  const totalCount = meetings.length;
  const todayCount = meetings.filter((m) => m.date === todayISO).length;

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
    setDefaultDate(undefined);
    setModalOpen(true);
  };

  const handleNew = (date?: string) => {
    setEditing(null);
    setDefaultDate(date);
    setModalOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 capitalize">
          Agenda
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-balance text-2xl font-semibold text-gray-900 md:text-3xl">
              Sua agenda.
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
              Veja tudo do mês num toque. Clique em um dia para abrir os
              compromissos ou confira a lista dos próximos dias.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <GoogleConnectChip />
            <Stat label="Hoje" value={todayCount} />
            <Stat label="Total" value={totalCount} />
            <button
              onClick={() => handleNew()}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-4 text-xs font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
            >
              <CalendarPlus size={13} />
              Nova reunião
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-6">
          <MonthCalendar
            meetings={meetings}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-gray-200/70 bg-white/80 p-5 backdrop-blur-sm md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
                Dia selecionado
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold text-gray-900 capitalize">
                {selectedDate === todayISO
                  ? "Hoje"
                  : formatLongDate(selectedDate)}
              </h3>
              {selectedDate !== todayISO ? (
                <p className="text-[11px] text-gray-400 capitalize">
                  {formatLongDate(selectedDate)}
                </p>
              ) : null}
            </div>
            <button
              onClick={() => handleNew(selectedDate)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <CalendarPlus size={12} />
              Adicionar
            </button>
          </div>

          {selectedDayMeetings.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                <CalendarPlus size={18} className="text-gray-500" />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-800">
                Dia livre
              </p>
              <p className="mt-0.5 max-w-xs text-xs text-gray-500">
                Nenhuma reunião marcada. Que tal agendar uma?
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {selectedDayMeetings.map((meeting) => (
                  <MeetingRow
                    key={meeting.id}
                    meeting={meeting}
                    confirming={confirmingId === meeting.id}
                    onEdit={() => handleEdit(meeting)}
                    onDelete={() => handleDelete(meeting.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
              Próximos dias
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900 md:text-2xl">
              Lista rápida
            </h2>
          </div>
          <span className="text-[11px] font-medium text-gray-400">
            {upcomingDays.reduce((acc, [, items]) => acc + items.length, 0)}{" "}
            reuniões a caminho
          </span>
        </div>

        {upcomingDays.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <CalendarPlus size={20} className="text-gray-500" />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-900">
              Agenda livre
            </p>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              Nenhum compromisso à vista. Crie um ou conecte o Google Agenda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {upcomingDays.map(([date, items]) => (
              <DayColumn
                key={date}
                date={date}
                items={items}
                isSelected={date === selectedDate}
                isToday={date === todayISO}
                onSelect={() => setSelectedDate(date)}
                onAdd={() => handleNew(date)}
              />
            ))}
          </div>
        )}
      </section>

      <MeetingFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        defaultDate={defaultDate}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex h-9 flex-col items-start justify-center rounded-full border border-gray-200 bg-white/80 px-3 backdrop-blur-sm">
      <span className="text-[8px] font-semibold tracking-[0.2em] text-gray-400 uppercase leading-none">
        {label}
      </span>
      <span className="text-xs font-semibold text-gray-900 leading-tight">
        {value}
      </span>
    </div>
  );
}

function DayColumn({
  date,
  items,
  isSelected,
  isToday,
  onSelect,
  onAdd,
}: {
  date: string;
  items: Meeting[];
  isSelected: boolean;
  isToday: boolean;
  onSelect: () => void;
  onAdd: () => void;
}) {
  const d = new Date(date + "T00:00");
  const dayNum = d.getDate();
  const weekday = d.toLocaleDateString("pt-BR", { weekday: "short" });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border bg-white p-4 transition",
        isSelected
          ? "border-gray-900/70 shadow-[0_10px_30px_-18px_rgba(17,24,39,0.45)]"
          : "border-gray-200/70 hover:border-gray-300 hover:shadow-[0_6px_18px_-12px_rgba(15,23,42,0.18)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onSelect}
          className="flex items-center gap-2.5 text-left"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl font-semibold transition",
              isSelected
                ? "bg-gray-900 text-white"
                : isToday
                  ? "bg-gray-100 text-gray-900"
                  : "bg-gray-50 text-gray-700",
            )}
          >
            <span className="text-[9px] font-semibold tracking-wider uppercase opacity-70">
              {weekday.slice(0, 3)}
            </span>
            <span className="text-sm tabular-nums">{dayNum}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {dayLabel(date)}
            </p>
            <p className="text-[11px] text-gray-400">
              {items.length} {items.length === 1 ? "reunião" : "reuniões"}
            </p>
          </div>
        </button>
        <button
          onClick={onAdd}
          aria-label="Adicionar neste dia"
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <CalendarPlus size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3">
        {items.slice(0, 4).map((meeting) => (
          <CompactRow
            key={meeting.id}
            meeting={meeting}
            onClick={onSelect}
          />
        ))}
        {items.length > 4 ? (
          <button
            onClick={onSelect}
            className="mt-1 self-start text-[11px] font-semibold text-gray-500 transition hover:text-gray-900"
          >
            + {items.length - 4} reuniões
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

function MeetingRow({
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className="group relative flex items-stretch gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-3 pr-2 transition hover:border-gray-300 hover:shadow-[0_8px_24px_-14px_rgba(15,23,42,0.2)]"
    >
      <div className={cn("w-1 rounded-full", accent.bar)} />

      <div className="flex shrink-0 flex-col items-start gap-0.5 pr-2 md:min-w-[64px]">
        <span className="text-sm font-semibold text-gray-900 tabular-nums">
          {meeting.startTime}
        </span>
        <span className="text-[10px] text-gray-400 tabular-nums">
          {meeting.endTime}
        </span>
      </div>

      <div className="min-w-0 flex-1 border-l border-gray-100 pl-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-gray-900">
            {meeting.title}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ring-1",
              accent.cls,
            )}
          >
            <Icon size={9} />
            {meetingTypeLabel(meeting.type)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-gray-500">
          Com{" "}
          <span className="font-medium text-gray-700">{meeting.client}</span>
          {meeting.location ? ` · ${meeting.location}` : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <span className="hidden items-center gap-1 pr-1 text-[10px] text-gray-400 md:flex">
          <Clock size={10} />
          {durationLabel(meeting.startTime, meeting.endTime)}
        </span>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar"
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-900 group-hover:opacity-100"
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={confirming ? "Confirmar exclusão" : "Excluir"}
          className={cn(
            "inline-flex h-7 items-center justify-center gap-1 rounded-full px-1.5 text-[9px] font-semibold tracking-wider uppercase transition",
            confirming
              ? "bg-red-50 text-red-600 ring-1 ring-red-200"
              : "w-7 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100",
          )}
        >
          <Trash2 size={12} />
          {confirming ? "Confirmar" : null}
        </button>
      </div>
    </motion.div>
  );
}

function CompactRow({
  meeting,
  onClick,
}: {
  meeting: Meeting;
  onClick: () => void;
}) {
  const accent = typeAccent[meeting.type];
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-2 text-left transition hover:border-gray-200 hover:bg-gray-50/60"
    >
      <span className={cn("h-7 w-0.5 shrink-0 rounded-full", accent.bar)} />
      <span className="text-[11px] font-semibold text-gray-900 tabular-nums">
        {meeting.startTime}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs text-gray-700 group-hover:text-gray-900">
        {meeting.title}
      </span>
      <span className="hidden truncate text-[10px] text-gray-400 sm:inline">
        {meeting.client}
      </span>
    </button>
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
