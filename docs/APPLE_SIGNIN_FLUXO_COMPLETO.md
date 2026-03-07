# Sign in with Apple — Análise do fluxo completo

Documento para diagnosticar o erro **"invalid_request: Invalid web redirect url"** do começo ao fim.

---

## 1. A URL que você está enviando

Sua request URL está correta em formato:

```
https://appleid.apple.com/auth/authorize
  ?client_id=com.executivosvoice.auth
  &redirect_uri=https%3A%2F%2Fvoice.executivosdigital.com.br   ← decodificado: https://voice.executivosdigital.com.br
  &response_type=code%20id_token
  &scope=name%20email
  &response_mode=web_message
  &frame_id=...
  &m=11&v=1.5.6
```

Ou seja:

- **client_id:** `com.executivosvoice.auth` (Services ID)
- **redirect_uri:** `https://voice.executivosdigital.com.br` (origem, sem path, sem barra final)
- **response_mode:** `web_message` (fluxo popup)

O front está montando a chamada corretamente. O problema costuma estar na **configuração no Apple Developer** ou em **propagação/cache**.

---

## 2. Fluxo passo a passo (onde pode falhar)

```
[1] Usuário clica "Login com Apple"
        ↓
[2] AppleID.auth.init() já foi chamado com clientId, redirectURI, usePopup: true
        ↓
[3] AppleID.auth.signIn() abre o popup para appleid.apple.com
        ↓
[4] Apple recebe: client_id, redirect_uri, scope, response_type, response_mode=web_message
        ↓
[5] Apple valida:
     • client_id existe e é um Services ID com "Sign in with Apple" habilitado
     • redirect_uri está na lista de Return URLs desse Services ID (comparação exata)
     • (outras validações internas)
        ↓
[6] Se algo falhar em [5] → Apple responde "invalid_request" / "Invalid web redirect url"
[7] Se OK → Apple mostra tela de login → após sucesso, envia resultado via postMessage para a origem do redirect_uri
```

O erro que você vê vem da etapa **[5]**: a Apple não está aceitando a combinação `client_id` + `redirect_uri` que você está enviando.

---

## 3. O que a Apple valida no redirect_uri

- A string enviada em `redirect_uri` tem que ser **idêntica** a uma das entradas em **Return URLs** do Services ID.
- **Não** pode ser IP ou `localhost`.
- **Não** pode ter fragmento (`#...`).
- Normalmente é a **origem** (ex.: `https://voice.executivosdigital.com.br`), sem path e sem barra final no nosso caso (popup / web_message).

Ou seja: no painel da Apple, em **Return URLs**, tem que existir exatamente:

`https://voice.executivosdigital.com.br`

(nada antes, nada depois, sem barra no final, sem path).

---

## 4. Diferença entre “Domains and Subdomains” e “Return URLs”

No Apple Developer, no Configure do **Services ID**:

- **Domains and Subdomains**  
  Domínios do seu site (ex.: `voice.executivosdigital.com.br`). Costuma ser **sem** `https://`.

- **Return URLs**  
  URLs completas para onde a Apple pode “devolver” o fluxo. Para o nosso caso deve ser a **origem** com `https://`, ex.:  
  `https://voice.executivosdigital.com.br`  
  (sem `/login`, sem barra no final).

O que a Apple compara com o seu request é a lista de **Return URLs**. O `redirect_uri` da request tem que bater com uma dessas entradas.

---

## 5. Possíveis causas do erro (checklist)

### A) Return URL não está exatamente igual

- No Apple Developer, em **Return URLs**, a entrada tem que ser exatamente:
  - `https://voice.executivosdigital.com.br`
- Conferir:
  - Sem `https://` a menos ou a mais.
  - Sem path (ex.: sem `/login`).
  - Sem barra no final.
  - Sem espaço no início/fim.
  - Domínio correto (ex.: `voice.executivosdigital.com.br`).

### B) Services ID errado ou mal configurado

