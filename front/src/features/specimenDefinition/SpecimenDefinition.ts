import { SpecimenDefinitionResource } from "./types";

export interface HandlingInstruction {
  displayName: string;
  code: string;
  instruction: string;
}

export class SpecimenDefinition {
  id: string;
  collectionCode: string;
  collectionSystem: string;
  display: string;
  patientPreparation: string[];
  handlingInstructions: HandlingInstruction[];
  specimenRequirementComment: string | null;

  constructor(data: SpecimenDefinitionResource) {
    this.id = data.id;

    const mainCoding = data.typeCollected?.coding?.[0];
    this.collectionCode = mainCoding?.code || "N/A";
    this.collectionSystem = mainCoding?.system || "N/A";
    this.display = mainCoding?.display || "N/A";

    this.patientPreparation =
      data.patientPreparation?.map((prep) => prep.text) || [];

    this.specimenRequirementComment = data.specimenRequirementComment || null;

    const handlingList: HandlingInstruction[] = [];

    if (data.typeTested) {
      data.typeTested.forEach((testType) => {
        if (testType.handling) {
          testType.handling.forEach((handle) => {
            if (!handle.instruction) return;

            handle.extension?.forEach((ext) => {
              const displayName = ext.valueCoding?.display || "N/A";
              const code = ext.valueCoding?.code || "N/A";

              handlingList.push({
                displayName,
                code,
                instruction: handle.instruction!,
              });
            });
          });
        }
      });
    }

    this.handlingInstructions = handlingList;
  }
}
