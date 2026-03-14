import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  TestTube2,
  ClipboardList,
  CheckCircle2,
  Truck,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Badge } from "../../components/ui/badge";
import { CitationItem } from "../../features/citations/types";
import { useAppStore } from "../../store/appStore";

export interface DetailsSheetProps {
  specimenData: any;
  observationData: any;
  activityDefinitionData: any;
  citationsData: CitationItem[] | { message: string } | null;
  isLoading: boolean;
}

const DESCRIPTION_CHAR_LIMIT = 300;
const HANDLING_INITIAL_LIMIT = 10;
const CITATIONS_INITIAL_LIMIT = 10;

const genderLabel: Record<string, string> = {
  male: "Mężczyzna",
  female: "Kobieta",
  other: "Inne",
  unknown: "Nieznana",
};

type GenderFilter = "all" | "male" | "female";

export const DetailsSheet: React.FC<DetailsSheetProps> = ({
  specimenData,
  observationData,
  activityDefinitionData,
  citationsData,
  isLoading,
}) => {
  const { detailsId, setDetailsId } = useAppStore();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [isHandlingExpanded, setIsHandlingExpanded] = useState(false);
  const [isHandlingAllVisible, setIsHandlingAllVisible] = useState(false);
  const [isCitationsAllVisible, setIsCitationsAllVisible] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setGenderFilter("all");
    setIsHandlingExpanded(false);
    setIsHandlingAllVisible(false);
    setIsCitationsAllVisible(false);
  }, [detailsId]);

  const description = activityDefinitionData?.description || "";
  const isDescriptionLong = description.length > DESCRIPTION_CHAR_LIMIT;
  const displayedDescription =
    isDescriptionLong && !isDescriptionExpanded
      ? description.slice(0, DESCRIPTION_CHAR_LIMIT) + "..."
      : description;

  const formatRangeValue = (value: number | undefined): number | undefined =>
    value !== undefined ? Math.round(value * 100) / 100 : undefined;

  // Citations logic
  const citationsArray = Array.isArray(citationsData) ? citationsData : null;
  const hasGenderedData = citationsArray?.some((item) => item.gender);
  const availableGenders = citationsArray
    ? [...new Set(citationsArray.map((item) => item.gender).filter(Boolean))]
    : [];
  const showGenderFilter = hasGenderedData && availableGenders.length > 1;

  const filteredCitations = citationsArray
    ? citationsArray.filter((item) => {
        if (genderFilter === "all") return true;
        if (!item.gender) return true;
        return item.gender === genderFilter;
      })
    : null;

  const visibleCitations = filteredCitations
    ? isCitationsAllVisible
      ? filteredCitations
      : filteredCitations.slice(0, CITATIONS_INITIAL_LIMIT)
    : null;

  const hasMoreCitations =
    filteredCitations && filteredCitations.length > CITATIONS_INITIAL_LIMIT;

  // Handling instructions logic
  const handlingInstructions = specimenData?.handlingInstructions ?? [];
  const visibleHandling = isHandlingAllVisible
    ? handlingInstructions
    : handlingInstructions.slice(0, HANDLING_INITIAL_LIMIT);
  const hasMoreHandling = handlingInstructions.length > HANDLING_INITIAL_LIMIT;

  const renderRangeOrAge = (
    data:
      | {
          low?: { value?: number; unit?: string };
          high?: { value?: number; unit?: string };
        }
      | null
      | undefined,
    label: string,
  ) => {
    if (!data) return null;

    const lowValue = formatRangeValue(data.low?.value);
    const highValue = formatRangeValue(data.high?.value);
    const unit = data.low?.unit || data.high?.unit || "";

    let displayText = "";
    if (lowValue !== undefined && highValue !== undefined) {
      displayText = `${lowValue} – ${highValue} ${unit}`;
    } else if (lowValue !== undefined) {
      displayText = `≥ ${lowValue} ${unit}`;
    } else if (highValue !== undefined) {
      displayText = `≤ ${highValue} ${unit}`;
    } else {
      displayText = "Brak zakresu";
    }

    return (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200"
      >
        {label}: {displayText}
      </Badge>
    );
  };

  const filterButtons: { label: string; value: GenderFilter }[] = [
    { label: "Wszyscy", value: "all" },
    { label: "Mężczyzna", value: "male" },
    { label: "Kobieta", value: "female" },
  ];

  return (
    <Sheet
      open={!!detailsId}
      onOpenChange={(open: boolean) => !open && setDetailsId(null)}
    >
      <SheetContent className="w-full mx-4 sm:max-w-xl overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center flex-col gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
                LOINC:{" "}
                {activityDefinitionData?.code?.coding?.[0]?.code || "N/A"}
              </Badge>
            </SheetHeader>

            <div className="space-y-8">
              {/* Opis */}
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

              {/* Przygotowanie Pacjenta */}
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
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <p className="uppercase">
                            {specimenData.display?.toLowerCase()}
                          </p>
                          <p className="text-slate-300">|</p>
                          <p className="text-slate-500">
                            KOD: {specimenData?.collectionCode || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {handlingInstructions.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <button
                          onClick={() =>
                            setIsHandlingExpanded(!isHandlingExpanded)
                          }
                          className="flex items-center justify-between w-full text-left"
                        >
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Instrukcje Obsługi ({handlingInstructions.length})
                          </span>
                          {isHandlingExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          )}
                        </button>

                        {isHandlingExpanded && (
                          <div className="mt-3 flex flex-col gap-3">
                            {visibleHandling.map(
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
                                  className="p-4 rounded-lg border border-slate-300 bg-white"
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

                            {hasMoreHandling && (
                              <button
                                onClick={() =>
                                  setIsHandlingAllVisible(!isHandlingAllVisible)
                                }
                                className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                {isHandlingAllVisible
                                  ? "Pokaż mniej"
                                  : `Wyświetl wszystkie (${handlingInstructions.length})`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {citationsData && (
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                      <BookOpen className="h-4 w-4" />
                      Wartości Referencyjne
                    </h4>

                    {showGenderFilter && (
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        {filterButtons
                          .filter(
                            (btn) =>
                              btn.value === "all" ||
                              availableGenders.includes(btn.value),
                          )
                          .map((btn) => (
                            <button
                              key={btn.value}
                              onClick={() => {
                                setGenderFilter(btn.value);
                                setIsCitationsAllVisible(false);
                              }}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                genderFilter === btn.value
                                  ? "bg-white text-slate-900 shadow-sm"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {visibleCitations ? (
                      visibleCitations.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">
                          Brak danych dla wybranego filtru.
                        </p>
                      ) : (
                        <>
                          {visibleCitations.map((item, idx) => (
                            <div
                              key={idx}
                              className="border border-slate-200 rounded-lg p-4 bg-slate-50/30"
                            >
                              {item.message ? (
                                <p className="text-sm text-slate-500 italic">
                                  {item.message}
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {(item.range || item.age || item.gender) && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {renderRangeOrAge(item.range, "Zakres")}
                                      {renderRangeOrAge(item.age, "Wiek")}
                                      {item.gender && (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                          Płeć:{" "}
                                          {genderLabel[item.gender] ??
                                            item.gender}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  {(item.range || item.age || item.gender) && (
                                    <hr className="border-slate-200 my-2" />
                                  )}
                                  {item.citation?.description && (
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                      {item.citation.description}
                                    </p>
                                  )}
                                  <div className="pt-2">
                                    {item.citation?.citedArtifact
                                      ?.webLocation?.[0]?.url ? (
                                      <a
                                        href={
                                          item.citation.citedArtifact
                                            .webLocation[0].url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                      >
                                        <BookOpen className="h-4 w-4 shrink-0" />
                                        <span className="break-all">
                                          {
                                            item.citation.citedArtifact
                                              .webLocation[0].url
                                          }
                                        </span>
                                      </a>
                                    ) : (
                                      <p className="text-sm text-slate-400 italic">
                                        Brak źródła
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {hasMoreCitations && (
                            <button
                              onClick={() =>
                                setIsCitationsAllVisible(!isCitationsAllVisible)
                              }
                              className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              {isCitationsAllVisible
                                ? "Pokaż mniej"
                                : `Wyświetl wszystkie (${filteredCitations!.length})`}
                            </button>
                          )}
                        </>
                      )
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        {(citationsData as { message: string }).message}
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
