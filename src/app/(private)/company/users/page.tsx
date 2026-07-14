"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { useCorporate } from "@/context/corporateContext";
import { debounce } from "lodash";
import {
  ChevronDown,
  Crown,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CompanyTabs } from "../components/company-tabs";

/**
 * Fase 2.6 — usuários da empresa (migrado do client-dashboard): listar,
 * criar (única forma de conta nova com o B2C congelado), editar papel e
 * desativar. Só Controlador.
 */

interface CompanyUserRow {
  id: string;
  name: string;
  email: string;
  role: "USER" | "COMPANY_ADMIN" | "ADMIN";
  createdAt?: string;
  deletedAt?: string | null;
}

export default function CompanyUsersPage() {
  const { loaded, isController } = useCorporate();
  const { profile } = useSession();
  const { GetAPI, PostAPI, PutAPI, DeleteAPI } = useApiContext();

  const [users, setUsers] = useState<CompanyUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "COMPANY_ADMIN",
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setDebouncedQuery(value);
      }, 500),
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (debouncedQuery) params.set("query", debouncedQuery);
    const response = await GetAPI(
      `/company-adm/users?${params.toString()}`,
      true,
    );
    if (response.status === 200) {
      setUsers(response.body.items ?? []);
      setPages(response.body.pages ?? 1);
    }
    setLoading(false);
  }, [GetAPI, page, debouncedQuery]);

  useEffect(() => {
    if (loaded && isController) load();
  }, [loaded, isController, load]);

  async function handleCreate() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Preencha nome, e-mail e senha");
      return;
    }
    setBusy(true);
    const response = await PostAPI("/company-adm/users", form, true);
    setBusy(false);
    if (response.status === 200 || response.status === 201) {
      toast.success("Usuário criado — repasse a senha com segurança");
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", role: "USER" });
      load();
    } else {
      toast.error(
        response.body?.message || "Não foi possível criar (e-mail em uso?)",
      );
    }
  }

  async function handleRoleChange(
    user: CompanyUserRow,
    role: "USER" | "COMPANY_ADMIN",
  ) {
    setBusy(true);
    const response = await PutAPI(
      `/company-adm/users/${user.id}`,
      { role },
      true,
    );
    setBusy(false);
    if (response.status === 200) {
      toast.success("Papel atualizado");
      load();
    } else {
      toast.error(response.body?.message || "Não foi possível atualizar");
    }
  }

  async function handleDelete(user: CompanyUserRow) {
    if (
      !window.confirm(
        `Desativar o usuário "${user.name}"? Ele perde o acesso, mas as gravações dele permanecem.`,
      )
    )
      return;
    setBusy(true);
    const response = await DeleteAPI(`/company-adm/users/${user.id}`, true);
    setBusy(false);
    if (response.status === 200) {
      toast.success("Usuário desativado");
      load();
    } else {
      toast.error(response.body?.message || "Não foi possível desativar");
    }
  }

  if (loaded && !isController) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
        <p className="text-sm text-gray-500">
          Somente o controlador da empresa acessa esta área.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Usuários
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Quem tem acesso ao Voice na sua empresa.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      <CompanyTabs />

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
          placeholder="Buscar por nome ou e-mail..."
          className="h-11 w-full rounded-full border border-gray-200 bg-white/70 pr-4 pl-11 text-sm text-gray-800 shadow-sm backdrop-blur-sm transition outline-none focus:border-gray-400 focus:bg-white"
        />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl border border-gray-200/60 bg-white/60"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          Nenhum usuário encontrado.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user) => {
            const isSelf = user.id === profile?.id;
            const inactive = !!user.deletedAt;
            return (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    {user.role === "COMPANY_ADMIN" ? (
                      <Crown size={15} className="text-amber-500" />
                    ) : (
                      <UserRound size={15} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-gray-400">
                          (você)
                        </span>
                      )}
                      {inactive && (
                        <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
                          desativado
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                {!isSelf && !inactive && user.role !== "ADMIN" && (
                  <div className="flex shrink-0 items-center gap-1">
                    <div className="relative">
                      <select
                        value={user.role}
                        disabled={busy}
                        onChange={(e) =>
                          handleRoleChange(
                            user,
                            e.target.value as "USER" | "COMPANY_ADMIN",
                          )
                        }
                        className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pr-7 pl-2 text-xs font-medium text-gray-700 outline-none"
                      >
                        <option value="USER">Usuário</option>
                        <option value="COMPANY_ADMIN">Controlador</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={busy}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Desativar ${user.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && pages > 1 && (
        <CustomPagination
          currentPage={page}
          setCurrentPage={setPage}
          pages={pages}
        />
      )}

      <Dialog open={createOpen} onOpenChange={(o) => !o && setCreateOpen(false)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Novo usuário</DialogTitle>
            <DialogDescription>
              Com o cadastro público desativado, esta é a forma de dar acesso a
              um funcionário. Depois, adicione-o a um departamento na aba
              Estrutura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome completo"
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="E-mail"
              type="email"
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Senha inicial"
              type="text"
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value as "USER" | "COMPANY_ADMIN",
                  })
                }
                className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pr-9 pl-3 text-sm text-gray-800 outline-none"
              >
                <option value="USER">Usuário comum</option>
                <option value="COMPANY_ADMIN">Controlador</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={busy}
                className="rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {busy ? "Criando..." : "Criar usuário"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
