import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { useGetAgeUnits } from "../../../features/citations/Api";
import { ObservationDefinitionListItem } from "../../../features/observationDefinition/Api";
import { useAppStore } from "../../../store/appStore";
import { ActivityDetailsView } from "./ActivityDetailsView";
import { ObservationDetailsView } from "./ObservationDetailsView";
import {
  ActivitySkeleton,
  ObservationSkeleton,
  DetailsModalProps,
  DetailsView,
  AgeFilter,
  GenderFilter,
} from "../../../components/detailsModal";

export type { DetailsModalProps } from "../../../components/detailsModal";

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
  const [view, setView] = useState<DetailsView>(DetailsView.Activity);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>(
    GenderFilter.All,
  );
  const [ageFilter, setAgeFilter] = useState<AgeFilter>(AgeFilter.All);

  useEffect(() => {
    setView(DetailsView.Activity);
    setSelectedObsId(null);
    setIsDescriptionExpanded(false);
    setGenderFilter(GenderFilter.All);
    setAgeFilter(AgeFilter.All);
  }, [detailsId, setSelectedObsId]);

  const goToObservation = (obsId: string) => {
    setSelectedObsId(obsId);
    setView(DetailsView.Observation);
  };

  const goBackToActivity = () => {
    setSelectedObsId(null);
    setView(DetailsView.Activity);
  };

  const parentTitle = activityDefinitionData?.title || "usługi";

  const parameters: ObservationDefinitionListItem[] =
    observationList.length > 0
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
      <DialogContent className="w-[min(900px,92vw)] sm:max-w-3xl max-h-[85vh] overflow-y-auto backdrop-blur-sm">
        {view === DetailsView.Activity ? (
          activityViewLoading ? (
            <ActivitySkeleton />
          ) : (
            <ActivityDetailsView
              activityDefinitionData={activityDefinitionData}
              specimenData={specimenData}
              parameters={parameters}
              isDescriptionExpanded={isDescriptionExpanded}
              onToggleDescription={() =>
                setIsDescriptionExpanded(!isDescriptionExpanded)
              }
              onSelectObservation={goToObservation}
            />
          )
        ) : observationViewLoading ? (
          <ObservationSkeleton
            onBack={goBackToActivity}
            parentTitle={parentTitle}
          />
        ) : (
          <ObservationDetailsView
            observationData={observationData}
            citationsData={citationsData}
            parentTitle={parentTitle}
            ageUnits={ageUnits}
            genderFilter={genderFilter}
            onGenderFilterChange={setGenderFilter}
            ageFilter={ageFilter}
            onAgeFilterChange={setAgeFilter}
            onBack={goBackToActivity}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
