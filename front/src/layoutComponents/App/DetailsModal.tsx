import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  TestTube2,
  ClipboardList,
  CheckCircle2,
  Truck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";
import { ActivityGoalSection } from "../../features/activityDefinition/ActivityGoalSection";
import { CitationItem } from "../../features/citations/types";
import { useGetAgeUnits } from "../../features/citations/Api";
import { ObservationDefinitionListItem } from "../../features/observationDefinition/Api";
import { useAppStore } from "../../store/appStore";

export interface DetailsModalProps {
  specimenData: any;
  observationData: any;
  observationList: ObservationDefinitionListItem[];
  activityDefinitionData: any;
  citationsData: CitationItem[] | { message: string } | null;
  activityViewLoading: boolean;
  observationViewLoading: boolean;
  isMultiObs: boolean;
  singleObsId: string | null;
}

const NFZ_LABELS: Record<string, string> = {
  NFZSG: "Świadczenie gwarantowane NFZ",
  NFZPK: "Produkt kontraktowy NFZ",
  NFZSR: "Świadczenie rozliczane NFZ",
};

const DESCRIPTION_CHAR_LIMIT = 300;

const genderLabel: Record<string, string> = {
  male: "Mężczyzna",
  female: "Kobieta",
  other: "Inne",
  unknown: "Nieznana",
};

type GenderFilter = "all" | "male" | "female";
type View = "activity" | "observation";

const CHILD_AGE_THRESHOLD_YEARS = 18;

const SkeletonBlock: React.FC<{ className?: string }> = ({
  className = "",
}) => <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;

const ActivitySkeleton: React.FC = () => (
  <>
    <DialogHeader className="mb-1 space-y-2">
      <DialogTitle className="sr-only">Ładowanie szczegółów usługi</DialogTitle>
      <SkeletonBlock className="h-7 w-2/3" />
      <div className="flex flex-wrap gap-2 mb-2">
        <SkeletonBlock className="h-6 w-24" />
        <SkeletonBlock className="h-6 w-40" />
      </div>
    </DialogHeader>
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-4 w-5/6" />
      </section>
      <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">
        <SkeletonBlock className="h-4 w-44" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="h-12 w-full" />
      </section>
    </div>
  </>
);

const ObservationSkeleton: React.FC<{
  onBack: () => void;
  parentTitle: string;
}> = ({ onBack, parentTitle }) => (
  <>
    <DialogHeader className="mb-1 space-y-2">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mb-1 w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Powrót do {parentTitle}
      </button>
      <DialogTitle className="sr-only">
        Ładowanie szczegółów parametru
      </DialogTitle>
      <SkeletonBlock className="h-7 w-2/3" />
      <div className="flex flex-wrap gap-2">
        <SkeletonBlock className="h-6 w-28" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
    </DialogHeader>
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-12 w-full" />
        <SkeletonBlock className="h-12 w-full" />
      </section>
    </div>
  </>
);

