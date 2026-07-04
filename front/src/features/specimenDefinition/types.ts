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

export interface FhirCodeableConcept {
  coding?: FhirCoding[];
  text?: string;
}

export interface SpecimenTypeTested {
  type?: FhirCodeableConcept;
  handling?: SpecimenHandling[];
}

export interface SpecimenDefinitionResource {
  resourceType: "SpecimenDefinition";
  id: string;
  typeCollected?: FhirCodeableConcept;
  patientPreparation?: { text: string }[];
  typeTested?: SpecimenTypeTested[];
  specimenRequirementComment?: string | null;
}
