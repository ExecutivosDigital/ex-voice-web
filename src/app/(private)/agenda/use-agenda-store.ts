"use client";

/**
 * Tipos e helpers do calendário da Agenda. (Era um store zustand com reuniões
 * mock — desde 21/07 as views consomem os eventos REAIS do Google Agenda,
 * mapeados para `Meeting` na própria página. Agendamento manual persistido é
 * backlog; quando existir, entra aqui como fonte adicional.)
 */

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