export const DetailsModal: React.FC<DetailsModalProps> = ({
  specimenData,
  observationData,
  observationList,
  activityDefinitionData,
  citationsData,
  activityViewLoading,
  observationViewLoading,
  isMultiObs,
  singleObsId,
}) => {
  const { detailsId, setDetailsId, setSelectedObsId } = useAppStore();
  const ageUnits = useGetAgeUnits();
  const [view, setView] = useState<View>("activity");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [showChildren, setShowChildren] = useState(true);

  useEffect(() => {
    setView("activity");
    setSelectedObsId(null);
    setIsDescriptionExpanded(false);
    setGenderFilter("all");
    setShowChildren(true);
  }, [detailsId, setSelectedObsId]);

  const goToObservation = (obsId: string) => {
    setSelectedObsId(obsId);
    setView("observation");
  };

  const goBackToActivity = () => {
    setSelectedObsId(null);
    setView("activity");
  };

  const nfzCodes: { code: string; display: string }[] = Array.from(
    new Map(
      ((activityDefinitionData?.extension ?? []) as any[])
        .filter((e: any) => e.url?.endsWith("activityDefinition-nfzCode"))
        .flatMap((nfzExt: any) => {
          const subExts: any[] = nfzExt.extension ?? [];
          const coding = subExts.find(
            (e: any) => e.url === "type",
          )?.valueCoding;
          return coding?.code
            ? [
                {
                  code: coding.code as string,
                  display: (coding.display ?? coding.code) as string,
                },
              ]
            : [];
        })
        .map(
          (item) =>
            [item.code, item] as [string, { code: string; display: string }],
        ),
    ).values(),
  );

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

  const ageToYears = (item: CitationItem): number => {
    const unit = item.age?.low?.unit || item.age?.high?.unit || "";
    const val = item.age?.low?.value ?? item.age?.high?.value ?? Infinity;
    if (unit === "a") return val;
    if (unit === "mo") return val / 12;
    if (unit === "wk") return val / 52;
    if (unit === "d") return val / 365;
    return val;
  };

  const isChildItem = (item: CitationItem): boolean => {
    if (!item.age) return false;
    const lowUnit = item.age.low?.unit || "";
    const highUnit = item.age.high?.unit || "";
    if (lowUnit === "d" || lowUnit === "wk") return true;
    if (highUnit === "d" || highUnit === "wk") return true;
    if (lowUnit === "mo" || highUnit === "mo") return true;
    if (
      highUnit === "a" &&
      (item.age.high?.value ?? Infinity) <= CHILD_AGE_THRESHOLD_YEARS
    )
      return true;
    return false;
  };

  const hasChildData = citationsArray?.some(isChildItem) ?? false;

  const filteredCitations = citationsArray
    ? citationsArray
        .filter((item) => {
          if (
            genderFilter !== "all" &&
            item.gender &&
            item.gender !== genderFilter
          )
            return false;
          if (!showChildren && isChildItem(item)) return false;
          return true;
        })
        .slice()
        .sort((a, b) => ageToYears(a) - ageToYears(b))
    : null;

  const handlingInstructions = specimenData?.handlingInstructions ?? [];

  const filterButtons: { label: string; value: GenderFilter }[] = [
    { label: "Wszyscy", value: "all" },
    { label: "Mężczyzna", value: "male" },
    { label: "Kobieta", value: "female" },
  ];

  const parameters: ObservationDefinitionListItem[] = isMultiObs
    ? observationList
    : singleObsId
      ? [
          {
            id: singleObsId,
            preferredReportName: null,
          },
        ]
      : [];

  return (
    <Dialog
      open={!!detailsId}
      onOpenChange={(open: boolean) => !open && setDetailsId(null)}
    >
      <DialogContent className="w-[min(900px,92vw)] sm:max-w-3xl max-h-[85vh] scrollbar-hide overflow-y-auto backdrop-blur-sm">
        {view === "activity" ? (
          activityViewLoading ? (
            <ActivitySkeleton />
          ) : (
            <>
              <DialogHeader className="mb-1 space-y-1">
                <DialogTitle className="text-2xl leading-tight">
                  {activityDefinitionData?.title || "Szczegóły Usługi"}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="w-fit text-blue-700 border-blue-200 bg-blue-50 font-mono"
                  >
                    LOINC:{" "}
                    {activityDefinitionData?.code?.coding?.[0]?.code || "N/A"}
                  </Badge>
                  {nfzCodes.map((nfz, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="w-fit text-emerald-700 border-emerald-200 bg-emerald-50"
                    >
                      {NFZ_LABELS[nfz.code] ?? nfz.display}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>

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

                <ActivityGoalSection
                  activityDefinitionData={activityDefinitionData}
                />

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

                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                    <BookOpen className="h-4 w-4" />
                    Parametry badania
                    {parameters.length > 0 && (
                      <span className="text-slate-400 font-normal normal-case tracking-normal">
                        ({parameters.length})
                      </span>
                    )}
                  </h4>
                  {parameters.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">
                      Brak parametrów powiązanych z tą usługą.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {parameters.map((obs) => (
                        <button
                          key={obs.id}
                          onClick={() => goToObservation(obs.id)}
                          className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-800">
                            {obs.preferredReportName ??
                              "Zobacz wartości referencyjne"}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          )
        ) : observationViewLoading ? (
          <ObservationSkeleton
            onBack={goBackToActivity}
            parentTitle={activityDefinitionData?.title || "usługi"}
          />
        ) : (
          <>
            <DialogHeader className="mb-1 space-y-1">
              <button
                onClick={goBackToActivity}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mb-1 w-fit"
              >
                <ChevronLeft className="h-4 w-4" />
                Powrót do {activityDefinitionData?.title || "usługi"}
              </button>
              <DialogTitle className="text-2xl leading-tight">
                {observationData?.preferredReportName || "Szczegóły Parametru"}
              </DialogTitle>
              {(observationData?.code || observationData?.codeDisplay) && (
                <div className="flex flex-wrap items-baseline gap-2">
                  {observationData?.code && (
                    <Badge
                      variant="outline"
                      className="w-fit text-blue-700 border-blue-200 bg-blue-50 font-mono"
                    >
                      LOINC: {observationData.code}
                    </Badge>
                  )}
                  {observationData?.codeDisplay && (
                    <span className="text-xs text-slate-500">
                      {observationData.codeDisplay}
                    </span>
                  )}
                </div>
              )}
            </DialogHeader>

            <div className="space-y-8">
              {citationsData && (
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                      <BookOpen className="h-4 w-4" />
                      Wartości Referencyjne
                    </h4>

                    <div className="flex items-center gap-2 flex-wrap">
                      {hasChildData && (
                        <button
                          onClick={() => setShowChildren((v) => !v)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                            showChildren
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-700"
                          }`}
                        >
                          {showChildren ? "Ukryj dzieci" : "Pokaż dzieci"}
                        </button>
                      )}
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
                  </div>

                  <div className="flex flex-col gap-3">
                    {filteredCitations ? (
                      filteredCitations.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">
                          Brak danych dla wybranego filtru.
                        </p>
                      ) : (
                        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
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
                              const ageUnitCode =
                                item.age?.low?.unit ||
                                item.age?.high?.unit ||
                                "";
                              const ageUnit =
                                ageUnits[ageUnitCode] || ageUnitCode;
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
      </DialogContent>
    </Dialog>
  );
};
