import React, { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { MarkdownText } from "../../ui/MarkdownText";
import { CitationItem } from "../../../features/citations/types";
import {
  CitationsData,
  GenderFilter,
  GENDER_FILTER_BUTTONS,
  genderLabel,
} from "../types";
import {
  ageToYears,
  formatBoundedSummary,
  formatRangeValue,
  isChildItem,
} from "../utils";
import { DetailSection, MutedText, SectionTitle } from "../primitives";

const ReferenceRangeRow: React.FC<{
  item: CitationItem;
  ageUnits: Record<string, string>;
  showGenderColumn: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ item, ageUnits, showGenderColumn, isExpanded, onToggle }) => {
  const rangeSummary = formatBoundedSummary(
    formatRangeValue(item.range?.low?.value),
    formatRangeValue(item.range?.high?.value),
    item.range?.low?.unit || item.range?.high?.unit || "",
  );

  const ageUnitCode = item.age?.low?.unit || item.age?.high?.unit || "";
  const ageSummary = formatBoundedSummary(
    formatRangeValue(item.age?.low?.value),
    formatRangeValue(item.age?.high?.value),
    ageUnits[ageUnitCode] || ageUnitCode,
  );

  const sourceUrl = item.citation?.citedArtifact?.webLocation?.[0]?.url;
  const hasDetails = Boolean(item.citation?.description || sourceUrl);
  const colSpan = showGenderColumn ? 4 : 3;

  return (
    <>
      <tr
        onClick={hasDetails ? onToggle : undefined}
        className={`border-b border-slate-100 ${
          hasDetails ? "cursor-pointer hover:bg-slate-50" : ""
        }`}
      >
        <td className="py-2.5 pr-4 font-medium text-slate-900 whitespace-nowrap">
          {rangeSummary || "—"}
        </td>
        <td className="py-2.5 pr-4 text-slate-700 whitespace-nowrap">
          {ageSummary || "—"}
        </td>
        {showGenderColumn && (
          <td className="py-2.5 pr-4 text-slate-700 whitespace-nowrap">
            {item.gender ? (genderLabel[item.gender] ?? item.gender) : "—"}
          </td>
        )}
        <td className="py-2.5 w-8 text-right">
          {hasDetails && (
            <ChevronDown
              className={`h-4 w-4 text-slate-400 inline-block transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </td>
      </tr>
      {isExpanded && hasDetails && (
        <tr className="border-b border-slate-100">
          <td colSpan={colSpan} className="py-3 px-2 bg-slate-50/50">
            <div className="space-y-3">
              {item.citation?.description && (
                <MarkdownText>{item.citation.description}</MarkdownText>
              )}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="break-all">{sourceUrl}</span>
                </a>
              ) : (
                <p className="text-sm text-slate-400 italic">Brak źródła</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const ReferenceRangesSection: React.FC<{
  citationsData: CitationsData;
  ageUnits: Record<string, string>;
  genderFilter: GenderFilter;
  onGenderFilterChange: (filter: GenderFilter) => void;
  showChildren: boolean;
  onToggleShowChildren: () => void;
}> = ({
  citationsData,
  ageUnits,
  genderFilter,
  onGenderFilterChange,
  showChildren,
  onToggleShowChildren,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleGenderFilterChange = (filter: GenderFilter) => {
    setExpandedRow(null);
    onGenderFilterChange(filter);
  };

  const handleToggleShowChildren = () => {
    setExpandedRow(null);
    onToggleShowChildren();
  };

  if (!citationsData) return null;

  const citationsArray = Array.isArray(citationsData) ? citationsData : null;
  const hasGenderedData = citationsArray?.some((item) => item.gender) ?? false;
  const availableGenders = citationsArray
    ? [...new Set(citationsArray.map((item) => item.gender).filter(Boolean))]
    : [];
  const showGenderFilter = hasGenderedData && availableGenders.length > 1;
  const hasChildData = citationsArray?.some(isChildItem) ?? false;

  const filteredCitations = citationsArray
    ? citationsArray
        .filter((item) => {
          if (
            genderFilter !== GenderFilter.All &&
            item.gender &&
            item.gender !== genderFilter
          )
            return false;
          if (!showChildren && isChildItem(item)) return false;
          return true;
        })
        .slice()
        .sort((a, b) => ageToYears(a) - ageToYears(b))
    : null;

  const messageItems = filteredCitations?.filter((item) => item.message) ?? [];
  const rangeItems = filteredCitations?.filter((item) => !item.message) ?? [];

  const headerCellClass =
    "sticky top-0 bg-white py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500";

  return (
    <DetailSection>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <SectionTitle icon={BookOpen}>Wartości Referencyjne</SectionTitle>

        <div className="flex items-center gap-2 flex-wrap">
          {hasChildData && (
            <button
              onClick={handleToggleShowChildren}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                showChildren
                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-700"
              }`}
            >
              {showChildren ? "Ukryj dzieci" : "Pokaż dzieci"}
            </button>
          )}
          {showGenderFilter && (
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {GENDER_FILTER_BUTTONS.filter(
                (btn) =>
                  btn.value === GenderFilter.All ||
                  availableGenders.includes(btn.value),
              ).map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => handleGenderFilterChange(btn.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    genderFilter === btn.value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredCitations ? (
          filteredCitations.length === 0 ? (
            <MutedText>Brak danych dla wybranego filtru.</MutedText>
          ) : (
            <>
              {messageItems.map((item, idx) => (
                <MutedText key={`msg-${idx}`}>{item.message}</MutedText>
              ))}
              {rangeItems.length > 0 && (
                <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        <th className={headerCellClass}>Zakres</th>
                        <th className={headerCellClass}>Wiek</th>
                        {hasGenderedData && (
                          <th className={headerCellClass}>Płeć</th>
                        )}
                        <th className="sticky top-0 bg-white py-2 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {rangeItems.map((item, idx) => (
                        <ReferenceRangeRow
                          key={idx}
                          item={item}
                          ageUnits={ageUnits}
                          showGenderColumn={hasGenderedData}
                          isExpanded={expandedRow === idx}
                          onToggle={() =>
                            setExpandedRow(expandedRow === idx ? null : idx)
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )
        ) : (
          <MutedText>
            {(citationsData as { message: string }).message}
          </MutedText>
        )}
      </div>
    </DetailSection>
  );
};
