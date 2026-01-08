import { Building2, Filter, FlaskConical, Search } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { useGetLocationDefinitionLB, useGetLocationDefinitionPP } from "../../../features/locationDefinition/Api.ts";

type SearchbarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLab: string;
  setSelectedLab: (lab: string) => void;
  selectedSpecimen: string;
  setSelectedSpecimen: (specimen: string) => void;
};
const LABORATORIES = [
  "Diagnostyka Łódź",
  "Szpital Wojewódzki",
  "Lab. Centralne",
];
const SPECIMENS = ["Krew żylna", "Mocz", "Surowica", "Osocze"];

const Searchbar = (props: SearchbarProps) => {
  const {data: laboratories} = useGetLocationDefinitionLB();
  const {data: collectionPoints} = useGetLocationDefinitionPP();
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
                value={props.searchTerm}
                onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="w-full space-y-2 md:w-[280px]">
            <label className="text-sm font-medium leading-none">
              Laboratorium
            </label>
            <Select
              value={props.selectedLab}
              onValueChange={props.setSelectedLab}
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
                  <SelectItem key={lab.id} value={lab.id}>
                    {lab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full space-y-2 md:w-[240px]">
            <label className="text-sm font-medium leading-none">Punkty Pobrań</label>
            <Select
              value={props.selectedSpecimen}
              onValueChange={props.setSelectedSpecimen}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2 text-slate-600">
                  <FlaskConical className="h-4 w-4" />
                  <SelectValue placeholder="Wszystkie" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie punkty pobrań</SelectItem>
                {collectionPoints?.map((point) => (
                  <SelectItem key={point.id} value={point.id}>
                    {point.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => {
              props.setSearchTerm("");
              props.setSelectedLab("all");
              props.setSelectedSpecimen("all");
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default Searchbar;
