import { fetchFhirResource } from "./services/fhir-service.js";
import {
  getActivityDefinitionsByTitle,
  fetchActivityDefinition,
} from "./services/activity-definition.js";
import { getConditionsDefinitionsFromActivityDefinition } from "./services/conditions.js";
import { getObservationDefinitionsFromActivityDefinition } from "./services/observation.js";
import { getSpecimenDefinitionsFromActivityDefinition } from "./services/specimen.js";

interface ResourceReference {
  resourceType: string;
  id: string;
}

interface ActivityDefinition {
  id: string;
  [key: string]: any;
}

type ResourceExtractor = (activityDefinition: ActivityDefinition) => ResourceReference[];

const writeToFile = async (filename: string, data: any): Promise<void> => {
  const fs = await import("fs/promises");
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to file: ${filename}`);
  } catch (error) {
    console.error(`Error writing to file: ${error}`);
  }
};

const fetchAndSaveDefinitions = async (
  activityDefinition: ActivityDefinition,
  extractor: ResourceExtractor,
  filenamePrefix: string
): Promise<void> => {
  const definitions = extractor(activityDefinition);
  if (!definitions.length) {
    return;
  }

  const fetched = await Promise.all(
    definitions.map(({ resourceType, id }) =>
      fetchFhirResource(resourceType, `/${id}`)
    )
  );

  await writeToFile(`${filenamePrefix}_${activityDefinition.id}.json`, fetched);
};

const getDataFromServer = async (): Promise<void> => {
  const searchTitle = "morf";
  const activityDefinitionsBundle =
    await getActivityDefinitionsByTitle(searchTitle, false);
  await writeToFile("activityDefinitionsRAW.json", activityDefinitionsBundle);

  const activityDefinitionEntries = activityDefinitionsBundle.entry || [];
  if (!activityDefinitionEntries.length) {
    console.log("No ActivityDefinitions found for the given title.");
    return;
  }

  activityDefinitionEntries.forEach(async (entry: any) => {
    const { resource } = entry;
    await fetchAndSaveDefinitions(
      resource,
      getSpecimenDefinitionsFromActivityDefinition,
      "specimenDefinitions"
    );
    await fetchAndSaveDefinitions(
      resource,
      getObservationDefinitionsFromActivityDefinition,
      "observationDefinitions"
    );
    await fetchAndSaveDefinitions(
      resource,
      getConditionsDefinitionsFromActivityDefinition,
      "conditionDefinitions"
    );
    await fetchActivityDefinition(resource.id);
  });
};
