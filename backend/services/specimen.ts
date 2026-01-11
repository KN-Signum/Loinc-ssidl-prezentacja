import { extractCanonicals } from "./fhir-service.js";

interface ActivityDefinition {
  specimenRequirement?: any[];
  [key: string]: any;
}

interface CanonicalReference {
  id: string;
  resourceType: string;
}

export function getSpecimenDefinitionsFromActivityDefinition(
  activityDefinition: ActivityDefinition
): CanonicalReference[] {
  return extractCanonicals(
    activityDefinition.specimenRequirement,
    (canonical: string) => canonical
  );
}
