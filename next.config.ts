import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  /**
   * Proxy do front para a API — usado SÓ no homolog (Vercel).
   *
   * O front na Vercel é HTTPS; a API de homolog na VPS é HTTP puro. Se o
   * browser chamasse a VPS direto, o navegador bloquearia por "mixed content".
   * Aqui a Vercel faz o proxy: o browser chama `/api-backend/...` (mesma origem,
   * HTTPS) e a Vercel repassa para a VPS por trás (servidor-a-servidor, sem o
   * bloqueio). De brinde, cookies de auth funcionam (tudo vira mesma origem) e
   * não há CORS.
   *
   * Só liga quando API_URL_INTERNAL está definida (ambiente homolog). Em
   * produção a variável não existe, `rewrites` volta vazio e nada muda — o front
   * chama NEXT_PUBLIC_API_URL direto, como sempre. Não toca produção.
   */
  async rewrites() {
    const target = process.env.API_URL_INTERNAL;
    if (!target) return [];
    return [{ source: "/api-backend/:path*", destination: `${target}/:path*` }];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
