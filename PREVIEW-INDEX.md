# PREVIEW INDEX — 24 mockups visuais

8 telas × 3 estilos (Minimalista / Monocromático / Corporate UI Software).

Mockups **puramente visuais**, sem lógica, sem API, sem auth. Todo botão, filtro, modal, estado vazio e ação do app real está reproduzido — a variação é apenas de linguagem visual.

Todas as rotas sob `/preview/*` em `localhost:3000`.

---

## 1. home — Dashboard

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/home-minimalista |
| Monocromático | http://localhost:3000/preview/home-monocromatico |
| Corporate UI | http://localhost:3000/preview/home-corporate |

Elementos: topbar (logo, créditos, "Baixar o App", sino, Gravar, avatar), breadcrumb, saudação, DateRangePicker, banner de upgrade "TRIAL ATIVO", 4 KPI cards com trend, gráfico "Gravações últimos 7 dias", "Próximas Reuniões" com overlay "Em Breve" + "Conectar com Google", "Lembretes", "Aprenda com a gente" (ContentPanel).

## 2. recordings — Últimas Gravações

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/recordings-minimalista |
| Monocromático | http://localhost:3000/preview/recordings-monocromatico |
| Corporate UI | http://localhost:3000/preview/recordings-corporate |

Elementos: busca, 4 filtros de tipo (Contato/Lembretes/Estudos/Outros), tabela 6 colunas (Tipo/Título/Data/Tempo/Transcrição/Ações) com sort icons, 4 badges de status (Pronta/Transcrevendo/Pendente/Não solicitada), paginação, estado vazio com CTA "Gravar".

## 3. clients — Seus Contatos

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/clients-minimalista |
| Monocromático | http://localhost:3000/preview/clients-monocromatico |
| Corporate UI | http://localhost:3000/preview/clients-corporate |

Elementos: busca, CTA "Novo Contato", tabela (Nome/Descrição/Gravações/Ações) com sort, paginação, estado vazio, painel **CreateClientSheet** com campos (Nome, Email, Telefone, Descrição).

## 4. plans — Planos & Assinatura

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/plans-minimalista |
| Monocromático | http://localhost:3000/preview/plans-monocromatico |
| Corporate UI | http://localhost:3000/preview/plans-corporate |

Elementos: 3 cards (Autônomo/Ultra "Mais Popular"/Corporativo) com features check/X + preço, toggle Mensal/Anual, checkout tabs PIX/Cartão, CardPreview, campos (Nome, CPF, Email, Telefone, CEP, Estado, Cidade, Rua, Número, Complemento), Free plan banner "100% OFF", PixGeneratedView (QR + código copiável + "Já realizei o pagamento" + polling), SuccessView "Parabéns!".

## 5. recording — Resumo da gravação

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/recording-minimalista |
| Monocromático | http://localhost:3000/preview/recording-monocromatico |
| Corporate UI | http://localhost:3000/preview/recording-corporate |

Elementos: header + duração + tabs (Geral/Transcrição/Chat/Insights), **3 estados** (READY markdown / PENDING "A Mágica está acontecendo" / NOT_REQUESTED com ícone FileText+Wand2+Sparkles), CTA "Solicitar Transcrição", modal **RequestTranscription** (busca "Buscar IA…" + prompts com badges Padrão/Pessoal/Empresa/Global + radio + CTA "Confirmar seleção de IA: …").

## 6. transcription — Transcrição

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/transcription-minimalista |
| Monocromático | http://localhost:3000/preview/transcription-monocromatico |
| Corporate UI | http://localhost:3000/preview/transcription-corporate |

Elementos: bolhas profissional (direita) / contato (esquerda) com avatar, timestamp, legenda, CTA "Organizar Locutores", modal **de organização** (grip drag, avatar-button com Briefcase, edição inline com Pencil, check selecionado, botão "Salvar"), **3 estados** (READY 6 segmentos / Processando / Não disponível com waveform + CTA "Solicitar Transcrição"), scroll-to-top fixo.

## 7. chat — Assistente Executivo

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/chat-minimalista |
| Monocromático | http://localhost:3000/preview/chat-monocromatico |
| Corporate UI | http://localhost:3000/preview/chat-corporate |

Elementos: header + "Analisando: [nome]", CTA "Nova Conversa", botão Expand/Minimize, **3 modos** (Chat ativo user+AI+TypingDots+copy / Empty com grid 4 SuggestionCards / Modo sugestão ativado), **ChatInput** (textarea + Paperclip + Mic + Send), **3 estados** (Gravando pulse / Arquivo anexado / Áudio pendente com waveform).

## 8. overview — Insights

| Estilo | URL |
|---|---|
| Minimalista | http://localhost:3000/preview/overview-minimalista |
| Monocromático | http://localhost:3000/preview/overview-monocromatico |
| Corporate UI | http://localhost:3000/preview/overview-corporate |

Elementos: header + tabs + 2 CTAs ("Personalizar Insights" + "Exportar em PDF"), seções dinâmicas (**DynamicComponentRenderer**) com cards editáveis (botões Pencil + Copy), loading + empty states, footer com 2º Exportar, **PersonalizationModal wizard** (3 steps: Personalização → Recursos → Contato, com "Voltar/Continuar/Fechar" + CTA final "Fale Conosco" WhatsApp).

---

## Comparação lado-a-lado rápida

Para confrontar as 3 linguagens visuais na mesma tela, abra cada trio junto (Cmd+Click em cada link) — a ordem dos estilos é sempre **Minimalista / Monocromático / Corporate UI**.

## Rodar local

Dev server já sobe na `:3000`. Se não estiver rodando:

```bash
yarn dev
```

E abra qualquer uma das 24 URLs acima.

## Nota de integração

Foi adicionado `/preview` a `PUBLIC_PATHS` em `src/middleware.ts` para que as rotas de preview abram em qualquer estado de autenticação. **Nenhuma outra rota ou arquivo real foi modificado.**
