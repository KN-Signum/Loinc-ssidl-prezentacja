import React from "react";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { ActivityDefinition } from "../../../features/activityDefinition/ActivityDefinition";
import { NFZ_LABELS, NfzCode } from "../types";
import { extractNfzCodes } from "../utils";
import { CodeBadge } from "../primitives";

export const ActivityHeader: React.FC<{
  activityDefinitionData: ActivityDefinition | null;
}> = ({ activityDefinitionData }) => {
  const nfzCodes = extractNfzCodes(activityDefinitionData?.extension);

  const loincCode =
    activityDefinitionData?.code?.coding?.find(
      (c) => c.system === "http://loinc.org",
    )?.code ||
    activityDefinitionData?.code?.coding?.[0]?.code ||
    "N/A";

  const icd9 = activityDefinitionData?.code?.coding?.find((c) =>
    c.system?.includes("pl-icd9plServiceCode-CS"),
  );

  return (
    <DialogHeader className="mb-1 space-y-1">
      <DialogTitle className="text-2xl leading-tight">
        {activityDefinitionData?.title || "Szczegóły Usługi"}
      </DialogTitle>
      <div className="flex flex-wrap gap-2 mb-2">
        <CodeBadge color="blue">LOINC: {loincCode}</CodeBadge>
        {icd9 && <CodeBadge color="violet">ICD-9: {icd9.code}</CodeBadge>}
        {nfzCodes.map((nfz, idx) => (
          <CodeBadge key={idx} color="emerald" mono={false}>
            {NFZ_LABELS[nfz.code as NfzCode] ?? nfz.display}
          </CodeBadge>
        ))}
      </div>
    </DialogHeader>
  );
};
