/**
 * Helper para chamadas server-side à API backend.
 * Usado pelos Route Handlers de auth.
 */

// Server-side pode falar HTTP direto com a API (não há bloqueio de mixed-content
// fora do browser), então usa a URL ABSOLUTA da API. No homolog isso é a VPS
// (http://IP:3334); o browser, esse sim, passa pelo rewrite da Vercel (ver
// next.config). Em produção API_URL_INTERNAL não existe e cai no valor de sempre.
const API_URL = process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export async function backendFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${API_URL}${path}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
