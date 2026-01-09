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

const BaseSearchbar = (props: SearchbarProps) => {
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
export default BaseSearchbar;
