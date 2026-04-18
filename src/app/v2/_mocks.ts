export const mockProfile = {
  name: "Ricardo Almeida",
  firstName: "Ricardo",
  email: "ricardo@exvoice.com",
  phone: "(41) 99999-0000",
  initials: "RA",
  credits: 320,
  plan: "Ultra Anual",
  memberSince: "mar 2025",
};

export const recentClients = [
  { id: "c1", name: "Maria Souza", lastSession: "há 2 semanas", initials: "MS", sessions: 12 },
  { id: "c2", name: "João Peixoto", lastSession: "ontem", initials: "JP", sessions: 3 },
  { id: "c3", name: "Pedro Lima", lastSession: "há 5 dias", initials: "PL", sessions: 7 },
];

export const allClients = [
  ...recentClients,
  { id: "c4", name: "Ana Beatriz", lastSession: "há 3 semanas", initials: "AB", sessions: 4 },
  { id: "c5", name: "Carlos Mendes", lastSession: "há 1 mês", initials: "CM", sessions: 1 },
  { id: "c6", name: "Fernanda Castro", lastSession: "há 6 dias", initials: "FC", sessions: 9 },
];

export const personalTypes = [
  { id: "REMINDER", label: "Lembrete", hint: "Nota rápida pra você lembrar depois" },
  { id: "STUDY", label: "Estudo", hint: "Material de leitura, aula, podcast" },
  { id: "OTHER", label: "Outro", hint: "Qualquer outra coisa" },
];

export type RecordingStatus = "PRONTO" | "TRANSCRIBING" | "PENDING" | "NOT_REQUESTED";

export const mockRecordings: {
  id: string;
  type: "Consulta" | "Lembrete" | "Estudo" | "Outro";
  title: string;
  client: string | null;
  clientId: string | null;
  clientInitials: string;
  date: string;
  duration: string;
  status: RecordingStatus;
}[] = [
  { id: "r1", type: "Consulta", title: "Maria Souza — 1ª consulta", client: "Maria Souza", clientId: "c1", clientInitials: "MS", date: "Hoje, 09:15", duration: "42m 12s", status: "PRONTO" },
  { id: "r2", type: "Consulta", title: "João Peixoto — Follow-up", client: "João Peixoto", clientId: "c2", clientInitials: "JP", date: "Ontem, 14:30", duration: "28m 40s", status: "PRONTO" },
  { id: "r3", type: "Estudo", title: "Padrões de ansiedade — literatura", client: null, clientId: null, clientInitials: "", date: "Ontem, 10:00", duration: "1h 12m", status: "TRANSCRIBING" },
  { id: "r4", type: "Consulta", title: "Ana Beatriz — Retorno trimestral", client: "Ana Beatriz", clientId: "c4", clientInitials: "AB", date: "17 abr, 16:45", duration: "18m 05s", status: "PENDING" },
  { id: "r5", type: "Lembrete", title: "Ligar para o laboratório", client: null, clientId: null, clientInitials: "", date: "16 abr, 11:00", duration: "2m 30s", status: "NOT_REQUESTED" },
  { id: "r6", type: "Consulta", title: "Pedro Lima — Estudo de caso", client: "Pedro Lima", clientId: "c3", clientInitials: "PL", date: "15 abr, 08:30", duration: "55m 20s", status: "PRONTO" },
  { id: "r7", type: "Consulta", title: "Maria Souza — Retorno", client: "Maria Souza", clientId: "c1", clientInitials: "MS", date: "12 abr, 10:00", duration: "38m 15s", status: "PRONTO" },
  { id: "r8", type: "Outro", title: "Gravação casual — reflexão", client: null, clientId: null, clientInitials: "", date: "10 abr, 22:00", duration: "6m 40s", status: "PRONTO" },
];

export const pendingReviewCount = 2;

export const nextAppointments = [
  { time: "14:00", client: "João Peixoto", clientId: "c2", type: "Follow-up", duration: "30 min", in: "em 14min" },
  { time: "15:30", client: "Carlos Mendes", clientId: "c5", type: "1ª consulta", duration: "45 min", in: "em 1h44" },
  { time: "17:00", client: "Maria Souza", clientId: "c1", type: "Retorno", duration: "30 min", in: "em 3h14" },
];

