type Uri = string;

export interface Identifier {
  system: Uri;
  value: string;
}

export interface Coding {
  system: string;
  code: string;
  display?: string;
}

export interface CodeableConcept {
  coding: Coding[];
}

export type ContactPointSystem = "phone" | "email";

export interface ContactPoint {
  system: ContactPointSystem;
  value: string;
}

export interface ExtendedContactDetail {
  telecom: ContactPoint[];
}

export interface PLBaseAddressEu {
  city: string;
  country?: string;
  postalCode?: string;
  line?: string[];
}

export interface Reference {
  reference: string;
  display?: string;
}
