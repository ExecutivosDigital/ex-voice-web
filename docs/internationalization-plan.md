# Plano de Internacionalização — ex-voice-web

> **Data da análise:** 04/05/2026  
> **Status atual do sistema:** Monolíngue (pt-BR), sem infraestrutura de i18n  
> **Objetivo:** Tornar o sistema funcional para qualquer idioma e mercado internacional

---

## Sumário

1. [Diagnóstico Geral](#1-diagnóstico-geral)
2. [Pagamento — Ponto Crítico #1](#2-pagamento--ponto-crítico-1)
3. [Textos e Strings — Ponto Crítico #2](#3-textos-e-strings--ponto-crítico-2)
4. [Formatos Regionais — Ponto Crítico #3](#4-formatos-regionais--ponto-crítico-3)
5. [Datas e Horários](#5-datas-e-horários)
6. [Conformidade Legal e Privacidade](#6-conformidade-legal-e-privacidade)
7. [Roteamento e URLs](#7-roteamento-e-urls)
8. [Modelo de Dados do Usuário](#8-modelo-de-dados-do-usuário)
9. [Integrações Externas e IA](#9-integrações-externas-e-ia)
10. [Conteúdo de Marketing e SEO](#10-conteúdo-de-marketing-e-seo)
11. [Suporte RTL](#11-suporte-rtl)
12. [Resumo dos Gaps](#12-resumo-dos-gaps)
13. [Plano de Ação](#13-plano-de-ação)

---

## 1. Diagnóstico Geral

O sistema está **100% acoplado ao mercado brasileiro**. Não existe nenhuma camada de abstração para idioma, moeda, formato de dados ou regulação. A internacionalização não é uma configuração que se troca — é uma refatoração estrutural que precisa acontecer em camadas.

**Stack atual relevante:**
- Next.js 16 com App Router
- TypeScript + React 19
- Tailwind CSS 4
- React Hook Form + Zod
- date-fns + Moment.js (ambos hardcoded pt-BR)
- Sem nenhuma biblioteca de i18n instalada

**Resumo do estado atual:**

| Área | Status | Nível de Risco |
|------|--------|----------------|
| Pagamento | PIX + BRL exclusivamente | 🔴 Crítico |
| Textos/UI | 200+ strings hardcoded em pt-BR | 🔴 Crítico |
| Moeda/Número | Formatação hardcoded pt-BR | 🔴 Crítico |
| Formatos regionais | CPF, CEP, telefone BR | 🔴 Crítico |
| Datas | Locale fixo pt-BR | 🟠 Alto |
| Conformidade legal | Apenas LGPD | 🟠 Alto |
| Roteamento | Sem prefixo de locale | 🟠 Alto |
| Modelo do usuário | Campos brasileiros | 🟠 Alto |
| Integrações IA | Idioma provavelmente fixo | 🟡 Médio |
| Marketing/SEO | Conteúdo hardcoded pt-BR | 🟡 Médio |
| RTL | Parcial (só alguns componentes) | 🟢 Baixo |

---

## 2. Pagamento — Ponto Crítico #1

### Problema

O sistema de pagamento é inteiramente brasileiro e não tem equivalente direto em outros países.

- **PIX** é um método de pagamento exclusivo do Banco Central do Brasil — não existe fora do Brasil.
- A moeda está hardcoded como `BRL` com formatação `pt-BR` em todo o codebase:
  ```ts
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  ```
- O schema de preços dos planos tem campos fixos: `pixMonthlyPrice`, `pixYearlyPrice`, `creditMonthlyPrice`, `creditYearlyPrice` — sem suporte a multi-moeda.
- O toggle "PIX / Cartão" está embutido na UI como feature central do produto.
- O backend retorna os preços já formatados em BRL.

### Gaps Identificados

- Sem gateway de pagamento internacional (Stripe, PayPal, Adyen).
- Sem abstração de método de pagamento — cada método está acoplado diretamente ao backend e às telas.
- Sem conversão ou seleção de moeda.
- Sem suporte a métodos locais internacionais (SEPA, ACH, BACS, Boleto já é BR também).

### Impacto

Um usuário fora do Brasil não consegue pagar. Ponto final.

---

## 3. Textos e Strings — Ponto Crítico #2

### Problema

Aproximadamente **200+ strings hardcoded** em português distribuídas por todos os componentes. Nenhuma biblioteca de i18n instalada.

### Localização das strings hardcoded

**Autenticação (`/login`, `/register`, `/reset-password`):**
- `"Sua Assistente Inteligente"`, `"Acesse sua conta"`, `"Bem-vindo de volta!"`
- `"Não tem uma conta? Cadastre-se"`, `"Voltar ao login"`
- Erros: `"Credenciais inválidas"`, `"Erro interno do servidor"`, `"Sem conexão"`
- `"Muitas tentativas. Tente novamente em alguns minutos."`

**Registro:**
- `"Crie sua conta"`, `"Preencha seus dados para começar gratuitamente."`
- Validações Zod: `"Nome deve ter pelo menos 2 caracteres"`, `"Email Inválido"`, `"Senhas não coincidem"`
- `"Este e-mail já está cadastrado."`, `"Conta criada com sucesso!"`

**Planos e Preços:**
- `"Escolha o plano que trabalha por você"`, `"7 dias de garantia"`
- Ciclos: `"Mensal"` / `"Anual"`, Métodos: `"PIX"` / `"Cartão"`
- Nomes dos planos: `"Autônomo"`, `"Ultra"`, `"Corporativo"`
- `"Mais popular"`, `"Uso ilimitado"`, `"Gravação incluída"`, `"/mês"`
- FAQs completas (5 perguntas e respostas extensas, hardcoded)
- Depoimentos de 3 clientes (nome, cargo, empresa — hardcoded)
- Badges de confiança: `"Garantia 7 dias"`, `"LGPD"`, `"Suporte Rápido"`

**Checkout e Pagamento:**
- `"Preencha todos os campos do cartão."`, `"Não foi possível carregar os planos."`
- `"Código PIX copiado!"`, `"Gerando código PIX..."`, `"Não foi possível gerar o PIX."`
- `"Pagamento realizado com sucesso!"`, `"Erro ao processar pagamento com cartão"`

**Componentes gerais:**
- `"Conteúdo copiado para a área de transferência!"`, `"Somente letras"`

### Gaps Identificados

- Zero infraestrutura de tradução — nenhum arquivo `.json` de locale, nenhuma biblioteca instalada.
- Strings de validação (Zod) estão acopladas ao schema — não passam por nenhuma camada de tradução.
- Mensagens de erro do backend chegam em português e são exibidas diretamente.
- Não existe mapeamento de chaves de tradução — seria necessário extrair e nomear cada string manualmente.

---

## 4. Formatos Regionais — Ponto Crítico #3

### Problema

Três tipos de dados são estritamente brasileiros e não funcionam para nenhum outro país.

| Campo | Formato Atual (Brasil) | Problema Internacional |
|-------|------------------------|------------------------|
| CPF/CNPJ | `XXX.XXX.XXX-XX` / `XX.XXX.XXX/XXXX-XX` | Documento fiscal exclusivo do Brasil. Cada país tem o seu (VAT, SSN, NIN, RFC, etc.) |
| CEP | `XXXXX-XXX` | Formato brasileiro. UK: `SW1A 1AA`, EUA: `XXXXX-XXXX`, Alemanha: `XXXXX` |
| Telefone | `(XX) XXXXX-XXXX` | Padrão de 11 dígitos brasileiro. Internacional: `+CC (XX) XXXXX-XXXX` via E.164 |
| Moeda | `R$ X.XXX,XX` | Ponto como separador de milhar, vírgula decimal — inverso ao padrão americano/europeu |

### Funções afetadas

- `maskCpfCnpj(value)` — utilitário exclusivo BR
- `maskPhoneBR(value)` — utilitário exclusivo BR
- `maskCep(value)` — utilitário exclusivo BR
- Todas as chamadas `Intl.NumberFormat("pt-BR", ...)` — hardcoded

### Gaps Identificados

- As funções de máscara estão espalhadas pelo codebase e acopladas às telas de formulário.
- O campo CPF/CNPJ existe no modelo de usuário (`User.cpfCnpj`) — precisaria ser generalizado no banco de dados.
- Sem biblioteca de formatação de telefone internacional (`libphonenumber-js` ou similar).
- Sem validação de código postal por país.

---

## 5. Datas e Horários

### Problema

Toda formatação de data está hardcoded em `pt-BR` com duas bibliotecas diferentes.

- Moment.js configurado explicitamente: `moment.locale("pt-br")` — em múltiplos arquivos.
- Chamadas `toLocaleDateString` sempre com `"pt-BR"` como argumento fixo.
- Formato padrão `DD/MM/YYYY` — os EUA usam `MM/DD/YYYY`, causando confusão direta.
- Sem tratamento explícito de timezone — usa o timezone do browser.
- O Moment.js é considerado legacy (sem novas features desde 2020).

### Arquivos afetados

- `src/app/(private)/agenda/components/day-view.tsx`
- `src/app/(private)/agenda/components/pre-meeting-modal.tsx`
- `src/app/(private)/agenda/page.tsx`
- `src/app/(private)/agenda-2/page.tsx`
- `src/app/(private)/clients/page.tsx`
- `src/app/(private)/recordings/page.tsx`
- `src/app/(private)/recordings/[id]/components/hero.tsx`
- `src/app/(private)/clients/2/(selected-appointment)/[id]/utils/pdfOverviewGenerator.ts`

### Gaps Identificados

- Locale de data não é dinâmico — não detecta o idioma do usuário.
- Sem gestão de timezone para usuários em fusos diferentes.
- Duas bibliotecas de data fazendo a mesma coisa (date-fns e Moment.js) — inconsistência.

---

## 6. Conformidade Legal e Privacidade

### Problema

O sistema menciona explicitamente conformidade com **LGPD** (Lei Geral de Proteção de Dados — lei brasileira). Cada mercado tem sua própria regulação, e o sistema lida com dados sensíveis (gravações e transcrições de sessões).

| Mercado | Regulação | Exigências principais |
|---------|-----------|----------------------|
| Brasil | LGPD | Consentimento, direito ao esquecimento, DPO opcional |
| Europa | GDPR | Consentimento explícito, DPO obrigatório em alguns casos, transferência de dados restrita |
| EUA (geral) | CCPA (Califórnia) | Direito de opt-out, divulgação de dados coletados |
| EUA (saúde) | HIPAA | Dados de saúde têm proteção especial — relevante se atender psicólogos/médicos |
| Reino Unido | UK GDPR | GDPR adaptado pós-Brexit |

### Ponto de atenção crítico

O sistema parece atender **psicólogos, consultores e profissionais de saúde** (baseado nos depoimentos e no tipo de reuniões gravadas). Em mercados como os EUA, gravar e transcrever sessões com clientes de saúde entra em território **HIPAA**, que exige:

- Business Associate Agreements (BAA) com fornecedores
- Criptografia específica em repouso e trânsito
- Auditorias de acesso
- Plano de resposta a incidentes

### Gaps Identificados

- Política de privacidade em português, cita apenas LGPD.
- Sem versões de política por jurisdição.
- Sem banner de consentimento de cookies conforme GDPR.
- Sem mecanismo de exportação/exclusão de dados do usuário (exigido por GDPR e LGPD).
- Sem análise de adequação HIPAA.

---

## 7. Roteamento e URLs

### Problema

Sem nenhuma estrutura de rota por locale.

- Todas as rotas são `/plans`, `/login`, `/register` — sem prefixo de idioma.
- O Next.js tem suporte nativo a i18n routing, mas não está configurado.
- Sem detecção automática de idioma do usuário.

### Padrões internacionais de roteamento

| Estratégia | Exemplo | Quando usar |
|------------|---------|-------------|
| Prefixo de URL | `/en/plans`, `/pt/plans` | SEO forte, URLs claras |
| Subdomínio | `en.app.com`, `pt.app.com` | Grandes produtos, CDN por região |
| Domínio por país | `app.com.br`, `app.co.uk` | Máximo SEO local, mais complexo |

### Gaps Identificados

- `next.config.ts` sem configuração `i18n`.
- Sem middleware de detecção de locale.
- Sem `hreflang` tags nas páginas para SEO multilíngue.
- Sem cookie/preferência de idioma no perfil do usuário.

---

## 8. Modelo de Dados do Usuário

### Problema

O modelo de usuário carrega campos exclusivamente brasileiros.

**Modelo atual:**
```ts
interface User {
  id: string;
  email: string;
  name: string;
  cpfCnpj?: string | null;       // Documento fiscal brasileiro
  address?: string | null;
  addressNumber?: string | null;
  postalCode?: string | null;    // CEP formato brasileiro
  mobilePhone?: string | null;   // Formato (XX) XXXXX-XXXX
}
```

### Gaps Identificados

- `cpfCnpj` — exclusivo do Brasil. Precisaria de campo genérico (`taxId`, `nationalId`) ou campos separados por tipo.
- `mobilePhone` — sem suporte a formato E.164 internacional (`+1234567890`).
- `postalCode` — sem validação por país.
- Sem campo de `locale` ou `language` preferido pelo usuário.
- Sem campo de `country` ou `timezone`.
- Sem campo de `currency` preferida.

---

## 9. Integrações Externas e IA

### O que está bem

- **OpenAI, Google Generative AI, OpenRouter** — globais, sem restrição regional.
- **Google OAuth e Apple Sign-In** — já são internacionais.

### O que precisa mudar

**AssemblyAI (Transcrição de Áudio):**
- Suporta múltiplos idiomas, mas o modelo provavelmente está configurado para português.
- Para transcrições em inglês, espanhol ou outros idiomas, precisa de parâmetro de idioma dinâmico na chamada da API.
- Sem idioma correto, a transcrição tem qualidade muito inferior.

**Prompts de IA:**
- Os prompts para geração de resumos e análises estão provavelmente em português.
- Resumos gerados em português para um usuário que fala inglês quebra a experiência.
- Precisariam ser parametrizados pelo idioma do usuário.

**OpenRouter/OpenAI (Chat):**
- O modelo é configurável via env var — isso está bem.
- Os prompts do sistema (`system prompts`) precisam ser adaptados por idioma.

### Gaps Identificados

- Idioma de transcrição do AssemblyAI não é dinâmico.
- Prompts de IA não são parametrizados por locale.
- Sem fallback de idioma para quando o idioma detectado não tem suporte.

---

## 10. Conteúdo de Marketing e SEO

### Problema

Todo o conteúdo de marketing está hardcoded e em português, com referências culturais brasileiras.

**Depoimentos hardcoded:**
- *"Em duas semanas, economizei pelo menos 8 horas por mês..."* — Mariana Lopes, Psicóloga clínica
- *"Finalmente posso focar no cliente durante a reunião..."* — Rafael Moretti, Consultor financeiro
- *"Nosso time inteiro migrou e o ganho foi imediato..."* — Fernanda Castro, Head de Operações · Nuvya

**Textos de proposta de valor hardcoded:**
- `"Grave suas reuniões e deixe nossa IA gerar resumos perfeitos automaticamente."`
- `"via PIX, cobrado mensalmente"` — referência explícita ao PIX

**FAQs hardcoded:**
- Pergunta sobre diferença PIX vs Cartão — irrelevante internacionalmente.
- Pergunta sobre LGPD — específica ao Brasil.

### Gaps Identificados

- Sem sistema de CMS para gerenciar conteúdo por locale.
- Depoimentos com identidade cultural brasileira — não ressoam em outros mercados.
- FAQs com referências a regulações e métodos de pagamento brasileiros.
- Sem metatags `hreflang` para SEO multilíngue.
- Sem sitemap por locale.

---

## 11. Suporte RTL

### Situação atual

Existe estrutura **parcial** de RTL em alguns componentes usando classes Tailwind `rtl:`.

**Componentes com suporte parcial:**
- `src/components/ui/blocks/avatar.tsx`
- `src/components/ui/blocks/dropdown-menu.tsx`
- `src/components/ui/blocks/pagination.tsx`
- `src/components/ui/blocks/table.tsx`
- `src/app/(private)/chat-business/components/messages.tsx`

**Componentes sem suporte RTL:**
- Layout principal
- Telas de login e registro
- Página de planos e checkout
- Agenda e calendário

### Prioridade

RTL é necessário para árabe, hebraico e persa. Dado o perfil do produto (reuniões corporativas, foco em produtividade profissional), mercados de língua árabe como Emirados Árabes e Arábia Saudita têm alto potencial, mas podem ser abordados em uma segunda fase.

---

## 12. Resumo dos Gaps

### 🔴 Crítico — Bloqueadores de lançamento internacional

| # | Gap | Impacto |
|---|-----|---------|
| 1 | Sem gateway de pagamento internacional (apenas PIX) | Usuário fora do Brasil não consegue pagar |
| 2 | 200+ strings hardcoded em pt-BR sem infraestrutura de i18n | Interface inteiramente inacessível em outros idiomas |
| 3 | Moeda hardcoded em BRL sem suporte multi-moeda | Preços incompreensíveis e incorretos para outros mercados |
| 4 | Formatos de CPF/CEP/telefone exclusivamente brasileiros | Formulários quebram para usuários de outros países |

### 🟠 Alto — Necessário para boa experiência

| # | Gap | Impacto |
|---|-----|---------|
| 5 | Formatação de data hardcoded pt-BR (DD/MM/YYYY) | Datas ambíguas ou erradas para usuários americanos/europeus |
| 6 | Timezone não gerenciado | Horários de reuniões incorretos para usuários em outros fusos |
| 7 | Conformidade apenas com LGPD | Risco legal em mercados europeus (GDPR) e americanos (CCPA/HIPAA) |
| 8 | Sem roteamento por locale | Sem SEO internacional, sem experiência localizada por URL |
| 9 | Modelo de usuário com campos brasileiros | Perfil incompleto/inválido para usuários internacionais |

### 🟡 Médio — Necessário para escala

| # | Gap | Impacto |
|---|-----|---------|
| 10 | Idioma de transcrição AssemblyAI fixo | Qualidade de transcrição ruim para outros idiomas |
| 11 | Prompts de IA em português | Resumos e análises em português para usuários de outros idiomas |
| 12 | Conteúdo de marketing hardcoded com referências BR | Marketing ineficaz e confuso em outros mercados |
| 13 | Sem metatags hreflang e SEO multilíngue | Invisível para buscas em outros idiomas |

### 🟢 Baixo — Melhoria desejável

| # | Gap | Impacto |
|---|-----|---------|
| 14 | Suporte RTL incompleto | Necessário para árabe/hebraico — mercados específicos |
| 15 | Dois momentos de biblioteca de data (Moment + date-fns) | Inconsistência técnica, dívida futura |

---

## 13. Plano de Ação

O plano está dividido em **3 fases**. Cada fase é independente e entregável — você pode parar após qualquer fase e o sistema funcionará no estágio alcançado.

---

### FASE 1 — Fundação (Pré-requisito para tudo)
> **Objetivo:** Preparar a infraestrutura sem mudar nenhum comportamento visível  
> **Duração estimada:** 2–3 semanas  
> **Resultado:** Sistema preparado para receber traduções e multi-moeda

---

#### 1.1 — Instalar e configurar next-intl

**Por que next-intl:** É a biblioteca de i18n mais integrada ao Next.js App Router. Suporte nativo a Server Components, sem overhead de hidratação, tipagem TypeScript nativa.

```bash
npm install next-intl
```

Estrutura de arquivos a criar:
```
src/
  messages/
    pt-BR.json     # Português (Brasil) — idioma base
    en.json        # Inglês — primeiro idioma internacional
  i18n/
    request.ts     # Configuração de locale por request
    routing.ts     # Definição de locales suportados
```

Alterações no `next.config.ts`:
```ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

---

#### 1.2 — Configurar roteamento por locale

Criar estrutura de rotas com prefixo de locale:
```
src/app/
  [locale]/
    (public)/
      login/
      register/
      ...
    (private)/
      plans/
      clients/
      ...
```

Criar `middleware.ts` na raiz com detecção automática de locale:
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);
```

Locales a suportar inicialmente: `['pt-BR', 'en']` com `pt-BR` como padrão.

---

#### 1.3 — Extrair todas as strings para arquivos de tradução

Processo de extração para cada arquivo de componente:

**Antes:**
```tsx
<h1>Acesse sua conta</h1>
<p>Bem-vindo de volta! Por favor, insira seus dados.</p>
```

**Depois:**
```tsx
const t = useTranslations('auth.login');
<h1>{t('title')}</h1>
<p>{t('subtitle')}</p>
```

**Arquivo `pt-BR.json`:**
```json
{
  "auth": {
    "login": {
      "title": "Acesse sua conta",
      "subtitle": "Bem-vindo de volta! Por favor, insira seus dados."
    }
  }
}
```

**Prioridade de extração (por impacto):**
1. Telas de autenticação (login, registro, recuperação de senha)
2. Página de planos e preços
3. Checkout e pagamento
4. Mensagens de erro e validação (Zod schemas)
5. Componentes de navegação e layout
6. Demais telas privadas

---

#### 1.4 — Tornar formatação de data dinâmica

Substituir todos os locales hardcoded pelo locale do usuário:

**Antes:**
```ts
date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
moment.locale("pt-br")
```

**Depois:**
```ts
// Usando date-fns com locale dinâmico
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

const localeMap = { 'pt-BR': ptBR, 'en': enUS };
format(date, 'dd MMMM yyyy', { locale: localeMap[userLocale] })
```

Remover Moment.js progressivamente — substituir todos os usos por date-fns.

---

#### 1.5 — Adicionar campo de locale/idioma no modelo de usuário

Campos a adicionar no perfil do usuário (requer mudança no backend também):
```ts
interface User {
  // ... campos existentes
  locale: string;        // 'pt-BR', 'en', 'es', etc.
  timezone: string;      // 'America/Sao_Paulo', 'America/New_York', etc.
  country: string;       // 'BR', 'US', 'GB', etc.
  currency: string;      // 'BRL', 'USD', 'EUR', etc.
}
```

---

### FASE 2 — Pagamento e Dados Regionais
> **Objetivo:** Habilitar pagamentos e formulários para mercados fora do Brasil  
> **Duração estimada:** 3–4 semanas  
> **Resultado:** Usuários internacionais conseguem assinar e usar o produto

---

#### 2.1 — Integrar Stripe como gateway internacional

**Por que Stripe:** Suporta 135+ moedas, 46+ países, métodos de pagamento locais (cartão, SEPA, ACH, Apple Pay, Google Pay), SDK robusto para Next.js.

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

**Estratégia de convivência com o sistema atual:**
- Manter o gateway atual (PIX + cartão BR) para usuários brasileiros.
- Adicionar Stripe para usuários internacionais.
- Detectar país do usuário no checkout e exibir o gateway correto.

**Fluxo proposto:**
```
Usuário inicia checkout
       ↓
Detectar país do usuário
       ↓
País = BR → Gateway atual (PIX/Cartão BR)
País ≠ BR → Stripe Checkout
```

**Endpoints novos a criar:**
```
/api/checkout/stripe/create-session   POST
/api/checkout/stripe/webhook          POST (para confirmação assíncrona)
/api/checkout/stripe/portal           POST (para gestão de assinatura)
```

---

#### 2.2 — Implementar multi-moeda

**Abordagem recomendada:** Preços definidos no backend por moeda, frontend solicita preços pelo país/moeda do usuário.

**Schema de preços revisado (sugestão para backend):**
```json
{
  "plan": "Ultra",
  "prices": [
    { "currency": "BRL", "monthly": 199.00, "yearly": 1990.00, "paymentMethods": ["PIX", "CREDIT_CARD"] },
    { "currency": "USD", "monthly": 39.00, "yearly": 390.00, "paymentMethods": ["CREDIT_CARD", "APPLE_PAY"] },
    { "currency": "EUR", "monthly": 36.00, "yearly": 360.00, "paymentMethods": ["CREDIT_CARD", "SEPA"] }
  ]
}
```

**Formatação dinâmica de moeda:**
```ts
// Substituir todas as chamadas hardcoded por:
new Intl.NumberFormat(userLocale, {
  style: 'currency',
  currency: userCurrency
}).format(value)
```

---

#### 2.3 — Generalizar formatos de dados no frontend

**Telefone — usar libphonenumber-js:**
```bash
npm install libphonenumber-js
```
```ts
// Substituir maskPhoneBR por:
import { parsePhoneNumber, formatPhoneNumber } from 'libphonenumber-js';
```

**Documento fiscal — campo genérico:**
- Renomear `cpfCnpj` para `taxId` com campo auxiliar `taxIdType` (`CPF`, `CNPJ`, `VAT`, `SSN`, etc.).
- Exibir label e máscara adequados ao país do usuário.

**Código postal — validação por país:**
```bash
npm install postal-codes-js
```

**Endereço — usar formato internacional:**
- Remover `addressNumber` como campo separado (não existe em vários países).
- Usar campo único `addressLine1` + `addressLine2`.

---

#### 2.4 — Adaptar modelos de IA por idioma

**AssemblyAI — idioma dinâmico:**
```ts
// Antes (provavelmente fixo):
const transcript = await client.transcripts.transcribe({ audio_url });

// Depois:
const transcript = await client.transcripts.transcribe({
  audio_url,
  language_code: userLocale.split('-')[0], // 'pt', 'en', 'es', etc.
  language_detection: true // fallback automático
});
```

**Prompts de IA — parametrizar por idioma:**
```ts
const systemPrompt = t('ai.summaryPrompt', { language: userLanguageName });
// Ex: "Generate a professional meeting summary in English."
// Ex: "Gere um resumo profissional da reunião em Português."
```

---

### FASE 3 — Conformidade, SEO e Escala
> **Objetivo:** Estar legalmente seguro e visível nos mercados-alvo  
> **Duração estimada:** 2–4 semanas  
> **Resultado:** Produto pronto para crescimento internacional sustentável

---

#### 3.1 — Conformidade legal por mercado

**GDPR (Europa):**
- Adicionar banner de consentimento de cookies (ex: `react-cookie-consent` ou solução própria).
- Implementar página de configurações de privacidade com controles granulares.
- Adicionar endpoint de exportação de dados do usuário.
- Adicionar endpoint de exclusão de conta e dados (right to be forgotten).
- Criar política de privacidade em inglês com seção específica para GDPR.

**CCPA (EUA — Califórnia):**
- Link "Do Not Sell My Personal Information" no footer.
- Política de privacidade com seção CCPA.

**HIPAA (EUA — saúde):**
- Avaliar se o produto se enquadra como Business Associate.
- Se sim: assinar BAAs com todos os fornecedores (AssemblyAI, OpenAI, etc.).
- Implementar audit logs de acesso a dados de sessões.
- Contratar consultoria jurídica especializada antes de entrar neste mercado.

---

#### 3.2 — SEO multilíngue

**Metatags hreflang** em todas as páginas:
```html
<link rel="alternate" hreflang="pt-BR" href="https://app.com/pt-BR/plans" />
<link rel="alternate" hreflang="en" href="https://app.com/en/plans" />
<link rel="alternate" hreflang="x-default" href="https://app.com/plans" />
```

**Sitemap por locale:**
```
/sitemap.xml
  → /en/...
  → /pt-BR/...
```

**Open Graph por idioma:**
```tsx
export const metadata: Metadata = {
  title: t('meta.title'),
  description: t('meta.description'),
  openGraph: { locale: locale, alternateLocale: otherLocales }
}
```

---

#### 3.3 — Conteúdo de marketing localizado

**Estratégia recomendada:** Não traduzir os depoimentos brasileiros — criar depoimentos genuínos em cada mercado.

- Remover referências a PIX nos textos de planos para usuários internacionais.
- Substituir FAQs sobre LGPD por FAQs sobre GDPR para usuários europeus.
- Criar copy de proposta de valor adaptado por mercado (não apenas traduzido).
- Considerar um CMS headless (Contentful, Sanity, Strapi) para gerenciar conteúdo de marketing por locale sem deploys.

---

#### 3.4 — Monitoramento e qualidade por locale

- Adicionar `locale` como dimensão nos eventos de analytics.
- Criar testes E2E para os fluxos principais em inglês.
- Adicionar verificação de build para garantir que nenhuma string nova seja adicionada sem chave de tradução (ESLint plugin `eslint-plugin-i18n`).
- Criar processo de revisão de traduções antes de publicar novo locale.

---

## Ordem de execução recomendada (visão geral)

```
Semana 1–2:   Instalar next-intl + configurar roteamento por locale
Semana 3–5:   Extrair todas as strings para arquivos de tradução (pt-BR)
Semana 6:     Criar arquivo de tradução en.json + tornar datas dinâmicas
Semana 7–8:   Integrar Stripe + criar fluxo de checkout por país
Semana 9–10:  Generalizar formatos de dados (telefone, endereço, documento)
Semana 11:    Adaptar AssemblyAI e prompts de IA por idioma
Semana 12–13: Implementar conformidade GDPR básica
Semana 14:    SEO multilíngue (hreflang, sitemap, Open Graph)
Semana 15+:   Conteúdo de marketing localizado + monitoramento
```

---

## Decisões de arquitetura a tomar antes de começar

Antes de iniciar a implementação, as seguintes decisões precisam ser alinhadas:

| Decisão | Opção A | Opção B | Recomendação |
|---------|---------|---------|--------------|
| Estratégia de URL | Prefixo (`/en/plans`) | Subdomínio (`en.app.com`) | Prefixo — mais simples, mesmo deploy |
| Locale padrão | `pt-BR` (manter atual) | `en` (pivot internacional) | `pt-BR` — não quebra usuários atuais |
| Idioma inicial além de pt-BR | Inglês (en) | Espanhol (es) | Inglês — maior alcance global |
| Gateway de pagamento | Stripe | Adyen | Stripe — melhor DX, mais documentação |
| Gestão de conteúdo de marketing | Hardcoded + i18n | CMS headless | CMS para textos longos (FAQs, depoimentos) |
| Estratégia HIPAA | Entrar neste mercado | Evitar por ora | Avaliar com jurídico antes de decidir |

---

*Documento gerado em 04/05/2026 com base em análise completa do codebase.*
