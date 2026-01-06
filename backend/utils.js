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