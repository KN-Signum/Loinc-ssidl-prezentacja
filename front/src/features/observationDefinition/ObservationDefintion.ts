import { ObservationDefinitionResource } from "./types";

export class ObservationDefinition {
  id: string;
  preferredReportName: string;

  constructor(data: ObservationDefinitionResource) {
    this.id = data.id;
    this.preferredReportName =
      data.preferredReportName || "Brak nazwy raportowej";
  }
}
