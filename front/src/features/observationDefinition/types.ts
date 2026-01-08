export interface ObservationDefinitionResource {
  resourceType: "ObservationDefinition";
  id: string;
  preferredReportName?: string;
  code?: {
    coding?: FhirCoding[];
  };
}
export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}
