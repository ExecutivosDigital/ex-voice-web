"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { Select } from "@/components/ui/blocks/select";
import { useApiContext } from "@/context/ApiContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useCorporate } from "@/context/corporateContext";
import { translateError } from "@/utils/translate-error";
import {
  Building2,
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
import { ActionButton, Section } from "./components/ui";

/**
 * Fase 2.1 — Área "Empresa" (só Controlador): CRUD de departamentos e filiais.
 * Endpoints da Fase 1 (/corporate/*). Ver ex/FASE-2.md.
 *
 * Redesign de 17/07 a partir dos pontos do Victor:
 *  - cada ação vive DENTRO da sua seção (o "Novo departamento" morava no topo
 *    da página, com o contexto da empresa e as filiais entre ele e a seção);
 *  - Departamentos ANTES de Filiais — o principal na frente do opcional;
 *  - dois estilos de botão para a área inteira (ver components/ui.tsx).
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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dim text-white shadow-lg">
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Empresa
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Estrutura da sua empresa: departamentos, filiais e suas IAs.
        </p>
      </div>

      <CompanyTabs />

      {/* Business Analytics da empresa (Fase 2.4) */}
      <BusinessContextCard />

      {/* Departamentos — o principal vem primeiro; a ação mora na seção */}
      <Section
        icon={Building2}
        title="Departamentos"
        count={departments.length}
        action={
          <ActionButton onClick={() => setForm({ ...EMPTY_FORM })}>
            <Plus size={15} /> Novo departamento
          </ActionButton>
        }
      >
        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center">
            <p className="max-w-md text-sm text-gray-500">
              Nenhum departamento ainda. Sem departamentos, a empresa funciona
              com um contexto único — crie o primeiro quando quiser separar
              times (Comercial, RH, Financeiro...).
            </p>
            <ActionButton onClick={() => setForm({ ...EMPTY_FORM })}>
              <Plus size={15} /> Criar primeiro departamento
            </ActionButton>
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
      </Section>

      {/* Filiais — opcionais, vêm depois do principal */}
      <Section
        icon={Landmark}
        title="Filiais"
        count={branches.length}
        description="Opcional — para empresas com mais de um site. Um site só? Tudo pode viver direto nos departamentos."
        action={
          <ActionButton
            variant="outline"
            onClick={() => setShowBranchForm((v) => !v)}
          >
            {showBranchForm ? <X size={14} /> : <Plus size={14} />}
            {showBranchForm ? "Cancelar" : "Nova filial"}
          </ActionButton>
        }
      >
        {showBranchForm && (
          <div className="flex gap-2">
            <input
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateBranch()}
              placeholder="Nome da filial (ex.: Curitiba)"
              autoFocus
              className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
            <ActionButton onClick={handleCreateBranch}>Criar</ActionButton>
          </div>
        )}

        {branches.length === 0 && !showBranchForm ? (
          <p className="text-sm text-gray-400">Nenhuma filial cadastrada.</p>
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
      </Section>

      {/* Glossário (Fase 2.4) */}
      <GlossarySection
        departments={departments.map((d) => ({ id: d.id, name: d.name }))}
      />

      <p className="text-xs text-gray-400">
        IAs por departamento no fluxo de gravação chegam na próxima entrega
        (Fase 2.5).
      </p>

      {/* Formulário de departamento (criar/editar) — modal centralizado */}
      <Dialog open={!!form} onOpenChange={(o) => !o && !saving && setForm(null)}>
        <DialogContent className="max-w-2xl bg-white">
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
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
                />
                <Select
                  value={form.branchId}
                  onChange={(branchId) => setForm({ ...form, branchId })}
                  options={[
                    { value: "", label: "Sem filial" },
                    ...branches.map((b) => ({
                      value: b.id,
                      label: `Filial: ${b.name}`,
                    })),
                  ]}
                />
              </div>
              <input
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Detalhes (opcional — ex.: time de vendas externas)"
                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
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
                <ActionButton variant="outline" onClick={() => setForm(null)}>
                  Cancelar
                </ActionButton>
                <ActionButton onClick={handleSaveDepartment} disabled={saving}>
                  {saving ? "Salvando..." : form.id ? "Salvar" : "Criar"}
                </ActionButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
