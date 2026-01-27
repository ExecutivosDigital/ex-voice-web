"use client";

import { Modal } from "@/components/ui/modal";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { PromptIcon } from "@/utils/prompt-icon";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface PromptOption {
  id: string;
  name: string;
  content: string;
  type: string;
  source: "USER" | "COMPANY" | "GLOBAL";
  icon?: string;
}

export function RequestTranscription() {
  const { selectedRecording, setSelectedRecording } = useGeneralContext();
  const { PutAPI, GetAPI } = useApiContext();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<PromptOption[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      fetchAvailablePrompts();
    } else {
      setSearchQuery("");
    }
  }, [isModalOpen]);

  async function fetchAvailablePrompts() {
    setIsLoadingPrompts(true);
    try {
      const response = await GetAPI(`/prompts/available`, true);
      if (response.status === 200) {
        setPrompts(response.body || []);
      } else {
        console.error("Erro ao buscar prompts:", response.status);
        setPrompts([]);
      }
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      setPrompts([]);
    } finally {
      setIsLoadingPrompts(false);
    }
  }

  async function HandleRequestTranscription(promptId?: string) {
    if (!selectedRecording) {
      return;
    }
    setIsRequesting(true);
    const request = await PutAPI(
      `/recording/${selectedRecording?.id}`,
      {
        status: "PENDING",
        ...(promptId && { promptId }),
      },
      true,
    );
    if (request.status === 200) {
      toast.success("Solicitação enviada com sucesso!");
      setSelectedRecording({
        ...selectedRecording,
        transcriptionStatus: "PENDING",
      });
      setIsModalOpen(false);
      return setIsRequesting(false);
    }
    toast.error("Erro ao solicitar transcrição!");
    setIsRequesting(false);
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleSelectPrompt(prompt: PromptOption) {
    HandleRequestTranscription(prompt.id);
  }

  function getSourceLabel(source: string) {
    switch (source) {
      case "USER":
        return "Pessoal";
      case "COMPANY":
        return "Empresa";
      case "GLOBAL":
        return "Global";
      default:
        return source;
    }
  }

  function getSourceColor(source: string) {
    switch (source) {
      case "USER":
        return "bg-purple-100 text-purple-800";
      case "COMPANY":
        return "bg-gray-100 text-gray-800";
      case "GLOBAL":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return prompts;
    const query = searchQuery.toLowerCase();
    return prompts.filter(
      (prompt) =>
        prompt.name.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query),
    );
  }, [prompts, searchQuery]);

  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={
          selectedRecording?.transcriptionStatus === "PENDING" || isRequesting
        }
        className={cn(
          "bg-primary absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white",
          selectedRecording?.transcriptionStatus === "PENDING" &&
            "cursor-wait bg-green-400 opacity-50",
          selectedRecording?.transcriptionStatus === "DONE" && "hidden",
        )}
      >
        {isRequesting ? (
          <>
            <Loader2 className="animate-spin" />
            Transcrevendo...
          </>
        ) : selectedRecording?.transcriptionStatus === "PENDING" ? (
          "Transcrição pendente"
        ) : (
          "Solicitar Transcrição"
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="max-w-4xl h-[90vh]"
        className="border-gray-200 bg-white"
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-bold text-gray-800">
                Selecione um prompt
              </h2>
              <p className="text-sm text-gray-500">
                Escolha o prompt que será utilizado para a transcrição
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Prompts List */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
              {isLoadingPrompts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  {searchQuery
                    ? "Nenhum prompt encontrado para esta busca"
                    : "Nenhum prompt disponível para este tipo de gravação"}
                </div>
              ) : (
                filteredPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSelectPrompt(prompt)}
                    disabled={isRequesting}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-50",
                      isRequesting && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                      <PromptIcon
                        icon={prompt.icon}
                        size={20}
                        className="text-white"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {prompt.name}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          getSourceColor(prompt.source),
                        )}
                      >
                        {getSourceLabel(prompt.source)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
