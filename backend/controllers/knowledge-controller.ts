import { Request, Response } from "express";
import {
  fetchFhirResource,
  fetchPaginatedFhirResource,
  FhirServiceError,
} from "../services/fhir-service.js";
import { getActivityDefinitionsByTitle } from "../services/activity-definition.js";
import { getSpecimenDefinitionsFromActivityDefinition } from "../services/specimen.js";
import { getObservationDefinitionsFromActivityDefinition } from "../services/observation.js";

const AGE_UNITS_VALUE_SET_ID = "pl-base-ageUnit-VS";

function handleFhirError(res: Response, error: unknown): void {
  if (error instanceof FhirServiceError) {
    res.status(error.statusCode).json({ error: error.message });
  } else if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Nieznany błąd serwera." });
  }
}

async function getAgeUnitMap(): Promise<Map<string, string>> {
  try {
    const valueSet = await fetchFhirResource("ValueSet", `/${AGE_UNITS_VALUE_SET_ID}`);
    const concepts = valueSet?.compose?.include?.[0]?.concept ?? [];
    return new Map(concepts.map((c: { code: string; display: string }) => [c.code, c.display]));
  } catch {
    return new Map([["a", "lat"], ["mo", "miesięcy"], ["d", "dni"], ["wk", "tygodni"]]);
  }
}

export const activityDefinitionByTitleController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title = "", token } = req.query;
    console.log("Received title:", title);
    console.log("Received token:", token);
    if (token) {
      const result = await fetchPaginatedFhirResource(token as string);
      res.status(200).json(result);
      return;
    }
    const result = await getActivityDefinitionsByTitle(title as string, true);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching activity definitions:", error);
    handleFhirError(res, error);
  }
};

export const activityDefinitionByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ActivityDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching activity definition:", error);
    handleFhirError(res, error);
  }
};

export const observationDefinitionByObsIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { obsId } = req.params;
    const result = await fetchFhirResource("ObservationDefinition", `/${obsId}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching observation definition:", error);
    handleFhirError(res, error);
  }
};

export const observationDefinitionListController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const activityDefinition = await fetchFhirResource("ActivityDefinition", `/${id}`);
    const refs = getObservationDefinitionsFromActivityDefinition(activityDefinition);
    if (refs.length === 0) {
      res.status(200).json([]);
      return;
    }

    const results = await Promise.all(
      refs.map(async (ref) => {
        try {
          const obsDef = await fetchFhirResource("ObservationDefinition", `/${ref.id}`);
          return {
            id: obsDef.id,
            preferredReportName: obsDef.preferredReportName ?? null,
          };
        } catch (error) {
          console.error(`Error fetching ObservationDefinition ${ref.id}:`, error);
          return null;
        }
      }),
    );

    res.status(200).json(results.filter(Boolean));
  } catch (error) {
    console.error("Error fetching observation definition list:", error);
    handleFhirError(res, error);
  }
};

export const specimenDefinitionByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const activityDefinition = await fetchFhirResource("ActivityDefinition", `/${id}`);
    const refs = getSpecimenDefinitionsFromActivityDefinition(activityDefinition);
    if (refs.length === 0) {
      res.status(404).json({ error: "No SpecimenDefinition linked to this ActivityDefinition" });
      return;
    }
    const result = await fetchFhirResource("SpecimenDefinition", `/${refs[0].id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching specimen definition:", error);
    handleFhirError(res, error);
  }
};

export const conditionDefinitionByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ConditionDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching condition definition:", error);
    handleFhirError(res, error);
  }
};

export const citationsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { obsId } = req.params;

    const observationDefinition = await fetchFhirResource(
      "ObservationDefinition",
      `/${obsId}`,
    );
    const qualifiedValues = observationDefinition.qualifiedValue || [];

    if (qualifiedValues.length === 0) {
      res.status(200).json({ message: "Brak danych" });
      return;
    }

    const ageUnitMap = await getAgeUnitMap();
    const mapAgeUnit = (age: any) => {
      if (!age) return null;
      const mappedAge = { ...age };
      if (mappedAge.low?.unit) {
        mappedAge.low = {
          ...mappedAge.low,
          unit: ageUnitMap.get(mappedAge.low.unit) || mappedAge.low.unit,
        };
      }
      if (mappedAge.high?.unit) {
        mappedAge.high = {
          ...mappedAge.high,
          unit: ageUnitMap.get(mappedAge.high.unit) || mappedAge.high.unit,
        };
      }
      return mappedAge;
    };

    const citationsWithRanges = await Promise.all(
      qualifiedValues.map(async (qv: any) => {
        const citationReference = qv.extension?.find((ext: any) =>
          ext.valueReference?.reference?.startsWith("Citation/"),
        )?.valueReference?.reference;

        if (!citationReference) {
          return {
            message: "Brak danych",
          };
        }

        const citationId = citationReference.split("/")[1];
        const range = qv.range || null;
        const gender = qv.gender;
        const age = mapAgeUnit(qv.age);

        try {
          const citationResponse = await fetchFhirResource(
            "Citation",
            `/${citationId}`,
          );

          return {
            citation: citationResponse,
            citationId,
            range,
            gender,
            age,
          };
        } catch (error) {
          console.error(`Error fetching citation ${citationId}:`, error);
          return {
            message:
              "Informacje źródłowe dla wartości referencyjnych badania laboratoryjnego są niedostępne.",
            citationId,
            range,
            gender,
            age,
          };
        }
      }),
    );

    const filteredCitations = citationsWithRanges.filter(
      (item) => item !== null,
    );

    res.status(200).json(filteredCitations);
  } catch (error) {
    console.error("Error fetching citations:", error);
    handleFhirError(res, error);
  }
};
export const locationController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type } = req.params;
    const context =
      type === "lab"
        ? "http://hl7.org.pl/fhir/ig/pl-lab/CodeSystem/pl-lab-facilityTypeCS|LA"
        : "http://hl7.org.pl/fhir/ig/pl-lab/CodeSystem/pl-lab-facilityTypeCS|PP";
    console.log(type);
    const locations = await fetchFhirResource("Location", `?type=${context}`);
    res.status(200).json(locations.entry.map((entry: any) => entry.resource));
  } catch (error) {
    console.error("Error fetching locations:", error);
    handleFhirError(res, error);
  }
};

export const ageUnitsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const valueSet = await fetchFhirResource("ValueSet", `/${AGE_UNITS_VALUE_SET_ID}`);
    const concepts = valueSet?.compose?.include?.[0]?.concept ?? [];
    const units: Record<string, string> = {};
    for (const c of concepts) {
      units[c.code] = c.display;
    }
    res.status(200).json(units);
  } catch (error) {
    console.error("Error fetching age units:", error);
    handleFhirError(res, error);
  }
};
