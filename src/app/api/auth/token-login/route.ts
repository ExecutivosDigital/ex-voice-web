import { setAuthCookies } from "@/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/token-login?accessToken=...&refreshToken=...
 *
 * Recebe accessToken e refreshToken como query params (provenientes do fluxo
 * de checkout / registro da landing page), seta os cookies de autenticação e
 * redireciona o usuário para o dashboard.
 *
 * Usado para login automático após pagamento ou cadastro na LP.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  // Se os tokens não foram fornecidos, redireciona para o login normal
  if (!accessToken || !refreshToken) {
    console.warn("[token-login] Tokens ausentes — redirecionando para /login");
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    // Seta os cookies de autenticação (hv_access_token + hv_refresh_token)
    await setAuthCookies(accessToken, refreshToken);

    // Redireciona para o dashboard após autenticar
    return NextResponse.redirect(new URL("/", origin));
  } catch (error) {
    console.error("[token-login] Erro ao setar cookies:", error);
    return NextResponse.redirect(new URL("/login", origin));
  }
}
