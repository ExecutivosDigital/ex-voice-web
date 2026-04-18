"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarPlus,
  Clock,
  MapPin,
  Monitor,
  Sparkles,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DayView } from "./components/day-view";
import { GoogleConnectChip } from "./components/google-connect-chip";
import { MeetingFormModal } from "./components/meeting-form-modal";
import { MonthCalendar } from "./components/month-calendar";
import { PreMeetingModal } from "./components/pre-meeting-modal";
import { ViewSwitcher, AgendaView } from "./components/view-switcher";
import { YearView } from "./components/year-view";
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

function minutesBetween(iso: string, time: string) {
  const target = new Date(`${iso}T${time}:00`);
  return Math.round((target.getTime() - Date.now()) / 60000);
}

export default function AgendaPage() {
  const meetings = useAgendaStore((s) => s.meetings);

  const todayISO = toISO(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [view, setView] = useState<AgendaView>("month");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);
  const [preMeeting, setPreMeeting] = useState<Meeting | null>(null);

  const sortedMeetings = useMemo(() => sortMeetings(meetings), [meetings]);
  const selectedDayMeetings = useMemo(
    () => sortedMeetings.filter((m) => m.date === selectedDate),
    [sortedMeetings, selectedDate],
  );

  const nextMeeting = useMemo(() => {
    const now = Date.now();
    return (
      sortedMeetings.find((m) => {
        const start = new Date(`${m.date}T${m.startTime}:00`).getTime();
        return start >= now;
      }) ?? null
    );
  }, [sortedMeetings]);

  const todayMeetings = useMemo(
    () => sortedMeetings.filter((m) => m.date === todayISO),
    [sortedMeetings, todayISO],
  );
  const weekMeetings = useMemo(() => {
    const d = new Date();
    const in7 = new Date();
    in7.setDate(d.getDate() + 7);
    const end = toISO(in7);
    return sortedMeetings.filter((m) => m.date >= todayISO && m.date <= end);
  }, [sortedMeetings, todayISO]);

  const handleEdit = (meeting: Meeting) => {
    setEditing(meeting);
    setDefaultDate(undefined);
    setModalOpen(true);
    setPreMeeting(null);
  };

  const handleNew = (date?: string) => {
    setEditing(null);
    setDefaultDate(date);
    setModalOpen(true);
  };

  const handleSelectMonth = (year: number, month: number) => {
    setViewDate(new Date(year, month, 1));
    setView("month");
  };

  const handleSelectDate = (iso: string) => {
    setSelectedDate(iso);
    const d = new Date(iso + "T00:00");
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <CockpitHeader
        todayCount={todayMeetings.length}
        weekCount={weekMeetings.length}
        totalCount={meetings.length}
        nextMeeting={nextMeeting}
        onOpenNext={() => nextMeeting && setPreMeeting(nextMeeting)}
      />

      <ViewToolbar view={view} onViewChange={setView} />

      <AnimatePresence mode="wait">
        {view === "day" && (
          <motion.div
            key="day"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <DayView
              meetings={meetings}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onOpenMeeting={(m) => setPreMeeting(m)}
              onAdd={(d) => handleNew(d)}
            />
          </motion.div>
        )}

        {view === "month" && (
          <motion.section
            key="month"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]"
          >
            <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-6">
              <MonthCalendar
                meetings={meetings}
                selectedDate={selectedDate}
                viewDate={viewDate}
                onSelectDate={setSelectedDate}
                onViewDateChange={setViewDate}
              />
            </div>

            <SelectedDayPanel
              selectedDate={selectedDate}
              todayISO={todayISO}
              meetings={selectedDayMeetings}
              onAdd={() => handleNew(selectedDate)}
              onOpen={(m) => setPreMeeting(m)}
              onOpenDayView={() => setView("day")}
            />
          </motion.section>
        )}

        {view === "year" && (
          <motion.div
            key="year"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <YearView
              meetings={meetings}
              year={viewDate.getFullYear()}
              selectedDate={selectedDate}
              onYearChange={(y) =>
                setViewDate(new Date(y, viewDate.getMonth(), 1))
              }
              onSelectMonth={handleSelectMonth}
              onSelectDate={(iso) => {
                handleSelectDate(iso);
                setView("day");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MeetingFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        defaultDate={defaultDate}
      />

      <PreMeetingModal
        meeting={preMeeting}
        onClose={() => setPreMeeting(null)}
        onEdit={handleEdit}
        onStartRecording={(m) => {
          setPreMeeting(null);
          // Hook de gravação integra aqui depois.
          console.log("start recording for", m.id);
        }}
      />
    </div>
  );
}

function ViewToolbar({
  view,
  onViewChange,
}: {
  view: AgendaView;
  onViewChange: (v: AgendaView) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase md:inline">
        Visualizar por
      </span>
      <ViewSwitcher value={view} onChange={onViewChange} />
      <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
    </div>
  );
}

function CockpitHeader({
  todayCount,
  weekCount,
  totalCount,
  nextMeeting,
  onOpenNext,
}: {
  todayCount: number;
  weekCount: number;
  totalCount: number;
  nextMeeting: Meeting | null;
  onOpenNext: () => void;
}) {
  const nextMins = useMemo(
    () =>
      nextMeeting
        ? minutesBetween(nextMeeting.date, nextMeeting.startTime)
        : null,
    [nextMeeting],
  );

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 capitalize">
          Agenda
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-balance text-2xl font-semibold text-gray-900 md:text-3xl">
              Seu cockpit.
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
              Próximas conversas, direcionamentos da IA e histórico do cliente
              no mesmo lugar. Clique numa reunião para abrir o{" "}
              <span className="font-medium text-gray-700">Pre-Meeting</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <GoogleConnectChip />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <NextMeetingCard
          meeting={nextMeeting}
          minutes={nextMins}
          onOpen={onOpenNext}
        />
        <StatCard label="Hoje" value={todayCount} hint="compromissos" tone="light" />
        <StatCard
          label="Próx. 7 dias"
          value={weekCount}
          hint="na semana"
          tone="light"
        />
        <StatCard
          label="Agenda total"
          value={totalCount}
          hint="registradas"
          tone="light"
        />
      </div>
    </section>
  );
}

function NextMeetingCard({
  meeting,
  minutes,
  onOpen,
}: {
  meeting: Meeting | null;
  minutes: number | null;
  onOpen: () => void;
}) {
  if (!meeting) {
    return (
      <div className="flex items-center justify-between rounded-3xl border border-dashed border-gray-200 bg-white/70 p-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.28em] text-gray-400 uppercase">
            Próximo compromisso
          </p>
          <p className="mt-1.5 text-sm font-semibold text-gray-900">
            Agenda livre
          </p>
          <p className="text-xs text-gray-500">
            Nenhuma reunião à vista. Hora de respirar.
          </p>
        </div>
        <Sparkles className="text-gray-300" size={28} />
      </div>
    );
  }

  const accent = typeAccent[meeting.type];
  const Icon = accent.icon;
  const countdown =
    minutes === null
      ? ""
      : minutes <= 0
        ? "Agora"
        : minutes < 60
          ? `em ${minutes} min`
          : minutes < 60 * 24
            ? `em ${Math.floor(minutes / 60)}h`
            : `em ${Math.floor(minutes / 60 / 24)}d`;

  const urgent = minutes !== null && minutes <= 15;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onOpen}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-3xl border p-5 text-left transition",
        urgent
          ? "border-red-200 bg-gradient-to-br from-red-50 via-white to-white shadow-[0_12px_40px_-20px_rgba(239,68,68,0.35)]"
          : "border-gray-900/80 bg-gradient-to-br from-gray-900 via-[#111318] to-[#1a1d24] text-white shadow-[0_12px_40px_-20px_rgba(17,24,39,0.6)]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl",
          urgent ? "bg-red-500/20" : "bg-emerald-500/10",
        )}
      />

      <div
        className={cn(
          "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1",
          urgent
            ? "bg-white text-red-600 ring-red-200"
            : "bg-white/10 text-white ring-white/15",
        )}
      >
        <Icon size={22} />
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-semibold tracking-[0.28em] uppercase",
              urgent ? "text-red-600" : "text-white/50",
            )}
          >
            Próximo
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase",
              urgent
                ? "bg-red-500 text-white"
                : minutes !== null && minutes < 60
                  ? "bg-amber-400 text-amber-950"
                  : "bg-white/10 text-white ring-1 ring-white/20",
            )}
          >
            {urgent && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            )}
            {countdown || meetingTypeLabel(meeting.type)}
          </span>
        </div>
        <h3
          className={cn(
            "mt-1 truncate text-base font-semibold md:text-lg",
            urgent ? "text-gray-900" : "text-white",
          )}
        >
          {meeting.title}
        </h3>
        <p
          className={cn(
            "mt-0.5 flex items-center gap-2 text-[11px]",
            urgent ? "text-gray-600" : "text-white/60",
          )}
        >
          <Clock size={11} />
          {meeting.startTime} – {meeting.endTime} · Com {meeting.client}
        </p>
      </div>

      <ArrowRight
        size={18}
        className={cn(
          "relative shrink-0 transition-transform group-hover:translate-x-1",
          urgent ? "text-gray-500" : "text-white/70",
        )}
      />
    </motion.button>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-3xl border p-5",
        tone === "dark"
          ? "border-gray-900 bg-gradient-to-br from-gray-900 to-gray-700 text-white"
          : "border-gray-200/70 bg-white/80 backdrop-blur-sm",
      )}
    >
      <p
        className={cn(
          "text-[10px] font-semibold tracking-[0.28em] uppercase",
          tone === "dark" ? "text-white/60" : "text-gray-400",
        )}
      >
        {label}
      </p>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-3xl font-semibold tabular-nums",
            tone === "dark" ? "text-white" : "text-gray-900",
          )}
        >
          {value}
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            tone === "dark" ? "text-white/60" : "text-gray-400",
          )}
        >
          {hint}
        </span>
      </div>
    </div>
  );
}

