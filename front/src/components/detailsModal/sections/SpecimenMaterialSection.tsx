import React from "react";
import { FlaskConical, TestTube2 } from "lucide-react";
import { MaterialInfo } from "../../../features/specimenDefinition/SpecimenDefinition";
import { DetailSection, MutedText, SectionTitle } from "../primitives";

export const SpecimenMaterialSection: React.FC<{
  materials: MaterialInfo[];
}> = ({ materials }) => (
  <DetailSection variant="muted">
    <SectionTitle icon={FlaskConical} className="mb-4">
      Materiał badany
    </SectionTitle>

    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 shadow-sm">
        <TestTube2 className="h-5 w-5" />
      </div>
      <div>
        {materials.length > 0 ? (
          <p className="text-sm text-slate-900 font-medium">
            {materials[0].display}{" "}
            {materials[0].code && (
              <span className="text-slate-500">(kod {materials[0].code})</span>
            )}
          </p>
        ) : (
          <MutedText>Brak informacji o materiale.</MutedText>
        )}
      </div>
    </div>
  </DetailSection>
);
