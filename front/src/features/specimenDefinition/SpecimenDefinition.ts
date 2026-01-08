import { SpecimenDefinitionResource } from "./types";

export class SpecimenDefinition {
  id: string;
  collectionCode: string;
  collectionSystem: string;
  patientPreparation: string[];
  transportInstructions: string[];
  stabilityInstructions: string[];
  constructor(data: SpecimenDefinitionResource) {
    this.id = data.id;

    const mainCoding = data.typeCollected?.coding?.[0];
    this.collectionCode = mainCoding?.code || "N/A";
    this.collectionSystem = mainCoding?.system || "N/A";

    this.patientPreparation =
      data.patientPreparation?.map((prep) => prep.text) || [];

    const uniqueTransport = new Set<string>();
    const uniqueStability = new Set<string>();

    if (data.typeTested) {
      data.typeTested.forEach((testType) => {
        if (testType.handling) {
          testType.handling.forEach((handle) => {
            if (!handle.instruction) return;

            handle.extension?.forEach((ext) => {
              const code = ext.valueCoding?.code;

              if (code === "WARTRANS") {
                uniqueTransport.add(handle.instruction!);
              } else if (code === "STABPIERW") {
                uniqueStability.add(handle.instruction!);
              }
            });
          });
        }
      });
    }

    this.transportInstructions = Array.from(uniqueTransport);
    this.stabilityInstructions = Array.from(uniqueStability);
  }
}
