import { create } from "zustand";

interface AppState {
  detailsId: string | null;
  setDetailsId: (id: string | null) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  knowledgeBase: boolean;
  setKnowledgeBase: (value: boolean) => void;

  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  detailsId: null,
  setDetailsId: (id: string | null) => set({ detailsId: id }),

  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),

  knowledgeBase: true,
  setKnowledgeBase: (value: boolean) => set({ knowledgeBase: value }),

  isOrderModalOpen: false,
  setIsOrderModalOpen: (isOpen: boolean) => set({ isOrderModalOpen: isOpen }),
}));
