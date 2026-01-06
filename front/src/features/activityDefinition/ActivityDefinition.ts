import { ActivityDefinitionKind, ActivityDefinitionStatus, CodeableConcept, Extension, Meta, UseContext } from "./types";

export class ActivityDefinition {
  resourceType: 'ActivityDefinition' = 'ActivityDefinition';
  id: string;
  meta: Meta;
  extension: Extension[];
  url: string;
  version: string;
  title: string;
  status: ActivityDefinitionStatus
  description: string;
  useContext: UseContext[];
  kind: ActivityDefinitionKind;
  code: CodeableConcept;
  specimenRequirement: string[];
  observationResultRequirement: string[];

  constructor(data: {
    id: string;
    meta: Meta;
    extension: Extension[];
    url: string;
    version: string;
    title: string;
    status: ActivityDefinitionStatus
    description: string;
    useContext: UseContext[];
    kind: ActivityDefinitionKind;
    code: CodeableConcept;
    specimenRequirement: string[];
    observationResultRequirement: string[];
  }) {
    this.id = data.id;
    this.meta = data.meta;
    this.extension = data.extension;
    this.url = data.url;
    this.version = data.version;
    this.title = data.title;
    this.status = data.status;
    this.description = data.description;
    this.useContext = data.useContext;
    this.kind = data.kind;
    this.code = data.code;
    this.specimenRequirement = data.specimenRequirement;
    this.observationResultRequirement = data.observationResultRequirement;
  }
}