import React from "react";
import { Droplets, Syringe } from "lucide-react";
import { MaterialInfo } from "../../../features/specimenDefinition/SpecimenDefinition";
import { DetailSection, SectionTitle } from "../primitives";

export const CollectedMaterialSection: React.FC<{
  material: MaterialInfo | null;
}> = ({ material }) => {
  if (!material) return null;

  return (
    <DetailSection variant="muted">
      <SectionTitle icon={Syringe} className="mb-4">
        Materiał pobierany
      </SectionTitle>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 shadow-sm">
          <Droplets className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-900 font-semibold">
          {material.display}
        </p>
      </div>
    </DetailSection>
  );
};
