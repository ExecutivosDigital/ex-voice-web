import { cn } from "@/utils/cn";
import { Loader2, MessageSquare, PanelLeftClose, Plus, Search } from "lucide-react";

interface ChatSidebarProps {
  onNewChat: () => void;
  onToggle: () => void;
  chats: Array<{ id: string; name: string; createdAt: string; updatedAt: string }>;
  currentChatId?: string;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasMorePages: boolean;
  isLoadingHistory: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function ChatSidebar({
  onNewChat,
  onToggle,
  chats,
  currentChatId,
  onSelectChat,
  searchQuery,
  onSearchChange,
  hasMorePages,
  isLoadingHistory,
  onLoadMore,
  className,
}: ChatSidebarProps) {

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {/* New Header Row */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-800">Histórico</h2>
        <button
          onClick={onToggle}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          title="Fechar barra lateral"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar histórico..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
        />
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-gray-500/20 transition-all hover:scale-[1.02] hover:shadow-gray-500/30 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        Nova Conversa
      </button>

      {/* History List */}
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 flex-1 overflow-y-auto pr-1">
        {chats.length === 0 && !isLoadingHistory ? (
          <p className="px-4 py-2 text-sm text-gray-400 text-center">
            {searchQuery ? "Nenhum resultado encontrado" : "Nenhuma conversa"}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all",
                  currentChatId === chat.id
                    ? "bg-gray-50 text-gray-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <MessageSquare
                  className={cn(
                    "h-4 w-4 shrink-0",
                    currentChatId === chat.id
                      ? "text-gray-600"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                <span className="truncate">{chat.name}</span>
              </button>
            ))}

            {/* Botão Carregar Mais */}
            {hasMorePages && (
              <div className="px-4 py-2">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingHistory}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                    isLoadingHistory
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  {isLoadingHistory ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Carregando...</span>
                    </>
                  ) : (
                    <span>Carregar mais</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-gray-100 pt-4 text-center">
        <p className="min-w-max text-xs text-gray-400">
          {isLoadingHistory ? "Carregando..." : `${chats.length} conversa${chats.length !== 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
}
