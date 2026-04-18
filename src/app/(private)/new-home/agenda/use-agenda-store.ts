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

export interface PastMeetingSummary {
  id: string;
  date: string;
  title: string;
  highlights: string[];
  nextSteps: string[];
  sentiment: "positivo" | "neutro" | "atencao";
}

export interface AiDirectives {
  objective: string;
  resume: string[];
  watchouts: string[];
  questions: string[];
  tone: string;
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

const MOCK_HISTORY: Record<string, PastMeetingSummary[]> = {
  "Maria Silva": [
    {
      id: "h-ms-1",
      date: toISODate(-7),
      title: "Sessão 3 · Plano de ação",
      highlights: [
        "Relatou progresso nos hábitos de sono.",
        "Identificou gatilho de ansiedade no trabalho.",
      ],
      nextSteps: [
        "Continuar diário de humor 3x por semana.",
        "Testar técnica de respiração 4-7-8 antes de reuniões.",
      ],
      sentiment: "positivo",
    },
    {
      id: "h-ms-2",
      date: toISODate(-14),
      title: "Sessão 2 · Mapeamento",
      highlights: ["Mapeamos as 3 frentes principais de stress."],
      nextSteps: ["Enviar material de apoio sobre autocuidado."],
      sentiment: "neutro",
    },
  ],
  "João Santos": [
    {
      id: "h-js-1",
      date: toISODate(-3),
      title: "Call comercial · Apresentação",
      highlights: [
        "Demonstrou interesse no plano Pro.",
        "Perguntou sobre integração com CRM.",
      ],
      nextSteps: [
        "Enviar proposta revisada até sexta.",
        "Confirmar reunião com time técnico dele.",
      ],
      sentiment: "positivo",
    },
  ],
  "Ana Costa": [
    {
      id: "h-ac-1",
      date: toISODate(-30),
      title: "Contato inicial",
      highlights: ["Primeira consulta: histórico coletado."],
      nextSteps: ["Preparar plano personalizado para apresentar."],
      sentiment: "neutro",
    },
  ],
  "Carlos Mendes": [
    {
      id: "h-cm-1",
      date: toISODate(-10),
      title: "Revisão trimestral",
      highlights: [
        "Resultados abaixo do esperado em 2 indicadores.",
        "Ficou preocupado com o prazo do projeto X.",
      ],
      nextSteps: [
        "Revisar cronograma do projeto X.",
        "Alinhar expectativas sobre o Q2.",
      ],
      sentiment: "atencao",
    },
  ],
  "Beatriz Lima": [
    {
      id: "h-bl-1",
      date: toISODate(-21),
      title: "Primeira consulta",
      highlights: ["Queixa principal: dores recorrentes."],
      nextSteps: ["Agendar exames complementares."],
      sentiment: "neutro",
    },
  ],
};

export function getPastMeetings(client: string): PastMeetingSummary[] {
  return MOCK_HISTORY[client] ?? [];
}

export function getAiDirectives(meeting: Meeting): AiDirectives {
  const history = getPastMeetings(meeting.client);
  const lastSession = history[0];

  if (!lastSession) {
    return {
      objective:
        "Primeiro contato. Foque em entender o contexto, expectativas e dores principais.",
      resume: [
        "Apresente-se brevemente e explique a estrutura da conversa.",
        "Deixe a pessoa falar mais que você nos primeiros 10 minutos.",
      ],
      watchouts: [
        "Evite propor soluções antes de entender o cenário completo.",
      ],
      questions: [
        "O que te trouxe até aqui hoje?",
        "Como está a situação atualmente?",
        "Se saíssemos daqui com uma única vitória, qual seria?",
      ],
      tone: "Acolhedor, curioso, sem pressa.",
    };
  }

  const tone =
    lastSession.sentiment === "atencao"
      ? "Escuta ativa e validação. Evite frases defensivas."
      : lastSession.sentiment === "positivo"
        ? "Confiante e consultivo. Mantenha o ritmo."
        : "Neutro e investigativo. Aprofunde pontos abertos.";

  return {
    objective: `Dar continuidade ao que ficou em aberto na sessão de ${new Date(lastSession.date + "T00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}. Feche pelo menos um next step.`,
    resume: lastSession.nextSteps,
    watchouts:
      lastSession.sentiment === "atencao"
        ? [
            "O cliente saiu preocupado na última conversa.",
            "Tópico sensível: evite retomar sem contextualizar.",
          ]
        : [
            "Confirme se os combinados da última sessão foram executados.",
          ],
    questions: [
      `Como foi colocar em prática "${lastSession.nextSteps[0] ?? "os combinados"}"?`,
      "O que mudou desde a última vez que conversamos?",
      "Existe algo novo que apareceu e que precisamos incluir aqui?",
    ],
    tone,
  };
}
