import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { SpecimenDefinition } from "../../features/specimenDefinition/SpecimenDefinition";
import { ObservationDefinition } from "../../features/observationDefinition/ObservationDefintion";
import { ObservationDefinitionListItem } from "../../features/observationDefinition/Api";
import { CitationItem } from "../../features/citations/types";

export enum DetailsView {
  Activity = "activity",
  Observation = "observation",
}

export enum GenderFilter {
  All = "all",
  Male = "male",
  Female = "female",
}

export enum NfzCode {
  Guaranteed = "NFZSG",
  Contracted = "NFZPK",
  Settled = "NFZSR",
}

export type CitationsData = CitationItem[] | { message: string } | null;

export const NFZ_LABELS: Record<NfzCode, string> = {
  [NfzCode.Guaranteed]: "Świadczenie gwarantowane NFZ",
  [NfzCode.Contracted]: "Produkt kontraktowy NFZ",
  [NfzCode.Settled]: "Świadczenie rozliczane NFZ",
};

export const genderLabel: Record<string, string> = {
  male: "Mężczyzna",
  female: "Kobieta",
  other: "Inne",
  unknown: "Nieznana",
};

export const GENDER_FILTER_BUTTONS: { label: string; value: GenderFilter }[] = [
  { label: "Wszyscy", value: GenderFilter.All },
  { label: "Mężczyzna", value: GenderFilter.Male },
  { label: "Kobieta", value: GenderFilter.Female },
];

export const DESCRIPTION_CHAR_LIMIT = 300;
export const CHILD_AGE_THRESHOLD_YEARS = 18;

export interface DetailsModalProps {
  specimenData: SpecimenDefinition | null;
  observationData: ObservationDefinition | null;
  observationList: ObservationDefinitionListItem[];
  activityDefinitionData: ActivityDefinition | null;
  citationsData: CitationsData;
  activityViewLoading: boolean;
  observationViewLoading: boolean;
  isMultiObs: boolean;
  singleObsId: string | null;
}
