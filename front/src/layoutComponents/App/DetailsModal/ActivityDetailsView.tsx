import React from "react";
import { ActivityDefinition } from "../../../features/activityDefinition/ActivityDefinition";
import { SpecimenDefinition } from "../../../features/specimenDefinition/SpecimenDefinition";
import { ObservationDefinitionListItem } from "../../../features/observationDefinition/Api";
import {
  ActivityHeader,
  ActivityGoalSection,
  DescriptionSection,
  PatientPreparationSection,
  SpecimenMaterialSection,
  PreAnalyticalFactorsSection,
  SpecimenCommentSection,
  ParametersSection,
} from "../../../components/detailsModal";

export interface ActivityDetailsViewProps {
  activityDefinitionData: ActivityDefinition | null;
  specimenData: SpecimenDefinition | null;
  parameters: ObservationDefinitionListItem[];
  isDescriptionExpanded: boolean;
  onToggleDescription: () => void;
  onSelectObservation: (obsId: string) => void;
}

export const ActivityDetailsView: React.FC<ActivityDetailsViewProps> = ({
  activityDefinitionData,
  specimenData,
  parameters,
  isDescriptionExpanded,
  onToggleDescription,
  onSelectObservation,
}) => (
  <>
    <ActivityHeader activityDefinitionData={activityDefinitionData} />

    <div className="space-y-8">
      <DescriptionSection
        description={activityDefinitionData?.description || ""}
        isExpanded={isDescriptionExpanded}
        onToggle={onToggleDescription}
      />

      <ActivityGoalSection activityDefinitionData={activityDefinitionData} />

      {specimenData && (
        <>
          <PatientPreparationSection items={specimenData.patientPreparation} />
          <SpecimenMaterialSection materials={specimenData.materials} />
          <PreAnalyticalFactorsSection
            sections={specimenData.handlingSections}
          />
          <SpecimenCommentSection
            comment={specimenData.specimenRequirementComment}
          />
        </>
      )}

      <ParametersSection
        parameters={parameters}
        onSelectObservation={onSelectObservation}
      />
    </div>
  </>
);
