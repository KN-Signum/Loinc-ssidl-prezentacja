import {
  fetchFhirResource,
  validateResponseForPagination,
} from "./fhir-service.js";

export async function getActivityDefinitionsByTitle(title: string,knowledge: boolean): Promise<any> {
  console.log("Fetching ActivityDefinitions with title containing:", title);
  const context = knowledge ?
    "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/CodeSystem/ssidl-definitionUseContext-CS|BW" :
    "http://loincssidl.umed.pl/fhir/ig/ssidl/CodeSystem/ssidl-definitionUseContext-CS|KU";
  const result = await fetchFhirResource(
    "ActivityDefinition",
    `?context=${context}&title:contains=${title}`
  );

  const validatedResult = validateResponseForPagination(result);
  return validatedResult;
}

export async function fetchActivityDefinition(id: string): Promise<any> {
  return fetchFhirResource("ActivityDefinition", `/${id}`);
}
