export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FhirExtension {
  url: string;
  valueCoding?: FhirCoding;
}

export interface SpecimenHandling {
  extension?: FhirExtension[];
  instruction?: string;
}

export interface SpecimenTypeTested {
  handling?: SpecimenHandling[];
}

export interface SpecimenDefinitionResource {
  resourceType: "SpecimenDefinition";
  id: string;
  typeCollected?: {
    coding?: FhirCoding[];
  };
  patientPreparation?: { text: string }[];
  typeTested?: SpecimenTypeTested[];
  specimenRequirementComment?: string | null;
}
