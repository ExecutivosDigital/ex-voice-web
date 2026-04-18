"use client";

import { useSession } from "@/context/auth";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentType, useMemo, useState } from "react";
import { useAgendaStore } from "../agenda/use-agenda-store";
import { ImmersiveRecorder } from "./immersive-recorder";
import { RecordMode } from "./mode-cards";
import { RecentRecordings } from "./recent-recordings";
import { UpcomingMeetings } from "./upcoming-meetings";

const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

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

function getGreeting(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export interface ModeCardsComponentProps {
  onSelect: (mode: RecordMode) => void;
}

interface HomeShellProps {
  ModeCardsComponent: ComponentType<ModeCardsComponentProps>;
  label?: string;
}

export function HomeShell({ ModeCardsComponent, label }: HomeShellProps) {
  const { profile } = useSession();
  const [activeMode, setActiveMode] = useState<RecordMode | null>(null);

  const firstName = profile?.name?.split(" ")[0] || "";
  const now = new Date();
  const formattedDate = `${WEEKDAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;
  const greeting = getGreeting(now.getHours());

  const meetings = useAgendaStore((s) => s.meetings);
  const appointmentsToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return meetings.filter((m) => m.date === today).length;
  }, [meetings]);
  const pendingSummaries = 2;

  return (
    <div className="flex w-full flex-col gap-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium tracking-[0.18em] text-gray-400 capitalize">
            {formattedDate}
          </p>
          {label && (
            <span className="rounded-full border border-gray-300/70 bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-gray-600 uppercase backdrop-blur-md">
              {label}
            </span>
          )}
        </div>
        <h1 className="text-balance text-2xl font-semibold text-gray-900 md:text-3xl">
          {greeting}
          {firstName ? `, ${firstName}.` : "."}
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
          Você tem{" "}
          <span className="font-medium text-gray-700">
            {appointmentsToday}{" "}
            {appointmentsToday === 1 ? "reunião" : "reuniões"}
          </span>{" "}
          hoje e{" "}
          <span className="font-medium text-gray-700">
            {pendingSummaries} resumos
          </span>{" "}
          esperando sua revisão.
        </p>
      </motion.section>

      <ModeCardsComponent onSelect={(mode) => setActiveMode(mode)} />

      <UpcomingMeetings />

      <RecentRecordings />

      <AnimatePresence>
        {activeMode && (
          <ImmersiveRecorder
            key={activeMode}
            mode={activeMode}
            onClose={() => setActiveMode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
