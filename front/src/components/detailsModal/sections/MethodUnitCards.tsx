import React from "react";
import { Microscope, Ruler } from "lucide-react";
import { ObservationDefinition } from "../../../features/observationDefinition/ObservationDefintion";
import { InfoCard } from "../primitives";

export const MethodUnitCards: React.FC<{
  observationData: ObservationDefinition | null;
}> = ({ observationData }) => {
  if (!observationData?.methodDisplay && !observationData?.permittedUnitDisplay)
    return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {observationData?.methodDisplay && (
        <InfoCard
          icon={Microscope}
          iconColorClass="bg-blue-50 border-blue-100 text-blue-600"
          label="Metoda badania"
          value={observationData.methodDisplay}
          valueClassName="capitalize"
          code={observationData.methodCode}
        />
      )}
      {observationData?.permittedUnitDisplay && (
        <InfoCard
          icon={Ruler}
          iconColorClass="bg-emerald-50 border-emerald-100 text-emerald-600"
          label="Jednostka wyniku"
          value={observationData.permittedUnitDisplay}
          code={observationData.permittedUnitCode}
        />
      )}
    </div>
  );
};
