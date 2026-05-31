import { extractCanonicals } from "./fhir-service.js";

const SPECIMEN_REQUIREMENT_COMMENT_EXTENSION_URL =
  "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/StructureDefinition/ssidl-activityDefinition-specimenRequirementComment";

interface ActivityDefinition {
  specimenRequirement?: any[];
  _specimenRequirement?: Array<{
    extension?: Array<{
      url?: string;
      valueString?: string;
    }>;
  }>;
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

export function getSpecimenRequirementCommentFromActivityDefinition(
  activityDefinition: ActivityDefinition,
): string | null {
  const extension = activityDefinition._specimenRequirement?.[0]?.extension?.[0];

  if (
    extension?.url !== SPECIMEN_REQUIREMENT_COMMENT_EXTENSION_URL ||
    !extension?.valueString
  ) {
    return null;
  }

  return extension.valueString;
}
