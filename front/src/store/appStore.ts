import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  detailsId: string | null;
  setDetailsId: (id: string | null) => void;

  selectedObsId: string | null;
  setSelectedObsId: (id: string | null) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  knowledgeBase: boolean;
  setKnowledgeBase: (value: boolean) => void;

  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (isOpen: boolean) => void;

  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      detailsId: null,
      setDetailsId: (id: string | null) => set({ detailsId: id, selectedObsId: null }),

      selectedObsId: null,
      setSelectedObsId: (id: string | null) => set({ selectedObsId: id }),

      searchTerm: "",
      setSearchTerm: (term: string) => set({ searchTerm: term }),

      knowledgeBase: true,
      setKnowledgeBase: (value: boolean) => set({ knowledgeBase: value }),

      isOrderModalOpen: false,
      setIsOrderModalOpen: (isOpen: boolean) => set({ isOrderModalOpen: isOpen }),

      isPreviewMode: false,
      setIsPreviewMode: (isPreview: boolean) =>
        set((state) => ({
          isPreviewMode: isPreview,
          knowledgeBase: isPreview ? state.knowledgeBase : true,
        })),
    }),
    {
      name: "ssidl-access-settings",
      partialize: (state) => ({
        isPreviewMode: state.isPreviewMode,
      }),
    },
  ),
);
