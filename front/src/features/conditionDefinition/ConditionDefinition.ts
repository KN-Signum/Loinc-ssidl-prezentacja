import { ConditionDefinitionResource } from "./types";

export class ConditionDefinition {
  id: string;
  description: string;

  constructor(data: ConditionDefinitionResource) {
    this.id = data.id;
    this.description = data.description || "";
  }
}