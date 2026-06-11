import React from "react";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { ObservationDefinition } from "../../../features/observationDefinition/ObservationDefintion";
import { BackButton, CodeBadge } from "../primitives";

export const ObservationHeader: React.FC<{
  observationData: ObservationDefinition | null;
  parentTitle: string;
  onBack: () => void;
}> = ({ observationData, parentTitle, onBack }) => (
  <DialogHeader className="mb-1 space-y-1">
    <BackButton onClick={onBack} label={parentTitle} />
    <DialogTitle className="text-2xl leading-tight">
      {observationData?.preferredReportName || "Szczegóły Parametru"}
    </DialogTitle>
    {(observationData?.code || observationData?.codeDisplay) && (
      <div className="flex flex-wrap items-baseline gap-2">
        {observationData?.code && (
          <CodeBadge color="blue">LOINC: {observationData.code}</CodeBadge>
        )}
        {observationData?.codeDisplay && (
          <span className="text-xs text-slate-500">
            {observationData.codeDisplay}
          </span>
        )}
      </div>
    )}
  </DialogHeader>
);
