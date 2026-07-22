import { Building2, FlaskConical, Search, X } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useGetLocationDefinitionLB, useGetLocationDefinitionPP } from "../../../features/locationDefinition/Api.ts";
import { useTableFiltering } from "../../../hooks/useTableFiltering.ts";
import { useAppStore } from "../../../store/appStore.ts";
import { LocationDefinition } from "../../../features/locationDefinition/LocationDefinition.ts";
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../../config/apiBase";
import { isEditableElement, SEARCH_INPUT_ID } from "../../../hooks/keyboardNav";

const Searchbar = () => {
  const {data: laboratories} = useGetLocationDefinitionLB();
  const {data: collectionPoints} = useGetLocationDefinitionPP();
  const { searchTerm, setSearchTerm } = useAppStore();
  const { selectedLab,setSelectedLab,selectedSpecimen, setSelectedSpecimen } = useTableFiltering({
      listData: [],
      searchTerm: "",
  });
  function getLoactionIds(...locations: LocationDefinition[][]) {
    const ids = new Set<string>();
    locations.forEach((locationList) => {
      locationList?.forEach((location) => {
        if (location.id) {
          ids.add(location.id);
        }
      });
    });
    return ids;
  }
  useEffect(() => {
    const labIds = getLoactionIds(laboratories , collectionPoints );
    const fetchHealthareServices = async () => {
      try {
        const healthcareServices = await Promise.all(
          Array.from(labIds).map((id) =>
            axios.get(`${BACKEND_BASE_URL}/terminology/healthcare-services/location/${id}`)
          )
        );
        console.log(labIds)
        console.log(healthcareServices)
      } catch (error) {
        console.log(error)
      }
    }
    fetchHealthareServices()
  }, [laboratories,collectionPoints]);

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

          {/* Filters */}
          <div className="w-full space-y-2 md:w-[280px]">
            <label className="text-sm font-medium leading-none">
              Laboratorium/Punkt pobrań
            </label>
            <Select
              value={selectedLab}
              onValueChange={setSelectedLab}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="h-4 w-4" />
                  <SelectValue placeholder="Wszystkie" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie laboratoria</SelectItem>
                {laboratories?.map((lab) => (
                  <SelectItem key={`${lab.id}-${Math.random()}`} value={lab.id}>
                    {lab.name}
                  </SelectItem>
                ))}
                {// Dodałem collectionPoint do id bo z bazy danych narazie mogą się powtarzać
                collectionPoints?.map((point) => (
                  <SelectItem key={`${point.id}-collectionPoint-${Math.random()}`} value={point.id+ "collectionPoint"}> 
                    {point.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default Searchbar;
