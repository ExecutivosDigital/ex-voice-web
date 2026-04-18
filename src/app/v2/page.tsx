import {
  ArrowRight,
  Bell,
  Bot,
  CreditCard,
  FileText,
  Folder,
  Headphones,
  Home as HomeIcon,
  Lock,
  LogIn,
  Mic,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Route = {
  path: string;
  title: string;
  description: string;
  icon: typeof HomeIcon;
  badge?: string;
};

type Group = {
  title: string;
  description: string;
  routes: Route[];
};

const groups: Group[] = [
  {
    title: "Core",
    description: "As telas principais do dia a dia",
    routes: [
      { path: "/v2/home", title: "Início", description: "Dashboard com próxima consulta e revisões pendentes", icon: HomeIcon },
      { path: "/v2/recorder", title: "Nova Modal de Gravar", description: "Protótipo interativo — 4 passos simplificados", icon: Mic, badge: "Principal" },
    ],
  },
  {
    title: "Gravações e Entidades",
    description: "Listagem e detalhamento",
    routes: [
      { path: "/v2/recordings", title: "Gravações", description: "Feed completo com filtros por tipo", icon: Mic },
      { path: "/v2/clients", title: "Contatos", description: "Lista de todos os contatos", icon: Users },
      { path: "/v2/clients/c1", title: "Detalhe do Contato", description: "Perfil + histórico de sessões (Maria Souza)", icon: User },
      { path: "/v2/clients/c1/r1", title: "Consulta — Resumo", description: "Markdown do resumo gerado pela IA", icon: FileText },
      { path: "/v2/clients/c1/r1/overview", title: "Consulta — Insights", description: "Seções editoriais com pontos-chave", icon: FileText },
      { path: "/v2/clients/c1/r1/chat", title: "Consulta — Chat", description: "Converse com a IA sobre a sessão", icon: Bot },
      { path: "/v2/clients/c1/r1/transcription", title: "Consulta — Transcrição", description: "Bolhas profissional/contato", icon: FileText },
    ],
  },
  {
    title: "Outras entidades",
    description: "Lembretes, Estudos e Outros — mesma estrutura",
    routes: [
      { path: "/v2/reminders", title: "Lembretes", description: "Lista com prioridade", icon: Bell },
      { path: "/v2/reminders/l1", title: "Lembrete — Detalhe", description: "Insights + Chat", icon: Bell },
      { path: "/v2/studies", title: "Estudos", description: "Gravações de aulas e leituras", icon: FileText },
      { path: "/v2/studies/e1", title: "Estudo — Detalhe (4 abas)", description: "Padrões de ansiedade", icon: FileText },
      { path: "/v2/others", title: "Outros", description: "Gravações diversas", icon: Folder },
      { path: "/v2/others/o1", title: "Outro — Detalhe (4 abas)", description: "Reflexão pessoal", icon: Folder },
    ],
  },
  {
    title: "Ferramentas",
    description: "AI, notificações, planos e perfil",
    routes: [
      { path: "/v2/chat-business", title: "AI Executivos", description: "Converse com a IA sobre todo seu consultório", icon: Bot, badge: "Novo" },
      { path: "/v2/notifications", title: "Notificações", description: "Feed agrupado por dia", icon: Bell },
      { path: "/v2/plans", title: "Planos & Assinatura", description: "3 planos com toggle mensal/anual", icon: CreditCard },
      { path: "/v2/profile", title: "Meu Perfil", description: "Editar informações pessoais", icon: User },
    ],
  },
  {
    title: "Autenticação (públicas)",
    description: "Telas sem sidebar, com layout centrado",
    routes: [
      { path: "/v2/login", title: "Login", description: "Entrar com email + senha ou social", icon: LogIn },
      { path: "/v2/register", title: "Registro", description: "Criar conta grátis", icon: UserPlus },
      { path: "/v2/reset-password", title: "Esqueci minha senha", description: "Recuperar por email", icon: Lock },
    ],
  },
];

export default function V2Sitemap() {
  const totalRoutes = groups.reduce((acc, g) => acc + g.routes.length, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Image
            src="/logos/logo-dark.svg"
            alt="EX Voice"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            v2 · sitemap · {totalRoutes} rotas
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Mic className="h-3 w-3" />
            EX Voice — Versão 2
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Todas as telas redesenhadas,
            <br />
            <span className="bg-gradient-to-r from-neutral-500 to-neutral-900 bg-clip-text text-transparent">
              prontas para navegar.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">
            Redesign completo do produto na linguagem v2: sidebar limpa, paleta
            original do EX Voice, tipografia Poppins, gravação em 1 clique.
            Clique em qualquer tela pra explorar — tudo está interconectado.
          </p>
        </div>

        {/* Featured */}
        <div className="mb-16 rounded-2xl border border-neutral-900 bg-neutral-900 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Comece por aqui
              </div>
              <h2 className="text-lg font-semibold">Nova Modal de Gravar</h2>
              <p className="mt-1 text-sm text-white/70">
                Protótipo interativo do novo fluxo de gravação. Clique, grave,
                revise e salve — tudo em 4 passos enxutos.
              </p>
            </div>
            <Link
              href="/v2/recorder"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
            >
              Abrir protótipo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.title}>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-neutral-900">{g.title}</h2>
                <p className="mt-0.5 text-sm text-neutral-500">{g.description}</p>
              </div>
              <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100 bg-white">
                {g.routes.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="group flex items-center gap-4 px-5 py-4 transition hover:bg-neutral-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition group-hover:bg-gradient-to-br group-hover:from-neutral-500 group-hover:to-neutral-900 group-hover:text-white">
                        <r.icon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900">
                            {r.title}
                          </span>
                          {r.badge && (
                            <span className="rounded-md bg-neutral-900 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                              {r.badge}
                            </span>
                          )}
                          <code className="ml-1 font-mono text-[11px] text-neutral-400">
                            {r.path}
                          </code>
                        </div>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {r.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-900" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-neutral-200 pt-8 text-xs text-neutral-500">
          <p>
            <strong className="font-semibold text-neutral-700">
              Paleta:
            </strong>{" "}
            neutros originais do EX Voice (#4c4d4e · gradient neutral-500 →
            neutral-900) ·{" "}
            <strong className="font-semibold text-neutral-700">Tipografia:</strong>{" "}
            Poppins ·{" "}
            <strong className="font-semibold text-neutral-700">Logo:</strong>{" "}
            logo-dark.svg ·{" "}
            <strong className="font-semibold text-neutral-700">Reuso:</strong>{" "}
            Shell, RecorderModal, ListPage, RecordingTabs, Section* (Resumo/Insights/Chat/Transcription)
          </p>
        </div>
      </main>
    </div>
  );
}
