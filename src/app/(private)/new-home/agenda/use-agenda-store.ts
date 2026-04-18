"use client";

import { create } from "zustand";

export type MeetingType = "meet" | "zoom" | "teams" | "presencial";
export type MeetingSource = "local" | "google";

export interface Meeting {
  id: string;
  title: string;
  client: string;
  date: string;
  startTime: string;
  endTime: string;
  type: MeetingType;
  notes?: string;
  location?: string;
  source: MeetingSource;
}

function toISODate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const INITIAL: Meeting[] = [
  {
    id: "m-1",
    title: "Sessão de acompanhamento",
    client: "Maria Silva",
    date: toISODate(0),
    startTime: "14:00",
    endTime: "15:00",
    type: "meet",
    notes: "Revisar progresso das últimas duas semanas.",
    source: "local",
  },
  {
    id: "m-2",
    title: "Follow-up comercial",
    client: "João Santos",
    date: toISODate(0),
    startTime: "16:30",
    endTime: "17:00",
    type: "zoom",
    notes: "Apresentar proposta revisada.",
    source: "local",
  },
  {
    id: "m-3",
    title: "Primeira consulta",
    client: "Ana Costa",
    date: toISODate(1),
    startTime: "09:00",
    endTime: "10:00",
    type: "presencial",
    location: "Consultório - Sala 2",
    source: "local",
  },
  {
    id: "m-4",
    title: "Reunião de alinhamento",
    client: "Equipe interna",
    date: toISODate(1),
    startTime: "11:00",
    endTime: "11:30",
    type: "teams",
    source: "local",
  },
  {
    id: "m-5",
    title: "Revisão de plano",
    client: "Carlos Mendes",
    date: toISODate(2),
    startTime: "15:00",
    endTime: "16:00",
    type: "meet",
    source: "local",
  },
  {
    id: "m-6",
    title: "Consulta de retorno",
    client: "Beatriz Lima",
    date: toISODate(3),
    startTime: "10:00",
    endTime: "10:45",
    type: "presencial",
    location: "Consultório - Sala 1",
    source: "local",
  },
];

interface AgendaState {
  meetings: Meeting[];
  googleConnected: boolean;
  googleEmail: string | null;
  addMeeting: (meeting: Omit<Meeting, "id" | "source"> & { source?: MeetingSource }) => void;
  updateMeeting: (id: string, patch: Partial<Meeting>) => void;
  removeMeeting: (id: string) => void;
  connectGoogle: (email: string) => void;
  disconnectGoogle: () => void;
}

export const useAgendaStore = create<AgendaState>((set) => ({
  meetings: INITIAL,
  googleConnected: false,
  googleEmail: null,
  addMeeting: (meeting) =>
    set((state) => ({
      meetings: [
        ...state.meetings,
        {
          ...meeting,
          id: `m-${Date.now()}`,
          source: meeting.source ?? "local",
        },
      ],
    })),
  updateMeeting: (id, patch) =>
    set((state) => ({
      meetings: state.meetings.map((m) =>
        m.id === id ? { ...m, ...patch } : m,
      ),
    })),
  removeMeeting: (id) =>
    set((state) => ({
      meetings: state.meetings.filter((m) => m.id !== id),
    })),
  connectGoogle: (email) =>
    set({ googleConnected: true, googleEmail: email }),
  disconnectGoogle: () =>
    set({ googleConnected: false, googleEmail: null }),
}));

export function sortMeetings(meetings: Meeting[]) {
  return [...meetings].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

export function getUpcoming(meetings: Meeting[]) {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return sortMeetings(
    meetings.filter((m) => {
      if (m.date > today) return true;
      if (m.date === today) return m.endTime >= currentTime;
      return false;
    }),
  );
}

export function meetingTypeLabel(type: MeetingType) {
  switch (type) {
    case "meet":
      return "Google Meet";
    case "zoom":
      return "Zoom";
    case "teams":
      return "Teams";
    case "presencial":
      return "Presencial";
  }
}
