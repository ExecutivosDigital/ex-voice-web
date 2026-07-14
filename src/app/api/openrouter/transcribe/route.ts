/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAccessTokenFromCookies } from "@/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Fallback de transcrição (Whisper via OpenRouter) server-side — par do
 * /api/openrouter/chat. Recebe FormData com "file" e devolve o texto.
 */

const WHISPER_MODEL = "openai/whisper-large-v3";

export async function POST(request: NextRequest) {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY não configurada" },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file ausente" }, { status: 400 });
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  });

  const resp = await openai.audio.transcriptions.create({
    model: WHISPER_MODEL,
    file,
    response_format: "text",
  } as any);
  const text = typeof resp === "string" ? resp : ((resp as any)?.text ?? "");

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
