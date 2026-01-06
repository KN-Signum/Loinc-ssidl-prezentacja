import { getActivityDefinitionsByTitle, fetchFhirResource } from "../services/fhir-service.js";

export const activityDefinitionByTitleController = async (req, res) => {
  try {
    const { title = "morf" } = req.query;
    const result = await getActivityDefinitionsByTitle(title);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching activity definitions:", error);
    res.status(500).json({ error: error.message });
  }
}
export const activityDefinitionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ActivityDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching activity definition:", error);
    res.status(500).json({ error: error.message });
  }
}
export const observationDefinitionByIdController =  async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ObservationDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching observation definition:", error);
    res.status(500).json({ error: error.message });
  }
}
export const specimenDefinitionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("SpecimenDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching specimen definition:", error);
    res.status(500).json({ error: error.message });
  }
}
export const conditionDefinitionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ConditionDefinition", `/${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching condition definition:", error);
    res.status(500).json({ error: error.message });
  }
}
export const citationsController =  async (req, res) => {
  try {
    const { observationID } = req.params;

    if (!observationID) {
      return res.status(400).json({
        error: "observationID path parameter is required",
      });
    }

    const observationDefinition = await fetchFhirResource(
      "ObservationDefinition",
      `/${observationID}`,
    );

    const qualifiedValues = observationDefinition.qualifiedValue || [];

    if (qualifiedValues.length === 0) {
      return res.status(200).json([]);
    }

    const citationsWithRanges = await Promise.all(
      qualifiedValues.map(async (qv) => {
        const citationReference = qv.extension?.find((ext) =>
          ext.valueReference?.reference?.startsWith("Citation/"),
        )?.valueReference?.reference;

        if (!citationReference) {
          return null;
        }

        const citationId = citationReference.split("/")[1];
        const range = qv.range || null;

        let citationResponse = null;
        let statusCode = null;

        try {
          citationResponse = await fetchFhirResource(
            "Citation",
            `/${citationId}`,
          );
          statusCode = 200;
        } catch (error) {
          statusCode = 500;
        }

        if (statusCode !== 200) {
          return {
            message:
              "Informacje źródłowe dla wartości referencyjnych badania laboratoryjnego są niedostępne.",
            range,
          };
        }

        return {
          citation: citationResponse,
          range,
        };
      }),
    );

    const filteredCitations = citationsWithRanges.filter(
      (item) => item !== null,
    );

    res.status(200).json(filteredCitations);
  } catch (error) {
    console.error("Error fetching citations:", error);
    res.status(500).json({ error: error.message });
  }
}