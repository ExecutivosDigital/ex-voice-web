# QA - Análise de Botões, Links e Elementos Interativos

**Data da Análise:** 26 de Janeiro de 2026  
**Projeto:** Health Voice Web

---

## Índice

1. [Páginas Públicas](#1-páginas-públicas)
2. [Páginas Privadas - Home](#2-páginas-privadas---home)
3. [Páginas Privadas - Clientes](#3-páginas-privadas---clientes)
4. [Páginas Privadas - Lembretes (Reminders)](#4-páginas-privadas---lembretes-reminders)
5. [Páginas Privadas - Estudos (Studies)](#5-páginas-privadas---estudos-studies)
6. [Páginas Privadas - Outros (Others)](#6-páginas-privadas---outros-others)
7. [Páginas Privadas - Gravações (Recordings)](#7-páginas-privadas---gravações-recordings)
8. [Páginas Privadas - Chat Business](#8-páginas-privadas---chat-business)
9. [Componentes Globais](#9-componentes-globais)
10. [Páginas de Termos e Privacidade](#10-páginas-de-termos-e-privacidade)
11. [⚠️ ELEMENTOS QUEBRADOS OU SEM AÇÃO](#️-elementos-quebrados-ou-sem-ação)

---

## 1. Páginas Públicas

### 1.1. Página de Login (`src/app/(public)/login/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link "Cadastre-se" | 72 | `<Link>` | Navega para `/register` | ✅ Funcional |
| Botão "Voltar ao login" | 82 | `<button>` | `setForgot(false)` - Retorna para tela de login | ✅ Funcional |

### 1.2. Componente de Login (`src/app/(public)/login/components/login.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão mostrar/ocultar senha | 225 | `<button>` | `setShowPassword(!showPassword)` - Toggle visibilidade da senha | ✅ Funcional |
| Link "Esqueceu a senha?" | 239 | `<span>` | `onClick` prop - Abre tela de recuperação | ✅ Funcional |
| Botão "Entrar" | 246 | `<button>` | `form.handleSubmit(handleLogin)` - Envia formulário de login | ✅ Funcional |
| Botão "Google Sign-In" | 271 | `<button>` | `handleGoogleSignIn` - Login com Google | ✅ Funcional |
| Botão "Apple Sign-In" | 286 | `<button>` | `handleAppleSignIn` - Login com Apple | ✅ Funcional |

### 1.3. Componente de Registro (`src/app/(public)/login/components/register.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão mostrar/ocultar senha | 303 | `<button>` | `setShowPassword(!showPassword)` | ✅ Funcional |
| Botão mostrar/ocultar confirmar senha | 334 | `<button>` | `setShowRememberPassword(!showRememberPassword)` | ✅ Funcional |
| Botão "Próximo" | 354 | `<button>` | `handleNext(form)` - Avança no cadastro | ✅ Funcional |
| Link Termos | 372 | Comentado | `window.open("/terms", "_blank")` | ⚠️ COMENTADO |
| Link Privacidade | 379 | Comentado | `window.open("/privacy", "_blank")` | ⚠️ COMENTADO |

### 1.4. Página de Registro (`src/app/(public)/register/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link "Faça login" | 60 | `<Link>` | Navega para `/login` | ✅ Funcional |

### 1.5. Formulário de Registro (`src/app/(public)/register/components/register-form.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão mostrar/ocultar senha | 314 | `<button>` | `setShowPassword(!showPassword)` | ✅ Funcional |
| Botão mostrar/ocultar confirmar senha | 345 | `<button>` | `setShowRememberPassword(!showRememberPassword)` | ✅ Funcional |
| Botão "Cadastrar" | 365 | `<button>` | `form.handleSubmit(handleRegister)` - Envia cadastro | ✅ Funcional |
| Link Termos de Serviço | 381 | `<a>` | `href="#"` | ❌ QUEBRADO |
| Link Política de Privacidade | 382 | `<a>` | `href="#"` | ❌ QUEBRADO |

### 1.6. Componente Esqueci a Senha (`src/app/(public)/login/components/forgot.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão "Enviar" | 223 | `<button>` | `onClick()` - Envia código de recuperação | ✅ Funcional |
| Botão "Próximo" | 297 | `<button>` | `handleNext(form)` - Avança no fluxo | ✅ Funcional |

---

## 2. Páginas Privadas - Home

### 2.1. Página Home (`src/app/(private)/(home)/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Componentes dinâmicos | - | - | Renderiza cards e componentes | ✅ Funcional |

### 2.2. Lembretes Próximos (`src/app/(private)/(home)/components/upcoming-reminders.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão "Novo" (Adicionar lembrete) | 124 | `<button>` | `handleAdd` - Navega para `/reminders` e abre gravação | ✅ Funcional |
| Botão página anterior | 134 | `<button>` | `setCurrentPage(p => Math.max(0, p - 1))` | ✅ Funcional |
| Botão próxima página | 141 | `<button>` | `setCurrentPage(p => Math.min(totalPages - 1, p + 1))` | ✅ Funcional |
| Botão atualizar horário | 208 | `<button>` | `updateTime(reminder.id)` - Atualiza horário do lembrete | ✅ Funcional |
| Botão editar horário | 216 | `<button>` | `setEditingId(reminder.id)` - Abre edição de horário | ✅ Funcional |
| Botão marcar como concluído | 263 | `<button>` | `updateStatus(reminder.id, "completed")` | ✅ Funcional |
| Botão marcar como cancelado | 270 | `<button>` | `updateStatus(reminder.id, "cancelled")` | ✅ Funcional |
| Botão desfazer (Undo) | 281 | `<button>` | `updateStatus(reminder.id, "pending")` | ✅ Funcional |

### 2.3. Próximas Reuniões (`src/app/(private)/(home)/components/upcoming-meetings.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão conectar Google Calendar | 117 | `<button>` | `onConnect` - Conecta ao Google Calendar | ✅ Funcional |
| Botão conectar Google Calendar (alternativo) | 140 | `<button>` | `onConnect` | ✅ Funcional |
| Botão link externo da reunião | 198 | `<button>` | Sem onClick handler | ❌ SEM AÇÃO |

### 2.4. Seletor de Data (`src/app/(private)/(home)/components/date-range-picker.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão toggle date picker | 97 | `<button>` | `setIsOpen(!isOpen)` | ✅ Funcional |
| Botão selecionar período | 123 | `<button>` | Seleciona range de datas | ✅ Funcional |

### 2.5. Painel de Conteúdo (`src/app/(private)/(home)/components/content-panel.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão slide anterior | 175 | `<button>` | `prevSlide` - Navega para slide anterior | ✅ Funcional |
| Botão próximo slide | 182 | `<button>` | `nextSlide` - Navega para próximo slide | ✅ Funcional |

### 2.6. Modal de Completar Registro (`src/app/(private)/(home)/components/complete-registration-modal.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Formulário | 195 | `<form>` | `form.handleSubmit(onSubmit)` - Completa registro via API | ✅ Funcional |

---

## 3. Páginas Privadas - Clientes

### 3.1. Página de Clientes (`src/app/(private)/clients/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão "Novo Cliente" | 57 | `<button>` | `onOpenNewClient` - Abre modal de novo cliente | ✅ Funcional |

### 3.2. Linha da Tabela de Clientes (`src/app/(private)/clients/components/general-client-table-row.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (card/row) | 41 | `<div>` | `handleNavigation` - `router.push(/clients/${client.id})` | ✅ Funcional |
| Botão dropdown | 82 | `<button>` | Abre menu de ações | ✅ Funcional |
| Div clicável (mobile) | 110 | `<div>` | `handleNavigation` | ✅ Funcional |

### 3.3. Página do Cliente Selecionado (`src/app/(private)/clients/[selected-client-id]/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Componentes dinâmicos | - | - | Renderiza dados do cliente | ✅ Funcional |

### 3.4. Linha da Tabela de Consultas do Cliente (`src/app/(private)/clients/[selected-client-id]/components/selected-client-table-row.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (row) | 27 | `<div>` | `handleNavigation` - `router.push(${pathname}/${recording.id})` | ✅ Funcional |
| Div clicável (mobile) | 57 | `<div>` | `handleNavigation` | ✅ Funcional |

### 3.5. Transcrição da Consulta (`src/app/(private)/clients/[selected-client-id]/(selected-appointment)/[id]/components/transcription.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão definir profissional | 316 | `<button>` | `handleSetProfessional(config.id)` | ✅ Funcional |
| Botão salvar edição | 351 | `<button>` | `handleSaveEdit` | ✅ Funcional |
| Botão cancelar edição | 357 | `<button>` | `handleCancelEdit` | ✅ Funcional |
| Botão iniciar edição | 374 | `<button>` | `handleStartEdit(config)` | ✅ Funcional |
| Botão salvar configurações de speaker | 404 | `<button>` | `handleSaveSpeakerConfigs` - PUT API | ✅ Funcional |
| Botão abrir modal | 433 | `<button>` | `setIsModalOpen(true)` | ✅ Funcional |

### 3.6. Chat da Consulta - Input (`src/app/(private)/clients/[selected-client-id]/(selected-appointment)/[id]/chat/components/chat-input.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão remover arquivo | 109 | `<button>` | `removeFile(index)` | ✅ Funcional |
| Botão remover arquivo (alternativo) | 128 | `<button>` | `removeFile(index)` | ✅ Funcional |
| Botão selecionar arquivo | 142 | `<button>` | `fileInputRef.current?.click()` | ✅ Funcional |
| Botão toggle microfone | 165 | `<button>` | `handleMicClick` | ✅ Funcional |
| Botão enviar mensagem | 179 | `<button>` | `onSend` | ✅ Funcional |

### 3.7. Chat da Consulta - Página (`src/app/(private)/clients/[selected-client-id]/(selected-appointment)/[id]/chat/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão novo chat | 167 | `<button>` | `handleNewChat` | ✅ Funcional |
| Botão toggle expansão | 184 | `<button>` | `handleToggleExpand` | ✅ Funcional |
| Botão voltar | 199 | `<button>` | `handleBack` | ✅ Funcional |
| Botão sugestão | 288 | `<button>` | `handleSuggestionClick(suggestion)` | ✅ Funcional |

### 3.8. Card de Sugestão do Chat (`src/app/(private)/clients/[selected-client-id]/(selected-appointment)/[id]/chat/components/suggestion-card.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável | 31 | `<div>` | `onClick` prop - Executa sugestão | ✅ Funcional |

---

## 4. Páginas Privadas - Lembretes (Reminders)

### 4.1. Página de Lembretes (`src/app/(private)/reminders/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão ordenar por data | 62 | `<button>` | `handleSort("DATE")` | ✅ Funcional |
| Botão ordenar por horário | 74 | `<button>` | `handleSort("TIME")` | ✅ Funcional |
| Botão nova gravação | 101 | `<button>` | `openNewRecording("PERSONAL", "REMINDER")` | ✅ Funcional |

### 4.2. Modal de Edição de Lembrete (`src/app/(private)/reminders/components/edit-reminder-modal.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div backdrop (fechar modal) | 62 | `<div>` | `e.target === e.currentTarget && onClose()` | ✅ Funcional |
| Botão fechar modal (X) | 76 | `<button>` | `onClose` | ✅ Funcional |
| Botão cancelar | 146 | `<button>` | `onClose` | ✅ Funcional |
| Botão salvar | 152 | `<button>` | `handleSave` - PUT API atualiza lembrete | ✅ Funcional |

### 4.3. Card de Lembrete (`src/app/(private)/reminders/components/general-reminder-card-item.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (navegar) | 39 | `<div>` | `handleNavigation` - `router.push(/reminders/${reminder.id})` | ✅ Funcional |
| Botão editar | 86 | `<button>` | `handleOpenEdit` - Abre modal de edição | ✅ Funcional |
| Div clicável (mobile) | 109 | `<div>` | `handleNavigation` | ✅ Funcional |

### 4.4. Linha da Tabela de Lembretes (`src/app/(private)/reminders/components/general-reminder-table-row.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (row) | 26 | `<div>` | `handleNavigation` - `router.push(/reminders/${reminder.id})` | ✅ Funcional |
| Div clicável (mobile) | 44 | `<div>` | `handleNavigation` | ✅ Funcional |

### 4.5. Layout do Lembrete Selecionado (`src/app/(private)/reminders/(selected-reminder)/[selected-reminder-id]/layout.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Redirect automático | 17 | router.push | `router.push("/reminders")` - Redireciona se não houver lembrete selecionado | ✅ Funcional |

### 4.6. Scroll to Top - Lembretes (`src/app/(private)/reminders/(selected-reminder)/[selected-reminder-id]/components/scroll-to-top.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão voltar ao topo | 40 | `<button>` | `scrollToTop` | ✅ Funcional |

### 4.7. Chat de Lembrete - Input (`src/app/(private)/reminders/(selected-reminder)/[selected-reminder-id]/chat/components/chat-input.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão toggle microfone | 65 | `<button>` | `handleMicClick` | ✅ Funcional |
| Botão enviar mensagem | 79 | `<button>` | `onSend` | ✅ Funcional |

### 4.8. Chat de Lembrete - Página (`src/app/(private)/reminders/(selected-reminder)/[selected-reminder-id]/chat/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão novo chat | 179 | `<button>` | `handleNewChat` | ✅ Funcional |
| Botão toggle expansão | 196 | `<button>` | `handleToggleExpand` | ✅ Funcional |
| Botão voltar | 211 | `<button>` | `handleBack` | ✅ Funcional |
| Botão sugestão | 283 | `<button>` | `handleSuggestionClick(suggestion)` | ✅ Funcional |

---

## 5. Páginas Privadas - Estudos (Studies)

### 5.1. Página de Estudos (`src/app/(private)/studies/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão nova gravação | 53 | `<button>` | `openNewRecording("PERSONAL", "STUDY")` | ✅ Funcional |

### 5.2. Linha da Tabela de Estudos (`src/app/(private)/studies/components/general-studies-table-row.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (row) | 27 | `<div>` | `handleNavigation` - `router.push(/studies/${recording.id})` | ✅ Funcional |
| Div clicável (mobile) | 57 | `<div>` | `handleNavigation` | ✅ Funcional |

### 5.3. Transcrição de Estudo (`src/app/(private)/studies/(selected-study)/[selected-study-id]/components/transcription.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão copiar transcrição | 123 | `<button>` | `handleCopy` | ✅ Funcional |

### 5.4. Scroll to Top - Estudos (`src/app/(private)/studies/(selected-study)/[selected-study-id]/components/scroll-to-top.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão voltar ao topo | 40 | `<button>` | `scrollToTop` | ✅ Funcional |

### 5.5. Chat de Estudo - Input (`src/app/(private)/studies/(selected-study)/[selected-study-id]/chat/components/chat-input.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão toggle microfone | 65 | `<button>` | `handleMicClick` | ✅ Funcional |
| Botão enviar mensagem | 79 | `<button>` | `onSend` | ✅ Funcional |

### 5.6. Chat de Estudo - Página (`src/app/(private)/studies/(selected-study)/[selected-study-id]/chat/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão novo chat | 179 | `<button>` | `handleNewChat` | ✅ Funcional |
| Botão toggle expansão | 196 | `<button>` | `handleToggleExpand` | ✅ Funcional |
| Botão voltar | 211 | `<button>` | `handleBack` | ✅ Funcional |
| Botão sugestão | 283 | `<button>` | `handleSuggestionClick(suggestion)` | ✅ Funcional |

---

## 6. Páginas Privadas - Outros (Others)

### 6.1. Página de Outros (`src/app/(private)/others/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão nova gravação | 53 | `<button>` | `openNewRecording("PERSONAL", "OTHER")` | ✅ Funcional |

### 6.2. Linha da Tabela de Outros (`src/app/(private)/others/components/general-others-table-row.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (row) | 27 | `<div>` | `handleNavigation` - `router.push(/others/${recording.id})` | ✅ Funcional |
| Div clicável (mobile) | 57 | `<div>` | `handleNavigation` | ✅ Funcional |

### 6.3. Scroll to Top - Outros (`src/app/(private)/others/(selected-other)/[selected-other-id]/components/scroll-to-top.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão voltar ao topo | 40 | `<button>` | `scrollToTop` | ✅ Funcional |

### 6.4. Chat de Outros - Input (`src/app/(private)/others/(selected-other)/[selected-other-id]/chat/components/chat-input.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão toggle microfone | 65 | `<button>` | `handleMicClick` | ✅ Funcional |
| Botão enviar mensagem | 79 | `<button>` | `onSend` | ✅ Funcional |

### 6.5. Chat de Outros - Página (`src/app/(private)/others/(selected-other)/[selected-other-id]/chat/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão novo chat | 179 | `<button>` | `handleNewChat` | ✅ Funcional |
| Botão toggle expansão | 196 | `<button>` | `handleToggleExpand` | ✅ Funcional |
| Botão voltar | 211 | `<button>` | `handleBack` | ✅ Funcional |
| Botão sugestão | 283 | `<button>` | `handleSuggestionClick(suggestion)` | ✅ Funcional |
| Botão remover arquivo | 342 | `<button>` | `setFile(null)` | ✅ Funcional |

---

## 7. Páginas Privadas - Gravações (Recordings)

### 7.1. Página de Gravações (`src/app/(private)/recordings/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão filtrar por CLIENT | 59 | `<button>` | `handleTypeFilter("CLIENT")` | ✅ Funcional |
| Botão filtrar por REMINDER | 76 | `<button>` | `handleTypeFilter("REMINDER")` | ✅ Funcional |
| Botão filtrar por STUDY | 93 | `<button>` | `handleTypeFilter("STUDY")` | ✅ Funcional |
| Botão filtrar por OTHER | 110 | `<button>` | `handleTypeFilter("OTHER")` | ✅ Funcional |

### 7.2. Linha da Tabela de Gravações (`src/app/(private)/recordings/components/general-recording-table-row.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável (row) | 111 | `<div>` | `handleNavigation` - Navega baseado no tipo (CLIENT, STUDY, OTHER, REMINDER) | ✅ Funcional |
| Div clicável (mobile) | 170 | `<div>` | `handleNavigation` | ✅ Funcional |

---

## 8. Páginas Privadas - Chat Business

### 8.1. Página Chat Business (`src/app/(private)/chat-business/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão abrir sidebar | 141 | `<button>` | `setIsSidebarOpen(true)` | ✅ Funcional |
| Botão selecionar prompt | 179 | `<button>` | `handleSelectPrompt(prompt)` | ✅ Funcional |
| Botão novo chat | 209 | `<button>` | `handleNewChat` | ✅ Funcional |

### 8.2. Carrossel de Prompts (`src/app/(private)/chat-business/components/prompts-carousel.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão selecionar prompt | 61 | `<button>` | `onSelectPrompt(prompt)` | ✅ Funcional |

### 8.3. Sidebar do Chat (`src/app/(private)/chat-business/components/chat-sidebar.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão toggle sidebar | 43 | `<button>` | `onToggle` | ✅ Funcional |
| Botão novo chat | 65 | `<button>` | `onNewChat` | ✅ Funcional |
| Div selecionar chat | 83 | `<div>` | `onSelectChat(chat.id)` | ✅ Funcional |
| Botão carregar mais | 107 | `<button>` | `onLoadMore` | ✅ Funcional |

### 8.4. Input do Chat Business (`src/app/(private)/chat-business/components/chat-input.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão remover arquivo | 109 | `<button>` | `removeFile(index)` | ✅ Funcional |
| Botão remover arquivo (alternativo) | 128 | `<button>` | `removeFile(index)` | ✅ Funcional |
| Botão selecionar arquivo | 142 | `<button>` | `fileInputRef.current?.click()` | ✅ Funcional |
| Botão toggle microfone | 165 | `<button>` | `handleMicClick` | ✅ Funcional |
| Botão enviar mensagem | 179 | `<button>` | `onSend` | ✅ Funcional |

### 8.5. Card de Sugestão - Chat Business (`src/app/(private)/chat-business/components/suggestion-card.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Div clicável | 31 | `<div>` | `onClick` prop | ✅ Funcional |

---

## 9. Componentes Globais

### 9.1. Header (`src/components/ui/header.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Breadcrumb clicável | 160 | `<span>` | `router.push(item.href!)` | ✅ Funcional |
| Logo (navegar home) | 207 | `<Image>` | `router.push("/")` | ✅ Funcional |
| Menu Item "Perfil" | 251 | `<DropdownMenuItem>` | `setIsProfileModalOpen(true)` | ✅ Funcional |
| Menu Item "App Mobile" | 272 | `<DropdownMenuItem>` | `window.open(appUrl, "_blank")` | ✅ Funcional |
| Menu Item "Suporte WhatsApp" | 291 | `<DropdownMenuItem>` | `window.open("https://wa.me/5541997819114", "_blank")` | ✅ Funcional |
| Menu Item "Sair" | 313 | `<DropdownMenuItem>` | `router.push("/login")` | ✅ Funcional |
| Botão menu mobile | 339 | `<button>` | `setMobileMenu(!mobileMenu)` | ✅ Funcional |
| Navegação Clientes | 369 | `<button>` | `router.push("/clients")` | ✅ Funcional |
| Navegação Consulta | 386 | `<span>` | `router.push(/clients/${...})` | ✅ Funcional |
| Navegação Visão Geral | 402 | `<span>` | `router.push(/clients/${...}/overview)` | ✅ Funcional |
| Navegação Chat | 418 | `<span>` | `router.push(/clients/${...}/chat)` | ✅ Funcional |
| Navegação Transcrição | 434 | `<span>` | `router.push(/clients/${...}/transcription)` | ✅ Funcional |
| Navegação Prontuário | 450 | `<span>` | `router.push(/clients/${...}/medical-record)` | ✅ Funcional |
| Navegação Lembretes | 503 | `<button>` | `router.push("/reminders")` | ✅ Funcional |
| Navegação Lembrete Específico | 518 | `<span>` | `router.push(/reminders/${...})` | ✅ Funcional |
| Navegação Chat Lembrete | 532 | `<span>` | `router.push(/reminders/${...}/chat)` | ✅ Funcional |
| Navegação Estudos | 573 | `<button>` | `router.push("/studies")` | ✅ Funcional |
| Navegação Estudo Específico | 588 | `<span>` | `router.push(/studies/${...})` | ✅ Funcional |
| Navegação Chat Estudo | 602 | `<span>` | `router.push(/studies/${...}/chat)` | ✅ Funcional |
| Navegação Transcrição Estudo | 616 | `<span>` | `router.push(/studies/${...}/transcription)` | ✅ Funcional |
| Navegação Outros | 659 | `<button>` | `router.push("/others")` | ✅ Funcional |
| Navegação Outro Específico | 675 | `<span>` | `router.push(/others/${...})` | ✅ Funcional |
| Navegação Chat Outro | 688 | `<span>` | `router.push(/others/${...}/chat)` | ✅ Funcional |
| Navegação Transcrição Outro | 702 | `<span>` | `router.push(/others/${...}/transcription)` | ✅ Funcional |
| Tab Home | 750 | `<button>` | `router.push("/")` | ✅ Funcional |
| Tab Gravações | 762 | `<button>` | `router.push("/recordings")` | ✅ Funcional |
| Tab Lembretes | 774 | `<button>` | `router.push("/reminders")` | ✅ Funcional |
| Tab Clientes | 786 | `<button>` | `router.push("/clients")` | ✅ Funcional |
| Tab Estudos | 798 | `<button>` | `router.push("/studies")` | ✅ Funcional |
| Tab Outros | 810 | `<button>` | `router.push("/others")` | ✅ Funcional |
| Tab AI Health | 822 | `<button>` | `router.push("/chat-business")` | ✅ Funcional |

### 9.2. Sidebar (`src/components/ui/sidebar.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Menu Item App Mobile (iOS) | 47 | `<DropdownMenuItem>` | `window.open(...)` - App Store | ✅ Funcional |
| Menu Item App Mobile (Android) | 65 | `<DropdownMenuItem>` | `window.open(...)` - Play Store | ✅ Funcional |
| Menu Item Suporte WhatsApp | 97 | `<DropdownMenuItem>` | `window.open("https://wa.me/5541997819114", "_blank")` | ✅ Funcional |
| Menu Item Sair | 104 | `<DropdownMenuItem>` | `router.push("/login")` | ✅ Funcional |
| Botão fechar menu mobile | 122 | `<button>` | `setMobileMenu(false)` | ✅ Funcional |

### 9.3. Footer (`src/components/ui/footer.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link Termos de Uso | 28 | `<span>` | `router.push("/terms")` | ✅ Funcional |
| Link Política de Privacidade | 34 | `<span>` | `router.push("/privacy")` | ✅ Funcional |

### 9.4. Breadcrumbs (`src/components/ui/breadcrumbs.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Item clicável | 129 | `<span>` | `router.push(item.href!)` | ✅ Funcional |

### 9.5. Modal Genérico (`src/components/ui/modal.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Backdrop (fechar) | 35 | `<div>` | `e.stopPropagation()` | ✅ Funcional |
| Container (stop propagation) | 47 | `<div>` | `e.stopPropagation()` | ✅ Funcional |

### 9.6. Action Sheet (`src/components/ui/action-sheet.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Backdrop (fechar) | 48 | `<div>` | `onClose()` | ✅ Funcional |
| Botão fechar | 71 | `<button>` | `onClose` | ✅ Funcional |

### 9.7. Solicitar Transcrição (`src/components/ui/request-transcription.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão abrir modal | 133 | `<button>` | `handleOpenModal` | ✅ Funcional |
| Botão fechar modal | 174 | `<button>` | `handleCloseModal` | ✅ Funcional |
| Botão selecionar prompt | 211 | `<button>` | `handleSelectPrompt(prompt)` | ✅ Funcional |

### 9.8. Criar Cliente Sheet (`src/components/ui/create-client-sheet.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Backdrop (fechar) | 147 | `<div>` | `onClose()` | ✅ Funcional |
| Botão fechar | 235 | `<button>` | `onClose()` | ✅ Funcional |
| Botão próximo | 241 | `<button>` | `handleNext(form)` | ✅ Funcional |

### 9.9. Waveform Audio Player (`src/components/ui/waveform-audio-player.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão seek | 206 | `<button>` | `handleSeek(index)` | ✅ Funcional |
| Botão restart | 228 | `<button>` | `handleRestart` | ✅ Funcional |
| Botão play/pause | 239 | `<button>` | `togglePlay` | ✅ Funcional |

### 9.10. Paginação Customizada (`src/components/ui/blocks/custom-pagination.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão primeira página | 62 | `<button>` | `handleFirst` | ✅ Funcional |
| Botão ir para página | 76 | `<button>` | `setCurrentPage(page)` | ✅ Funcional |
| Botão última página | 84 | `<button>` | `handleLast` | ✅ Funcional |

### 9.11. Audio Recorder (`src/components/audio-recorder/audio-recorder.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão abrir dropdown | 397 | `<button>` | `handleDropdownOpenChange(true)` | ✅ Funcional |
| Menu Item salvar PERSONAL | 436 | `<DropdownMenuItem>` | `openSaveDialog("PERSONAL")` | ✅ Funcional |
| Botão dropdown click | 459 | `<button>` | inline handler | ✅ Funcional |
| Botão reset flow | 479 | `<button>` | `resetFlow` | ✅ Funcional |
| Botão action (vários) | 540, 576, 610, 654, 689, 779 | `<button>` | inline handlers variados | ✅ Funcional |
| Botão iniciar gravação | 799 | `<button>` | `handleStartRecording` | ✅ Funcional |
| Botão reset flow | 825 | `<button>` | `resetFlow` | ✅ Funcional |
| Botão ir para save dialog | 891 | `<button>` | `setCurrentStep("save-dialog")` | ✅ Funcional |
| Botão iniciar gravação vídeo | 897 | `<button>` | `handleStartVideoRecording` | ✅ Funcional |
| Botão parar gravação | 951 | `<button>` | `recorder.stopRecording` | ✅ Funcional |
| Botão reset flow | 968 | `<button>` | `resetFlow` | ✅ Funcional |
| Botão tentar novamente | 1039 | `<button>` | `handleRetryRecording` | ✅ Funcional |
| Botão confirmar gravação | 1046 | `<button>` | `handleConfirmRecording` | ✅ Funcional |

### 9.12. Profile Modal (`src/components/profile/profile-modal.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão fechar modal | 353 | `<button>` | `onOpenChange(false)` | ✅ Funcional |
| Botão salvar | 359 | `<button>` | `handleSubmit` - PUT API atualiza perfil | ✅ Funcional |

### 9.13. Chat Popup (`src/components/chatPopup/index.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Botão toggle expand | 94 | `<button>` | `toggleExpand` | ✅ Funcional |
| Botão toggle chat | 105 | `<button>` | `toggleChat` | ✅ Funcional |
| Botão remover arquivo | 162 | `<button>` | `setFile(null)` | ✅ Funcional |
| Botão enviar mensagem | 172 | `<button>` | `handleSendMessage()` | ✅ Funcional |
| Botão action | 199 | `<button>` | inline handler | ✅ Funcional |
| Botão toggle chat | 226 | `<button>` | `toggleChat` | ✅ Funcional |

### 9.14. Mobile Component (`src/components/mobile.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link App Store (Apple) | 51 | `<a>` | `href="https://apps.apple.com/us/app/health-voice/id6754345791"` | ✅ Funcional |
| Link Play Store (Google) | 71 | `<a>` | `href="https://play.google.com/store/apps/details?id=com.executivos.healthvoice"` | ✅ Funcional |

---

## 10. Páginas de Termos e Privacidade

### 10.1. Página de Termos (`src/app/terms/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Ícone voltar | 10 | `<ChevronLeft>` | `window.history.back()` | ✅ Funcional |

### 10.2. Página de Privacidade (`src/app/privacy/page.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Ícone voltar | 10 | `<ChevronLeft>` | `window.history.back()` | ✅ Funcional |

---

## 11. Home4 Components (Versão Alternativa)

### 11.1. Card de Lembretes Recentes (`src/app/(private)/home4/components/recent-reminders-card.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link "Ver todos" | 45 | `<a>` | `href="/reminders"` | ✅ Funcional |

### 11.2. Tabela de Agendamento (`src/app/(private)/home4/components/meet-schedule-table.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link "Ver todas as reuniões" | 75 | `<a>` | `href="#"` | ❌ PLACEHOLDER |

### 11.3. Slider de Últimas Gravações (`src/app/(private)/home4/components/last-recordings-slider.tsx`)

| Elemento | Linha | Tipo | Ação | Observação |
|----------|-------|------|------|------------|
| Link "Ver todas" | 65 | `<a>` | `href="/recordings"` | ✅ Funcional |

---

# ⚠️ ELEMENTOS QUEBRADOS OU SEM AÇÃO

## Elementos com `href="#"` (Links Placeholder)

| Arquivo | Linha | Elemento | Descrição | Problema |
|---------|-------|----------|-----------|----------|
| `src/app/(public)/register/components/register-form.tsx` | 381 | `<a href="#">` | Link "Termos de Serviço" | ❌ Link não leva a lugar nenhum |
| `src/app/(public)/register/components/register-form.tsx` | 382 | `<a href="#">` | Link "Política de Privacidade" | ❌ Link não leva a lugar nenhum |
| `src/app/(private)/home4/components/meet-schedule-table.tsx` | 75 | `<a href="#">` | Link "Ver todas as reuniões" | ❌ Link placeholder |

## Elementos Sem onClick Handler

| Arquivo | Linha | Elemento | Descrição | Problema |
|---------|-------|----------|-----------|----------|
| `src/app/(private)/(home)/components/upcoming-meetings.tsx` | 198 | `<button>` | Botão de link externo da reunião | ❌ Não possui onClick handler definido |

## Funcionalidades Comentadas

| Arquivo | Linha | Elemento | Descrição | Problema |
|---------|-------|----------|-----------|----------|
| `src/app/(public)/login/components/register.tsx` | 372 | Comentado | Link para Termos (`window.open("/terms", "_blank")`) | ⚠️ Código comentado - funcionalidade desabilitada |
| `src/app/(public)/login/components/register.tsx` | 379 | Comentado | Link para Privacidade (`window.open("/privacy", "_blank")`) | ⚠️ Código comentado - funcionalidade desabilitada |

## Funções Definidas Mas Não Utilizadas

| Arquivo | Função | Descrição | Problema |
|---------|--------|-----------|----------|
| `src/context/ApiContext.tsx` | `DeleteAPI` | Função para chamadas DELETE | ⚠️ Função definida mas não encontrada em uso nos componentes |

---

# Resumo Estatístico

| Categoria | Quantidade |
|-----------|------------|
| Total de elementos interativos | ~200+ |
| Botões com onClick | ~150+ |
| Links (next/link) | 3 |
| Anchor tags (`<a>`) | 9 |
| router.push() | 53 |
| Formulários com onSubmit | 5 |
| Modais com triggers | 15+ |
| **Elementos quebrados/sem ação** | **5** |
| **Funcionalidades comentadas** | **2** |

---

# Recomendações de Correção

## Prioridade Alta

1. **Corrigir links de Termos e Privacidade no formulário de registro**
   - Arquivo: `src/app/(public)/register/components/register-form.tsx`
   - Linhas: 381-382
   - Solução: Substituir `href="#"` por `href="/terms"` e `href="/privacy"`

2. **Adicionar onClick handler ao botão de link externo**
   - Arquivo: `src/app/(private)/(home)/components/upcoming-meetings.tsx`
   - Linha: 198
   - Solução: Adicionar handler para abrir link da reunião em nova aba

## Prioridade Média

3. **Descomentar links de Termos e Privacidade no componente de registro**
   - Arquivo: `src/app/(public)/login/components/register.tsx`
   - Linhas: 372, 379
   - Solução: Remover comentários e ativar funcionalidade

4. **Corrigir link placeholder em meet-schedule-table**
   - Arquivo: `src/app/(private)/home4/components/meet-schedule-table.tsx`
   - Linha: 75
   - Solução: Adicionar href correto ou remover link se não necessário

## Prioridade Baixa

5. **Verificar uso do DeleteAPI**
   - Arquivo: `src/context/ApiContext.tsx`
   - Verificar se a função precisa ser implementada nos componentes

---

*Documento gerado automaticamente para fins de Quality Assurance*
