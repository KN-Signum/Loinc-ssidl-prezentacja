import { ObservationDefinitionResource } from "./types";

export class ObservationDefinition {
  id: string;
  preferredReportName: string;
  code: string | null;
  codeDisplay: string | null;

  constructor(data: ObservationDefinitionResource) {
    this.id = data.id;
    this.preferredReportName =
      data.preferredReportName || "Brak nazwy raportowej";
    this.code = data.code?.coding?.[0]?.code ?? null;
    this.codeDisplay = data.code?.coding?.[0]?.display ?? null;
  }
}