function SelectedDayPanel({
  selectedDate,
  todayISO,
  meetings,
  onAdd,
  onOpen,
  onOpenDayView,
}: {
  selectedDate: string;
  todayISO: string;
  meetings: Meeting[];
  onAdd: () => void;
  onOpen: (meeting: Meeting) => void;
  onOpenDayView: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-gray-200/70 bg-white/80 p-5 backdrop-blur-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Dia selecionado
          </p>
          <h3 className="mt-1 truncate text-lg font-semibold text-gray-900 capitalize">
            {selectedDate === todayISO ? "Hoje" : formatLongDate(selectedDate)}
          </h3>
          <p className="text-[11px] text-gray-400 capitalize">
            {meetings.length} {meetings.length === 1 ? "compromisso" : "compromissos"}
            {selectedDate !== todayISO
              ? ` · ${formatLongDate(selectedDate)}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenDayView}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-gray-200 bg-white px-3 text-[10px] font-semibold tracking-wider text-gray-600 uppercase transition hover:border-gray-300 hover:text-gray-900"
          >
            Abrir dia
            <ArrowRight size={11} />
          </button>
          <button
            onClick={onAdd}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-gray-900 px-3 text-[11px] font-semibold text-white transition hover:bg-gray-700"
          >
            <CalendarPlus size={12} />
            Adicionar
          </button>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-10 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
            <CalendarPlus size={18} className="text-gray-500" />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-800">Dia livre</p>
          <p className="mt-0.5 max-w-xs text-xs text-gray-500">
            Nenhuma reunião marcada. Agende ou use esse tempo para revisar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {meetings.map((meeting) => (
            <button
              key={meeting.id}
              onClick={() => onOpen(meeting)}
              className="group relative flex items-stretch gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-3 text-left transition hover:border-gray-300 hover:shadow-[0_8px_24px_-14px_rgba(15,23,42,0.25)]"
            >
              <div
                className={cn(
                  "w-1 rounded-full",
                  typeAccent[meeting.type].bar,
                )}
              />
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
                      typeAccent[meeting.type].cls,
                    )}
                  >
                    {meetingTypeLabel(meeting.type)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  Com{" "}
                  <span className="font-medium text-gray-700">
                    {meeting.client}
                  </span>
                  {meeting.location ? ` · ${meeting.location}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <span className="hidden items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase opacity-0 transition group-hover:opacity-100 md:inline-flex">
                  <Sparkles size={10} /> Pre-Meeting
                </span>
                <ArrowRight
                  size={14}
                  className="ml-1 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
