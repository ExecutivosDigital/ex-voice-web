"use client";

import { useSectionChat } from "@/components/chatPopup/chat-handler";
import { Prompt } from "@/components/chatPopup/types";
import { useSession } from "@/context/auth";
import { useGeneralContext } from "@/context/GeneralContext";
import { useChatPrompts, type ChatPrompt } from "@/hooks/useChatPrompts";
import { cn } from "@/utils/cn";
import { generalPrompt } from "@/utils/prompts";
import { PromptIcon } from "@/utils/prompt-icon";
import { ArrowLeft, Maximize2, Minimize2, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./components/chat-input";
import { SuggestionCard } from "./components/suggestion-card";
import { Messages } from "./messages";

export default function ChatPage() {
  const { profile } = useSession();
  const { selectedRecording } = useGeneralContext();
  const { prompts, isLoading: isLoadingPrompts } = useChatPrompts();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<ChatPrompt | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPrompt] = useState(generalPrompt);

  const hookPrompt: Prompt | undefined = selectedSuggestion
    ? {
        id: selectedSuggestion.id,
        name: selectedSuggestion.name,
        prompt: selectedSuggestion.content,
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
    files,
    setFiles,
    loading,
  } = useSectionChat({ selectedPrompt: hookPrompt });

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSuggestionClick = (prompt: ChatPrompt) => {
    setSelectedSuggestion(prompt);
    setMessages([]);
    setInputMessage("");
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
    iconGradient: "bg-gradient-to-br from-sky-500 to-blue-600",
    border: "border-sky-200",
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
            Assistente de Transcrição
          </h1>
          <p className="text-sm text-gray-500">
            Conversando sobre: {selectedRecording?.name || "Gravação"}
          </p>
        </div>

        {!isChatEmpty && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40 active:scale-95"
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
              <PromptIcon
                icon={selectedSuggestion.icon}
                className="text-primary h-4 w-4"
                size={16}
              />
              <span className="text-sm font-semibold text-gray-700">
                {selectedSuggestion.name}
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
                    files={files}
                    onFilesChange={setFiles}
                    pendingAudioFile={file}
                    onDiscardAudio={() => setFile(null)}
                  />
                </div>
              </div>
              <div className="mt-auto py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {isLoadingPrompts ? (
                    <p className="text-sm text-gray-500">Carregando sugestões...</p>
                  ) : (
                    prompts.map((prompt, index) => (
                      <SuggestionCard
                        key={prompt.id}
                        index={index}
                        title={prompt.name}
                        icon={prompt.icon ?? ""}
                        onClick={() => handleSuggestionClick(prompt)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-full flex-col gap-4 py-2 pt-12">
              {/* If just starting a suggestion mode but no messages yet */}
              {isChatEmpty && selectedSuggestion && (
                <div className="animate-in fade-in zoom-in-95 flex flex-1 flex-col items-center justify-center duration-500">
                  <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                    <PromptIcon
                      icon={selectedSuggestion.icon}
                      className="h-8 w-8"
                      size={32}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Modo {selectedSuggestion.name} Ativado
                  </h3>
                  <p className="mt-1 max-w-xs text-center text-sm text-gray-500">
                    {selectedSuggestion.content.replace(":", "...")}
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
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => handleSendMessage()}
              isRecording={isRecording}
              onRecordStart={startRecording}
              onRecordStop={stopRecording}
              isLoading={typeof loading !== "undefined" ? loading : false}
              files={files}
              onFilesChange={setFiles}
              pendingAudioFile={file}
              onDiscardAudio={() => setFile(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
