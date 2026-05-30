import { ObservationDefinitionResource } from "./types";

export class ObservationDefinition {
  id: string;
  preferredReportName: string;
  code: string | null;
  codeDisplay: string | null;
  methodCode: string | null;
  methodDisplay: string | null;
  permittedUnitCode: string | null;
  permittedUnitDisplay: string | null;

  constructor(data: ObservationDefinitionResource) {
    this.id = data.id;
    this.preferredReportName =
      data.preferredReportName || "Brak nazwy raportowej";
    this.code = data.code?.coding?.[0]?.code ?? null;
    this.codeDisplay = data.code?.coding?.[0]?.display ?? null;
    this.methodCode = data.method?.coding?.[0]?.code ?? null;
    this.methodDisplay = data.method?.coding?.[0]?.display?.trim() ?? null;
    this.permittedUnitCode = data.permittedUnit?.[0]?.code ?? null;
    this.permittedUnitDisplay = data.permittedUnit?.[0]?.display ?? null;
  }
}
