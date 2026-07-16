import { create } from "zustand";

interface LayoutState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebarCollapse: () => void;
  setSidebarCollapse: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,

  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setSidebarCollapse: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  setMobileSidebar: (open) => set({ isMobileSidebarOpen: open }),
}));
