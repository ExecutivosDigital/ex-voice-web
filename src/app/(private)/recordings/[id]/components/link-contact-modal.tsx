"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useApiContext } from "@/context/ApiContext";
import { cn } from "@/utils/cn";
import { Check, Loader2, Search, UserRound, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * "Gravar sem vínculo e atribuir contato depois" (VISAO-PRODUTO): vincula ou
 * troca o contato de uma gravação já salva. Além de organizar o acervo, o
 * vínculo re-dispara a nomeação automática dos locutores remotos — a reunião
 * passa a ter um "com quem" e o sistema usa isso para batizar as vozes.
 */

interface ContactOption {
  id: string;
  name: string;
}

const PAGE_SIZE = 20;

export function LinkContactModal({
  recordingId,
  currentClient,
  open,
  onClose,
}: {
  recordingId: string;
  currentClient: { id: string; name: string } | null;
  open: boolean;
  onClose: () => void;
}) {
  const { GetAPI, PutAPI } = useApiContext();
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchContacts = useCallback(
    async (search: string, pageToLoad: number, append: boolean) => {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", String(pageToLoad));
      if (search.trim()) params.append("query", search.trim());
      const response = await GetAPI(`/client?${params.toString()}`, true);
      if (response?.status === 200) {
        const batch: ContactOption[] = response.body?.clients || [];
        setContacts((prev) => {
          if (!append) return batch;
          const seen = new Set(prev.map((c) => c.id));
          return [...prev, ...batch.filter((c) => !seen.has(c.id))];
        });
        setHasMore(batch.length === PAGE_SIZE);
        setPage(pageToLoad);
      } else {
        toast.error("Não foi possível carregar os contatos.");
      }
      setLoading(false);
    },
    [GetAPI],
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedId(currentClient?.id ?? null);
    fetchContacts("", 1, false);
  }, [open, currentClient?.id, fetchContacts]);

  function handleSearch(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchContacts(value, 1, false), 350);
  }

  async function applyClient(clientId: string | null) {
    setBusy(true);
    const response = await PutAPI(`/recording/${recordingId}`, { clientId }, true);
    setBusy(false);
    if (response?.status === 200 || response?.status === 201) {
      toast.success(
        clientId
          ? "Contato vinculado — os nomes dos locutores serão revistos"
          : "Contato desvinculado",
      );
      onClose();
      setTimeout(() => window.location.reload(), 600);
    } else {
      toast.error("Não foi possível salvar. Tente novamente.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentClient ? "Trocar contato" : "Vincular contato"}
          </DialogTitle>
          <DialogDescription>
            De quem é esta reunião? O vínculo organiza o histórico do contato e
            ajuda a nomear automaticamente quem fala na gravação.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-3">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar contato pelo nome..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-white pr-3 pl-9 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100">
            {loading && contacts.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
                <Loader2 size={15} className="animate-spin" /> Carregando
                contatos...
              </div>
            ) : contacts.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                Nenhum contato encontrado.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {contacts.map((contact) => {
                  const active = selectedId === contact.id;
                  return (
                    <li key={contact.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(contact.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition",
                          active
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        <span className="inline-flex min-w-0 items-center gap-2">
                          <UserRound
                            size={14}
                            className={cn(
                              "shrink-0",
                              active ? "text-white/70" : "text-gray-400",
                            )}
                          />
                          <span className="truncate">{contact.name}</span>
                        </span>
                        {active && <Check size={14} className="shrink-0" />}
                      </button>
                    </li>
                  );
                })}
                {hasMore && (
                  <li>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => fetchContacts(query, page + 1, true)}
                      className="w-full px-3 py-2.5 text-center text-xs font-semibold text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      {loading ? "Carregando..." : "Carregar mais"}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {currentClient ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => applyClient(null)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              >
                <X size={13} />
                Desvincular
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={onClose}
                className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={
                  busy || !selectedId || selectedId === currentClient?.id
                }
                onClick={() => selectedId && applyClient(selectedId)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-gray-900 px-5 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:opacity-40"
              >
                {busy && <Loader2 size={13} className="animate-spin" />}
                Vincular
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
