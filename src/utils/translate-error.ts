/**
 * Traduz mensagens de erro da API (muitas em inglês, herança do template) para
 * PT-BR amigável. Cobre os casos que aparecem no fluxo corporativo; o que não
 * casar volta como veio. Pedido do Victor na validação (§5.1).
 */

const EXACT: Record<string, string> = {
  "User with this email already exists": "Já existe um usuário com este e-mail.",
  "Email already in use": "Este e-mail já está em uso.",
  "Recording already shared with this user":
    "Esta gravação já está compartilhada com essa pessoa.",
  "Term already exists in this scope":
    "Este termo já existe neste escopo.",
  "Cannot share a recording with yourself":
    "Você não pode compartilhar uma gravação com você mesmo.",
  "User not found": "Usuário não encontrado.",
  "Recording not found": "Gravação não encontrada.",
  "Company not found": "Empresa não encontrada.",
  "Prompt not found": "IA não encontrada.",
  Unauthorized: "Sessão expirada. Faça login novamente.",
  Forbidden: "Você não tem permissão para esta ação.",
};

const PATTERNS: { re: RegExp; pt: string }[] = [
  { re: /already exists/i, pt: "Este registro já existe." },
  { re: /does not belong to (this|your) company/i, pt: "Este item não pertence à sua empresa." },
  { re: /must belong to the same company/i, pt: "A pessoa precisa ser da mesma empresa." },
  { re: /has (recordings|departments|IAs).*before/i, pt: "Há itens vinculados — remova-os antes." },
  { re: /no transcription/i, pt: "Esta gravação ainda não tem transcrição." },
  { re: /required/i, pt: "Preencha os campos obrigatórios." },
  { re: /invalid/i, pt: "Dados inválidos. Verifique os campos." },
];

export function translateError(
  message: string | undefined | null,
  fallback = "Não foi possível concluir. Tente novamente.",
): string {
  if (!message) return fallback;
  const msg = String(message).trim();
  if (EXACT[msg]) return EXACT[msg];
  for (const { re, pt } of PATTERNS) {
    if (re.test(msg)) return pt;
  }
  // Se ainda parecer inglês técnico, usa o fallback; senão devolve como veio (pode já ser PT)
  return /[a-z]/i.test(msg) && /\b(the|does|not|already|must|belong|user|company)\b/i.test(msg)
    ? fallback
    : msg;
}
