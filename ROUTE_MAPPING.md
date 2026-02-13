# Mapeamento de Rotas: App Mobile → Web

## Visão Geral

As rotas do app mobile (Expo Router) são diferentes das rotas do web (Next.js App Router). Este documento descreve o mapeamento e como o sistema converte automaticamente as rotas.

## Mapeamento de Rotas

| App Mobile (Expo Router) | Web (Next.js) | Descrição |
|--------------------------|---------------|-----------|
| `/(tabs)/index` | `/(home)` | Página inicial |
| `/notes/[id]` | `/reminders/[selected-reminder-id]` | Detalhes de lembrete |
| `/notes` | `/reminders` | Lista de lembretes |
| `/other/[id]` | `/others/[selected-other-id]` | Detalhes de "outros" |
| `/other` | `/others` | Lista de "outros" |
| `/study/[id]` | `/studies/[selected-study-id]` | Detalhes de estudo |
| `/study` | `/studies` | Lista de estudos |
| `/patient/[id]` | `/clients/[selected-client-id]` | Detalhes de paciente/cliente |
| `/patient` | `/clients` | Lista de pacientes/clientes |
| `/(checkout)/checkout` | `/(home)` | Checkout (fallback para home) |
| `/chat` | `/chat-business` | Chat com IA |
| `/notifications` | `/notifications` | Notificações |

## Como Funciona

### 1. Utilitário de Conversão

O arquivo `src/utils/route-mapper.ts` contém a função `convertAppRouteToWeb()` que:

- Recebe uma rota do app mobile e parâmetros opcionais
- Converte para a rota correspondente no web
- Trata substituição de `[id]` por valores reais
- Fornece fallback para home se a rota não for encontrada

### 2. Uso nos Componentes

Os componentes de notificação (`notification-dropdown.tsx` e `notifications/page.tsx`) usam automaticamente o conversor:

```typescript
import { convertAppRouteToWeb } from "@/utils/route-mapper";

const webRoute = convertAppRouteToWeb(notification.route, notification.params);
router.push(webRoute);
```

## Priorização: App Mobile

As rotas são **priorizadas para o app mobile**. Isso significa que:

1. A API envia rotas no formato do app mobile
2. O app mobile usa as rotas diretamente
3. O web converte automaticamente usando o `route-mapper`

## Exemplos de Conversão

### Exemplo 1: Lembrete
```typescript
// App Mobile
route: '/notes/[id]'
params: { id: '123' }

// Web (convertido)
'/reminders/123'
```

### Exemplo 2: Estudo
```typescript
// App Mobile
route: '/study/[id]'
params: { id: '456' }

// Web (convertido)
'/studies/456'
```

### Exemplo 3: Home
```typescript
// App Mobile
route: '/(tabs)/index'

// Web (convertido)
'/(home)'
```

## Adicionando Novos Mapeamentos

Para adicionar um novo mapeamento, edite `src/utils/route-mapper.ts`:

```typescript
const ROUTE_MAP: Record<string, (params?: Record<string, any>) => string> = {
  // Adicione aqui
  '/nova-rota/[id]': (params) => `/nova-rota-web/${params?.id}`,
};
```

## Troubleshooting

### Rota não encontrada
- Verifique se o mapeamento existe em `ROUTE_MAP`
- Verifique os logs do console para ver a rota original
- O sistema faz fallback para `/(home)` se não encontrar mapeamento

### Parâmetros não funcionando
- Certifique-se de que `params` está sendo passado corretamente
- Verifique se o nome do parâmetro corresponde ao esperado (geralmente `id`)

## Notas Importantes

- As rotas do app mobile são a fonte de verdade
- O web sempre converte, nunca usa rotas do app diretamente
- Fallbacks garantem que o usuário sempre seja redirecionado, mesmo se houver erro
