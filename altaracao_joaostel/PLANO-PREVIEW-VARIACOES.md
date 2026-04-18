# PLANO: Mockups Visuais de Telas — Next.js + shadcn/ui

## Contexto
- **Stack:** Next.js + shadcn/ui + Tailwind (já instalados).
- **Objetivo:** criar versões puramente visuais de 8 telas em 3 estilos diferentes.
- **Escopo:** **apenas visual.** Sem API, sem state real, sem hooks de dados, sem auth, sem nada funcional. Dados 100% mockados inline.
- **Estilos:** Minimalista, Monocromático, Corporate UI Software.

## Telas-alvo (8)

| # | Rota original | Nome curto |
|---|---|---|
| 1 | `/` | `home` |
| 2 | `/recordings` | `recordings` |
| 3 | `/clients` | `clients` |
| 4 | `/plans` | `plans` |
| 5 | `/clients/[c]/[r]` | `recording` |
| 6 | `/clients/[c]/[r]/transcription` | `transcription` |
| 7 | `/clients/[c]/[r]/chat` | `chat` |
| 8 | `/clients/[c]/[r]/overview` | `overview` |

## Convenção de URLs das variações
Tudo sob `/preview/` pra isolar das rotas reais:

```
/preview/home-minimalista
/preview/home-monocromatico
/preview/home-corporate
/preview/recordings-minimalista
... etc
/preview/overview-corporate
```

Total: **8 telas × 3 estilos = 24 rotas de preview.**

Os IDs dos params `[clientId]/[recordingId]` são ignorados — as rotas `recording`, `transcription`, `chat`, `overview` são flat no preview e usam dados mockados.

## Fase 1 — Inspeção visual (rápida, só olhar)
Para cada tela-alvo, o Claude Code deve:
1. Abrir o `page.tsx` correspondente e os componentes visuais que ela renderiza.
2. Anotar num arquivo único `PREVIEW-MAP.md`:
   - Estrutura de layout (sidebar? topbar? grid? colunas?).
   - Lista de blocos visuais (ex: "card de estatística", "tabela de clientes com 5 colunas", "input de busca + botão novo").
   - Tipos de dados exibidos (nome do cliente, data, duração, status...).
3. **Não ler lógica, hooks, actions, nem APIs.** Só ver o que aparece na tela.

Esse mapa é a única referência pra criar os mockups. Nenhum código da aplicação real é reutilizado.

## Fase 2 — Estrutura de arquivos

```
app/
  preview/
    _mocks/
      data.ts                  ← todos os dados fake (clientes, gravações, etc.)
    _components/
      minimalista/             ← primitivos visuais do estilo
      monocromatico/
      corporate/
    home-minimalista/page.tsx
    home-monocromatico/page.tsx
    home-corporate/page.tsx
    recordings-minimalista/page.tsx
    ...
    overview-corporate/page.tsx
```

Cada `page.tsx` é um **Server Component estático** — só JSX + mock data, sem `"use client"` a menos que precise de um toggle visual trivial (ex: tab ativa).

## Fase 3 — Tokens por estilo

### Minimalista
- **Paleta:** branco, preto, 1 cinza neutro, 1 accent discreto.
- **Tipografia:** Inter ou Geist, pesos 400/500. Line-height 1.6+.
- **Espaçamento:** amplo (p-6 a p-12, gap-8+).
- **Componentes:** sem sombras, bordas sutis ou inexistentes, `rounded-md`.
- **Hierarquia:** por tipografia e whitespace, não por cor.
- **Referência:** Linear, Vercel, Stripe Docs.

### Monocromático
- **Paleta:** uma única escala de cinza (neutral-50 → neutral-950). **Zero accent colorido.**
- **Tipografia:** serifada em títulos (Instrument Serif, Fraunces) + sans no corpo.
- **Contraste por valor**, não por matiz. Estados hover/active são tons diferentes do mesmo cinza.
- **Layout:** sensação editorial, colunas controladas.
- **Referência:** Readwise, Ghost, Are.na.

### Corporate UI Software
- **Paleta:** azul primário (`blue-600`), cinzas, verde/amarelo/vermelho de status.
- **Tipografia:** Inter densa, 13–14px em tabelas, pesos 400/500/600.
- **Espaçamento:** compacto, information-dense. Tabelas com zebra e filtros.
- **Layout:** sidebar fixa esquerda (~240px) + topbar com breadcrumb + main com cards/tabelas.
- **Componentes:** badges de status, botões primários sólidos, data-table shadcn, breadcrumbs.
- **Referência:** Jira, Linear, Retool, Salesforce Lightning.

## Fase 4 — Execução
Ordem: **uma tela por vez, nas 3 variações, antes de passar pra próxima.**

Por tela:
1. Ler o bloco correspondente no `PREVIEW-MAP.md`.
2. Definir o mock data necessário em `app/preview/_mocks/data.ts` (se ainda não existir).
3. Criar as 3 `page.tsx` nas respectivas pastas.
4. Usar componentes shadcn/ui existentes agressivamente. Se faltar algum (ex: `data-table`, `breadcrumb`, `sidebar`), instalar via `npx shadcn@latest add [nome]`.
5. Rodar `pnpm build` no fim de cada bloco de 3 variações. Se quebrar, corrigir antes de seguir.

## Fase 5 — Entregável final
Gerar um `PREVIEW-INDEX.md` na raiz com:
- Lista das 24 URLs geradas, agrupadas por tela.
- Para cada tela, os 3 links lado a lado pra comparação rápida.

## Regras inegociáveis
- **Nada de lógica real.** Zero API calls, zero hooks de dados, zero server actions, zero auth. Tudo mock inline.
- **Não tocar na tela original.** Rotas de preview vivem em `/preview/*`, totalmente paralelas.
- **Não instalar dependências novas** além de componentes shadcn. Fontes via `next/font/google`.
- **Responsivo** (mobile + desktop) nas 3 variações.
- **Dark mode** só se a home original tiver; senão, ignorar.
- **Consistência interna:** todas as telas da mesma família devem usar os mesmos primitivos visuais (botão, card, input) — extrair pra `_components/[familia]/`.
