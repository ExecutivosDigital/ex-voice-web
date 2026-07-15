"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useApiContext } from "@/context/ApiContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useCorporate } from "@/context/corporateContext";
import { translateError } from "@/utils/translate-error";
import { cn } from "@/utils/cn";
import {
  Building2,
  ChevronDown,
  Landmark,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CompanyTabs } from "./components/company-tabs";
import {
  BusinessContextCard,
  GlossarySection,
} from "./components/context-sections";
import {
  BranchManagersModal,
  CompanyUser,
  DepartmentMembersModal,
} from "./components/manage-people-modals";

/**
 * Fase 2.1 — Área "Empresa" (só Controlador): CRUD de departamentos e filiais.
 * Endpoints da Fase 1 (/corporate/*). Ver ex/FASE-2.md.
 */

interface Branch {
  id: string;
  name: string;
  details: string | null;
  departments: { id: string; name: string }[];
  managers: {
    userId: string;
    user: { id: string; name: string; email: string };
  }[];
}

interface DepartmentMemberView {
  userId: string;
  role: "MANAGER" | "MEMBER";
  user: { id: string; name: string; email: string };
}

interface Department {
  id: string;
  name: string;
  details: string | null;
  businessContext: string | null;
  branchId: string | null;
  branch: { id: string; name: string } | null;
  members: DepartmentMemberView[];
  _count: { promptSettings: number; recordings: number };
}

interface DepartmentForm {
  id?: string;
  name: string;
  details: string;
  businessContext: string;
  branchId: string;
}

const EMPTY_FORM: DepartmentForm = {
  name: "",
  details: "",
  businessContext: "",
  branchId: "",
};

