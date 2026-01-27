"use client";

import { useApiContext } from "@/context/ApiContext";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Prompt = {
  id: string;
  name: string;
  content: string;
  icon?: string; // SVG string ou nome do ícone Lucide
  source?: "USER" | "COMPANY" | "GLOBAL";
};

export type ChatItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

interface ChatPageContextProps {
  // --- Estados de Seleção ---
  selectedPrompt: Prompt | null;

  // --- Ações de Seleção ---
  handleSelectPrompt: (prompt: Prompt | null) => void;

  // --- Dados do Chat ---
  prompts: Prompt[]; // Prompts disponíveis
  chats: ChatItem[]; // Histórico de conversas

  // --- Controle de Histórico com Paginação ---
  handleGetHistory: (page?: number, query?: string) => Promise<void>;
  isLoadingHistory: boolean;
  historyPage: number;
  hasMorePages: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  loadMoreChats: () => Promise<void>;
}

const ChatPageContext = createContext<ChatPageContextProps | undefined>(
  undefined
);

export const ChatPageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { GetAPI } = useApiContext();

  // --- STATES ---
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [chats, setChats] = useState<ChatItem[]>([]);

  // States de Histórico
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isInitialMount = useRef(true);

  // --- FUNÇÕES ---

  // 1. Buscar Prompts de Chat
  const handleGetChatPrompts = useCallback(async () => {
    try {
      const response = await GetAPI("/prompts/chat", true);
      if (response.status === 200) {
        setPrompts(response.body || []);
        // Não auto-seleciona prompt - usuário escolhe manualmente se quiser
      }
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
    }
  }, [GetAPI]);

  // 2. Buscar Histórico (NOVA LÓGICA PAGINADA)
  const handleGetHistory = useCallback(
    async (page = 1, query?: string) => {
      setIsLoadingHistory(true);
      try {
        // Construir query string com page e query (se fornecido)
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        if (query && query.trim()) {
          queryParams.append("query", query.trim());
        }

        const response = await GetAPI(`/chat?${queryParams.toString()}`, true);

        if (response.status === 200) {
          const newChats = response.body.data || [];
          const meta = response.body.meta;

          setChats((prev) => {
            if (page === 1) return newChats; // Se for pág 1, substitui tudo
            // Se for pág > 1, evita duplicatas e adiciona ao final
            const existingIds = new Set(prev.map((c) => c.id));
            const uniqueNewChats = newChats.filter(
              (c: ChatItem) => !existingIds.has(c.id)
            );
            return [...prev, ...uniqueNewChats];
          });

          setHistoryPage(page);

          // Atualizar hasMorePages baseado na meta
          if (meta) {
            setHasMorePages(page < meta.totalPages);
          } else {
            setHasMorePages(false);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [GetAPI]
  );

  // Função para carregar mais chats (próxima página)
  const loadMoreChats = useCallback(async () => {
    if (!hasMorePages || isLoadingHistory) return;
    await handleGetHistory(historyPage + 1, searchQuery);
  }, [hasMorePages, isLoadingHistory, historyPage, searchQuery, handleGetHistory]);

  // 3. Seleção de Prompt
  const handleSelectPrompt = (prompt: Prompt | null) => {
    setSelectedPrompt(prompt);
  };

  // --- EFEITOS ---

  // Inicialização: Carrega Prompts
  useEffect(() => {
    handleGetChatPrompts();
  }, [handleGetChatPrompts]);

  // Efeito para buscar quando searchQuery mudar (com debounce, exceto na inicialização)
  useEffect(() => {
    if (isInitialMount.current) {
      // Na inicialização, busca imediatamente sem debounce
      isInitialMount.current = false;
      handleGetHistory(1, searchQuery);
      return;
    }

    // Em mudanças subsequentes, aplica debounce
    const timeoutId = setTimeout(() => {
      handleGetHistory(1, searchQuery);
    }, 400); // Debounce de 400ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleGetHistory]);

  return (
    <ChatPageContext.Provider
      value={{
        // Seleção
        selectedPrompt,
        handleSelectPrompt,
        prompts,

        // Histórico
        chats,
        handleGetHistory,
        isLoadingHistory,
        historyPage,
        hasMorePages,
        searchQuery,
        setSearchQuery,
        loadMoreChats,
      }}
    >
      {children}
    </ChatPageContext.Provider>
  );
};

export const useChatPage = () => {
  const context = useContext(ChatPageContext);
  if (!context)
    throw new Error("useChatPage must be used within a ChatPageProvider");
  return context;
};
