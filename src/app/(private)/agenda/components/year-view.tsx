"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Meeting } from "../use-agenda-store";

const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const WEEKDAYS_MINI = ["d", "s", "t", "q", "q", "s", "s"];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

interface YearViewProps {
  meetings: Meeting[];
  year: number;
  selectedDate: string;
  onYearChange: (year: number) => void;
  onSelectMonth: (year: number, month: number) => void;
  onSelectDate: (iso: string) => void;
}

export function YearView({
  meetings,
  year,
  selectedDate,
  onYearChange,
  onSelectMonth,
  onSelectDate,
}: YearViewProps) {
  const todayISO = toISO(new Date());

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of meetings) {
      map.set(m.date, (map.get(m.date) ?? 0) + 1);
    }
    return map;
  }, [meetings]);

  const monthTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    for (const m of meetings) {
      const d = new Date(m.date + "T00:00");
      if (d.getFullYear() === year) totals[d.getMonth()] += 1;
    }
    return totals;
  }, [meetings, year]);

  const maxMonthTotal = Math.max(1, ...monthTotals);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-3xl border border-gray-200/70 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onYearChange(year - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Ano anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="min-w-[100px] px-2 text-center text-sm font-semibold text-gray-900 tabular-nums">
            {year}
          </h3>
          <button
            onClick={() => onYearChange(year + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Próximo ano"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-gray-200" /> Livre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-gray-400" /> 1–2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-gray-700" /> 3+
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-gray-900" /> Hoje
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, monthIdx) => (
          <MiniMonth
            key={monthIdx}
            year={year}
            month={monthIdx}
            total={monthTotals[monthIdx]}
            relative={monthTotals[monthIdx] / maxMonthTotal}
            selectedDate={selectedDate}
            todayISO={todayISO}
            countsByDate={countsByDate}
            onSelectMonth={() => onSelectMonth(year, monthIdx)}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
}

function MiniMonth({
  year,
  month,
  total,
  relative,
  selectedDate,
  todayISO,
  countsByDate,
  onSelectMonth,
  onSelectDate,
}: {
  year: number;
  month: number;
  total: number;
  relative: number;
  selectedDate: string;
  todayISO: string;
  countsByDate: Map<string, number>;
  onSelectMonth: () => void;
  onSelectDate: (iso: string) => void;
}) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: { iso: string | null; day: number | null }[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ iso: null, day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ iso, day: d });
  }
  while (cells.length % 7 !== 0) cells.push({ iso: null, day: null });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white p-4 transition hover:border-gray-300 hover:shadow-[0_10px_28px_-18px_rgba(15,23,42,0.3)]"
    >
      <button
        onClick={onSelectMonth}
        className="flex items-center justify-between text-left"
      >
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
            {year}
          </p>
          <h4 className="text-sm font-semibold text-gray-900">
            {MONTHS_SHORT[month]}
          </h4>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-900 tabular-nums leading-none">
            {total}
          </span>
          <span className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
            {total === 1 ? "reunião" : "reuniões"}
          </span>
        </div>
      </button>

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-gray-100"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gray-900 to-gray-500 transition-all duration-500"
          style={{ width: `${Math.round(relative * 100)}%` }}
        />
      </div>

      <div className="grid grid-cols-7 gap-[3px]">
        {WEEKDAYS_MINI.map((w, i) => (
          <span
            key={i}
            className="text-center text-[8px] font-semibold tracking-wider text-gray-300 uppercase"
          >
            {w}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (!cell.iso) return <span key={i} className="aspect-square" />;
          const count = countsByDate.get(cell.iso) ?? 0;
          const isToday = cell.iso === todayISO;
          const isSelected = cell.iso === selectedDate;

          const bg = isSelected
            ? "bg-gray-900 text-white ring-1 ring-gray-900"
            : isToday
              ? "bg-gray-900 text-white"
              : count >= 3
                ? "bg-gray-700 text-white"
                : count > 0
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200";

          return (
            <button
              key={i}
              onClick={() => onSelectDate(cell.iso!)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-[4px] text-[8px] font-semibold tabular-nums transition",
                bg,
              )}
              title={`${cell.day} - ${count} reuni${count === 1 ? "ão" : "ões"}`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
