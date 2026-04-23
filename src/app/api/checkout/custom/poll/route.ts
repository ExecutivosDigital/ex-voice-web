import { setAuthCookies } from "@/lib/auth-cookies";
import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pollingToken = request.nextUrl.searchParams.get("pollingToken");
    if (!pollingToken) {
      return NextResponse.json(
        { message: "pollingToken é obrigatório" },
        { status: 400 },
      );
    }

    const response = await backendFetch(
      `/custom-plan/consume/status?pollingToken=${encodeURIComponent(pollingToken)}`,
      { method: "GET" },
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao consultar status" },
        { status: response.status },
      );
    }

    // Se pagamento foi confirmado, já seta cookies de auth
    if (data.status === "ACTIVE" && data.tokens?.accessToken && data.tokens?.refreshToken) {
      await setAuthCookies(data.tokens.accessToken, data.tokens.refreshToken);
      return NextResponse.json(
        { status: "ACTIVE", user: data.tokens.user },
        { status: 200 },
      );
    }

    return NextResponse.json({ status: data.status }, { status: 200 });
  } catch (error) {
    console.error("[api/checkout/custom/poll] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
