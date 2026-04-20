"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Monitor,
  Video,
} from "lucide-react";
import { useMemo } from "react";
import {
  Meeting,
  MeetingType,
  meetingTypeLabel,
  sortMeetings,
} from "../use-agenda-store";

const HOURS_START = 7;
const HOURS_END = 21;
const PX_PER_HOUR = 56;

const typeAccent: Record<
  MeetingType,
  { cls: string; bar: string; icon: typeof Video }
> = {
  meet: {
    cls: "bg-emerald-50/80 ring-emerald-200/80 text-emerald-900",
    bar: "bg-emerald-500",
    icon: Video,
  },
  zoom: {
    cls: "bg-sky-50/80 ring-sky-200/80 text-sky-900",
    bar: "bg-sky-500",
    icon: Video,
  },
  teams: {
    cls: "bg-indigo-50/80 ring-indigo-200/80 text-indigo-900",
    bar: "bg-indigo-500",
    icon: Monitor,
  },
  presencial: {
    cls: "bg-gray-100 ring-gray-200 text-gray-900",
    bar: "bg-gray-500",
    icon: MapPin,
  },
};

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function minutesFromMidnight(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatLongDate(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

interface DayViewProps {
  meetings: Meeting[];
  selectedDate: string;
  onSelectDate: (iso: string) => void;
  onOpenMeeting: (meeting: Meeting) => void;
  onAdd: (date: string) => void;
}

export function DayView({
  meetings,
  selectedDate,
  onSelectDate,
  onOpenMeeting,
  onAdd,
}: DayViewProps) {
  const dayDate = new Date(selectedDate + "T00:00");
  const todayISO = toISO(new Date());
  const isToday = selectedDate === todayISO;

  const dayMeetings = useMemo(
    () => sortMeetings(meetings.filter((m) => m.date === selectedDate)),
    [meetings, selectedDate],
  );

  const shiftDay = (delta: number) => {
    const d = new Date(dayDate);
    d.setDate(d.getDate() + delta);
    onSelectDate(toISO(d));
  };

  const nowMinutes = useMemo(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  }, []);

  const hours = Array.from(
    { length: HOURS_END - HOURS_START + 1 },
    (_, i) => HOURS_START + i,
  );

  const nowOffset =
    isToday && nowMinutes >= HOURS_START * 60 && nowMinutes <= HOURS_END * 60
      ? ((nowMinutes - HOURS_START * 60) / 60) * PX_PER_HOUR
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gray-200/70 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => shiftDay(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="min-w-[200px] px-2">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
              {isToday ? "Hoje" : "Dia selecionado"}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              {formatLongDate(dayDate)}
            </h3>
          </div>
          <button
            onClick={() => shiftDay(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDate(todayISO)}
            className="inline-flex h-8 items-center rounded-full border border-gray-200 bg-white px-3 text-[10px] font-semibold tracking-wider text-gray-600 uppercase transition hover:border-gray-300 hover:text-gray-900"
          >
            Ir para hoje
          </button>
          <button
            onClick={() => onAdd(selectedDate)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-3.5 text-[11px] font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
          >
            <CalendarPlus size={12} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-4 backdrop-blur-sm md:p-6">
        {dayMeetings.length === 0 ? (
          <EmptyDay onAdd={() => onAdd(selectedDate)} />
        ) : (
          <div
            className="relative"
            style={{ height: (HOURS_END - HOURS_START + 1) * PX_PER_HOUR }}
          >
            <div className="absolute inset-0 flex flex-col">
              {hours.map((h, i) => (
                <div
                  key={h}
                  className={cn(
                    "flex items-start gap-3 border-t border-dashed border-gray-100",
                    i === 0 && "border-transparent",
                  )}
                  style={{ height: PX_PER_HOUR }}
                >
                  <span className="w-12 -translate-y-2 text-[10px] font-semibold tracking-wider text-gray-400 tabular-nums uppercase">
                    {String(h).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {nowOffset !== null && (
              <div
                className="pointer-events-none absolute right-0 left-12 flex items-center gap-2"
                style={{ top: nowOffset }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-red-500/70 to-transparent" />
              </div>
            )}

            <div className="absolute top-0 right-0 left-14">
              {dayMeetings.map((meeting) => {
                const accent = typeAccent[meeting.type];
                const Icon = accent.icon;
                const startMin = minutesFromMidnight(meeting.startTime);
                const endMin = minutesFromMidnight(meeting.endTime);
                const top =
                  ((startMin - HOURS_START * 60) / 60) * PX_PER_HOUR;
                const height = Math.max(
                  ((endMin - startMin) / 60) * PX_PER_HOUR,
                  48,
                );
                const ended = isToday && endMin < nowMinutes;

                return (
                  <motion.button
                    key={meeting.id}
                    onClick={() => onOpenMeeting(meeting)}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "group absolute left-0 flex w-full items-stretch gap-2 overflow-hidden rounded-2xl px-3 py-2 text-left ring-1 transition hover:shadow-[0_10px_30px_-14px_rgba(15,23,42,0.35)]",
                      accent.cls,
                      ended && "opacity-60",
                    )}
                    style={{ top, height }}
                  >
                    <span
                      className={cn(
                        "w-1 shrink-0 rounded-full",
                        accent.bar,
                      )}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Icon size={12} />
                        <span className="text-[10px] font-semibold tracking-wider uppercase opacity-80">
                          {meetingTypeLabel(meeting.type)}
                        </span>
                        <span className="ml-auto text-[11px] font-semibold tabular-nums opacity-90">
                          {meeting.startTime} – {meeting.endTime}
                        </span>
                      </div>
                      <p className="truncate text-sm font-semibold">
                        {meeting.title}
                      </p>
                      <p className="truncate text-[11px] opacity-70">
                        Com {meeting.client}
                        {meeting.location ? ` · ${meeting.location}` : ""}
                      </p>
                    </div>
                    <span className="hidden shrink-0 self-center rounded-full bg-white/60 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ring-1 ring-white/80 group-hover:bg-white md:inline">
                      Preparar
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyDay({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        <CalendarPlus size={20} className="text-gray-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">Dia livre</p>
        <p className="mt-0.5 text-xs text-gray-500">
          Sem compromissos. Use este tempo para revisar gravações recentes.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-gray-700"
      >
        <CalendarPlus size={12} />
        Adicionar compromisso
      </button>
    </div>
  );
}
