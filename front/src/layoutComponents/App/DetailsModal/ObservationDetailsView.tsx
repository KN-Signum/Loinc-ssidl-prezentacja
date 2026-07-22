import React from "react";
import { ObservationDefinition } from "../../../features/observationDefinition/ObservationDefintion";
import {
  AgeFilter,
  CitationsData,
  GenderFilter,
  ObservationHeader,
  MethodUnitCards,
  ReferenceRangesSection,
} from "../../../components/detailsModal";

export interface ObservationDetailsViewProps {
  observationData: ObservationDefinition | null;
  citationsData: CitationsData;
  parentTitle: string;
  ageUnits: Record<string, string>;
  genderFilter: GenderFilter;
  onGenderFilterChange: (filter: GenderFilter) => void;
  ageFilter: AgeFilter;
  onAgeFilterChange: (filter: AgeFilter) => void;
  onBack: () => void;
}

export const ObservationDetailsView: React.FC<ObservationDetailsViewProps> = ({
  observationData,
  citationsData,
  parentTitle,
  ageUnits,
  genderFilter,
  onGenderFilterChange,
  ageFilter,
  onAgeFilterChange,
  onBack,
}) => (
  <>
    <ObservationHeader
      observationData={observationData}
      parentTitle={parentTitle}
      onBack={onBack}
    />

    <div className="space-y-8">
      <MethodUnitCards observationData={observationData} />
      <ReferenceRangesSection
        citationsData={citationsData}
        ageUnits={ageUnits}
        genderFilter={genderFilter}
        onGenderFilterChange={onGenderFilterChange}
        ageFilter={ageFilter}
        onAgeFilterChange={onAgeFilterChange}
      />
    </div>
  </>
);
