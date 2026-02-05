/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import OpenAI from "openai";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import fixWebmDuration from "webm-duration-fix";
import { Attachment, Message, Prompt } from "./types";

/* ================= OpenRouter via OpenAI SDK ================= */
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!,
  dangerouslyAllowBrowser: true, // em prod, prefira proxy/rota server-side
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost",
    "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "Chat Widget",
  },
});

/** Modelo-alvo: tente um Gemini com ÁUDIO habilitado na página de modelos.
 * Se este ID específico não aceitar audio, o fallback (Whisper) entra. */
const MODEL =
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "google/gemini-2.5-flash";

/** Fallback de transcrição (OpenRouter) */
const WHISPER_MODEL = "openai/whisper-large-v3";

/* ================= Types do payload ================= */
type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image_url"; image_url: { url: string } };
type AudioPart = {
  type: "input_audio";
  input_audio: { data: string; format: string };
};

type ChatMessage =
  | { role: "system"; content: string }
  | {
      role: "user" | "assistant";
      content: string | Array<TextPart | ImagePart | AudioPart>;
    };

interface UseSectionChatParams {
  selectedPrompt?: Prompt;
}

export interface UseSectionChatReturn {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  file: File | null;
  setFile: (f: File | null) => void;
  loading: boolean;
  isRecording: boolean;
  elapsedTime: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  handleSendMessage: (overrideContent?: string) => Promise<void>;
  handleAbortStream: () => void;
}

/* ================= Utils ================= */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = () => rej(r.error);
    r.onload = () => res(r.result as string);
    r.readAsDataURL(file);
  });
}
/** Retorna apenas o base64 (sem "data:...;base64,") */
async function fileToBase64NoPrefix(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  return dataUrl.split(",")[1] ?? "";
}
function audioFormatFromMime(mime: string) {
  const m = (mime || "").toLowerCase();
  if (!m.startsWith("audio/")) return "wav";
  const ext = m.split("/")[1] || "wav";
  if (ext === "mpeg" || ext === "mpga") return "mp3";
  return ext;
}

/** Heurística: o texto da primeira resposta acusa que não suporta áudio? */
function looksLikeNoAudioSupport(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("não consigo processar arquivos de áudio") ||
    t.includes("não consigo processar audio") ||
    t.includes("cannot process audio") ||
    t.includes("audio not supported") ||
    t.includes("i can’t process audio")
  );
}

