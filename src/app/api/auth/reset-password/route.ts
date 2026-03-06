import { backendFetch } from "@/lib/api-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: body.token,
        newPassword: body.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao redefinir senha" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { message: data.message },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/auth/reset-password] Erro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
