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
import { useRef } from "react";

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
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || files.length > 0) && !isLoading) {
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
    // Reset value to allow selecting same file again
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

      {/* File Preview Area */}
      {files.length > 0 && (
        <div className="mb-2 flex w-full max-w-[90%] flex-wrap gap-2">
          {files.map((file, index) => {
            const fileKey = `${file.name}-${index}`;
            if (file.type.startsWith("audio/")) {
              const url = URL.createObjectURL(file);
              return (
                <div key={fileKey} className="relative flex items-center pr-2">
                  <WaveformAudioPlayer
                    audioUrl={url}
                    barCount={20}
                    className="w-64 border border-blue-100 bg-white py-2 shadow-sm [&_button]:bg-blue-50 [&_button]:text-blue-600 [&_button]:hover:bg-blue-100 [&_span]:text-blue-600 [&_svg]:fill-blue-600 [&_svg]:text-blue-600"
                    videoDuration="00:00"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 rounded-full bg-white p-1 text-gray-400 shadow-sm hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
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

      <div className="invisible mb-1 text-center text-xs text-gray-400">""</div>
      <div className="relative flex min-w-[80%] items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group text-primary relative flex h-8 w-8 items-center justify-center rounded-lg from-sky-500 to-blue-600 transition-all hover:scale-105 hover:bg-gradient-to-br hover:text-white active:scale-95"
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
            onClick={handleMicClick}
            className={`group text-primary relative flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95 ${
              isRecording
                ? "animate-pulse bg-red-500 hover:bg-red-600"
                : "text-primary from-sky-500 to-blue-600 hover:bg-gradient-to-br hover:text-white"
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
            disabled={
              (!value.trim() && files.length === 0) || isLoading || isRecording
            }
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              (value.trim() || files.length > 0) && !isLoading && !isRecording
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-center text-xs text-gray-400">
        O HealthVoice pode cometer erros. Considere verificar informações
        importantes.
      </div>
    </div>
  );
}