/* ================= Hook ================= */
export function useSectionChat({
  selectedPrompt,
}: UseSectionChatParams): UseSectionChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // gravação
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const chunksRef = useRef<Blob[]>([]);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);

  // streaming
  const placeholderIndexRef = useRef<number>(-1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamBufferRef = useRef<string>("");

  /* ===== Gravação ===== */
  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    chunksRef.current = [];
    rec.ondataavailable = (e) =>
      e.data.size > 0 && chunksRef.current.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fixed = await fixWebmDuration(blob);
      const audioFile = new File([fixed], "gravacao.webm", {
        type: "audio/webm",
      });
      setFiles((prev) => [...prev, audioFile]); // Append recording to files
      stream.getTracks().forEach((t) => t.stop());
    };
    rec.start();
    setMediaRecorder(rec);
    setRecordStartTime(Date.now());
  };
  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    setRecordStartTime(null);
    setElapsedTime("00:00");
  };
  useEffect(() => {
    let timer: number | undefined;
    if (recordStartTime && isRecording) {
      timer = window.setInterval(() => {
        const diff = (Date.now() - recordStartTime) / 1000;
        const mm = String(Math.floor(diff / 60)).padStart(2, "0");
        const ss = String(Math.floor(diff % 60)).padStart(2, "0");
        setElapsedTime(`${mm}:${ss}`);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
      return undefined;
    };
  }, [recordStartTime, isRecording]);

  /* ===== UI stream flush ===== */
  function flushToUI() {
    const text = streamBufferRef.current;
    startTransition(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === placeholderIndexRef.current ? { ...m, content: text } : m,
        ),
      );
    });
  }

  /* ===== Histórico -> schema OpenRouter ===== */
  function buildHistoryForAPI(): ChatMessage[] {
    const out: ChatMessage[] = [];
    const sys = (selectedPrompt?.prompt ?? "").trim();
    if (sys) out.push({ role: "system", content: sys });

    for (const m of messages) {
      if (!m.content || m.content === "...") continue;
      out.push({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      });
    }
    return out;
  }

  /* ===== Fallback: transcrever com Whisper ===== */
  async function transcribeWithWhisper(audio: File): Promise<string> {
    const resp = await openai.audio.transcriptions.create({
      model: WHISPER_MODEL,
      file: audio,
      response_format: "text",
    } as any);
    return typeof resp === "string" ? resp : ((resp as any)?.text ?? "");
  }

  /* ===== Enviar ===== */
  async function handleSendMessage(overrideContent?: string) {
    // Captura texto e arquivos no início para enviar os dois juntos (não perder texto ao ter áudio pendente)
    const textToSend = (overrideContent ?? inputMessage).trim();
    const filesToSend = [...files];

    if (loading || (!textToSend && filesToSend.length === 0)) return;

    setLoading(true);

    // Prepare attachments for UI
    const attachments: Attachment[] = [];
    for (const f of filesToSend) {
      const url = URL.createObjectURL(f);
      attachments.push({
        url,
        type: f.type,
        name: f.name,
      });
    }

    // Quando há áudio/anexos E texto: mostrar duas bolhas (áudio acima, texto abaixo) antes da resposta da IA
    const hasAttachments = attachments.length > 0;
    const messagesToAdd: Message[] = [];

    if (hasAttachments) {
      messagesToAdd.push({
        role: "user",
        content: filesToSend.some((f) => f.type.startsWith("audio/")) ? "Mensagem de Áudio" : "Mensagem com anexo",
        attachments,
        ...(filesToSend.length === 1 && filesToSend[0].type.startsWith("audio/")
          ? {
              file: attachments[0].url,
              type: filesToSend[0].type,
              name: filesToSend[0].name,
            }
          : {}),
      });
    }
    if (textToSend) {
      messagesToAdd.push({
        role: "user",
        content: textToSend,
      });
    }

    setMessages((prev) => {
      const list = [...prev, ...messagesToAdd, { role: "ai", content: "..." }];
      placeholderIndexRef.current = list.length - 1;
      return list as Message[];
    });

    /* Construct Payload for API */
    const parts: Array<TextPart | ImagePart | AudioPart> = [];
    let attemptedAudio = false;

    // Process all files (áudio + outros)
    for (const file of filesToSend) {
      const mime = file.type || "";
      if (mime.startsWith("image/")) {
        const dataUrl = await fileToDataUrl(file);
        parts.push({ type: "image_url", image_url: { url: dataUrl } });
      } else if (mime === "application/pdf") {
        // For Gemini via OpenRouter/OpenAI SDK, PDF is often best sent as image_url with data URI
        // if the model supports it. Standard Gemini supports PDF.
        // Attempts to send as image_url with application/pdf mime type in data URI.
        const dataUrl = await fileToDataUrl(file);
        parts.push({ type: "image_url", image_url: { url: dataUrl } });
      } else if (mime.startsWith("audio/")) {
        // Workaround for OpenRouter/Gemini: Send audio as a Data URI in 'image_url' or similar structure
        // if the downstream model supports handling it as a generic file part.
        // Using `input_audio` often fails if the router/SDK doesn't map it correctly.
        const dataUrl = await fileToDataUrl(file);
        parts.push({
          type: "image_url",
          image_url: { url: dataUrl },
        });
        attemptedAudio = true;
      } else {
        parts.push({
          type: "text",
          text: `[Arquivo anexado: ${file.name} (${mime}) - Conteúdo não enviado diretamente]`,
        });
      }
    }

    // Sempre incluir texto quando o usuário digitou; senão, mensagem padrão se só houver arquivos
    if (textToSend) {
      parts.push({ type: "text", text: textToSend });
    } else if (filesToSend.length > 0 && !parts.some((p) => p.type === "text")) {
      parts.push({
        type: "text",
        text: "Por favor, analise os arquivos enviados.",
      });
    }

    // Clean UI State
    setInputMessage("");
    setFiles([]);

    // Histórico + Rodada Atual
    const base = buildHistoryForAPI();
    const lastUser: ChatMessage = { role: "user", content: parts };

    const messagesForAPI: ChatMessage[] = [...base, lastUser];

    /* Streaming */
    const runOnce = async (msgs: ChatMessage[]) => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      streamBufferRef.current = "";

      const completion = await openai.chat.completions.create(
        { model: MODEL, stream: true, messages: msgs as any },
        { signal: controller.signal },
      );

      for await (const chunk of completion as any) {
        const delta = chunk?.choices?.[0]?.delta?.content;
        if (!delta) continue;

        if (typeof delta === "string") {
          streamBufferRef.current += delta;
        } else if (Array.isArray(delta)) {
          for (const d of delta) {
            if (typeof d === "string") streamBufferRef.current += d;
            else if (typeof d?.text === "string")
              streamBufferRef.current += d.text;
          }
        }
        flushToUI();
      }
      flushToUI();
      return streamBufferRef.current;
    };

    try {
      const firstText = await runOnce(messagesForAPI);

      // Fallback para áudio se necessário
      if (attemptedAudio && looksLikeNoAudioSupport(firstText)) {
        // Encontra o primeiro arquivo de áudio para transcrever (limitação do fallback simples)
        // Idealmente transcreveria todos, mas vamos focar no primeiro para fallback
        const audioFile = filesToSend.find((f) => f.type.startsWith("audio/"));

        if (audioFile) {
          const transcript = await transcribeWithWhisper(audioFile);
          const base2 = buildHistoryForAPI();

          let previousText = "";
          // Tenta recuperar o texto que o usuário mandou junto
          const textPart = parts.find((p) => p.type === "text") as
            | TextPart
            | undefined;
          if (textPart) previousText = textPart.text;

          const prompt =
            previousText.length > 0
              ? `${previousText}\n\nTranscrição do áudio (ASR):\n${transcript}`
              : `Transcreva e responda ao áudio:\n${transcript}`;

          // Se tiver imagens, mantemos? O fallback complexo exigiria reconstruir tudo.
          // Simplificação: manda texto + transcrição se falhou o audio nativo.
          // Recupera imagens se houver
          const imageParts = parts.filter((p) => p.type === "image_url");

          const content: any[] = [
            { type: "text", text: prompt },
            ...imageParts,
          ];

          await runOnce([...base2, { role: "user", content }]);
        }
      }
    } catch (err) {
      console.error("OpenRouter stream error:", err);
      setMessages((prev) =>
        prev.map((m, i) =>
          i === placeholderIndexRef.current
            ? { ...m, content: "Erro ao responder. Tente novamente." }
            : m,
        ),
      );
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      streamBufferRef.current = "";
    }
  }

  function handleAbortStream() {
    abortControllerRef.current?.abort();
    setLoading(false);
  }

  /* ===== Compatibilidade (Single File) ===== */
  const file = files.length > 0 ? files[0] : null;
  const setFile = (f: File | null) => {
    setFiles(f ? [f] : []);
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    files,
    setFiles,
    loading,
    isRecording,
    elapsedTime,
    startRecording,
    stopRecording,
    handleSendMessage,
    handleAbortStream,
    // compat
    file,
    setFile,
  };
}
