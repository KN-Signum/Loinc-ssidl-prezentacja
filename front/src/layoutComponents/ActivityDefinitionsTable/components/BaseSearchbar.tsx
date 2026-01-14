import { X, Search } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useAppStore } from "../../../store/appStore";
import { useTableFiltering } from "../../../hooks/useTableFiltering";
import { IconButton } from "../../../components/ui/icon-button";


const BaseSearchbar = () => {
  const { searchTerm, setSearchTerm } = useAppStore();
  const { setSelectedLab, setSelectedSpecimen } = useTableFiltering({
    listData: [],
    searchTerm: "",
  });
  return (
    <Card className="border-slate-200 shadow-sm mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Search */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium leading-none">
              Szukaj badania
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Nazwa badania, kod LOINC..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <IconButton
            variant="ghost"
            className="shrink-0 border-slate-200"
            aria-label="Wyczyść wyszukiwarkę"
            hover="accent"
            onClick={() => {
              setSearchTerm("");
              setSelectedLab("all");
              setSelectedSpecimen("all");
            }}
          >
            <X className="absolute text-slate-800" />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};
export default BaseSearchbar;
