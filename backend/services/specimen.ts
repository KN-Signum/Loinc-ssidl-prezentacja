import { extractCanonicals } from "./fhir-service.js";

const SPECIMEN_REQUIREMENT_COMMENT_EXTENSION_URL_FRAGMENT =
  "ssidl-activityDefinition-specimenRequirementComment";

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
  const extension = activityDefinition._specimenRequirement
    ?.flatMap((entry) => entry.extension ?? [])
    .find(
      (ext) =>
        typeof ext.url === "string" &&
        ext.url.includes(SPECIMEN_REQUIREMENT_COMMENT_EXTENSION_URL_FRAGMENT),
    );

  return extension?.valueString || null;
}
