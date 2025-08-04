
"use client";

import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useSidebar = create<SidebarState>()(
    (set, get) => ({
      isOpen: true,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggle: () => set({ isOpen: !get().isOpen }),
    })
);

export const useSidebarToggle = () => useSidebar((state) => state.toggle);
