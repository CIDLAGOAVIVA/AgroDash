"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggle: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "sidebar-storage", // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const useSidebarToggle = () => useSidebar((state) => state.toggle);
