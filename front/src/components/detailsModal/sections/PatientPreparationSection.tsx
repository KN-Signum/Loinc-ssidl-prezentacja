import React from "react";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import { DetailSection, MutedText, SectionTitle } from "../primitives";

export const PatientPreparationSection: React.FC<{
  items: string[];
}> = ({ items }) => (
  <DetailSection>
    <SectionTitle icon={ClipboardList} className="mb-4">
      Przygotowanie Pacjenta
    </SectionTitle>
    {items.length > 0 ? (
      <ul className="space-y-2">
        {items.map((text, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    ) : (
      <MutedText>Brak specyficznych zaleceń.</MutedText>
    )}
  </DetailSection>
);
