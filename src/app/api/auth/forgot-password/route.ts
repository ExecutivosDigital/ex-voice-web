import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao solicitar recuperação de senha" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { message: data.message },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/auth/forgot-password] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
