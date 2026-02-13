"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { useSession } from "@/context/auth";
import { Prompt, useChatPage } from "@/context/chatContext";
import { useChatEngine } from "@/hooks/useChatEngine";
import { cn } from "@/utils/cn";
import { PromptIcon } from "@/utils/prompt-icon";
import { ChevronDown, PanelLeftOpen, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./components/chat-input";
import { ChatSidebar } from "./components/chat-sidebar";
import { Messages } from "./components/messages";
import { PromptsCarousel } from "./components/prompts-carousel";

export default function ChatBusiness() {
  const { profile } = useSession();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    chats,
    searchQuery,
    setSearchQuery,
    hasMorePages,
    isLoadingHistory,
    loadMoreChats,
    selectedPrompt,
    prompts,
    handleSelectPrompt,
  } = useChatPage();

  const engine = useChatEngine({
    promptId: selectedPrompt?.id,
    promptContent: selectedPrompt?.content,
  });

  const [inputMessage, setInputMessage] = useState("");

  // Auto-scroll to bottom
  useEffect(() => {
    if (engine.messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [engine.messages]);

  const handlePromptSelect = (prompt: Prompt) => {
    handleSelectPrompt(prompt);
    engine.clearChat(); // Clear chat to start fresh context
    setInputMessage(""); // Ensure input is clean
  };

  const handleBack = () => {
    // Limpa o estado de forma suave
    handleSelectPrompt(null);
    engine.clearChat();
    setInputMessage("");
    // Scroll suave para o topo quando voltar
    setTimeout(() => {
      const scrollArea = document.querySelector('[class*="scrollbar-hide"]');
      if (scrollArea) {
        scrollArea.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  const handleNewChat = () => {
    engine.clearChat();
    setInputMessage("");
    handleSelectPrompt(null);
  };

  const handleSendMessage = () => {
    if (
      inputMessage.trim() ||
      engine.fileHandler.files.length > 0 ||
      engine.audioRecorder.audioFile
    ) {
      engine.sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const styles = {
    iconGradient: "bg-gradient-to-r from-neutral-500 to-neutral-900",
    border: "border-gray-200",
  };

  const isChatEmpty = engine.messages.length === 0;
  const hasSelectedPrompt = selectedPrompt !== null;

  return (
    <div
    className={cn("flex h-[calc(100vh-8rem)] w-full gap-6")}
    style={{
      minHeight: 0, // Previne problemas de layout
    }}
    >
      {/* Sidebar - Histórico */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-80" : "w-0 overflow-hidden",
          "hidden h-full lg:block",
        )}
      >
        <ChatSidebar
          onToggle={() => setIsSidebarOpen(false)} // Inner close button
          onNewChat={handleNewChat}
          chats={chats}
          currentChatId={engine.chatId}
          onSelectChat={(chatId) => engine.loadChat(chatId)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasMorePages={hasMorePages}
          isLoadingHistory={isLoadingHistory}
          onLoadMore={loadMoreChats}
          className="h-full w-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 overflow-hidden">
        {/* Header Standardized - STATIC */}
        <div className="flex w-full shrink-0 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Open Sidebar Trigger - Visible when sidebar is closed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95 lg:flex"
                title="Abrir Histórico"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </button>
            )}

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Inteligência Artificial
              </h1>
              <p className="text-sm text-gray-500">
                Olá, {profile?.name?.split(" ")[0] || "Usuário"}. Como posso
                ajudar?
              </p>
            </div>
          </div>

          {/* Right side: Dropdown and New Chat Button */}
          <div className="flex items-center gap-3">
            {/* Dropdown de Prompts - Só aparece quando há conversa */}
            {prompts.length > 0 && !isChatEmpty && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md">
                    <span className="max-w-[150px] truncate">
                      {selectedPrompt?.name || "Selecione um prompt"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Prompts Disponíveis</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {prompts.map((prompt) => (
                    <DropdownMenuItem
                      key={prompt.id}
                      onClick={() => handleSelectPrompt(prompt)}
                      className={cn(
                        "cursor-pointer",
                        selectedPrompt?.id === prompt.id &&
                          "bg-gray-50 text-gray-700",
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {prompt.name}
                        </span>
                        {prompt.source && (
                          <span className="text-xs text-gray-500">
                            {prompt.source === "USER"
                              ? "Meu Prompt"
                              : prompt.source === "COMPANY"
                                ? "Empresa"
                                : "Global"}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Create New Chat Button (Mobile/Tablet) */}
            <div className="lg:hidden">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-500/25 transition-all hover:shadow-gray-500/40 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Nova Conversa
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container - Fixed Layout */}
        <div
          className={cn(
            "relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm",
            "flex-1",
          )}
          style={{
            minHeight: 0, // Previne problemas de layout
          }}
        >
          {/* Prompt Mode Overlay - Removido, não queremos mais mostrar no topo */}

          {/* Scrollable Area */}
          <div
            className={cn(
              "scrollbar-hide relative flex-1 p-6",
              isChatEmpty ? "overflow-hidden" : "overflow-y-auto scroll-smooth",
            )}
            style={{
              minHeight: 0, // Previne problemas de layout
            }}
          >
            {isChatEmpty ? (
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
                      onSend={handleSendMessage}
                      isRecording={engine.audioRecorder.isRecording}
                      onRecordStart={engine.audioRecorder.startRecording}
                      onRecordStop={engine.audioRecorder.stopRecording}
                      isLoading={engine.loading}
                      files={engine.fileHandler.files.map((f) => f.file)}
                      audioBlob={engine.audioRecorder.audioFile}
                      onClearAudio={engine.audioRecorder.clearAudio}
                      onFilesChange={(newFiles) => {
                        // Sincroniza com fileHandler
                        // Se a lista diminuiu, remove do fileHandler
                        if (newFiles.length < engine.fileHandler.files.length) {
                          // Remove arquivos que não estão mais na lista
                          const currentFileIds = engine.fileHandler.files.map(
                            (f) => f.id,
                          );
                          const newFileNames = new Set(
                            newFiles.map((f) => f.name),
                          );
                          engine.fileHandler.files.forEach((attachedFile) => {
                            if (!newFileNames.has(attachedFile.file.name)) {
                              engine.fileHandler.removeFile(attachedFile.id);
                            }
                          });
                        } else {
                          // Adiciona novos arquivos
                          const currentFileNames = new Set(
                            engine.fileHandler.files.map((f) => f.file.name),
                          );
                          const filesToAdd = newFiles.filter(
                            (f) => !currentFileNames.has(f.name),
                          );
                          if (filesToAdd.length > 0) {
                            const dt = new DataTransfer();
                            filesToAdd.forEach((file) => dt.items.add(file));
                            engine.fileHandler.handleFileSelect(dt.files);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="mt-auto py-4">
                  {prompts.length > 0 && (
                    <PromptsCarousel
                      prompts={prompts}
                      onSelectPrompt={handlePromptSelect}
                      selectedPromptId={
                        selectedPrompt
                          ? (selectedPrompt as Prompt).id
                          : undefined
                      }
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-full flex-col gap-4 py-2">
                {/* If just starting a prompt mode but no messages yet */}
                {engine.messages.length === 0 &&
                  hasSelectedPrompt &&
                  selectedPrompt && (
                    <div className="animate-in fade-in zoom-in-95 flex flex-1 flex-col items-center justify-center pt-12 duration-500">
                      <div className="bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                        <PromptIcon
                          icon={selectedPrompt.icon}
                          className="h-8 w-8 text-white"
                          size={32}
                        />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Modo {selectedPrompt.name} Ativado
                      </h3>
                      <p className="mt-1 max-w-xs text-center text-sm text-gray-500">
                        {selectedPrompt.content.substring(0, 100)}
                        {selectedPrompt.content.length > 100 ? "..." : ""}
                      </p>
                    </div>
                  )}

                {engine.messages.length > 0 && (
                  <>
                    {engine.messages.map((message, i) => (
                      <Messages
                        key={`business-msg-${i}-${message.id || i}`}
                        message={message}
                      />
                    ))}
                    <div ref={bottomRef} className="h-2" />
                  </>
                )}
              </div>
            )}
          </div>

          {!isChatEmpty && (
            <div className="border-t border-gray-100 bg-gray-50/50">
              <ChatInput
                value={inputMessage}
                onChange={setInputMessage}
                onSend={handleSendMessage}
                isRecording={engine.audioRecorder.isRecording}
                onRecordStart={engine.audioRecorder.startRecording}
                onRecordStop={engine.audioRecorder.stopRecording}
                isLoading={engine.loading}
                files={engine.fileHandler.files.map((f) => f.file)}
                audioBlob={engine.audioRecorder.audioFile}
                onClearAudio={engine.audioRecorder.clearAudio}
                onFilesChange={(newFiles) => {
                  // Converter File[] para FileList para o handleFileSelect
                  const dt = new DataTransfer();
                  newFiles.forEach((file) => dt.items.add(file));
                  engine.fileHandler.handleFileSelect(dt.files);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
