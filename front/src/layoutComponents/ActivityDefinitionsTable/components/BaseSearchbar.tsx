import { useEffect } from "react";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useAppStore } from "../../../store/appStore";
import { useTableFiltering } from "../../../hooks/useTableFiltering";
import { isEditableElement, SEARCH_INPUT_ID } from "../../../hooks/keyboardNav";


const BaseSearchbar = () => {
  const { searchTerm, setSearchTerm } = useAppStore();
  const { setSelectedLab, setSelectedSpecimen } = useTableFiltering({
    listData: [],
    searchTerm: "",
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !isEditableElement(document.activeElement)
      ) {
        e.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <Card className="border-slate-200 shadow-sm mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Search */}
          <div className="flex-1 space-y-2">
            <label htmlFor={SEARCH_INPUT_ID} className="text-sm font-medium leading-none">
              Szukaj badania
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id={SEARCH_INPUT_ID}
                placeholder="Nazwa badania, kod LOINC..."
                className="pl-9 pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    document
                      .querySelector<HTMLElement>('table tbody tr[data-row-index="0"]')
                      ?.focus();
                  }
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Wyczyść wyszukiwanie"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLab("all");
                    setSelectedSpecimen("all");
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default BaseSearchbar;
