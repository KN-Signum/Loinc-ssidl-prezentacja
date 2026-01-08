function getConditionsDefinitionsFromActivityDefinition(activityDefinition) {
  return extractCanonicals(
    activityDefinition.extension,
    (extension) => extension?.valueCanonical,
  );
}
export { getConditionsDefinitionsFromActivityDefinition };