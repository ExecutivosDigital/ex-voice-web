# PREVIEW-INDEX-V2 — Redesign completo do EX Voice

Redesign de todas as telas do produto sob `/v2/*`, usando a paleta e logo originais do EX Voice. Sidebar 240px, topbar minimalista, gravação em 1 clique, padrões familiares de SaaS acessíveis a qualquer idade.

**Sitemap navegável:** [http://localhost:3000/v2](http://localhost:3000/v2)

---

## Core

| Rota | Descrição |
|---|---|
| [/v2](http://localhost:3000/v2) | Índice/sitemap completo (tudo clicável) |
| [/v2/recorder](http://localhost:3000/v2/recorder) | 🎙️ Protótipo da nova modal de gravação (interativo) |
| [/v2/home](http://localhost:3000/v2/home) | Dashboard — próxima consulta + revisões pendentes |

## Gravações e entidades

| Rota | Descrição |
|---|---|
| [/v2/recordings](http://localhost:3000/v2/recordings) | Feed de todas as gravações com filtros |
| [/v2/clients](http://localhost:3000/v2/clients) | Lista de contatos |
| [/v2/clients/c1](http://localhost:3000/v2/clients/c1) | Detalhe do contato (Maria Souza) |
| [/v2/clients/c1/r1](http://localhost:3000/v2/clients/c1/r1) | Consulta — Resumo (markdown) |
| [/v2/clients/c1/r1/overview](http://localhost:3000/v2/clients/c1/r1/overview) | Consulta — Insights |
| [/v2/clients/c1/r1/chat](http://localhost:3000/v2/clients/c1/r1/chat) | Consulta — Chat com IA |
| [/v2/clients/c1/r1/transcription](http://localhost:3000/v2/clients/c1/r1/transcription) | Consulta — Transcrição |

## Lembretes

| Rota | Descrição |
|---|---|
| [/v2/reminders](http://localhost:3000/v2/reminders) | Lista de lembretes (com prioridade) |
| [/v2/reminders/l1](http://localhost:3000/v2/reminders/l1) | Lembrete — Insights |
| [/v2/reminders/l1/chat](http://localhost:3000/v2/reminders/l1/chat) | Lembrete — Chat |

## Estudos

| Rota | Descrição |
|---|---|
| [/v2/studies](http://localhost:3000/v2/studies) | Lista de estudos |
| [/v2/studies/e1](http://localhost:3000/v2/studies/e1) | Estudo — Resumo |
| [/v2/studies/e1/overview](http://localhost:3000/v2/studies/e1/overview) | Estudo — Insights |
| [/v2/studies/e1/chat](http://localhost:3000/v2/studies/e1/chat) | Estudo — Chat |
| [/v2/studies/e1/transcription](http://localhost:3000/v2/studies/e1/transcription) | Estudo — Transcrição |

## Outros

| Rota | Descrição |
|---|---|
| [/v2/others](http://localhost:3000/v2/others) | Lista de outros |
| [/v2/others/o1](http://localhost:3000/v2/others/o1) | Outro — Resumo |
| [/v2/others/o1/overview](http://localhost:3000/v2/others/o1/overview) | Outro — Insights |
| [/v2/others/o1/chat](http://localhost:3000/v2/others/o1/chat) | Outro — Chat |
| [/v2/others/o1/transcription](http://localhost:3000/v2/others/o1/transcription) | Outro — Transcrição |

## Ferramentas

| Rota | Descrição |
|---|---|
| [/v2/chat-business](http://localhost:3000/v2/chat-business) | AI Executivos — chat com sidebar de conversas |
| [/v2/notifications](http://localhost:3000/v2/notifications) | Notificações agrupadas por dia |
| [/v2/plans](http://localhost:3000/v2/plans) | Planos (mensal/anual toggle + 3 cards) |
| [/v2/profile](http://localhost:3000/v2/profile) | Meu Perfil |

## Autenticação (públicas)

| Rota | Descrição |
|---|---|
| [/v2/login](http://localhost:3000/v2/login) | Login (email + Google + Apple) |
| [/v2/register](http://localhost:3000/v2/register) | Criar conta |
| [/v2/reset-password](http://localhost:3000/v2/reset-password) | Esqueci a senha |

---

## Linguagem visual aplicada

| Item | Valor |
|---|---|
| Paleta primária | Gradient `from-neutral-500 to-neutral-900` (EX Voice original) |
| Primário CSS | `#4c4d4e` |
| Acentos de estado | emerald / amber / rose (sucesso / atenção / erro) |
| Background principal | `bg-white` com `bg-neutral-50` pra páginas públicas |
| Tipografia | Poppins 300-700 |
| Logo | `/logos/logo-dark.svg` |
| Shell | Sidebar fixa 240px + topbar minimal 64px com backdrop-blur |
| Cards | Borda sutil, `rounded-xl` a `rounded-2xl`, divide-y em listas |
| Hover actions | Pencil/Copy escondidos até hover do grupo |

## Componentes reutilizados

- `_components/shell.tsx` — sidebar + topbar (usado em todas as páginas privadas)
- `_components/recorder-modal.tsx` — modal de gravar (usado em todas as páginas privadas)
- `_components/list-page.tsx` — skeleton de lista (recordings, clients, reminders, studies, others)
- `_components/recording-tabs.tsx` — barra de abas (Resumo/Insights/Chat/Transcrição)
- `_components/recording-header.tsx` — cabeçalho de detalhe com breadcrumb + metadata
- `_components/section-resumo.tsx` — aba Resumo (markdown)
- `_components/section-insights.tsx` — aba Insights (editorial + floating export)
- `_components/section-chat.tsx` — aba Chat (interativo, com suggestion cards)
- `_components/section-transcription.tsx` — aba Transcrição (bolhas profissional/contato)
- `_components/status-chip.tsx` — chip de status (Pronto/Transcrevendo/Pendente/Solicitar)
- `_components/empty-state.tsx` — estado vazio padronizado
- `_components/public-shell.tsx` — layout pras páginas públicas

## Mocks

Tudo em `src/app/v2/_mocks.ts`: `mockProfile`, `recentClients`, `allClients`, `mockRecordings`, `mockReminders`, `mockStudies`, `mockOthers`, `mockNotifications`, `mockPlans`, `mockTranscriptSegments`, `mockChatMessages`, `mockBusinessMessages`, `mockBusinessConversations`, `overviewSections`, `clientHistory`, `nextAppointments`, `stats`, `personalTypes`, `mockPromptsIA`, `mockChatSuggestions`, `mockBusinessSuggestions`.

## Navegação (tudo conectado)

- **Sidebar** (7 itens): cada link leva a uma das 5 listas + AI Executivos
- **Lista → detalhe**: cada item clica pra sua página de detalhe com IDs mockados (c1, r1, e1, l1, o1)
- **Abas do detalhe**: Resumo ↔ Insights ↔ Chat ↔ Transcrição
- **Breadcrumbs**: cada nível navegável (Contatos → [Nome] → [Gravação] → [Aba])
- **Topbar**: sino → notifications, busca → stub
- **User card sidebar**: → /v2/profile
- **Botão "Nova Gravação" do sidebar**: abre RecorderModal de qualquer tela
- **Páginas públicas**: login ↔ register ↔ reset-password

## Alteração mínima fora de /v2

- `src/middleware.ts`: adicionado `/v2` a `PUBLIC_PATHS` (igual fizemos com `/preview` e `/silencio`). Nenhum outro arquivo real foi modificado.
