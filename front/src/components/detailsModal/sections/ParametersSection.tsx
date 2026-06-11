import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { ObservationDefinitionListItem } from "../../../features/observationDefinition/Api";
import { DetailSection, MutedText, SectionTitle } from "../primitives";

export const ParametersSection: React.FC<{
  parameters: ObservationDefinitionListItem[];
  onSelectObservation: (obsId: string) => void;
}> = ({ parameters, onSelectObservation }) => (
  <DetailSection>
    <SectionTitle icon={BookOpen} className="mb-4">
      Parametry badania
      {parameters.length > 0 && (
        <span className="text-slate-400 font-normal normal-case tracking-normal">
          ({parameters.length})
        </span>
      )}
    </SectionTitle>
    {parameters.length === 0 ? (
      <MutedText>Brak parametrów powiązanych z tą usługą.</MutedText>
    ) : (
      <div className="space-y-2">
        {parameters.map((obs) => (
          <button
            key={obs.id}
            onClick={() => onSelectObservation(obs.id)}
            className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-800">
              {obs.preferredReportName ?? "Zobacz wartości referencyjne"}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </button>
        ))}
      </div>
    )}
  </DetailSection>
);
