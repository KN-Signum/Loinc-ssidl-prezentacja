import { extractCanonicals } from "./fhir-service.js";

const REASON_REFERENCE_EXTENSION_URL =
  "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/StructureDefinition/activityDefinition-reasonReference";

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
    activityDefinition.extension?.filter(
      (extension) => extension?.url === REASON_REFERENCE_EXTENSION_URL,
    ),
    (extension: Extension) => extension?.valueCanonical
  );
}
