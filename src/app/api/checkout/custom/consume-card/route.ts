import { setAuthCookies } from "@/lib/auth-cookies";
import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await backendFetch("/custom-plan/consume/card", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao processar pagamento com cartão" },
        { status: response.status },
      );
    }

    // Auto-login: seta cookies de auth a partir dos tokens retornados
    if (data.tokens?.accessToken && data.tokens?.refreshToken) {
      await setAuthCookies(data.tokens.accessToken, data.tokens.refreshToken);
    }

    return NextResponse.json(
      {
        signatureId: data.signatureId,
        customPlanId: data.customPlanId,
        user: data.tokens?.user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/checkout/custom/consume-card] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
