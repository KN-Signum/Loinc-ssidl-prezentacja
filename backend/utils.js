import { fetchFhirResource } from "./services/fhir-service";
import { getActivityDefinitionsByTitle, fetchActivityDefinition } from "./services/activity-definition";
import { getConditionsDefinitionsFromActivityDefinition } from "./services/conditions";
import { getObservationDefinitionsFromActivityDefinition } from "./services/observation";
import { getSpecimenDefinitionsFromActivityDefinition } from "./services/specimen";

const writeToFile = async (filename, data) => {
  const fs = await import("fs/promises");
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to file: ${filename}`);
  } catch (error) {
    console.error(`Error writing to file: ${error}`);
  }
};

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