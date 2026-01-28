"use client";

import { AudioPlayer } from "@/components/chatPopup/AudioPlayer";
import { useSectionChat } from "@/components/chatPopup/chat-handler";
import { Prompt } from "@/components/chatPopup/types";
import { useSession } from "@/context/auth";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { generalPrompt } from "@/utils/prompts";
import {
  ArrowLeft,
  BookOpen, // Resumir
  CheckSquare, // Extrair Tarefas
  FileText, // Gerar Ata
  Heart, // Sentimento
  Maximize2,
  Minimize2,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./components/chat-input";
import { SuggestionCard } from "./components/suggestion-card";
import { Messages } from "./messages";

type Suggestion = {
  title: string;
  description: string;
  icon: any;
  prompt: string;
};

export default function ChatPage() {
  const { profile } = useSession();
  const { selectedRecording } = useGeneralContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPrompt] = useState(generalPrompt);

  const hookPrompt: Prompt | undefined = selectedSuggestion
    ? {
        id: "transcription-prompt",
        name: selectedSuggestion.title,
        prompt: selectedSuggestion.prompt,
      }
    : selectedPrompt;

  const {
    messages,
    setMessages,
    inputMessage,
    handleSendMessage,
    setInputMessage,
    isRecording,
    startRecording,
    stopRecording,
    file,
    setFile,
    loading,
  } = useSectionChat({ selectedPrompt: hookPrompt });

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const suggestions = [
    {
      title: "Resumir Transcrição",
      description: "Crie um resumo conciso dos principais pontos discutidos.",
      icon: BookOpen,
      prompt: "Resuma a transcrição atual focando nos pontos principais.",
    },
    {
      title: "Extrair Tarefas",
      description: "Liste todas as ações e tarefas mencionadas na conversa.",
      icon: CheckSquare,
      prompt:
        "Liste todas as tarefas e ações pendentes identificadas na transcrição.",
    },
    {
      title: "Análise de Sentimento",
      description: "Analise o tom e o sentimento geral dos participantes.",
      icon: Heart,
      prompt:
        "Analise o sentimento e o tom da conversa baseada na transcrição.",
    },
    {
      title: "Gerar Ata",
      description: "Formate a conversa como uma ata de reunião formal.",
      icon: FileText,
      prompt: "Crie uma ata formal desta reunião baseada na transcrição.",
    },
  ];

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setMessages([]);
    setInputMessage("");
    if (selectedRecording && selectedRecording?.transcription) {
      // logic handled by useEffect below
    }
  };

  const handleBack = () => {
    setSelectedSuggestion(null);
    setMessages([]);
    setInputMessage("");
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputMessage("");
    setSelectedSuggestion(null);
  };

  useEffect(() => {
    handleNewChat();
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  // Re-inject transcription if messages cleared usually happens via useEffect logic
  useEffect(() => {
    if (messages.length === 0) {
      if (selectedRecording && selectedRecording?.transcription) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: selectedRecording.transcription as string,
          },
        ]);
      }
    }
  }, [messages.length, selectedRecording]);

  const styles = {
    iconGradient: "bg-gradient-to-r from-neutral-500 to-neutral-900",
    border: "border-gray-200",
  };

  const isChatEmpty = messages.filter((m) => m.role !== "system").length === 0;

  return (
    <div
      className={`flex w-full flex-col gap-6 ${
        isExpanded ? "" : "h-[calc(100vh-10rem)] overflow-hidden"
      }`}
    >
      {/* Header Standardized - STATIC */}
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Assistente de Lembrete
          </h1>
          <p className="text-sm text-gray-500">
            Conversando sobre: {selectedRecording?.name || "Lembrete"}
          </p>
        </div>

        {!isChatEmpty && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-500/25 transition-all hover:shadow-gray-500/40 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Nova Conversa
          </button>
        )}
      </div>

      {/* Chat Container */}
      <div
        className={`relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 ease-in-out ${
          isExpanded ? "h-[95vh]" : "min-h-0 flex-1"
        }`}
      >
        {/* Toggle Expand Button - Top Right */}
        <button
          onClick={handleToggleExpand}
          className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100/50 text-gray-500 backdrop-blur-sm transition-all hover:bg-gray-200 hover:text-gray-700 active:scale-95"
          title={isExpanded ? "Restaurar tamanho" : "Expandir tela"}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>

        {/* Suggestion Mode Overlay */}
        {selectedSuggestion && (
          <div className="animate-in fade-in slide-in-from-top-4 absolute top-6 left-6 z-10 flex items-center gap-3 duration-300">
            <button
              onClick={handleBack}
              className="group hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:text-white active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div className="border-primary flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <selectedSuggestion.icon className="text-primary h-4 w-4" />
              <span className="text-sm font-semibold text-gray-700">
                {selectedSuggestion.title}
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Area */}
        <div
          className={cn(
            "scrollbar-hide relative flex-1 p-6",
            isChatEmpty && !selectedSuggestion
              ? "overflow-hidden"
              : "overflow-y-auto scroll-smooth",
          )}
        >
          {!selectedSuggestion && isChatEmpty ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div
                    className={cn(
                      "flex h-20 w-20 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                      styles.iconGradient,
                    )}
                  >
                    <Image
                      className="h-12 w-12"
                      src={"/logos/iconWhite.png"}
                      alt="Icon"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="max-w-md space-y-2">
                    <h3 className="text-2xl font-semibold text-black">
                      Comece uma conversa
                    </h3>
                    <p className="text-gray-500">
                      Selecione uma das sugestões abaixo ou digite sua própria
                      pergunta para começar.
                    </p>
                  </div>
                </div>

                <div className="z-20 mt-6 w-full max-w-2xl px-4">
                  <ChatInput
                    value={inputMessage}
                    onChange={setInputMessage}
                    onSend={() => handleSendMessage()}
                    isRecording={isRecording}
                    onRecordStart={startRecording}
                    onRecordStop={stopRecording}
                    isLoading={loading}
                  />
                </div>
              </div>
              <div className="mt-auto py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {suggestions.map((suggestion, index) => (
                    <SuggestionCard
                      key={index}
                      index={index}
                      title={suggestion.title}
                      icon={suggestion.icon}
                      onClick={() => handleSuggestionClick(suggestion)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-full flex-col gap-4 py-2 pt-12">
              {/* If just starting a suggestion mode but no messages yet */}
              {isChatEmpty && selectedSuggestion && (
                <div className="animate-in fade-in zoom-in-95 flex flex-1 flex-col items-center justify-center duration-500">
                  <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                    <selectedSuggestion.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Modo {selectedSuggestion.title} Ativado
                  </h3>
                  <p className="mt-1 max-w-xs text-center text-sm text-gray-500">
                    {selectedSuggestion.prompt.replace(":", "...")}
                  </p>
                </div>
              )}

              {messages.map(
                (message, i) =>
                  message.role !== "system" && (
                    <Messages
                      key={`business-msg-${i}-${message.content.substring(0, 10)}`}
                      message={message}
                    />
                  ),
              )}
              <div ref={bottomRef} className="h-2" />
            </div>
          )}
        </div>

        {(!isChatEmpty || selectedSuggestion) && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            {/* File Preview Area */}
            {file && (
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white/50 px-4 py-2">
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  </div>
                  <span className="truncate text-xs font-medium text-gray-500">
                    Áudio anexado
                  </span>
                </div>

                <div className="h-8 w-32">
                  <AudioPlayer
                    audioUrl={URL.createObjectURL(file)}
                    className="h-full w-full"
                  />
                </div>

                <button
                  onClick={() => setFile(null)}
                  className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => handleSendMessage()}
              isRecording={isRecording}
              onRecordStart={startRecording}
              onRecordStop={stopRecording}
              isLoading={typeof loading !== "undefined" ? loading : false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
