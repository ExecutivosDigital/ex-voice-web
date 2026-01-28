"use client";

import { ArrowUp, Mic, Paperclip, Square } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isRecording: boolean;
  onRecordStart: () => void;
  onRecordStop: () => void;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isRecording,
  onRecordStart,
  onRecordStop,
  isLoading,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
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
      <div className="invisible mb-1 text-center text-xs text-gray-400">""</div>
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
            onClick={handleMicClick}
            className={`group text-primary relative flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95 ${
              isRecording
                ? "animate-pulse bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-neutral-500 to-neutral-900 text-white hover:opacity-90"
            }`}
          >
            {isRecording ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onSend}
            disabled={!value.trim() || isLoading || isRecording}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              value.trim() && !isLoading && !isRecording
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
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
