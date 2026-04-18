export const mockUser = {
  name: "Dr. Ricardo Almeida",
  email: "ricardo@exvoice.com",
  initials: "RA",
  credits: 320,
  plan: "Trial",
};

export const mockKpis = [
  {
    title: "Quantidade de gravação",
    value: "48",
    subtitle: "no período selecionado",
    trend: { value: 12, isPositive: true },
    icon: "mic",
  },
  {
    title: "Tempo gravado",
    value: "12h 34m",
    subtitle: "total acumulado",
    trend: { value: 8, isPositive: true },
    icon: "clock",
  },
  {
    title: "Contatos atendidos",
    value: "31",
    subtitle: "Contatos únicos",
    trend: { value: 5, isPositive: false },
    icon: "users",
  },
  {
    title: "Tempo por contato",
    value: "24m 18s",
    subtitle: "média por contato",
    trend: { value: 3, isPositive: true },
    icon: "activity",
  },
];

export const mockChartData = [
  { date: "12 abr", recordings: 3 },
  { date: "13 abr", recordings: 5 },
  { date: "14 abr", recordings: 7 },
  { date: "15 abr", recordings: 4 },
  { date: "16 abr", recordings: 9 },
  { date: "17 abr", recordings: 12 },
  { date: "18 abr", recordings: 8 },
];

export const mockMeetings = [
  {
    title: "Alinhamento com João Peixoto",
    time: "14:00",
    date: "Hoje",
    duration: "30 min",
  },
  {
    title: "Consulta — Maria Souza",
    time: "15:30",
    date: "Hoje",
    duration: "45 min",
  },
  {
    title: "Revisão de caso — Pedro Lima",
    time: "09:00",
    date: "Amanhã",
    duration: "60 min",
  },
];

export const mockReminders = [
  {
    title: "Enviar resumo para Maria Souza",
    due: "Hoje, 18:00",
    priority: "alta",
  },
  {
    title: "Retornar ligação — Pedro Lima",
    due: "Amanhã, 10:00",
    priority: "média",
  },
  {
    title: "Revisar transcrição do estudo #214",
    due: "Sex, 14:00",
    priority: "baixa",
  },
];

export const mockContent = [
  {
    title: "Como estruturar melhor seus prompts de resumo",
    category: "Guia",
    readTime: "4 min",
  },
  {
    title: "Novidades da versão 2.3 do EX Voice",
    category: "Changelog",
    readTime: "2 min",
  },
  {
    title: "3 atalhos que aceleram seu fluxo de transcrição",
    category: "Dica",
    readTime: "3 min",
  },
];

export type RecordingType = "Contato" | "Lembrete" | "Estudo" | "Outro";
export type TranscriptionStatus =
  | "PRONTO"
  | "PENDING"
  | "TRANSCRIBING"
  | "NOT_REQUESTED";

export const mockRecordings: {
  id: string;
  type: RecordingType;
  title: string;
  date: string;
  duration: string;
  transcription: TranscriptionStatus;
}[] = [
  {
    id: "r1",
    type: "Contato",
    title: "Primeira consulta — Maria Souza",
    date: "18 abr 2026, 09:15",
    duration: "42m 12s",
    transcription: "PRONTO",
  },
  {
    id: "r2",
    type: "Contato",
    title: "Follow-up — João Peixoto",
    date: "17 abr 2026, 14:30",
    duration: "28m 40s",
    transcription: "PRONTO",
  },
  {
    id: "r3",
    type: "Estudo",
    title: "Estudo de caso — Pedro Lima",
    date: "17 abr 2026, 10:00",
    duration: "1h 12m",
    transcription: "TRANSCRIBING",
  },
  {
    id: "r4",
    type: "Lembrete",
    title: "Retorno — Ana Beatriz",
    date: "16 abr 2026, 16:45",
    duration: "18m 05s",
    transcription: "PENDING",
  },
  {
    id: "r5",
    type: "Outro",
    title: "Reunião de equipe — Semanal",
    date: "15 abr 2026, 11:00",
    duration: "55m 30s",
    transcription: "NOT_REQUESTED",
  },
];

export const mockClients = [
  {
    id: "c1",
    name: "Maria Souza",
    description: "Paciente desde jan/2024 — acompanhamento quinzenal",
    recordings: 12,
  },
  {
    id: "c2",
    name: "João Peixoto",
    description: "Primeira consulta em abr/2026",
    recordings: 2,
  },
  {
    id: "c3",
    name: "Pedro Lima",
    description: "Estudo de caso em andamento",
    recordings: 7,
  },
  {
    id: "c4",
    name: "Ana Beatriz",
    description: "Retorno trimestral",
    recordings: 4,
  },
  {
    id: "c5",
    name: "Carlos Mendes",
    description: "Encaminhado por Dr. Silva",
    recordings: 1,
  },
];

export const mockPlans = [
  {
    id: "autonomo",
    name: "AUTÔNOMO",
    subtitle: "Para profissionais solo começando agora",
    highlight: false,
    pricing: { monthly: 49, yearly: 39 },
    features: [
      { label: "Até 20 gravações por mês", included: true },
      { label: "Transcrição automática", included: true },
      { label: "Resumo com IA padrão", included: true },
      { label: "Personalização de prompts", included: false },
      { label: "Chat com IA ilimitado", included: false },
      { label: "Suporte prioritário", included: false },
    ],
  },
  {
    id: "ultra",
    name: "ULTRA",
    subtitle: "Nosso plano mais popular",
    highlight: true,
    badge: "Mais Popular",
    pricing: { monthly: 129, yearly: 99 },
    features: [
      { label: "Gravações ilimitadas", included: true },
      { label: "Transcrição automática", included: true },
      { label: "Resumo com IA personalizada", included: true },
      { label: "Personalização de prompts", included: true },
      { label: "Chat com IA ilimitado", included: true },
      { label: "Suporte prioritário", included: false },
    ],
  },
  {
    id: "corporativo",
    name: "CORPORATIVO",
    subtitle: "Para times e clínicas",
    highlight: false,
    pricing: { monthly: 399, yearly: 319 },
    features: [
      { label: "Gravações ilimitadas", included: true },
      { label: "Transcrição automática", included: true },
      { label: "Resumo com IA personalizada", included: true },
      { label: "Personalização de prompts", included: true },
      { label: "Chat com IA ilimitado", included: true },
      { label: "Suporte prioritário 24/7", included: true },
    ],
  },
];

