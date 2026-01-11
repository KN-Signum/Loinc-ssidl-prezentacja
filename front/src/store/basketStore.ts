import { create } from "zustand";
import { ActivityDefinition } from "../features/activityDefinition/ActivityDefinition";

interface BasketStore {
  basket: Set<string>;

  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearBasket: () => void;
  hasItem: (id: string) => boolean;

  getBasketItems: (allData: ActivityDefinition[]) => ActivityDefinition[];
  getBasketGroups: (
    allData: ActivityDefinition[],
  ) => Record<string, ActivityDefinition[]>;
  getBasketCount: () => number;
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  basket: new Set<string>(),

  addItem: (id: string) =>
    set((state) => ({ basket: new Set(state.basket).add(id) })),

  removeItem: (id: string) => {
    const newBasket = new Set(get().basket);
    newBasket.delete(id);
    set({ basket: newBasket });
  },

  toggleItem: (id: string) => {
    const { basket } = get();
    const newBasket = new Set(basket);
    if (newBasket.has(id)) {
      newBasket.delete(id);
    } else {
      newBasket.add(id);
    }
    set({ basket: newBasket });
  },

  clearBasket: () => set({ basket: new Set<string>() }),

  hasItem: (id: string) => get().basket.has(id),

  getBasketCount: () => get().basket.size,

  getBasketItems: (allData: ActivityDefinition[]) => {
    const { basket } = get();
    return allData.filter((item) => basket.has(item.id));
  },

  getBasketGroups: (allData: ActivityDefinition[]) => {
    const basketItems = get().getBasketItems(allData);
    const groups: Record<string, ActivityDefinition[]> = {};
    basketItems.forEach((item) => {
      const labName = item.laboratory || "Laboratorium Centralne";
      if (!groups[labName]) groups[labName] = [];
      groups[labName].push(item);
    });
    return groups;
  },
}));
