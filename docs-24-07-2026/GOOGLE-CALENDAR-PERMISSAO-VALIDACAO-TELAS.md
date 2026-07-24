# EX Voice — validação da permissão do Google Agenda

Guia manual para validar se o status da integração reflete a permissão realmente concedida pelo
usuário. Marque cada resultado com ✅ ou ❌.

## 0. Antes de começar

- Acessar o ambiente de homologação com um usuário de teste.
- Abrir a tela **Agenda**.
- Se já houver uma conta Google conectada, desconectá-la antes dos dois primeiros cenários.

## 1. Conceder a permissão

| # | Ação | Esperado |
|---|---|---|
| 1 | Clicar em **Conectar Google Agenda** | O fluxo de autorização do Google é aberto |
| 2 | Autorizar a leitura dos eventos | O usuário retorna à Agenda |
| 3 | Observar a confirmação | Aparece a mensagem de agenda conectada |
| 4 | Conferir o status e os eventos | A conta aparece conectada e seus próximos eventos são carregados |
| 5 | Recarregar a página | O estado conectado e os eventos permanecem |

**Resultado:** ✅ / ❌

## 2. Não conceder a leitura dos eventos

| # | Ação | Esperado |
|---|---|---|
| 1 | Clicar em **Conectar Google Agenda** | O fluxo de autorização do Google é aberto |
| 2 | Não autorizar a leitura dos eventos e concluir o fluxo | O usuário retorna à Agenda |
| 3 | Observar a mensagem | A tela informa que a permissão não foi concedida e que a agenda não foi conectada |
| 4 | Conferir o status | Continua disponível a ação **Conectar Google Agenda**; não aparece badge de conexão |
| 5 | Conferir a agenda e recarregar a página | Nenhum evento do Google é exibido e o estado permanece desconectado |

**Resultado:** ✅ / ❌

## 3. Cancelar todo o fluxo

| # | Ação | Esperado |
|---|---|---|
| 1 | Iniciar a conexão e cancelar no Google | O usuário retorna à Agenda |
| 2 | Observar a mensagem e o status | A tela informa que a conexão foi cancelada e permanece desconectada |

**Resultado:** ✅ / ❌

## 4. Conexão inválida criada antes da correção

| # | Ação | Esperado |
|---|---|---|
| 1 | Entrar com um usuário cujo badge indicava conexão sem acesso aos eventos | A Agenda tenta carregar a integração |
| 2 | Aguardar o carregamento | A tela informa a falta da permissão e volta automaticamente ao estado desconectado |
| 3 | Recarregar a página | O badge incorreto não reaparece |

**Resultado:** ✅ / ❌

## Golden Path

Conectar autorizando a leitura → visualizar eventos → desconectar → tentar novamente sem conceder a
leitura → confirmar que a integração permanece desconectada.

## Achados / Bugs

| # | Tela | Título | Sintoma | Status |
|---|---|---|---|---|
| 1 | Agenda | Badge indicava conexão sem permissão | Ao não autorizar a leitura dos eventos, o retorno do Google era tratado como conexão bem-sucedida | 🔴 Corrigido — conexão só é aceita quando a leitura foi autorizada |
