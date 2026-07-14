/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAccessTokenFromCookies } from "@/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Proxy server-side do chat OpenRouter (Fase 0): a chave sai do bundle do
 * navegador e passa a viver só aqui (OPENROUTER_API_KEY, sem NEXT_PUBLIC).
 * Recebe { messages } e devolve o texto da resposta em streaming puro.
 */

const MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

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

  const { messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages inválido" }, { status: 400 });
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost",
      "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "Ex Voice",
    },
  });

  const completion = await openai.chat.completions.create(
    { model: MODEL, stream: true, messages },
    { signal: request.signal },
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion as any) {
          const delta = chunk?.choices?.[0]?.delta?.content;
          if (!delta) continue;
          if (typeof delta === "string") {
            controller.enqueue(encoder.encode(delta));
          } else if (Array.isArray(delta)) {
            for (const d of delta) {
              if (typeof d === "string") controller.enqueue(encoder.encode(d));
              else if (typeof d?.text === "string")
                controller.enqueue(encoder.encode(d.text));
            }
          }
        }
      } catch (err) {
        // Aborto do client cai aqui — só encerra o stream
        console.error("OpenRouter stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
