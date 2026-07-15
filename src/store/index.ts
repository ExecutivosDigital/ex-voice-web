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
