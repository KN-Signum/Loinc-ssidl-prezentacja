import React from "react";
import {
  FlaskConical,
  TestTube2,
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Badge } from "../../components/ui/badge";

export interface DetailsSheetProps {
  detailsId: string | null;
  onClose: () => void;
  specimenData: any;
  observationData: any;
  isLoading: boolean;
}

export const DetailsSheet: React.FC<DetailsSheetProps> = ({
  detailsId,
  onClose,
  specimenData,
  observationData,
  isLoading,
}) => {
  return (
    <Sheet open={!!detailsId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full mx-4 sm:max-w-xl overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center flex-col gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-slate-500">
              Pobieranie definicji FHIR...
            </p>
          </div>
        ) : (
          <>
            <SheetHeader className="mb-1 space-y-1">
              <SheetTitle className="text-2xl leading-tight">
                {observationData?.preferredReportName || "Szczegóły Badania"}
              </SheetTitle>
              <Badge
                variant="outline"
                className="w-fit mb-2 text-blue-700 border-blue-200 bg-blue-50 font-mono"
              >
                LOINC: {specimenData?.collectionCode || "N/A"}
              </Badge>
            </SheetHeader>

            <div className="space-y-8">
              {specimenData && (
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                    <ClipboardList className="h-4 w-4" />
                    Przygotowanie Pacjenta
                  </h4>
                  {specimenData.patientPreparation.length > 0 ? (
                    <ul className="space-y-2">
                      {specimenData.patientPreparation.map((text: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      Brak specyficznych zaleceń.
                    </p>
                  )}
                </section>
              )}

              {specimenData && (
                <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                    <FlaskConical className="h-4 w-4" />
                    Specyfikacja Materiału
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 shadow-sm">
                        <TestTube2 className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500">
                          Typ Materiału
                        </span>
                        <div className="text-sm font-medium text-slate-900">
                          {specimenData.collectionSystem}
                        </div>
                      </div>
                    </div>

                    {specimenData.transportInstructions && specimenData.transportInstructions.length > 0 && (
                      <div className="flex items-start gap-3 pt-2 border-t border-slate-200 mt-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shadow-sm border border-amber-100">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="block text-xs font-semibold text-slate-500 mb-1">
                            Warunki Transportu
                          </span>
                          <ul className="list-disc pl-4 space-y-1">
                            {specimenData.transportInstructions.map(
                              (instruction: string, idx: number) => (
                                <li key={idx} className="text-sm font-medium text-slate-900">
                                  {instruction}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {specimenData.stabilityInstructions && specimenData.stabilityInstructions.length > 0 && (
                      <div className="flex items-start gap-3 pt-2 border-t border-slate-200 mt-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="block text-xs font-semibold text-slate-500 mb-1">
                            Stabilność Materiału
                          </span>
                          <ul className="list-disc pl-4 space-y-1">
                            {specimenData.stabilityInstructions.map(
                              (instruction: string, idx: number) => (
                                <li key={idx} className="text-sm font-medium text-slate-900">
                                  {instruction}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
