import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  TestTube2,
  ClipboardList,
  CheckCircle2,
  Truck,
  BookOpen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Badge } from "../../components/ui/badge";
import { CitationItem } from "../../features/citations/types";

export interface DetailsSheetProps {
  detailsId: string | null;
  onClose: () => void;
  specimenData: any;
  observationData: any;
  activityDefinitionData: any;
  citationsData: CitationItem[] | { message: string } | null;
  isLoading: boolean;
}

const DESCRIPTION_CHAR_LIMIT = 300;

export const DetailsSheet: React.FC<DetailsSheetProps> = ({
  detailsId,
  onClose,
  specimenData,
  observationData,
  activityDefinitionData,
  citationsData,
  isLoading,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [detailsId]);

  const description = activityDefinitionData?.description || "";
  const isDescriptionLong = description.length > DESCRIPTION_CHAR_LIMIT;
  const displayedDescription =
    isDescriptionLong && !isDescriptionExpanded
      ? description.slice(0, DESCRIPTION_CHAR_LIMIT) + "..."
      : description;

  const formatRangeValue = (value: number | undefined): number | undefined => {
    return value !== undefined ? Math.round(value * 100) / 100 : undefined;
  };
  const renderRangeOrAge = (
    data: {
      low?: { value?: number; unit?: string };
      high?: { value?: number; unit?: string };
    } | null,
    label: string,
    citationId?: string,
  ) => {
    if (!data) return null;

    const lowValue = formatRangeValue(data.low?.value);
    const highValue = formatRangeValue(data.high?.value);
    const unit = data.low?.unit || data.high?.unit || "";

    let displayText = "";
    if (lowValue !== undefined && highValue !== undefined) {
      displayText = `${lowValue} - ${highValue} ${unit}`;
    } else if (lowValue !== undefined) {
      displayText = `≥ ${lowValue} ${unit}`;
    } else if (highValue !== undefined) {
      displayText = `≤ ${highValue} ${unit}`;
    } else {
      displayText = "Brak zakresu";
    }

    return (
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {label}: {displayText}
        </Badge>
        {citationId && (
          <span className="text-xs text-slate-500 font-mono">
            Citation/{citationId}
          </span>
        )}
      </div>
    );
  };

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
              {activityDefinitionData?.description && (
                <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Opis
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {displayedDescription}
                  </p>
                  {isDescriptionLong && (
                    <button
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      {isDescriptionExpanded ? "pokaż mniej" : "pokaż więcej"}
                    </button>
                  )}
                </section>
              )}

              {specimenData && (
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                    <ClipboardList className="h-4 w-4" />
                    Przygotowanie Pacjenta
                  </h4>
                  {specimenData.patientPreparation.length > 0 ? (
                    <ul className="space-y-2">
                      {specimenData.patientPreparation.map(
                        (text: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex gap-2 text-sm text-slate-700"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{text}</span>
                          </li>
                        ),
                      )}
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

                    {specimenData.handlingInstructions &&
                      specimenData.handlingInstructions.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 mt-2">
                          <span className="block text-xs font-semibold text-slate-500 mb-3">
                            Instrukcje Obsługi
                          </span>
                          <div className="space-y-3">
                            {specimenData.handlingInstructions.map(
                              (
                                item: {
                                  displayName: string;
                                  code: string;
                                  instruction: string;
                                },
                                idx: number,
                              ) => (
                                <div
                                  key={idx}
                                  className="p-4 rounded-lg border border-slate-300 mb-2"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                                    <span className="text-sm font-semibold text-slate-900">
                                      {item.displayName}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-mono"
                                    >
                                      {item.code}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-700 leading-relaxed pl-6">
                                    {item.instruction}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </section>
              )}

              {citationsData && (
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                    <BookOpen className="h-4 w-4" />
                    Wartości Referencyjne
                  </h4>
                  <div className="space-y-4">
                    {Array.isArray(citationsData) ? (
                      citationsData.map((item, idx) => (
                        <div
                          key={idx}
                          className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0"
                        >
                          {item.message ? (
                            <p className="text-sm text-slate-500 italic">
                              {item.message}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {renderRangeOrAge(
                                item.range,
                                "Zakres",
                                item.citationId,
                              )}
                              {renderRangeOrAge(
                                item.age,
                                "Wiek",
                                item.citationId,
                              )}
                              {item.citation?.citedArtifact?.title && (
                                <p className="text-sm font-medium text-slate-900">
                                  {item.citation.citedArtifact.title}
                                </p>
                              )}
                              {item.citation?.citedArtifact?.abstract?.[0]
                                ?.text && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {item.citation.citedArtifact.abstract[0].text}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        {citationsData.message}
                      </p>
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
