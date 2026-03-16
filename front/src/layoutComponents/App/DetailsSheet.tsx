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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";
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

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setGenderFilter("all");
  }, [detailsId]);

  const nfzCodes: string[] = (() => {
    const extensions: any[] = activityDefinitionData?.extension ?? [];
    return extensions
      .filter((e: any) => e.url?.endsWith("activityDefinition-nfzCode"))
      .map((nfzExt: any) => {
        const subExts: any[] = nfzExt.extension ?? [];
        return (
          subExts.find((e: any) => e.url === "type")?.valueCoding?.code ?? ""
        );
      })
      .filter(Boolean);
  })();

  const description = activityDefinitionData?.description || "";
  const isDescriptionLong = description.length > DESCRIPTION_CHAR_LIMIT;
  const displayedDescription =
    isDescriptionLong && !isDescriptionExpanded
      ? description.slice(0, DESCRIPTION_CHAR_LIMIT) + "..."
      : description;

  const formatRangeValue = (value: number | undefined): number | undefined =>
    value !== undefined ? Math.round(value * 100) / 100 : undefined;

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

  const handlingInstructions = specimenData?.handlingInstructions ?? [];

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
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="w-fit text-blue-700 border-blue-200 bg-blue-50 font-mono"
                >
                  LOINC:{" "}
                  {activityDefinitionData?.code?.coding?.[0]?.code || "N/A"}
                </Badge>
                {nfzCodes.map((code, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="w-fit text-emerald-700 border-emerald-200 bg-emerald-50"
                  >
                    Kod NFZ: {code}
                  </Badge>
                ))}
              </div>
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
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                          Instrukcje Obsługi ({handlingInstructions.length})
                        </span>
                        <div className="max-h-64 overflow-y-auto scrollbar-hide">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            {handlingInstructions.map(
                              (
                                item: {
                                  displayName: string;
                                  code: string;
                                  instruction: string;
                                },
                                idx: number,
                              ) => (
                                <AccordionItem
                                  key={idx}
                                  value={`handling-${idx}`}
                                  className="border-b border-slate-200"
                                >
                                  <AccordionTrigger className="py-3 hover:no-underline">
                                    <div className="flex items-center gap-2">
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
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <p className="text-sm text-slate-700 leading-relaxed pl-6">
                                      {item.instruction}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              ),
                            )}
                          </Accordion>
                        </div>
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
                    {filteredCitations ? (
                      filteredCitations.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">
                          Brak danych dla wybranego filtru.
                        </p>
                      ) : (
                        <div className="max-h-80 overflow-y-auto scrollbar-hide">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            {filteredCitations.map((item, idx) => {
                              if (item.message) {
                                return (
                                  <p
                                    key={idx}
                                    className="text-sm text-slate-500 italic py-2"
                                  >
                                    {item.message}
                                  </p>
                                );
                              }

                              const lowVal = formatRangeValue(
                                item.range?.low?.value,
                              );
                              const highVal = formatRangeValue(
                                item.range?.high?.value,
                              );
                              const unit =
                                item.range?.low?.unit ||
                                item.range?.high?.unit ||
                                "";
                              let rangeSummary = "";
                              if (
                                lowVal !== undefined &&
                                highVal !== undefined
                              ) {
                                rangeSummary = `${lowVal}–${highVal} ${unit}`;
                              } else if (lowVal !== undefined) {
                                rangeSummary = `≥ ${lowVal} ${unit}`;
                              } else if (highVal !== undefined) {
                                rangeSummary = `≤ ${highVal} ${unit}`;
                              }

                              const ageLow = formatRangeValue(
                                item.age?.low?.value,
                              );
                              const ageHigh = formatRangeValue(
                                item.age?.high?.value,
                              );
                              const ageUnit =
                                item.age?.low?.unit ||
                                item.age?.high?.unit ||
                                "";
                              let ageSummary = "";
                              if (
                                ageLow !== undefined &&
                                ageHigh !== undefined
                              ) {
                                ageSummary = `${ageLow}–${ageHigh} ${ageUnit}`;
                              } else if (ageLow !== undefined) {
                                ageSummary = `≥ ${ageLow} ${ageUnit}`;
                              } else if (ageHigh !== undefined) {
                                ageSummary = `≤ ${ageHigh} ${ageUnit}`;
                              }

                              return (
                                <AccordionItem
                                  key={idx}
                                  value={`citation-${idx}`}
                                  className="border-b border-slate-200"
                                >
                                  <AccordionTrigger className="py-3 hover:no-underline">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {rangeSummary && (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                        >
                                          {rangeSummary}
                                        </Badge>
                                      )}
                                      {ageSummary && (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                        >
                                          Wiek: {ageSummary}
                                        </Badge>
                                      )}
                                      {item.gender && (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                        >
                                          {genderLabel[item.gender] ??
                                            item.gender}
                                        </Badge>
                                      )}
                                      {!rangeSummary &&
                                        !ageSummary &&
                                        !item.gender && (
                                          <span className="text-sm text-slate-600">
                                            Wartość referencyjna #{idx + 1}
                                          </span>
                                        )}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3 pl-1">
                                      {item.citation?.description && (
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                          {item.citation.description}
                                        </p>
                                      )}
                                      <div className="pt-1">
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
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
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
