export interface Meta {
  profile: string[];
}

export interface NfzSubExtension {
  url: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueCoding?: {
    system: string;
    code: string;
    display: string;
  };
}

export interface Extension {
  url: string;
  valueCanonical?: string;
  valueString?: string;
  extension?: NfzSubExtension[];
}

export interface Coding {
  system: string;
  version?: string;
  code: string;
  display?: string;
}

export interface CodeableConcept {
  coding: Coding[];
}

export interface UseContext {
  code: {
    system: string;
    code: string;
  };
  valueCodeableConcept: CodeableConcept;
}
export type ActivityDefinitionStatus = 'active' | 'draft' | 'retired' | 'unknown';
export type ActivityDefinitionKind = 'Task' | 'ServiceRequest' | string;