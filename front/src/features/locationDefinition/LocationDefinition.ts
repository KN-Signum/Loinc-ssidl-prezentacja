import { CodeableConcept, ExtendedContactDetail, Identifier, PLBaseAddressEu, Reference } from "./types";

export class LocationDefinition {
  resourceType: "Location" = "Location";

  id?: string;

  meta?: {
    profile?: string[];
  };

  identifier: Identifier[];

  name: string;

  mode: "instance" = "instance";

  type: CodeableConcept[];

  contact: ExtendedContactDetail[];

  address: PLBaseAddressEu;

  managingOrganization: Reference;

  constructor(params: {
    id?: string;
    profile?: string[];
    identifier: Identifier[];
    name: string;
    type: {
      system: string;
      code: string;
      display?: string;
    };
    contact: {
      phone?: string[];
      email?: string[];
    };
    address: PLBaseAddressEu;
    managingOrganization: Reference;
  }) {
    this.id = params.id;

    this.meta = params.profile
      ? { profile: params.profile }
      : undefined;

    this.identifier = params.identifier;
    this.name = params.name;

    this.type = [
      {
        coding: [
          {
            system: params.type.system,
            code: params.type.code,
            display: params.type.display,
          },
        ],
      },
    ];

    this.contact = [
      {
        telecom: [
          ...(params.contact.phone ?? []).map((p) => ({
            system: "phone" as const,
            value: p,
          })),
          ...(params.contact.email ?? []).map((e) => ({
            system: "email" as const,
            value: e,
          })),
        ],
      },
    ];

    this.address = params.address;
    this.managingOrganization = params.managingOrganization;
  }
}
