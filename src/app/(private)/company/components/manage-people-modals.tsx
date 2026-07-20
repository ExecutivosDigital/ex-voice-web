"use client";

import { Select } from "@/components/ui/blocks/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useApiContext } from "@/context/ApiContext";
import { ChevronDown, Crown, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Fase 2.2 — gestão de pessoas pela tela (só Controlador):
 * membros/papéis de um departamento e gestores de uma filial.
 */

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "COMPANY_ADMIN";
}

interface MemberView {
  userId: string;
  role: "MANAGER" | "MEMBER";
  user: { id: string; name: string; email: string };
}

/* ============================ Departamento ============================ */

export function DepartmentMembersModal({
  department,
  companyUsers,
  onClose,
  onChanged,
}: {
  department: {
    id: string;
    name: string;
    members: MemberView[];
  } | null;
  companyUsers: CompanyUser[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const { PostAPI, DeleteAPI } = useApiContext();
  const [addingUserId, setAddingUserId] = useState("");
  const [addingRole, setAddingRole] = useState<"MEMBER" | "MANAGER">("MEMBER");
  const [busy, setBusy] = useState(false);

  if (!department) return null;

  const memberIds = new Set(department.members.map((m) => m.userId));
  const candidates = companyUsers.filter((u) => !memberIds.has(u.id));

  async function setMember(userId: string, role: "MEMBER" | "MANAGER") {
    if (!department) return;
    setBusy(true);
    const response = await PostAPI(
      `/corporate/departments/${department.id}/members`,
      { userId, role },
      true,
    );
    setBusy(false);
    if (response.status === 200 || response.status === 201) {
      toast.success("Membro atualizado");
      setAddingUserId("");
      onChanged();
    } else {
      toast.error(response.body?.message || "Não foi possível salvar");
    }
  }

  async function removeMember(userId: string) {
    if (!department) return;
    setBusy(true);
    const response = await DeleteAPI(
      `/corporate/departments/${department.id}/members/${userId}`,
      true,
    );
    setBusy(false);
    if (response.status === 200) {
      toast.success("Membro removido");
      onChanged();
    } else {
      toast.error(response.body?.message || "Não foi possível remover");
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Membros — {department.name}</DialogTitle>
          <DialogDescription>
            Gestores veem todas as gravações do departamento; membros veem as
            próprias.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
          {department.members.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              Ninguém neste departamento ainda.
            </p>
          )}
          {department.members.map((member) => (
            <div
              key={member.userId}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
            >
              <div className="min-w-0 flex-1 basis-48">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium text-gray-900">
                  {member.role === "MANAGER" && (
                    <Crown size={13} className="shrink-0 text-amber-500" />
                  )}
                  {member.user.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {member.user.email}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Select
                  value={member.role}
                  disabled={busy}
                  onChange={(role) =>
                    setMember(member.userId, role as "MEMBER" | "MANAGER")
                  }
                  className="h-8 w-28 rounded-lg text-xs"
                  options={[
                    { value: "MEMBER", label: "Membro" },
                    { value: "MANAGER", label: "Gestor" },
                  ]}
                />
                <button
                  onClick={() => removeMember(member.userId)}
                  disabled={busy}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remover ${member.user.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {candidates.length > 0 ? (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            <Select
              value={addingUserId}
              onChange={setAddingUserId}
              className="flex-1"
              placeholder="Adicionar usuário..."
              options={[
                { value: "", label: "Adicionar usuário..." },
                ...candidates.map((u) => ({
                  value: u.id,
                  label: `${u.name} (${u.email})`,
                })),
              ]}
            />
            <Select
              value={addingRole}
              onChange={(role) => setAddingRole(role as "MEMBER" | "MANAGER")}
              className="w-32"
              options={[
                { value: "MEMBER", label: "Membro" },
                { value: "MANAGER", label: "Gestor" },
              ]}
            />
            <button
              onClick={() => addingUserId && setMember(addingUserId, addingRole)}
              disabled={!addingUserId || busy}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              <UserPlus size={15} /> Adicionar
            </button>
          </div>
        ) : (
          <p className="border-t border-gray-100 pt-3 text-xs text-gray-400">
            Todos os usuários da empresa já estão neste departamento.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* =============================== Filial =============================== */

export function BranchManagersModal({
  branch,
  companyUsers,
  managers,
  onClose,
  onChanged,
}: {
  branch: { id: string; name: string } | null;
  companyUsers: CompanyUser[];
  managers: { userId: string; user: { id: string; name: string; email: string } }[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const { PostAPI, DeleteAPI } = useApiContext();
  const [addingUserId, setAddingUserId] = useState("");
  const [busy, setBusy] = useState(false);

  if (!branch) return null;

  const managerIds = new Set(managers.map((m) => m.userId));
  const candidates = companyUsers.filter((u) => !managerIds.has(u.id));

  async function addManager() {
    if (!branch || !addingUserId) return;
    setBusy(true);
    const response = await PostAPI(
      `/corporate/branches/${branch.id}/managers/${addingUserId}`,
      {},
      true,
    );
    setBusy(false);
    if (response.status === 200 || response.status === 201) {
      toast.success("Gestor de filial definido");
      setAddingUserId("");
      onChanged();
    } else {
      toast.error(response.body?.message || "Não foi possível salvar");
    }
  }

  async function removeManager(userId: string) {
    if (!branch) return;
    setBusy(true);
    const response = await DeleteAPI(
      `/corporate/branches/${branch.id}/managers/${userId}`,
      true,
    );
    setBusy(false);
    if (response.status === 200) {
      toast.success("Gestor removido");
      onChanged();
    } else {
      toast.error(response.body?.message || "Não foi possível remover");
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle>Gestores — Filial {branch.name}</DialogTitle>
          <DialogDescription>
            Gestores de filial veem as gravações de todos os departamentos
            desta filial.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
          {managers.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              Nenhum gestor definido.
            </p>
          )}
          {managers.map((manager) => (
            <div
              key={manager.userId}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
            >
              <div className="min-w-0 flex-1 basis-48">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium text-gray-900">
                  <Crown size={13} className="shrink-0 text-amber-500" />
                  {manager.user.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {manager.user.email}
                </p>
              </div>
              <button
                onClick={() => removeManager(manager.userId)}
                disabled={busy}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label={`Remover ${manager.user.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {candidates.length > 0 && (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            <Select
              value={addingUserId}
              onChange={setAddingUserId}
              className="flex-1"
              options={[
                { value: "", label: "Adicionar gestor..." },
                ...candidates.map((u) => ({
                  value: u.id,
                  label: `${u.name} (${u.email})`,
                })),
              ]}
            />
            <button
              onClick={addManager}
              disabled={!addingUserId || busy}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              <UserPlus size={15} /> Adicionar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
