import {
  FhirCodeableConcept,
  SpecimenDefinitionResource,
  SpecimenHandling,
} from "./types";

export interface HandlingSection {
  title: string;
  code?: string;
  instructions: string[];
}

export interface MaterialInfo {
  display: string;
  code?: string;
  system?: string;
}

export interface TestedMaterial extends MaterialInfo {
  handlingSections: HandlingSection[];
}

function extractMaterialInfo(
  concept?: FhirCodeableConcept,
): MaterialInfo | null {
  const coding = concept?.coding?.[0];
  const display = coding?.display || concept?.text || coding?.code;
  if (!display) return null;

  return { display, code: coding?.code, system: coding?.system };
}

function extractHandlingSections(
  handling?: SpecimenHandling[],
): HandlingSection[] {
  const sectionsMap = new Map<string, HandlingSection>();

  handling?.forEach((handle) => {
    if (!handle.instruction) return;

    let title = "N/A";
    let code: string | undefined = undefined;

    const targetExt = handle.extension?.find(
      (ext) =>
        typeof ext.url === "string" &&
        ext.url.includes("specimenDefinition-handlingCode"),
    );

    const chosenExt = targetExt || handle.extension?.[0];
    if (chosenExt) {
      title = chosenExt.valueCoding?.display || title;
      code = chosenExt.valueCoding?.code || code;
    }

    const key = `${title}__${code ?? ""}`;
    const existing = sectionsMap.get(key);
    if (existing) {
      if (!existing.instructions.includes(handle.instruction)) {
        existing.instructions.push(handle.instruction);
      }
    } else {
      sectionsMap.set(key, {
        title,
        code,
        instructions: [handle.instruction],
      });
    }
  });

  return Array.from(sectionsMap.values());
}

export class SpecimenDefinition {
  id: string;
  typeCollected: MaterialInfo | null;
  patientPreparation: string[];
  testedMaterials: TestedMaterial[];
  specimenRequirementComment: string | null;

  constructor(data: SpecimenDefinitionResource) {
    this.id = data.id;

    this.typeCollected = extractMaterialInfo(data.typeCollected);

    this.patientPreparation =
      data.patientPreparation?.map((prep) => prep.text) || [];

    this.specimenRequirementComment = data.specimenRequirementComment || null;

    const materialsMap = new Map<
      string,
      { material: MaterialInfo; handling: SpecimenHandling[] }
    >();

    (data.typeTested || []).forEach((testType) => {
      const material = extractMaterialInfo(testType.type);
      if (!material) return;

      const key = `${material.code ?? ""}__${material.display}`;
      const existing = materialsMap.get(key);
      if (existing) {
        existing.handling.push(...(testType.handling || []));
      } else {
        materialsMap.set(key, {
          material,
          handling: [...(testType.handling || [])],
        });
      }
    });

    this.testedMaterials = Array.from(materialsMap.values()).map(
      ({ material, handling }) => ({
        ...material,
        handlingSections: extractHandlingSections(handling),
      }),
    );
  }
}
