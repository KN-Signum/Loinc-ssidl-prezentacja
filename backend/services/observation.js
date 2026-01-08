function getObservationDefinitionsFromActivityDefinition(activityDefinition) {
  return extractCanonicals(
    activityDefinition.observationResultRequirement,
    (canonical) => canonical,
  );
}
export { getObservationDefinitionsFromActivityDefinition };