import { Request, Response } from "express";
import {
  fetchFhirResource,
  fetchPaginatedFhirResource,
} from "../services/fhir-service.js";
import { getActivityDefinitionsByTitle } from "../services/activity-definition.js";

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
    const result = await getActivityDefinitionsByTitle(title as string);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching activity definitions:", error);
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    console.error("Error fetching activity definition:", error);
    res.status(500).json({ error: error.message });
  }
};

export const observationDefinitionByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ObservationDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching observation definition:", error);
    res.status(500).json({ error: error.message });
  }
};

export const specimenDefinitionByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("SpecimenDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching specimen definition:", error);
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    console.error("Error fetching condition definition:", error);
    res.status(500).json({ error: error.message });
  }
};

export const citationsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { observationID } = req.params;

    if (!observationID) {
      res.status(400).json({
        error: "observationID path parameter is required",
      });
      return;
    }

    const observationDefinition = await fetchFhirResource(
      "ObservationDefinition",
      `/${observationID}`,
    );
    const qualifiedValues = observationDefinition.qualifiedValue || [];

    if (qualifiedValues.length === 0) {
      res.status(200).json({ message: "Brak danych" });
      return;
    }

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

        try {
          const citationResponse = await fetchFhirResource(
            "Citation",
            `/${citationId}`,
          );

          return {
            citation: citationResponse,
            range,
          };
        } catch (error) {
          console.error(`Error fetching citation ${citationId}:`, error);
          return {
            message:
              "Informacje źródłowe dla wartości referencyjnych badania laboratoryjnego są niedostępne.",
            range,
          };
        }
      }),
    );

    const filteredCitations = citationsWithRanges.filter(
      (item) => item !== null,
    );

    res.status(200).json(filteredCitations);
  } catch (error: any) {
    console.error("Error fetching citations:", error);
    res.status(500).json({ error: error.message });
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
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: error.message });
  }
};
