"use client";

import { WaveformAudioPlayer } from "@/components/ui/waveform-audio-player";
import { ArrowUp, Mic, Paperclip, Square, X } from "lucide-react";
import { useEffect, useMemo } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isRecording: boolean;
  onRecordStart: () => void;
  onRecordStop: () => void;
  isLoading?: boolean;
  /** Áudio gravado pelo mic, pendente de confirmar e enviar */
  pendingAudioFile?: File | null;
  /** Chamado quando o usuário descarta o áudio gravado (sem enviar) */
  onDiscardAudio?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isRecording,
  onRecordStart,
  onRecordStop,
  isLoading,
  pendingAudioFile = null,
  onDiscardAudio,
}: ChatInputProps) {
  const pendingAudioUrl = useMemo(
    () => (pendingAudioFile ? URL.createObjectURL(pendingAudioFile) : null),
    [pendingAudioFile],
  );
  useEffect(() => {
    return () => {
      if (pendingAudioUrl) URL.revokeObjectURL(pendingAudioUrl);
    };
  }, [pendingAudioUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (
        (value.trim() || pendingAudioFile) &&
        !isLoading &&
        !isRecording
      ) {
        onSend();
      }
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      onRecordStop();
    } else {
      onRecordStart();
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center px-4 py-2 pb-1">
      {pendingAudioFile && pendingAudioUrl && (
        <div className="mb-0 w-full min-w-[80%] max-w-[80%]">
          <WaveformAudioPlayer
            audioUrl={pendingAudioUrl}
            barCount={14}
            className="w-full border border-blue-100 bg-white py-1.5 pl-2 pr-2 shadow-sm [&_button]:h-6 [&_button]:w-6 [&_button]:bg-blue-50 [&_button]:text-blue-600 [&_button]:hover:bg-blue-100 [&_span]:text-blue-600 [&_span]:text-xs [&_svg]:h-3 [&_svg]:w-3 [&_svg]:fill-blue-600 [&_svg]:text-blue-600"
            videoDuration="00:00"
          />
          <span className="mt-0.5 block text-[10px] text-gray-500">
            Áudio gravado. Você pode digitar um texto abaixo e enviar áudio + mensagem juntos, ou só o áudio. Clique na seta para enviar ou no X para cancelar o áudio.
          </span>
        </div>
      )}
      <div className={`invisible text-center text-xs text-gray-400 ${pendingAudioFile ? "mb-0" : "mb-1"}`}>""</div>
      <div className="relative flex min-w-[80%] items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md">
        <button className="group text-primary relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-900 text-white transition-all hover:scale-105 hover:opacity-90 active:scale-95">
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording
              ? "Gravando áudio..."
              : "Faça uma pergunta ou solicitação..."
          }
          disabled={isRecording || isLoading}
          className="flex-1 bg-transparent px-2 text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={
              pendingAudioFile
                ? onDiscardAudio
                : handleMicClick
            }
            className={`group relative flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95 ${
              isRecording
                ? "animate-pulse bg-red-500 hover:bg-red-600 text-white"
                : pendingAudioFile
                  ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                  : "bg-gradient-to-r from-neutral-500 to-neutral-900 text-white hover:opacity-90"
            }`}
            title={
              pendingAudioFile
                ? "Cancelar áudio"
                : isRecording
                  ? "Parar gravação"
                  : "Gravar áudio"
            }
          >
            {isRecording ? (
              <Square className="h-4 w-4 fill-current" />
            ) : pendingAudioFile ? (
              <X className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onSend}
            disabled={
              (!value.trim() && !pendingAudioFile) || isLoading || isRecording
            }
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              (value.trim() || pendingAudioFile) && !isLoading && !isRecording
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
            title={pendingAudioFile && value.trim() ? "Enviar áudio e mensagem" : pendingAudioFile ? "Enviar áudio" : "Enviar mensagem"}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-center text-xs text-gray-400">
        O ExVoice pode cometer erros. Considere verificar informações
        importantes.
      </div>
    </div>
  );
}