- O `client_id` da request tem que ser o **Identifier** de um **Services ID** (não App ID).
- Esse Services ID precisa ter **Sign in with Apple** habilitado e **Configurado** (Configure).
- As **Return URLs** que a Apple usa são as desse mesmo Services ID. Se você editou outro identifier, não adianta.

### C) Configuração não propagada (muito comum)

- A Apple pode demorar para propagar alterações (minutos a **vários dias**).
- No fórum oficial há relatos de **5+ dias** até o novo domínio/URL passar a ser aceito.
- Depois de alterar Return URLs / domínios, vale:
  - Clicar em **Save** de novo (alguns relatam que “re-salvar” ajudou).
  - Aguardar 24–48 h e testar de novo.

### D) Cache / navegador

- Testar em **outra aba anônima** ou outro navegador.
- Há quem tenha visto o erro sumir ao testar primeiro no **Safari** (e depois voltar ao Chrome/Edge).

### E) Vários Services IDs

- Se existir mais de um Services ID (ex.: um para app, um para web), conferir se o que está na tela de Configure é o que tem `client_id = com.executivosvoice.auth` e se as Return URLs estão nele.

### F) Primary App ID / associação

- O Services ID precisa estar associado a um **App ID** (primary) que tenha “Sign in with Apple” habilitado.
- Se essa associação estiver errada ou desatualizada, em teoria pode afetar; normalmente o erro seria outro, mas vale conferir a associação no mesmo modal de Configure.

---

## 6. O que fazer na prática (ordem sugerida)

1. **Conferir a string exata no Apple Developer**
   - Identifiers → **Services IDs** (não App IDs).
   - Abrir o Services ID cujo Identifier é `com.executivosvoice.auth`.
   - Sign in with Apple → **Configure**.
   - Em **Return URLs**, ver se existe exatamente:  
     `https://voice.executivosdigital.com.br`  
   - Se não existir, adicionar. Se existir com path ou barra, corrigir.
   - **Done** → **Continue** → **Save**.

2. **Re-salvar a configuração**
   - Sem mudar nada, abrir de novo Configure → Done → Continue → Save.  
   - (Relatado no fórum Apple como algo que “desencadeou” a propagação para alguns.)

3. **Testar em Safari (e depois em outro browser)**
   - Abrir o site em produção no **Safari**, tentar Login com Apple.
   - Se funcionar no Safari, testar de novo no Chrome/Edge (às vezes o erro some após o primeiro sucesso).

4. **Aguardar propagação**
   - Se você alterou domínio ou Return URLs recentemente, esperar 24–48 h (ou mais) e testar de novo.

5. **Último recurso: recriar o Services ID**
   - Criar um **novo** Services ID (ex.: `com.executivosvoice.auth.v2`).
   - Configurar Sign in with Apple, domínio e Return URL `https://voice.executivosdigital.com.br`.
   - No app (Vercel), trocar `NEXT_PUBLIC_APPLE_CLIENT_ID` para o novo identifier e fazer redeploy.
   - Assim você descarta qualquer estado “travado” do identifier antigo.

---

## 7. Resumo

- A **requestUrl** que você mandou está correta: `redirect_uri=https://voice.executivosdigital.com.br`.
- O erro costuma ser: **Return URL no Apple Developer diferente** (ou não propagada) **dessa string exata**, ou **propagação lenta** da Apple.
- Conferir: **Return URLs** do Services ID `com.executivosvoice.auth` com exatamente `https://voice.executivosdigital.com.br`, re-salvar, testar no Safari e, se precisar, aguardar ou recriar o Services ID.

Referências:
- [TN3107 - Resolving Sign in with Apple response errors](https://developer.apple.com/documentation/technotes/tn3107-resolving-sign-in-with-apple-response-errors)
- [Apple Developer Forums - invalid_request Invalid web redirect url](https://developer.apple.com/forums/thread/790119) (propagação e re-save)
