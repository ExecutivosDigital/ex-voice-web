# Sign in with Apple — Checklist para produção

Se o login com Apple retorna **"Invalid web redirect url"** mesmo com URLs e domínios configurados, confira os itens abaixo.

## 1. Correspondência exata da Redirect URI

A Apple exige que a `redirect_uri` enviada na requisição seja **idêntica** (caractere a caractere) à cadastrada no Apple Developer.

- **Sem barra no final:** use `https://seudominio.com` e **não** `https://seudominio.com/`
- **www vs sem www:** `https://www.seudominio.com` e `https://seudominio.com` são URLs **diferentes**. Cadastre no Apple exatamente a que o usuário usa ao abrir o site.

**O que fazer:** No [Apple Developer → Identifiers → Services ID](https://developer.apple.com/account/resources/identifiers/list/serviceId) (ex.: `com.executivosvoice.auth`) → **Configure** → em **Website URLs** / **Return URLs**:

- Coloque **cada** URL que o usuário pode usar (com e sem www, se aplicável), **sem** barra no final.
- Exemplo: `https://app.executivosdigital.com.br` e `https://www.app.executivosdigital.com.br` (se ambos forem usados).

## 2. Usar sempre a mesma URL no app (recomendado)

Para evitar desencontro entre www e não-www, defina uma URL **canônica** e use só ela:

1. No **ambiente de produção** do seu deploy (Vercel, etc.), defina:
   ```bash
   NEXT_PUBLIC_APPLE_REDIRECT_URI=https://seu-dominio-exato.com
   ```
   Use exatamente o mesmo domínio que o usuário vê na barra de endereço (com ou sem www, conforme seu padrão).

2. **Faça um novo build e deploy.** No Next.js, variáveis `NEXT_PUBLIC_*` são embutidas no build; alterar só no painel sem rebuild não atualiza o valor no front.

3. No Apple Developer, cadastre **exatamente** essa mesma URL (sem barra no final).

## 3. Services ID (não App ID)

Para **web**, o `client_id` deve ser o **Identifier** de um **Services ID**, não de um App ID.

- Em Identifiers, o tipo deve ser **Services ID**.
- O valor que você usa (ex.: `com.executivosvoice.auth`) deve ser o identifier desse Services ID.
- As **Return URLs / Website URLs** são configuradas nesse mesmo Services ID.

## 4. Verificar o que está sendo enviado

Em **produção**, abra o DevTools (F12) → aba **Network**. Ao clicar em “Login com Apple”, procure a requisição para `appleid.apple.com` e confira os parâmetros:

- `client_id`: deve ser exatamente o Services ID (ex.: `com.executivosvoice.auth`).
- `redirect_uri`: deve ser **exatamente** uma das URLs cadastradas no Services ID (incluindo `https://`, domínio e sem `/` no final).

Se `redirect_uri` estiver diferente do que está no Apple Developer (por exemplo com www quando você cadastrou sem www), corrija:

- Ou cadastrando no Apple a URL que está sendo enviada, ou  
- Definindo `NEXT_PUBLIC_APPLE_REDIRECT_URI` com a URL canônica e fazendo rebuild.

## 5. Resumo rápido

| Onde | O que conferir |
|------|-----------------|
| **Apple Developer** | Services ID → Return URLs = lista com as URLs exatas (sem barra final). Incluir www e não-www se ambos forem usados. |
| **Deploy (build)** | `NEXT_PUBLIC_APPLE_REDIRECT_URI` definida com a URL canônica. **Rebuild** após alterar. |
| **Navegador** | Na requisição para Apple, `redirect_uri` igual a uma das URLs cadastradas. |

Referência: [TN3107 - Resolving Sign in with Apple response errors](https://developer.apple.com/documentation/technotes/tn3107-resolving-sign-in-with-apple-response-errors) (Apple).
