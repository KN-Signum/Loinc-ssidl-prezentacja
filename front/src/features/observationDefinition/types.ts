export interface ObservationDefinitionResource {
  resourceType: "ObservationDefinition";
  id: string;
  preferredReportName?: string;
  code?: {
    coding?: FhirCoding[];
  };
  method?: {
    coding?: FhirCoding[];
  };
  permittedUnit?: FhirCoding[];
}
export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}
