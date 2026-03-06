import { setAuthCookies } from "@/lib/auth-cookies";
import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendFetch("/auth/social/apple", {
      method: "POST",
      body: JSON.stringify({
        identityToken: body.identityToken,
        fullName: body.fullName,
        registrationPlatform: body.registrationPlatform || "WEB",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro no login com Apple" },
        { status: response.status },
      );
    }

    await setAuthCookies(data.accessToken, data.refreshToken);

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    console.error("[api/auth/social/apple] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