export const stats = {
  thisMonth: 48,
  thisMonthTrend: { value: 12, isPositive: true },
  hours: "12h 34m",
  contacts: 31,
};

export const mockRecording = {
  id: "r1",
  title: "Maria Souza — 1ª consulta",
  client: "Maria Souza",
  clientId: "c1",
  clientInitials: "MS",
  date: "Hoje, 09:15",
  duration: "42m 12s",
  status: "PRONTO" as RecordingStatus,
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

export const clientHistory = [
  { id: "r1", title: "1ª consulta", date: "Hoje, 09:15", duration: "42m 12s", current: true, status: "PRONTO" as RecordingStatus },
  { id: "r7", title: "Retorno agendado", date: "12 abr 2026", duration: "38m 15s", status: "PRONTO" as RecordingStatus },
  { id: "rA", title: "Consulta inicial exploratória", date: "04 abr 2026", duration: "1h 05m", status: "PRONTO" as RecordingStatus },
  { id: "rB", title: "Contato inicial por telefone", date: "22 mar 2026", duration: "12m 30s", status: "PRONTO" as RecordingStatus },
];

export const overviewSections = [
  {
    title: "Pontos-chave da consulta",
    items: [
      "Insônia recorrente há 3 semanas — dificuldade de iniciar o sono",
      "Gatilho identificado: mudança estrutural no ambiente de trabalho",
      "Ausência de histórico familiar de transtornos de ansiedade",
      "Ruminação cognitiva noturna relacionada a demandas profissionais",
    ],
  },
  {
    title: "Sinais de alerta clínicos",
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

export const mockTranscriptSegments: {
  speaker: string;
  role: "profissional" | "contato";
  timestamp: string;
  text: string;
}[] = [
  { speaker: "Dr. Ricardo", role: "profissional", timestamp: "00:00", text: "Maria, boa tarde. Como você está hoje? Pode me contar um pouco sobre como foi sua semana?" },
  { speaker: "Maria Souza", role: "contato", timestamp: "00:08", text: "Oi doutor. Foi difícil, sinceramente. Tive três noites seguidas sem conseguir dormir direito." },
  { speaker: "Dr. Ricardo", role: "profissional", timestamp: "00:18", text: "Entendi. Quando você diz sem dormir direito, é que você não consegue pegar no sono ou acorda no meio da noite?" },
  { speaker: "Maria Souza", role: "contato", timestamp: "00:27", text: "Demoro pra pegar no sono. Fico pensando em trabalho, em e-mails que não respondi, coisas assim." },
  { speaker: "Dr. Ricardo", role: "profissional", timestamp: "00:42", text: "Esse padrão se intensificou depois daquela mudança no seu departamento que você me contou?" },
  { speaker: "Maria Souza", role: "contato", timestamp: "00:49", text: "Bastante. Desde que minha gestora saiu, eu sinto que preciso provar mais, trabalhar até mais tarde." },
  { speaker: "Dr. Ricardo", role: "profissional", timestamp: "01:05", text: "E no fim de semana? Consegue desacelerar nos dias em que não trabalha?" },
  { speaker: "Maria Souza", role: "contato", timestamp: "01:12", text: "Nem tanto. Parece que o meu corpo não esquece o ritmo da semana. Eu acordo cedo mesmo querendo dormir mais." },
];

export const mockChatSuggestions = [
  { id: "s1", name: "Resumir consulta", icon: "Sparkles" },
  { id: "s2", name: "Próximos passos", icon: "List" },
  { id: "s3", name: "Tópicos sensíveis", icon: "Heart" },
  { id: "s4", name: "Evolução do paciente", icon: "TrendingUp" },
];

export const mockChatMessages: {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}[] = [
  { id: "m1", role: "user", text: "Quais foram os principais pontos abordados nesta consulta?", time: "15:42" },
  { id: "m2", role: "assistant", text: "A consulta abordou três pontos principais:\n\n1. **Insônia recorrente** nas últimas 3 semanas, com dificuldade para pegar no sono.\n2. **Mudança no ambiente de trabalho** como gatilho principal, após a saída da gestora direta.\n3. **Padrão de sobrecarga autoimposta**, com extensão de horário e ruminação noturna.\n\nFoi proposto diário de sono e reavaliação em 30 dias.", time: "15:42" },
  { id: "m3", role: "user", text: "E quais são os próximos passos sugeridos?", time: "15:43" },
  { id: "m4", role: "assistant", text: "Os próximos passos sugeridos foram:\n\n- Iniciar acompanhamento **semanal**\n- Diário de sono e registro de estressores\n- Reavaliação do quadro em **2 semanas**\n- Envio de material de apoio sobre higiene do sono", time: "15:43" },
];

// Reminders
export type Priority = "alta" | "média" | "baixa";

export const mockReminders: {
  id: string;
  title: string;
  date: string;
  due: string;
  priority: Priority;
  status: RecordingStatus;
  duration: string;
}[] = [
  { id: "l1", title: "Enviar resumo para Maria Souza", date: "Hoje, 18:00", due: "Hoje, 18:00", priority: "alta", status: "PRONTO", duration: "1m 20s" },
  { id: "l2", title: "Retornar ligação — Pedro Lima", date: "Amanhã, 10:00", due: "Amanhã, 10:00", priority: "média", status: "PRONTO", duration: "45s" },
  { id: "l3", title: "Revisar transcrição do estudo #214", date: "Sex, 14:00", due: "Sex, 14:00", priority: "baixa", status: "TRANSCRIBING", duration: "2m 10s" },
  { id: "l4", title: "Agendar reunião com equipe", date: "Seg, 09:00", due: "Seg, 09:00", priority: "média", status: "PRONTO", duration: "1m 05s" },
  { id: "l5", title: "Comprar material do consultório", date: "24 abr, 17:00", due: "24 abr, 17:00", priority: "baixa", status: "NOT_REQUESTED", duration: "30s" },
];

// Studies
export const mockStudies: {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: RecordingStatus;
  topic: string;
}[] = [
  { id: "e1", title: "Padrões de ansiedade — literatura", date: "Ontem, 10:00", duration: "1h 12m", status: "TRANSCRIBING", topic: "Psicologia" },
  { id: "e2", title: "TCC aplicada a insônia", date: "15 abr 2026", duration: "48m", status: "PRONTO", topic: "Terapia" },
  { id: "e3", title: "Mindfulness em consultório", date: "10 abr 2026", duration: "32m", status: "PRONTO", topic: "Intervenções" },
  { id: "e4", title: "Neuropsicologia do sono", date: "02 abr 2026", duration: "1h 28m", status: "PRONTO", topic: "Neuro" },
];

// Others
export const mockOthers: {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: RecordingStatus;
}[] = [
  { id: "o1", title: "Reflexão pessoal — semana", date: "10 abr, 22:00", duration: "6m 40s", status: "PRONTO" },
  { id: "o2", title: "Rascunho de aula", date: "05 abr, 08:15", duration: "12m", status: "PRONTO" },
  { id: "o3", title: "Ideia de projeto — CRM integrado", date: "28 mar, 14:00", duration: "4m 20s", status: "PENDING" },
];

// Notifications
export type NotificationType = "transcription" | "recording" | "plan" | "reminder" | "system";

export const mockNotifications: {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  group: "hoje" | "ontem" | "semana";
  href?: string;
}[] = [
  { id: "n1", type: "transcription", title: "Transcrição pronta", description: "Maria Souza — 1ª consulta foi transcrita e o resumo está disponível.", time: "há 5 min", unread: true, group: "hoje", href: "/v2/clients/c1/r1" },
  { id: "n2", type: "reminder", title: "Lembrete vencendo", description: "Enviar resumo para Maria Souza — vence hoje às 18:00.", time: "há 1h", unread: true, group: "hoje", href: "/v2/reminders/l1" },
  { id: "n3", type: "recording", title: "Gravação salva", description: "João Peixoto — Follow-up foi salva e está na fila de transcrição.", time: "ontem, 14:35", unread: false, group: "ontem", href: "/v2/clients/c2/r2" },
  { id: "n4", type: "plan", title: "Trial termina em 7 dias", description: "Aproveite 25% de desconto no plano Anual nos próximos 3 dias.", time: "ontem, 10:00", unread: false, group: "ontem", href: "/v2/plans" },
  { id: "n5", type: "system", title: "Nova funcionalidade: AI Executivos", description: "Faça perguntas sobre suas gravações e receba respostas contextualizadas.", time: "14 abr", unread: false, group: "semana", href: "/v2/chat-business" },
];

// Plans
export const mockPlans = [
  {
    id: "autonomo",
    name: "Autônomo",
    subtitle: "Para profissionais começando",
    monthly: 49,
    yearly: 39,
    highlight: false,
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
    name: "Ultra",
    subtitle: "Nosso plano mais escolhido",
    monthly: 129,
    yearly: 99,
    highlight: true,
    badge: "Mais Popular",
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
    name: "Corporativo",
    subtitle: "Para times e clínicas",
    monthly: 399,
    yearly: 319,
    highlight: false,
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

// Prompts IA (for Solicitar Transcrição modal)
export const mockPromptsIA = [
  { id: "p1", name: "IA Padrão", source: "IA Padrão", description: "Resumo padrão da plataforma" },
  { id: "p2", name: "Consulta Psicológica", source: "Pessoal", description: "Focado em queixa, plano terapêutico e próximos passos" },
  { id: "p3", name: "Consultório Clínica A", source: "Empresa", description: "Prompt personalizado da sua clínica" },
  { id: "p4", name: "Reunião de Equipe", source: "Global", description: "Decisões, próximos passos, action items" },
];

// Chat Business — AI Executivos
export const mockBusinessConversations = [
  { id: "b1", title: "Padrões nas consultas desta semana", date: "Hoje", preview: "Identificamos 3 pacientes com temas relacionados a ansiedade no trabalho..." },
  { id: "b2", title: "Resumo executivo — março", date: "Ontem", preview: "No mês, você realizou 48 consultas com média de 42min por sessão..." },
  { id: "b3", title: "Evolução — Maria Souza", date: "15 abr", preview: "Desde a 1ª consulta, Maria apresentou melhora em 4 de 6 indicadores..." },
  { id: "b4", title: "Sugestões de material para estudos", date: "10 abr", preview: "Com base nos últimos estudos, sugerimos 5 artigos sobre TCC aplicada..." },
];

export const mockBusinessSuggestions = [
  { id: "bs1", name: "Resumo executivo do mês", icon: "TrendingUp" },
  { id: "bs2", name: "Padrões nas últimas consultas", icon: "Sparkles" },
  { id: "bs3", name: "Evolução de um paciente", icon: "Heart" },
  { id: "bs4", name: "Sugestões de estudos", icon: "BookOpen" },
];

export const mockBusinessMessages: {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}[] = [
  { id: "bm1", role: "user", text: "Me dá um resumo dos principais temas das minhas últimas 10 consultas.", time: "14:20" },
  { id: "bm2", role: "assistant", text: "Analisei suas últimas 10 consultas. Os temas mais recorrentes foram:\n\n1. **Ansiedade relacionada ao trabalho** — em 6 de 10 sessões\n2. **Distúrbios de sono** — em 5 sessões, todas correlacionadas com o item anterior\n3. **Conflito familiar** — em 3 sessões, sendo 2 do mesmo paciente\n\nSe quiser, posso detalhar cada tema ou sugerir intervenções comuns baseadas na literatura.", time: "14:20" },
  { id: "bm3", role: "user", text: "Detalha o tema de ansiedade no trabalho.", time: "14:22" },
  { id: "bm4", role: "assistant", text: "Entre os 6 pacientes com relatos de **ansiedade no trabalho**, identifiquei padrões comuns:\n\n- Todos relatam aumento recente da carga horária\n- 4 dos 6 mencionam mudanças de liderança/estrutura\n- 5 relatam insônia associada (ruminação noturna)\n- 3 relatam sintomas somáticos (dor muscular, taquicardia)\n\nRecomendo revisar o plano terapêutico com foco em **regulação emocional** e **higiene do sono**.", time: "14:22" },
];

export type TabKey = "resumo" | "overview" | "chat" | "transcription";
