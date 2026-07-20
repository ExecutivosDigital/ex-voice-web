import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  mobileMenu: boolean;
  setMobileMenu: (value: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      mobileMenu: false,
      setMobileMenu: (value) => set({ mobileMenu: value }),
    }),
    { name: "sidebar-store", storage: createJSONStorage(() => localStorage) },
  ),
);

/** Preferência de navegação no desktop: barra no topo (navbar) ou lateral (sidebar). */
type NavMode = "navbar" | "sidebar";

/**
 * Qual visão avançada da transcrição o usuário prefere.
 *
 * "timeline" = tipo Audacity: tempo na horizontal, blocos empilham quando se
 * cruzam. Separa VER de LER (a lista fica na visão padrão).
 * "agenda"   = tipo Google Calendar: tempo na vertical, quem corta aparece na
 * altura do corte, e quem fala junto divide a largura.
 *
 */
interface LayoutPrefsState {
  navMode: NavMode;
  sidebarCollapsed: boolean;
  setNavMode: (mode: NavMode) => void;
  toggleNavMode: () => void;
  toggleSidebarCollapsed: () => void;
}

export const useLayoutPrefs = create<LayoutPrefsState>()(
  persist(
    (set) => ({
      navMode: "navbar",
      sidebarCollapsed: false,
      setNavMode: (mode) => set({ navMode: mode }),
      toggleNavMode: () =>
        set((s) => ({ navMode: s.navMode === "navbar" ? "sidebar" : "navbar" })),
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: "layout-prefs", storage: createJSONStorage(() => localStorage) },
  ),
);
