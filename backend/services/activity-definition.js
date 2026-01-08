import { fetchFhirResource } from "./fhir-service.js";

export async function getActivityDefinitionsByTitle(title, count) {
  console.log("Fetching ActivityDefinitions with title containing:", title, count);
  const context =
    "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/CodeSystem/ssidl-definitionUseContext-CS|BW";
  return fetchFhirResource(
    "ActivityDefinition",
    `?context=${context}&title:contains=${title}&_Sort=title&_count=${count}`,
  );
}

export async function fetchActivityDefinition(id) {
  return fetchFhirResource(
    "ActivityDefinition",
    `/${id}`,
  );
};
