"use client";

import { Select } from "@/components/ui/blocks/select";

import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { useApiContext } from "@/context/ApiContext";
import { useCorporate } from "@/context/corporateContext";
import { cn } from "@/utils/cn";
import { debounce } from "lodash";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Clock,
  Inbox,
  Mic2,
  Search,
  Share2,
  UserRound,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

moment.locale("pt-br");

/**
 * Fase 2.3 — Gravações da equipe: lista pelo escopo hierárquico da Fase 1
 * (controlador → empresa; gestor de filial → filial; gestor de depto →
 * depto; usuário comum → próprias + compartilhadas) + "compartilhadas comigo".
 */

interface TeamRecording {
  id: string;
  name: string;
  description: string;
  duration: string;
  createdAt: string;
  transcriptionStatus: string;
  departmentId: string | null;
  department: { id: string; name: string; branchId: string | null } | null;
  user: { id: string; name: string };
  client: { id: string; name: string } | null;
}

interface SharedWithMe {
  id: string;
  createdAt: string;
  recording: {
    id: string;
    name: string;
    description: string;
    duration: string;
    createdAt: string;
    transcriptionStatus: string;
    user: { id: string; name: string };
  };
}

interface DepartmentOption {
  id: string;
  name: string;
}

export default function TeamRecordingsPage() {
  const { GetAPI } = useApiContext();
  const { loaded, hasCompany } = useCorporate();
  const router = useRouter();

  const [items, setItems] = useState<TeamRecording[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedWithMe[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [departmentId, setDepartmentId] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setDebouncedQuery(value);
      }, 500),
    [],
  );

  const loadList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: "12" });
    if (departmentId) params.set("departmentId", departmentId);
    if (debouncedQuery) params.set("query", debouncedQuery);
    const response = await GetAPI(
      `/corporate/recordings?${params.toString()}`,
      true,
    );
    if (response.status === 200) {
      setItems(response.body.items);
      setPages(response.body.pages || 1);
    }
    setLoading(false);
  }, [GetAPI, page, departmentId, debouncedQuery]);

  useEffect(() => {
    if (loaded && hasCompany) loadList();
  }, [loaded, hasCompany, loadList]);

  useEffect(() => {
    if (!loaded || !hasCompany) return;
    (async () => {
      const [sharedRes, deptRes] = await Promise.all([
        GetAPI("/corporate/recordings/shared-with-me", true),
        GetAPI("/corporate/departments", true),
      ]);
      if (sharedRes.status === 200) setSharedWithMe(sharedRes.body);
      if (deptRes.status === 200)
        setDepartments(
          deptRes.body.map((d: { id: string; name: string }) => ({
            id: d.id,
            name: d.name,
          })),
        );
    })();
  }, [loaded, hasCompany, GetAPI]);

  if (loaded && !hasCompany) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
        <p className="text-sm text-gray-500">
          Esta área é para contas corporativas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-2">
        <button
          onClick={() => router.push("/recordings")}
          className="group inline-flex w-max items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gray-400 uppercase transition hover:text-gray-900"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Minhas gravações
        </button>
        <h1 className="text-2xl font-semibold text-balance text-gray-900 md:text-3xl">
          Gravações da equipe.
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
          Tudo o que você pode ver pelo seu papel na empresa — e o que
          compartilharam com você.
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedSearch(e.target.value);
            }}
            placeholder="Buscar por título ou descrição..."
            className="h-12 w-full rounded-full border border-gray-200 bg-white/70 pr-4 pl-11 text-sm text-gray-800 shadow-sm backdrop-blur-sm transition outline-none focus:border-gray-400 focus:bg-white focus:shadow-md"
          />
        </div>
        {departments.length > 0 && (
          <Select
            value={departmentId}
            onChange={(id) => {
              setPage(1);
              setDepartmentId(id);
            }}
            className="h-12 w-auto min-w-56 rounded-full bg-white/70 shadow-sm"
            options={[
              { value: "", label: "Todos os departamentos" },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
          />
        )}
      </section>

      <section>
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[150px] animate-pulse rounded-2xl border border-gray-200/60 bg-white/60"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center">
            <Inbox size={24} className="text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              Nenhuma gravação no seu escopo com esses filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((rec) => (
              <button
                key={rec.id}
                onClick={() => router.push(`/recordings/${rec.id}`)}
                className={cn(
                  "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition",
                  "shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                    <Mic2 size={16} />
                  </div>
                  {rec.department && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      <Building2 size={9} />
                      {rec.department.name}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {rec.name || "Sem título"}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                    {rec.description || "Sem descrição"}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <UserRound size={11} />
                    {rec.user?.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {rec.duration || "--"}
                    </span>
                    <span>{moment(rec.createdAt).fromNow()}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {!loading && pages > 1 && (
        <CustomPagination
          currentPage={page}
          setCurrentPage={setPage}
          pages={pages}
        />
      )}

      {sharedWithMe.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <Share2 size={14} /> Compartilhadas comigo
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sharedWithMe.map((share) => (
              <button
                key={share.id}
                onClick={() => router.push(`/recordings/${share.recording.id}`)}
                className="group flex flex-col gap-2 rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm"
              >
                <p className="truncate text-sm font-semibold text-gray-900">
                  {share.recording.name || "Sem título"}
                </p>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {share.recording.description || "Sem descrição"}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <UserRound size={11} />
                    {share.recording.user?.name}
                  </span>
                  <span>{moment(share.createdAt).fromNow()}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
