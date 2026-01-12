import { Activity, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { ActivityDefinition } from "../../../features/activityDefinition/ActivityDefinition";

type ActivityDefinitionTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
  filteredData: ActivityDefinition[];
  basket: Set<string>;
  toggleSelection: (id: string) => void;
  setDetailsId: (id: string) => void;
  getLoincOrICDCode: (item: any) => {loinc:string,icd_9:string};
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  onNextPage?: () => void;
  onPrevPage?: () => void;
};

const BaseActivityDefinitionsTable = (props: ActivityDefinitionTableProps) => {
    const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700">
            Dostępne
          </Badge>
        );
      case "unavailable":
        return (
          <Badge variant="secondary" className="text-slate-500">
            Niedostępne
          </Badge>
        );
      default:
        return <Badge variant="outline">Aktywne</Badge>;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px] text-center"></TableHead>
              <TableHead className="w-[350px]">Nazwa Badania</TableHead>
              <TableHead className="w-[180px]">Kod (LOINC)</TableHead>
              <TableHead className="w-[120px]">Kod ICD-9</TableHead>
              <TableHead className="text-right"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.listLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  Ładowanie definicji...
                </TableCell>
              </TableRow>
            ) : props.filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  Nie znaleziono badań.
                </TableCell>
              </TableRow>
            ) : (
              props.filteredData.map((item: any) => {
                const isSelected = props.basket.has(item.id);
                const loincCode = props.getLoincOrICDCode(item).loinc;
                const icd9Code = props.getLoincOrICDCode(item).icd_9;
                return (
                  <TableRow
                    key={item.id}
                    className={`group transition-colors ${
                      isSelected
                        ? "bg-blue-50/50 hover:bg-blue-50"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => props.toggleSelection(item.id)}
                        aria-label={`Select ${item.title}`}
                      />
                    </TableCell>

                    <TableCell className="align-middle">
                      <span
                        className={`font-semibold transition-colors ${
                          isSelected ? "text-blue-700" : "text-slate-900"
                        }`}
                      >
                        {item.title || item.name}
                      </span>
                    </TableCell>

                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className="px-2 py-1 font-mono text-xs bg-slate-50 text-slate-600 border-slate-200"
                      >
                        <Activity className="h-3 w-3 mr-1 inline-block" />
                        {loincCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      {icd9Code}
                    </TableCell>

                    <TableCell className="text-right align-middle">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.setDetailsId(item.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Info className="mr-2 h-4 w-4" />
                        Szczegóły
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          disabled={!props.paginationTokenPrev}
          onClick={() => props.onPrevPage?.()}
          className="text-slate-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Poprzednia
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!props.paginationTokenNext}
          onClick={() => props.onNextPage?.()}
          className="text-slate-700"
        >
          Następna
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
export default BaseActivityDefinitionsTable;
