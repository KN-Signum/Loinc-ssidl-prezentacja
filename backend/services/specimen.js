function getSpecimenDefinitionsFromActivityDefinition(activityDefinition) {
  return extractCanonicals(
    activityDefinition.specimenRequirement,
    (canonical) => canonical,
  );
}
export { getSpecimenDefinitionsFromActivityDefinition };