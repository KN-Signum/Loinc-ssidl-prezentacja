import { Activity, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
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
import { useTableFiltering } from "../../../hooks/useTableFiltering";
import { useAppStore } from "../../../store/appStore";

type ActivityDefinitionTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  onNextPage?: () => void;
  onPrevPage?: () => void;
};

const BaseActivityDefinitionsTable = (props: ActivityDefinitionTableProps) => {
  const { filteredData, getLoincOrICDCode } = useTableFiltering({
    listData: props.listData,
    searchTerm: "",
  });
  const { setDetailsId } = useAppStore();

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm h-fit gap-0">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
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

                  const loincCode = getLoincOrICDCode(item).loinc;
                  const icd9Code = getLoincOrICDCode(item).icd_9;
                  return (
                    <TableRow
                      key={item.id}
                      className={`group transition-colors hover:bg-slate-50`}
                    >
                      <TableCell className="text-center">
                      </TableCell>

                      <TableCell className="align-middle">
                        <span
                          className={`font-semibold transition-colors text-slate-900`}
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

      <div className="flex items-center justify-end gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!props.paginationTokenPrev}
          onClick={() => props.onPrevPage?.()}
          className="bg-white shadow-sm border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Poprzednia
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!props.paginationTokenNext}
          onClick={() => props.onNextPage?.()}
          className="bg-white shadow-sm border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Następna
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
export default BaseActivityDefinitionsTable;