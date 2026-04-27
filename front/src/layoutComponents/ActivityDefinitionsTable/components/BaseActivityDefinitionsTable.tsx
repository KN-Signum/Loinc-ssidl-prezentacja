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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { ActivityDefinition } from "../../../features/activityDefinition/ActivityDefinition";
import { useTableFiltering } from "../../../hooks/useTableFiltering";
import { useAppStore } from "../../../store/appStore";
import { TableErrorState } from "./TableErrorState";

type ActivityDefinitionTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
  listError?: string | null;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  onNextPage?: () => void;
  onPrevPage?: () => void;
};

const NO_CODE_LABEL = "Brak kodu";
const EXPECTED_ROWS_PER_PAGE = 10;

const getCodeTooltipText = ({
  code,
  display,
  systemName,
  missingDisplayMessage,
}: {
  code: string;
  display: string | null;
  systemName: string;
  missingDisplayMessage: string;
}): string => {
  if (display) return display;
  if (code === NO_CODE_LABEL) return `Brak kodu ${systemName} dla tego zasobu.`;
  return missingDisplayMessage;
};

const BaseActivityDefinitionsTable = (props: ActivityDefinitionTableProps) => {
  const {filteredData, getLoincOrICDCode} = useTableFiltering({
    listData: props.listData,
    searchTerm: "",
  });
  const { setDetailsId } = useAppStore();
  const placeholderRowsCount = Math.max(0, EXPECTED_ROWS_PER_PAGE - filteredData.length);

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
            {props.listLoading && filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  Ładowanie definicji...
                </TableCell>
              </TableRow>
            ) : props.listError ? (
              <TableErrorState error={props.listError} colSpan={6} />
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
              <>
                {filteredData.map((item: any) => {
                  const { loinc, loinc_display, icd_9, icd_9_display } = getLoincOrICDCode(item);
                  const loincTooltipText = getCodeTooltipText({
                    code: loinc,
                    display: loinc_display,
                    systemName: "LOINC",
                    missingDisplayMessage:
                      "Brak nazwy zasobu dla kodu LOINC (code.coding.display).",
                  });
                  const icdTooltipText = getCodeTooltipText({
                    code: icd_9,
                    display: icd_9_display,
                    systemName: "ICD-9",
                    missingDisplayMessage:
                      "Brak nazwy zasobu w słowniku ICD (code.coding.display).",
                  });
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex cursor-help">
                              <Badge
                                variant="outline"
                                className="px-2 py-1 font-mono text-xs bg-slate-50 text-slate-600 border-slate-200"
                              >
                                <Activity className="h-3 w-3 mr-1 inline-block" />
                                {loinc}
                              </Badge>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={8}
                            className="border-blue-300"
                          >
                            {loincTooltipText}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="align-middle">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex cursor-help">
                              <Badge
                                variant="outline"
                                className="px-2 py-1 font-mono text-xs bg-slate-50 text-slate-600 border-slate-200"
                              >
                                <Activity className="h-3 w-3 mr-1 inline-block" />
                                {icd_9}
                              </Badge>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={8}
                            className="border-blue-300"
                          >
                            {icdTooltipText}
                          </TooltipContent>
                        </Tooltip>
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
                })}
                {Array.from({ length: placeholderRowsCount }).map((_, index) => (
                  <TableRow key={`placeholder-${index}`} className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-[49px]" />
                  </TableRow>
                ))}
              </>
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