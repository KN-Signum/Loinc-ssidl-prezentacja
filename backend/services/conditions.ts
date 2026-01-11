import { extractCanonicals } from "./fhir-service.js";

interface Extension {
  valueCanonical?: string;
  [key: string]: any;
}

interface ActivityDefinition {
  extension?: Extension[];
  [key: string]: any;
}

interface CanonicalReference {
  id: string;
  resourceType: string;
}

export function getConditionsDefinitionsFromActivityDefinition(
  activityDefinition: ActivityDefinition
): CanonicalReference[] {
  return extractCanonicals(
    activityDefinition.extension,
    (extension: Extension) => extension?.valueCanonical
  );
}
