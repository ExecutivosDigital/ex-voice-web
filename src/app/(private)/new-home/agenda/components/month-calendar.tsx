"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Meeting, MeetingType } from "../../agenda/use-agenda-store";

const WEEKDAYS_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const typeDot: Record<MeetingType, string> = {
  meet: "bg-emerald-500",
  zoom: "bg-sky-500",
  teams: "bg-indigo-500",
  presencial: "bg-gray-500",
};

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function buildMonthGrid(viewDate: Date) {
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(firstOfMonth);
    d.setDate(d.getDate() - (i + 1));
    cells.push({ date: d, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(viewDate.getFullYear(), viewDate.getMonth(), day),
      inMonth: true,
    });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  return cells;
}

interface MonthCalendarProps {
  meetings: Meeting[];
  selectedDate: string;
  viewDate: Date;
  onSelectDate: (iso: string) => void;
  onViewDateChange: (date: Date) => void;
  compact?: boolean;
}

export function MonthCalendar({
  meetings,
  selectedDate,
  viewDate,
  onSelectDate,
  onViewDateChange,
  compact,
}: MonthCalendarProps) {
  const meetingsByDate = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const m of meetings) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    return map;
  }, [meetings]);

  const cells = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const todayISO = toISO(new Date());

  const prev = () =>
    onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const next = () =>
    onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const goToday = () => {
    const now = new Date();
    onViewDateChange(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelectDate(toISO(now));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="min-w-[140px] px-1 text-sm font-semibold text-gray-900 capitalize">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h3>
          <button
            onClick={next}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <button
          onClick={goToday}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-semibold tracking-wider text-gray-600 uppercase transition hover:border-gray-300 hover:text-gray-900"
        >
          Hoje
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 pb-1.5">
        {WEEKDAYS_SHORT.map((w, i) => (
          <span
            key={i}
            className="py-1 text-center text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
          >
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          const iso = toISO(cell.date);
          const dayMeetings = meetingsByDate.get(iso) ?? [];
          const count = dayMeetings.length;
          const isToday = iso === todayISO;
          const isSelected = iso === selectedDate;
          const isWeekend =
            cell.date.getDay() === 0 || cell.date.getDay() === 6;

          const primaryType = dayMeetings[0]?.type;
          const hasMeetings = count > 0;

          return (
            <motion.button
              key={idx}
              onClick={() => onSelectDate(iso)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "group relative flex aspect-square flex-col items-stretch justify-between rounded-xl border p-1.5 text-left transition",
                !cell.inMonth && "opacity-40",
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white shadow-[0_10px_24px_-10px_rgba(17,24,39,0.55)]"
                  : isToday
                    ? "border-gray-900/10 bg-gray-50 text-gray-900"
                    : hasMeetings
                      ? "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50",
                compact && "aspect-auto min-h-[52px]",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-gray-900"
                        : isWeekend
                          ? "text-gray-400"
                          : "text-gray-700",
                  )}
                >
                  {cell.date.getDate()}
                </span>

                {hasMeetings && (
                  <span
                    className={cn(
                      "inline-flex min-w-[18px] shrink-0 items-center justify-center rounded-full px-1 text-[9px] font-bold tabular-nums leading-[16px]",
                      isSelected
                        ? "bg-white/20 text-white ring-1 ring-white/30"
                        : primaryType
                          ? cn(
                              "text-white ring-1",
                              typeDot[primaryType],
                              "ring-white",
                            )
                          : "bg-gray-900 text-white",
                    )}
                    aria-label={`${count} ${count === 1 ? "reunião" : "reuniões"}`}
                  >
                    {count}
                  </span>
                )}
              </div>

              {hasMeetings ? (
                <div className="flex items-end gap-0.5">
                  {dayMeetings.slice(0, 4).map((m, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        isSelected ? "bg-white/70" : typeDot[m.type],
                      )}
                    />
                  ))}
                  {Array.from({ length: Math.max(0, 4 - dayMeetings.length) }).map((_, i) => (
                    <span
                      key={`e-${i}`}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        isSelected ? "bg-white/10" : "bg-gray-100",
                      )}
                    />
                  ))}
                </div>
              ) : (
                <span className="h-1" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
        {(
          [
            { type: "meet" as const, label: "Meet" },
            { type: "zoom" as const, label: "Zoom" },
            { type: "teams" as const, label: "Teams" },
            { type: "presencial" as const, label: "Presencial" },
          ]
        ).map((item) => (
          <span
            key={item.type}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-500"
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full", typeDot[item.type])}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
