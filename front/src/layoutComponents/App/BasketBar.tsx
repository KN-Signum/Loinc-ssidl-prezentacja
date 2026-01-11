import React from "react";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { useBasketStore } from "../../store/basketStore";

export interface BasketBarProps {
  basketItems: ActivityDefinition[];
  basketGroups: Record<string, ActivityDefinition[]>;
  onProceedToOrder: () => void;
}

export const BasketBar: React.FC<BasketBarProps> = ({
  basketItems,
  basketGroups,
  onProceedToOrder,
}) => {
  const { clearBasket, getBasketCount } = useBasketStore();
  const basketCount = getBasketCount();
  const basketHasMultipleLabs = Object.keys(basketGroups).length > 1;

  if (basketCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">
              Koszyk Zleceń ({basketCount}{" "}
              {basketCount === 1 ? "badanie" : "badania"})
            </h3>
          </div>
          <div className="text-sm text-slate-500 line-clamp-1">
            Wybrano: {basketItems.map((i) => i.title || i.name).join(", ")}
          </div>
          {basketHasMultipleLabs && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 border border-amber-200">
              <AlertTriangle className="h-4 w-4" />
              Uwaga: Wybrano badania z {Object.keys(basketGroups).length}{" "}
              różnych laboratoriów. System wygeneruje oddzielne zlecenia.
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Button
            variant="outline"
            onClick={clearBasket}
            className="text-slate-600"
          >
            Wyczyść
          </Button>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            onClick={onProceedToOrder}
          >
            Przejdź do Zlecenia
          </Button>
        </div>
      </div>
    </div>
  );
};
