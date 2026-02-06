"use client";

import { WaveformAudioPlayer } from "@/components/ui/waveform-audio-player";
import {
  ArrowUp,
  FileAudio,
  FileText,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Square,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isRecording: boolean;
  onRecordStart: () => void;
  onRecordStop: () => void;
  isLoading?: boolean;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
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
  files = [],
  onFilesChange,
  pendingAudioFile = null,
  onDiscardAudio,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        (value.trim() || files.length > 0 || pendingAudioFile) &&
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFilesChange) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
    if (e.target) e.target.value = "";
  };

  const removeFile = (index: number) => {
    if (onFilesChange) {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith("audio/"))
      return <FileAudio className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center px-4 py-2 pb-1">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,application/pdf,audio/*"
        onChange={handleFileSelect}
      />

      {pendingAudioFile && pendingAudioUrl && (
        <div className="mb-0 w-full min-w-[80%] max-w-[80%]">
          <WaveformAudioPlayer
            audioUrl={pendingAudioUrl}
            barCount={14}
            className="w-full border border-neutral-100 bg-white py-1.5 pl-2 pr-2 shadow-sm [&_button]:h-6 [&_button]:w-6 [&_button]:bg-neutral-50 [&_button]:text-neutral-600 [&_button]:hover:bg-neutral-100 [&_span]:text-neutral-600 [&_span]:text-xs [&_svg]:h-3 [&_svg]:w-3 [&_svg]:fill-neutral-600 [&_svg]:text-neutral-600"
            videoDuration="00:00"
          />
          <span className="mt-0.5 block text-[10px] text-gray-500">
            Áudio gravado. Você pode digitar um texto abaixo e enviar áudio + mensagem juntos, ou só o áudio. Clique na seta para enviar ou no X para cancelar o áudio.
          </span>
        </div>
      )}
      <div className={`invisible text-center text-xs text-gray-400 ${pendingAudioFile ? "mb-0" : "mb-1"}`}>""</div>

      {/* File Preview Area */}
      {files.length > 0 && (
        <div className="flex w-full max-w-[90%] flex-wrap gap-2">
          {files.map((file, index) => {
            const fileKey = `${file.name}-${index}`;
            if (file.type.startsWith("audio/")) {
              return null
            }

            return (
              <div
                key={fileKey}
                className="group relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm"
              >
                <div className="text-blue-500">{getFileIcon(file)}</div>
                <span className="max-w-[150px] truncate text-xs text-gray-700">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={`invisible text-center text-xs text-gray-400 ${pendingAudioFile ? "mb-0" : "mb-1"}`}>""</div>
      <div className="relative flex min-w-[80%] items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group text-primary relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-900 text-white transition-all hover:scale-105 hover:opacity-90 active:scale-95"
          title="Anexar arquivos"
        >
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
              (!value.trim() && files.length === 0 && !pendingAudioFile) ||
              isLoading ||
              isRecording
            }
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              (value.trim() || files.length > 0 || pendingAudioFile) &&
              !isLoading &&
              !isRecording
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
