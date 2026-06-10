import { SpecimenDefinitionResource } from "./types";

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

export class SpecimenDefinition {
  id: string;
  collectionCode: string;
  collectionSystem: string;
  display: string;
  patientPreparation: string[];
  materials: MaterialInfo[];
  handlingSections: HandlingSection[];
  specimenRequirementComment: string | null;

  constructor(data: SpecimenDefinitionResource) {
    this.id = data.id;

    const mainCoding = data.typeCollected?.coding?.[0];
    this.collectionCode = mainCoding?.code || "N/A";
    this.collectionSystem = mainCoding?.system || "N/A";
    this.display = mainCoding?.display || "N/A";

    this.patientPreparation = data.patientPreparation?.map((prep) => prep.text) || [];
    
    this.specimenRequirementComment = data.specimenRequirementComment || null;

    const mats: MaterialInfo[] = [];
    if (data.typeTested) {
      data.typeTested.forEach((testType) => {
        const coding = testType.type?.coding || [];
        const main = coding[0];
        if (main) {
          mats.push({ display: main.display || "N/A", code: main.code, system: main.system });
        }
      });
    }
    this.materials = mats;

    const sectionsMap = new Map<string, HandlingSection>();

    if (data.typeTested) {
      data.typeTested.forEach((testType) => {
        if (!testType.handling) return;

        testType.handling.forEach((handle) => {
          if (!handle.instruction) return;


          let title = "N/A";
          let code: string | undefined = undefined;

          const targetExt = handle.extension?.find((ext) =>
            typeof ext.url === "string" && ext.url.includes("specimenDefinition-handlingCode")
          );

          const chosenExt = targetExt || handle.extension?.[0];
          if (chosenExt) {
            title = chosenExt.valueCoding?.display || title;
            code = chosenExt.valueCoding?.code || code;
          }

          const key = `${title}__${code ?? ""}`;
          const existing = sectionsMap.get(key);
          if (existing) {
            existing.instructions.push(handle.instruction!);
          } else {
            sectionsMap.set(key, {
              title,
              code,
              instructions: [handle.instruction!],
            });
          }
        });
      });
    }

    this.handlingSections = Array.from(sectionsMap.values());
  }
}
