import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await backendFetch("/custom-plan/consume/pix", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao iniciar pagamento PIX" },
        { status: response.status },
      );
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/checkout/custom/consume-pix] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