export default function CompanyPage() {
  const { loaded, isController } = useCorporate();
  const { GetAPI, PostAPI, PatchAPI, DeleteAPI } = useApiContext();
  const confirm = useConfirm();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<DepartmentForm | null>(null);
  const [newBranchName, setNewBranchName] = useState("");
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [membersDeptId, setMembersDeptId] = useState<string | null>(null);
  const [managersBranchId, setManagersBranchId] = useState<string | null>(null);

  const loadData = useCallback(
    async (showSkeleton = true) => {
      if (showSkeleton) setLoadingData(true);
      const [deptRes, branchRes, usersRes] = await Promise.all([
        GetAPI("/corporate/departments", true),
        GetAPI("/corporate/branches", true),
        GetAPI("/corporate/users", true),
      ]);
      if (deptRes.status === 200) setDepartments(deptRes.body);
      if (branchRes.status === 200) setBranches(branchRes.body);
      if (usersRes.status === 200) setCompanyUsers(usersRes.body);
      setLoadingData(false);
    },
    [GetAPI],
  );

  useEffect(() => {
    if (loaded && isController) {
      loadData();
    }
  }, [loaded, isController, loadData]);

  async function handleSaveDepartment() {
    if (!form || !form.name.trim()) {
      toast.error("Dê um nome ao departamento");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      details: form.details.trim() || undefined,
      businessContext: form.businessContext.trim() || undefined,
      branchId: form.branchId || undefined,
    };
    const response = form.id
      ? await PatchAPI(`/corporate/departments/${form.id}`, payload, true)
      : await PostAPI("/corporate/departments", payload, true);
    setSaving(false);
    if (response.status === 200 || response.status === 201) {
      toast.success(form.id ? "Departamento atualizado" : "Departamento criado");
      setForm(null);
      loadData();
    } else {
      toast.error(response.body?.message || "Não foi possível salvar");
    }
  }

  async function handleDeleteDepartment(department: Department) {
    const ok = await confirm({
      title: `Excluir o departamento "${department.name}"?`,
      description: "Os membros e o glossário próprios deste departamento serão removidos.",
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    const response = await DeleteAPI(
      `/corporate/departments/${department.id}`,
      true,
    );
    if (response.status === 200) {
      toast.success("Departamento excluído");
      loadData();
    } else {
      toast.error(
        translateError(
          response.body?.message,
          "Não foi possível excluir (há gravações ou IAs vinculadas?)",
        ),
      );
    }
  }

  async function handleCreateBranch() {
    if (!newBranchName.trim()) {
      toast.error("Dê um nome à filial");
      return;
    }
    const response = await PostAPI(
      "/corporate/branches",
      { name: newBranchName.trim() },
      true,
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Filial criada");
      setNewBranchName("");
      setShowBranchForm(false);
      loadData();
    } else {
      toast.error(response.body?.message || "Não foi possível criar a filial");
    }
  }

  async function handleDeleteBranch(branch: Branch) {
    const ok = await confirm({
      title: `Excluir a filial "${branch.name}"?`,
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    const response = await DeleteAPI(`/corporate/branches/${branch.id}`, true);
    if (response.status === 200) {
      toast.success("Filial excluída");
      loadData();
    } else {
      toast.error(
        response.body?.message ||
          "Não foi possível excluir (mova os departamentos dela antes)",
      );
    }
  }

  if (!loaded || (isController && loadingData)) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[120px] animate-pulse rounded-2xl border border-gray-200/60 bg-white/60"
          />
        ))}
      </div>
    );
  }

  if (!isController) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
          <Building2 size={28} />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Área restrita
        </h1>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Somente o controlador da empresa acessa o setup de departamentos e
          filiais.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Empresa
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Estrutura da sua empresa: filiais, departamentos e suas IAs.
          </p>
        </div>
        <button
          onClick={() => setForm({ ...EMPTY_FORM })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          <Plus size={16} /> Novo departamento
        </button>
      </div>

      <CompanyTabs />

      {/* Business Analytics da empresa (Fase 2.4) */}
      <BusinessContextCard />

      {/* Filiais */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <Landmark size={14} /> Filiais ({branches.length})
          </h2>
          <button
            onClick={() => setShowBranchForm((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {showBranchForm ? <X size={13} /> : <Plus size={13} />}
            {showBranchForm ? "Cancelar" : "Nova filial"}
          </button>
        </div>

        {showBranchForm && (
          <div className="flex gap-2">
            <input
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateBranch()}
              placeholder="Nome da filial (ex.: Curitiba)"
              className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
            <button
              onClick={handleCreateBranch}
              className="rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Criar
            </button>
          </div>
        )}

        {branches.length === 0 && !showBranchForm ? (
          <p className="text-sm text-gray-400">
            Nenhuma filial — para empresas de um site só, tudo pode viver
            direto nos departamentos.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800"
              >
                <Landmark size={14} className="text-gray-400" />
                <button
                  onClick={() => setManagersBranchId(branch.id)}
                  className="font-medium transition hover:text-gray-600"
                  title="Gerir gestores da filial"
                >
                  {branch.name}
                </button>
                <span className="text-xs text-gray-400">
                  {branch.departments.length} depto(s) ·{" "}
                  {branch.managers.length} gestor(es)
                </span>
                <button
                  onClick={() => handleDeleteBranch(branch)}
                  className="ml-1 hidden text-gray-300 transition hover:text-red-500 group-hover:block"
                  aria-label={`Excluir filial ${branch.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Formulário de departamento (criar/editar) — modal centralizado */}
      <Dialog open={!!form} onOpenChange={(o) => !o && !saving && setForm(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>
              {form?.id ? "Editar departamento" : "Novo departamento"}
            </DialogTitle>
          </DialogHeader>
          {form && (
            <div className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome (ex.: Comercial, RH, Financeiro)"
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
            <div className="relative">
              <select
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none focus:border-gray-400"
              >
                <option value="">Sem filial</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    Filial: {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <input
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            placeholder="Detalhes (opcional — ex.: time de vendas externas)"
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
          />
          <textarea
            value={form.businessContext}
            onChange={(e) =>
              setForm({ ...form, businessContext: e.target.value })
            }
            placeholder="Contexto de negócio do departamento (opcional) — o que este time faz, como trabalha, o que vende. Este texto é usado pela IA nos resumos das reuniões do departamento."
            rows={3}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setForm(null)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveDepartment}
              disabled={saving}
              className={cn(
                "rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]",
                saving && "pointer-events-none opacity-60",
              )}
            >
              {saving ? "Salvando..." : form.id ? "Salvar" : "Criar"}
            </button>
          </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Departamentos */}
      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          <Building2 size={14} /> Departamentos ({departments.length})
        </h2>

        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              Nenhum departamento ainda. Sem departamentos, a empresa funciona
              com um contexto único — crie o primeiro quando quiser separar
              times (Comercial, RH, Financeiro...).
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {departments.map((department) => (
              <div
                key={department.id}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white p-4 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {department.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {department.branch
                        ? `Filial: ${department.branch.name}`
                        : "Sem filial"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setForm({
                          id: department.id,
                          name: department.name,
                          details: department.details ?? "",
                          businessContext: department.businessContext ?? "",
                          branchId: department.branchId ?? "",
                        })
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
                      aria-label={`Editar ${department.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Excluir ${department.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {department.details && (
                  <p className="text-sm text-gray-600">{department.details}</p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <button
                    onClick={() => setMembersDeptId(department.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Users size={13} />
                    {department.members.length} membro(s)
                  </button>
                  <span>{department._count.promptSettings} IA(s)</span>
                  <span>{department._count.recordings} gravação(ões)</span>
                  {department.businessContext && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                      contexto configurado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Glossário (Fase 2.4) */}
      <GlossarySection
        departments={departments.map((d) => ({ id: d.id, name: d.name }))}
      />

      <p className="text-xs text-gray-400">
        IAs por departamento no fluxo de gravação chegam na próxima entrega
        (Fase 2.5).
      </p>

      <DepartmentMembersModal
        department={
          membersDeptId
            ? (departments.find((d) => d.id === membersDeptId) ?? null)
            : null
        }
        companyUsers={companyUsers}
        onClose={() => setMembersDeptId(null)}
        onChanged={() => loadData(false)}
      />
      <BranchManagersModal
        branch={
          managersBranchId
            ? (branches.find((b) => b.id === managersBranchId) ?? null)
            : null
        }
        managers={
          branches.find((b) => b.id === managersBranchId)?.managers ?? []
        }
        companyUsers={companyUsers}
        onClose={() => setManagersBranchId(null)}
        onChanged={() => loadData(false)}
      />
    </div>
  );
}
