import { create } from "zustand";

export type UserRole = "SuperAdmin" | "AssetManager" | "Auditor";

interface LayoutState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  userRole: UserRole;
  toggleSidebarCollapse: () => void;
  setSidebarCollapse: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
  setUserRole: (role: UserRole) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  userRole: "SuperAdmin",

  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setSidebarCollapse: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  setMobileSidebar: (open) => set({ isMobileSidebarOpen: open }),

  setUserRole: (role) => set({ userRole: role }),
}));
