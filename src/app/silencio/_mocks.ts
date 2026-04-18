export const recentClients = [
  { id: "c1", name: "Maria Souza", lastSession: "há 2 semanas", initials: "MS" },
  { id: "c2", name: "João Peixoto", lastSession: "ontem", initials: "JP" },
  { id: "c3", name: "Pedro Lima", lastSession: "há 5 dias", initials: "PL" },
];

export const allClients = [
  ...recentClients,
  { id: "c4", name: "Ana Beatriz", lastSession: "há 3 semanas", initials: "AB" },
  { id: "c5", name: "Carlos Mendes", lastSession: "há 1 mês", initials: "CM" },
  { id: "c6", name: "Fernanda Castro", lastSession: "há 6 dias", initials: "FC" },
];

export const personalTypes = [
  { id: "REMINDER", label: "Lembrete", hint: "Nota rápida pra você depois" },
  { id: "STUDY", label: "Estudo", hint: "Material de leitura, aulas" },
  { id: "OTHER", label: "Outro", hint: "Qualquer outra coisa" },
];
