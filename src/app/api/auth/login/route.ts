import { setAuthCookies } from "@/lib/auth-cookies";
import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Credenciais inválidas" },
        { status: response.status },
      );
    }

    // Seta cookies com os tokens
    await setAuthCookies(data.accessToken, data.refreshToken);

    // Retorna apenas os dados do usuário (tokens ficam nos cookies)
    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    console.error("[api/auth/login] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
