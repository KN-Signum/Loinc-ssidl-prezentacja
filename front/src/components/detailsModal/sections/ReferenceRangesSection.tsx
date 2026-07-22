import React, { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { MarkdownText } from "../../ui/MarkdownText";
import { CitationItem } from "../../../features/citations/types";
import {
  AgeFilter,
  AGE_FILTER_BUTTONS,
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

const FilterSwitcher = <T extends string>({
  buttons,
  value,
  onChange,
}: {
  buttons: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
    {buttons.map((btn) => (
      <button
        key={btn.value}
        onClick={() => onChange(btn.value)}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          value === btn.value
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {btn.label}
      </button>
    ))}
  </div>
);

const hasAgeInfo = (item: CitationItem): boolean =>
  item.age?.low?.value !== undefined || item.age?.high?.value !== undefined;

const ReferenceRangeRow: React.FC<{
  item: CitationItem;
  ageUnits: Record<string, string>;
  showGenderColumn: boolean;
  showAgeColumn: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({
  item,
  ageUnits,
  showGenderColumn,
  showAgeColumn,
  isExpanded,
  onToggle,
}) => {
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

  const description = item.citation?.description;
  const sourceUrl = item.citation?.citedArtifact?.webLocation?.[0]?.url;
  const hasDetails = Boolean(description || sourceUrl);
  const colSpan = 2 + (showGenderColumn ? 1 : 0) + (showAgeColumn ? 1 : 0);

  return (
    <>
      <tr
        onClick={hasDetails ? onToggle : undefined}
        className={`border-b border-slate-100 ${
          hasDetails ? "cursor-pointer hover:bg-slate-50" : ""
        }`}
      >
        {showGenderColumn && (
          <td className="py-2.5 pr-4 text-slate-700 whitespace-nowrap">
            {item.gender ? (genderLabel[item.gender] ?? item.gender) : "—"}
          </td>
        )}
        {showAgeColumn && (
          <td className="py-2.5 pr-4 text-slate-700 whitespace-nowrap">
            {ageSummary || "—"}
          </td>
        )}
        <td className="py-2.5 pr-4 font-medium text-slate-900 whitespace-nowrap">
          {rangeSummary || "—"}
        </td>
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
            {description ? (
              sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2"
                >
                  <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 group-hover:text-blue-800" />
                  <MarkdownText className="[&_p]:text-blue-600 group-hover:[&_p]:text-blue-800 group-hover:[&_p]:underline">
                    {description}
                  </MarkdownText>
                </a>
              ) : (
                <MarkdownText>{description}</MarkdownText>
              )
            ) : sourceUrl ? (
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
  ageFilter: AgeFilter;
  onAgeFilterChange: (filter: AgeFilter) => void;
}> = ({
  citationsData,
  ageUnits,
  genderFilter,
  onGenderFilterChange,
  ageFilter,
  onAgeFilterChange,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleGenderFilterChange = (filter: GenderFilter) => {
    setExpandedRow(null);
    onGenderFilterChange(filter);
  };

  const handleAgeFilterChange = (filter: AgeFilter) => {
    setExpandedRow(null);
    onAgeFilterChange(filter);
  };

  if (!citationsData) return null;

  const citationsArray = Array.isArray(citationsData) ? citationsData : null;

  const hasGenderedData = citationsArray?.some((item) => item.gender) ?? false;
  const availableGenders = citationsArray
    ? [...new Set(citationsArray.map((item) => item.gender).filter(Boolean))]
    : [];
  const showGenderFilter = hasGenderedData && availableGenders.length > 1;

  const hasAgeData = citationsArray?.some(hasAgeInfo) ?? false;
  const hasChildData = citationsArray?.some(isChildItem) ?? false;
  const hasAdultData = citationsArray?.some((item) => !isChildItem(item)) ?? false;
  const showAgeFilter = hasChildData && hasAdultData;

  const filteredCitations = citationsArray
    ? citationsArray
        .filter((item) => {
          if (
            genderFilter !== GenderFilter.All &&
            item.gender &&
            item.gender !== genderFilter
          )
            return false;
          if (ageFilter === AgeFilter.Adults && isChildItem(item)) return false;
          if (
            ageFilter === AgeFilter.Children &&
            hasAgeInfo(item) &&
            !isChildItem(item)
          )
            return false;
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
          {showGenderFilter && (
            <FilterSwitcher
              buttons={GENDER_FILTER_BUTTONS.filter(
                (btn) =>
                  btn.value === GenderFilter.All ||
                  availableGenders.includes(btn.value),
              )}
              value={genderFilter}
              onChange={handleGenderFilterChange}
            />
          )}
          {showAgeFilter && (
            <FilterSwitcher
              buttons={AGE_FILTER_BUTTONS}
              value={ageFilter}
              onChange={handleAgeFilterChange}
            />
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
                <div className="max-h-[60vh] overflow-y-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        {hasGenderedData && (
                          <th className={headerCellClass}>Płeć pacjenta</th>
                        )}
                        {hasAgeData && (
                          <th className={headerCellClass}>Wiek pacjenta</th>
                        )}
                        <th className={headerCellClass}>Zakres</th>
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
                          showAgeColumn={hasAgeData}
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
