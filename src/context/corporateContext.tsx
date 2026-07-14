"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "./auth";
import { useApiContext } from "./ApiContext";

/**
 * Fase 2 (RBAC) — estrutura corporativa do usuário logado, vinda de
 * GET /corporate/departments/my-structure (Fase 1). Usuário B2C (sem
 * companyId) nunca dispara a chamada e fica com tudo vazio/false.
 */

export interface CorporateDepartment {
  id: string;
  name: string;
  branchId: string | null;
  businessContext: string | null;
  role: "MANAGER" | "MEMBER";
}

export interface CorporateBranch {
  id: string;
  name: string;
}

interface CorporateContextValue {
  /** true depois que a estrutura foi carregada (ou descartada por não ter empresa). */
  loaded: boolean;
  /** Controlador da empresa (role COMPANY_ADMIN) — vê tudo, gere o setup. */
  isController: boolean;
  /** Pertence a alguma empresa (tem companyId). */
  hasCompany: boolean;
  /** Gere ao menos uma filial ou um departamento. */
  isManager: boolean;
  departments: CorporateDepartment[];
  managedBranches: CorporateBranch[];
  refresh: () => Promise<void>;
}

const CorporateContext = createContext<CorporateContextValue | undefined>(
  undefined,
);

export function useCorporate() {
  const ctx = useContext(CorporateContext);
  if (!ctx)
    throw new Error("useCorporate deve ser usado dentro de <CorporateProvider>");
  return ctx;
}

export function CorporateProvider({ children }: PropsWithChildren) {
  const { profile } = useSession();
  const { GetAPI } = useApiContext();

  const [loaded, setLoaded] = useState(false);
  const [isController, setIsController] = useState(false);
  const [departments, setDepartments] = useState<CorporateDepartment[]>([]);
  const [managedBranches, setManagedBranches] = useState<CorporateBranch[]>([]);

  const hasCompany = !!profile?.companyId;

  const refresh = useCallback(async () => {
    if (!profile?.companyId) {
      setIsController(false);
      setDepartments([]);
      setManagedBranches([]);
      setLoaded(true);
      return;
    }
    const response = await GetAPI("/corporate/departments/my-structure", true);
    if (response.status === 200) {
      setIsController(!!response.body.isController);
      setDepartments(response.body.departments ?? []);
      setManagedBranches(response.body.managedBranches ?? []);
    }
    setLoaded(true);
  }, [GetAPI, profile?.companyId]);

  useEffect(() => {
    // Só resolve depois que o perfil chegou (profile null = ainda carregando ou deslogado)
    if (profile) {
      refresh();
    }
  }, [profile, refresh]);

  const isManager =
    managedBranches.length > 0 || departments.some((d) => d.role === "MANAGER");

  return (
    <CorporateContext.Provider
      value={{
        loaded,
        isController,
        hasCompany,
        isManager,
        departments,
        managedBranches,
        refresh,
      }}
    >
      {children}
    </CorporateContext.Provider>
  );
}
