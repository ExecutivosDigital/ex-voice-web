"use client";

import { useApiContext } from "@/context/ApiContext";
import { useCallback, useEffect, useState } from "react";

/** Prompt retornado pela API /prompts/chat (type CHAT) */
export type ChatPrompt = {
  id: string;
  name: string;
  content: string;
  icon?: string;
  source?: "USER" | "COMPANY" | "GLOBAL";
};

/**
 * Busca os prompts de chat (type CHAT) da API.
 * Mesma lógica usada na tela Chat Business, reutilizável nas demais telas de chat.
 */
export function useChatPrompts() {
  const { GetAPI } = useApiContext();
  const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetAPI("/prompts/chat", true);
      if (response.status === 200) {
        setPrompts(response.body || []);
      }
    } catch (error) {
      console.error("Erro ao buscar prompts de chat:", error);
      setPrompts([]);
    } finally {
      setIsLoading(false);
    }
  }, [GetAPI]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  return { prompts, isLoading, refetch: fetchPrompts };
}
