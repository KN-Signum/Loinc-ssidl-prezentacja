import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TOKEN_URL =
  "http://apps.tukan.online:8082/realms/ssidl/protocol/openid-connect/token";
const FHIR_BASE_URL = "http://apps.tukan.online:8092/fhir";
const CLIENT_ID = "signum-prez";
const CLIENT_SECRET = "XzKuAg31gpdI2WQUzHi18f1nCqZboxEG";

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token.access_token}`,
  Accept: "application/fhir+json",
});

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  return response.json();
};

async function getToken() {
  return fetchJson(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
  });
}

async function fetchFhirResource(resourceType, suffix = "") {
  const token = await getToken();
  return fetchJson(`${FHIR_BASE_URL}/${resourceType}${suffix}`, {
    headers: buildAuthHeaders(token),
  });
}

const writeToFile = async (filename, data) => {
  const fs = await import("fs/promises");
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to file: ${filename}`);
  } catch (error) {
    console.error(`Error writing to file: ${error}`);
  }
};

const transformCanonicalUrlToId = (canonicalUrl) => {
  const parts = canonicalUrl.split("-");
  return parts[parts.length - 1];
};

const transformCanonicalUrlToResourceType = (canonicalUrl) => {
  const parts = canonicalUrl.split("/");
  return parts[parts.length - 2];
};

const extractCanonicals = (items, pickCanonical) =>
  (items || [])
    .map((item) => pickCanonical(item))
    .filter(Boolean)
    .map((canonicalUrl) => ({
      id: transformCanonicalUrlToId(canonicalUrl),
      resourceType: transformCanonicalUrlToResourceType(canonicalUrl),
    }));

const getSpecimenDefinitionsFromActivityDefinition = (activityDefinition) =>
  extractCanonicals(
    activityDefinition.specimenRequirement,
    (canonical) => canonical,
  );

const getObservationDefinitionsFromActivityDefinition = (activityDefinition) =>
  extractCanonicals(
    activityDefinition.observationResultRequirement,
    (canonical) => canonical,
  );

const getConditionsDefinitionsFromActivityDefinition = (activityDefinition) =>
  extractCanonicals(
    activityDefinition.extension,
    (extension) => extension?.valueCanonical,
  );

const fetchAndSaveDefinitions = async (
  activityDefinition,
  extractor,
  filenamePrefix,
) => {
  const definitions = extractor(activityDefinition);
  if (!definitions.length) {
    return;
  }

  const fetched = await Promise.all(
    definitions.map(({ resourceType, id }) =>
      fetchFhirResource(resourceType, `/${id}`),
    ),
  );

  await writeToFile(`${filenamePrefix}_${activityDefinition.id}.json`, fetched);
};

async function getActivityDefinitionsByTitle(title) {
  const context =
    "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/CodeSystem/ssidl-definitionUseContext-CS|BW";
  return fetchFhirResource(
    "ActivityDefinition",
    `?context=${context}&title:contains=${title}`,
  );
}

const fetchActivityDefinition = async (id) => {
  const activityDefinition = await fetchFhirResource(
    "ActivityDefinition",
    `/${id}`,
  );
  await writeToFile(`activityDefinition_${id}.json`, activityDefinition);
};

app.get("/health", (req, res) => {
  res.json({ status: "ok" }).status(200);
});

app.get("/activity-definitions", async (req, res) => {
  try {
    const { title = "morf" } = req.query;
    const result = await getActivityDefinitionsByTitle(title);
    res.json(result).status(200);
  } catch (error) {
    console.error("Error fetching activity definitions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/activity-definitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ActivityDefinition", `/${id}`);
    res.json(result).status(200);
  } catch (error) {
    console.error("Error fetching activity definition:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/observation-definitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ObservationDefinition", `/${id}`);
    res.json(result).status(200);
  } catch (error) {
    console.error("Error fetching observation definition:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/specimen-definitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("SpecimenDefinition", `/${id}`);
    res.json(result).status(200);
  } catch (error) {
    console.error("Error fetching specimen definition:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/condition-definitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFhirResource("ConditionDefinition", `/${id}`);
    res.json(result).status(200);
  } catch (error) {
    console.error("Error fetching condition definition:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/citations", async (req, res) => {
  try {
    const { observationDefinitionId } = req.query;

    if (!observationDefinitionId) {
      return res.status(400).json({
        error: "observationDefinitionId query parameter is required",
      });
    }

    const observationDefinition = await fetchFhirResource(
      "ObservationDefinition",
      `/${observationDefinitionId}`,
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
          const response = await fetchFhirResource(
            "Citation",
            `/${citationId}`,
          );

          statusCode = response.status;
          citationResponse = await response.json();
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const getDataFromServer = async () => {
  const searchTitle = "morf";
  const activityDefinitionsBundle =
    await getActivityDefinitionsByTitle(searchTitle);
  await writeToFile("activityDefinitionsRAW.json", activityDefinitionsBundle);

  const activityDefinitionEntries = activityDefinitionsBundle.entry || [];
  if (!activityDefinitionEntries.length) {
    console.log("No ActivityDefinitions found for the given title.");
    return;
  }

  activityDefinitionEntries.forEach(async (entry) => {
    const { resource } = entry;
    await fetchAndSaveDefinitions(
      resource,
      getSpecimenDefinitionsFromActivityDefinition,
      "specimenDefinitions",
    );
    await fetchAndSaveDefinitions(
      resource,
      getObservationDefinitionsFromActivityDefinition,
      "observationDefinitions",
    );
    await fetchAndSaveDefinitions(
      resource,
      getConditionsDefinitionsFromActivityDefinition,
      "conditionDefinitions",
    );
    await fetchActivityDefinition(resource.id);
  });
};

getDataFromServer();

