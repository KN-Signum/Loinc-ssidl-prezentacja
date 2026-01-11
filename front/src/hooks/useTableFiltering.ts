import { useState, useMemo, useCallback } from 'react';
import { ActivityDefinition } from '../features/activityDefinition/ActivityDefinition';
import { Coding } from '../features/activityDefinition/types';

interface UseTableFilteringOptions {
  listData: ActivityDefinition[];
  searchTerm: string;
}

interface UseTableFilteringResult {
  selectedLab: string;
  setSelectedLab: (lab: string) => void;
  selectedSpecimen: string;
  setSelectedSpecimen: (specimen: string) => void;
  filteredData: ActivityDefinition[];
  getLoincOrICDCode: (item: ActivityDefinition) => string;
}

const LOINC_SYSTEM = "http://loinc.org";
const ICD9_SYSTEM = "http://hl7.org.pl/fhir/CodeSystem/pl-icd9plServiceCode-CS";
const DEFAULT_CODE = "Brak kodu";

export const useTableFiltering = ({
  listData,
  searchTerm,
}: UseTableFilteringOptions): UseTableFilteringResult => {
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [selectedSpecimen, setSelectedSpecimen] = useState<string>("all");

  // Memoized code extraction function
  const getLoincOrICDCode = useCallback((item: ActivityDefinition): string => {
    const codingArray: Coding[] = item.code?.coding || [];
    const code = codingArray.find(
      (c: Coding) =>
        (c.system === LOINC_SYSTEM && c.code) ||
        (c.system === ICD9_SYSTEM && c.code)
    )?.code;
    return code || DEFAULT_CODE;
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!listData) return [];

    return listData.filter((item: ActivityDefinition) => {
      const title = item.title || item.name || "";
      const code = getLoincOrICDCode(item);

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.toLowerCase().includes(searchTerm.toLowerCase());

      // Note: Lab and specimen filtering currently always true
      // TODO: Implement actual filtering when backend supports it
      const matchesLab = selectedLab === "all" ? true : true;
      const matchesSpecimen = selectedSpecimen === "all" ? true : true;

      return matchesSearch && matchesLab && matchesSpecimen;
    });
  }, [searchTerm, selectedLab, selectedSpecimen, listData, getLoincOrICDCode]);

  return {
    selectedLab,
    setSelectedLab,
    selectedSpecimen,
    setSelectedSpecimen,
    filteredData,
    getLoincOrICDCode,
  };
};
