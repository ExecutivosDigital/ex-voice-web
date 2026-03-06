import {
  clearAuthCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/lib/auth-cookies";
import { backendFetch } from "@/lib/api-server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenFromCookies();

    if (!refreshToken) {
      await clearAuthCookies();
      return NextResponse.json(
        { message: "Refresh token não encontrado" },
        { status: 401 },
      );
    }

    const response = await backendFetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Refresh inválido — limpa cookies
      await clearAuthCookies();
      return NextResponse.json(
        { message: data.message || "Sessão expirada" },
        { status: 401 },
      );
    }

    // Atualiza cookies com novos tokens
    await setAuthCookies(data.accessToken, data.refreshToken);

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    console.error("[api/auth/refresh] Erro:", error);
    await clearAuthCookies();
    return NextResponse.json(
      { message: "Erro ao renovar sessão" },
      { status: 500 },
    );
  }
}