export const mockRecording = {
  id: "r1",
  title: "Primeira consulta — Maria Souza",
  client: "Maria Souza",
  date: "18 abr 2026, 09:15",
  duration: "42m 12s",
  status: "PRONTO" as TranscriptionStatus,
  summary: `# Resumo da Consulta

## Queixa Principal
Paciente relata ansiedade recorrente associada a mudanças no ambiente de trabalho, com episódios de insônia nas últimas 3 semanas.

## Histórico
- Sem histórico familiar direto de transtornos de ansiedade.
- Uso ocasional de medicação para dormir (automedicação).
- Pratica atividade física 2x por semana.

## Plano Terapêutico
1. Iniciar acompanhamento semanal
2. Diário de sono + estressores
3. Reavaliar em 30 dias

## Próximos Passos
Agendar retorno em **2 semanas** e compartilhar material de apoio sobre higiene do sono.`,
};

export const mockTranscript: {
  speaker: string;
  role: "profissional" | "contato";
  timestamp: string;
  text: string;
}[] = [
  {
    speaker: "Dr. Ricardo",
    role: "profissional",
    timestamp: "00:00",
    text: "Maria, boa tarde. Como você está hoje? Pode me contar um pouco sobre como foi sua semana?",
  },
  {
    speaker: "Maria Souza",
    role: "contato",
    timestamp: "00:08",
    text: "Oi doutor. Foi difícil, sinceramente. Tive três noites seguidas sem conseguir dormir direito.",
  },
  {
    speaker: "Dr. Ricardo",
    role: "profissional",
    timestamp: "00:18",
    text: "Entendi. Quando você diz sem dormir direito, é que você não consegue pegar no sono ou acorda no meio da noite?",
  },
  {
    speaker: "Maria Souza",
    role: "contato",
    timestamp: "00:27",
    text: "Demoro pra pegar no sono. Fico pensando em trabalho, em e-mails que não respondi, coisas assim.",
  },
  {
    speaker: "Dr. Ricardo",
    role: "profissional",
    timestamp: "00:42",
    text: "Esse padrão se intensificou depois daquela mudança no seu departamento que você me contou?",
  },
  {
    speaker: "Maria Souza",
    role: "contato",
    timestamp: "00:49",
    text: "Bastante. Desde que minha gestora saiu, eu sinto que preciso provar mais, trabalhar até mais tarde.",
  },
];

export const mockChatSuggestions = [
  { id: "s1", name: "Resumir consulta", icon: "sparkles" },
  { id: "s2", name: "Próximos passos", icon: "list" },
  { id: "s3", name: "Tópicos sensíveis", icon: "heart" },
  { id: "s4", name: "Evolução do paciente", icon: "trending-up" },
];

export const mockChatMessages: {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}[] = [
  {
    id: "m1",
    role: "user",
    text: "Quais foram os principais pontos abordados nesta consulta?",
    time: "15:42",
  },
  {
    id: "m2",
    role: "assistant",
    text: "A consulta abordou três pontos principais:\n\n1. **Insônia recorrente** nas últimas 3 semanas, com dificuldade para pegar no sono.\n2. **Mudança no ambiente de trabalho** como gatilho principal, após a saída da gestora direta.\n3. **Padrão de sobrecarga autoimposta**, com extensão de horário e ruminação noturna sobre tarefas pendentes.\n\nFoi proposto diário de sono e reavaliação em 30 dias.",
    time: "15:42",
  },
  {
    id: "m3",
    role: "user",
    text: "E quais são os próximos passos sugeridos?",
    time: "15:43",
  },
  {
    id: "m4",
    role: "assistant",
    text: "Os próximos passos sugeridos foram:\n\n- Iniciar acompanhamento **semanal**\n- Diário de sono e registro de estressores\n- Reavaliação do quadro em **2 semanas**\n- Envio de material de apoio sobre higiene do sono",
    time: "15:43",
  },
];

export const mockOverviewSections = [
  {
    title: "Pontos-chave",
    items: [
      "Insônia recorrente há 3 semanas — dificuldade de iniciar o sono",
      "Gatilho identificado: mudança estrutural no ambiente de trabalho",
      "Ausência de histórico familiar de transtornos de ansiedade",
      "Ruminação cognitiva noturna relacionada a demandas profissionais",
    ],
  },
  {
    title: "Sinais de alerta",
    items: [
      "Automedicação para dormir em 2 das últimas 3 semanas",
      "Aumento progressivo da carga horária autoimposta",
    ],
  },
  {
    title: "Plano terapêutico",
    items: [
      "Acompanhamento semanal por 30 dias",
      "Diário de sono e estressores",
      "Psicoeducação sobre higiene do sono",
      "Reavaliar necessidade de apoio farmacológico em 4 semanas",
    ],
  },
  {
    title: "Temas para próxima sessão",
    items: [
      "Limites e expectativas no novo cenário profissional",
      "Estratégias de desaceleração antes de dormir",
      "Rede de apoio atual (familiar e social)",
    ],
  },
];
