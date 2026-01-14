import { Activity, Info, TestTube2 } from "lucide-react";
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
import { useAppStore } from "../../../store/appStore";
import { useTableFiltering } from "../../../hooks/useTableFiltering";
import { useBasketStore } from "../../../store/basketStore";

type ActivityDefinitionTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
};

const ActivityDefinitionsTable = (props: ActivityDefinitionTableProps) => {
  const { filteredData, getLoincOrICDCode } = useTableFiltering({
    listData: props.listData,
    searchTerm: "",
  });
  const { setDetailsId } = useAppStore();
  const { basket, toggleItem } = useBasketStore();

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
    <Card className="shadow-sm">
      <div className="rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[50px] text-center"></TableHead>
              <TableHead className="w-[350px]">Nazwa Badania</TableHead>
              <TableHead className="w-[180px]">Kod (LOINC/Local)</TableHead>
              <TableHead>Laboratorium</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[50px] text-center">Baza Wiedzy</TableHead>
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
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  Nie znaleziono badań.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: any) => {
                const isSelected = basket.has(item.id);
                const loincCode = getLoincOrICDCode(item).loinc;
                const icd9Code = getLoincOrICDCode(item).icd_9;
                return (
                  <TableRow
                    key={item.id}
                    className={`group transition-colors ${isSelected
                      ? "bg-blue-50/50 hover:bg-blue-50"
                      : "hover:bg-slate-50/50"
                      }`}
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleItem(item.id)}
                        aria-label={`Select ${item.title}`}
                      />
                    </TableCell>

                    <TableCell className="align-middle">
                      <span
                        className={`font-semibold transition-colors ${isSelected ? "text-blue-700" : "text-slate-900"
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
                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        <TestTube2 className="mr-2 h-3 w-3 text-slate-500" />
                        {item.laboratory || "Lab. Centralne"}
                      </div>
                    </TableCell>

                    <TableCell className="align-middle">
                      {getStatusBadge(item.status || "active")}
                    </TableCell>

                    <TableCell className="text-right align-middle">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailsId(item.id)}
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
    </Card>
  );
};
export default ActivityDefinitionsTable;
