import { extractCanonicals } from "./fhir-service.js";

interface ActivityDefinition {
  observationResultRequirement?: any[];
  [key: string]: any;
}

interface CanonicalReference {
  id: string;
  resourceType: string;
}

export function getObservationDefinitionsFromActivityDefinition(
  activityDefinition: ActivityDefinition
): CanonicalReference[] {
  return extractCanonicals(
    activityDefinition.observationResultRequirement,
    (canonical: string) => canonical
  );
}
