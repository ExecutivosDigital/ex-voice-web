"use client";

import { ClientProps } from "@/@types/general-client";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { CreateClientSheet } from "@/components/ui/create-client-sheet";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import {
  ArrowUpRight,
  Calendar,
  Plus,
  Search,
  UserPlus,
  UsersRound,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

moment.locale("pt-br");

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("");
}

export default function MinimalClientsPage() {
  const {
    clients,
    isGettingClients,
    clientsFilters,
    setClientsFilters,
    clientsTotalPages,
    setSelectedClient,
  } = useGeneralContext();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setClientsFilters((prev) => ({
          ...prev,
          query: value || undefined,
          page: 1,
        }));
      }, 500),
    [setClientsFilters],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleOpen = (client: ClientProps) => {
    setSelectedClient(client);
    router.push(`/new-home/clients/${client.id}`);
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 capitalize">
          Pessoas
        </p>
        <h1 className="text-balance text-2xl font-semibold text-gray-900 md:text-3xl">
          Seus clientes.
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
          Tudo sobre quem você atende. Um clique para ver todas as gravações
          de cada contato.
        </p>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={handleQueryChange}
            placeholder="Buscar cliente por nome..."
            className="h-12 w-full rounded-full border border-gray-200 bg-white/70 pr-4 pl-11 text-sm text-gray-800 shadow-sm backdrop-blur-sm outline-none transition focus:border-gray-400 focus:bg-white focus:shadow-md"
          />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          <Plus size={16} />
          Novo cliente
        </button>
      </section>

      <section>
        {isGettingClients ? (
          <SkeletonGrid />
        ) : clients.length === 0 ? (
          <EmptyState
            onCreate={() => setIsCreateOpen(true)}
            hasFilters={!!query}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {clients.map((client, i) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onOpen={() => handleOpen(client)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {!isGettingClients && clientsTotalPages > 1 && (
        <div className="pt-2">
          <CustomPagination
            currentPage={clientsFilters.page}
            setCurrentPage={(page) =>
              setClientsFilters((prev) => ({ ...prev, page }))
            }
            pages={clientsTotalPages}
          />
        </div>
      )}

      {isCreateOpen && (
        <CreateClientSheet
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}

function ClientCard({
  client,
  onOpen,
  index,
}: {
  client: ClientProps;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.button
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]",
      )}
    >
      <span className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-center justify-between">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-xs font-semibold text-white shadow-sm">
          {initials(client.name) || "?"}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-gray-600 uppercase">
          <Calendar size={10} />
          {client.createdAt
            ? `Desde ${moment(client.createdAt).format("MMM/YY")}`
            : "Novo"}
        </span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {client.name}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
          {client.description || "Sem descrição"}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-end text-[11px] text-gray-400 transition group-hover:text-gray-900">
        <span className="inline-flex items-center gap-1">
          Abrir
          <ArrowUpRight size={12} />
        </span>
      </div>
    </motion.button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex h-36 animate-pulse flex-col justify-between rounded-2xl border border-gray-200/60 bg-white/60 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-gray-100" />
            <div className="h-5 w-16 rounded-full bg-gray-100" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-2/3 rounded-full bg-gray-100" />
            <div className="h-2.5 w-full rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  onCreate,
  hasFilters,
}: {
  onCreate: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        {hasFilters ? <UsersRound size={26} /> : <UserPlus size={26} />}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        {hasFilters ? "Nenhum cliente encontrado" : "Adicione seu primeiro cliente"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {hasFilters
          ? "Tente buscar por outro nome ou limpe o campo."
          : "Centralize suas conversas. Cadastre um cliente para começar."}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          <Plus size={14} />
          Novo cliente
        </button>
      )}
    </div>
  );
}
