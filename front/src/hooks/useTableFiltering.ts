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
  getLoincOrICDCode: (item: ActivityDefinition) => {loinc:string,icd_9:string};
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
  const getLoincOrICDCode = useCallback((item: ActivityDefinition): {loinc:string,icd_9:string} => {
    const codingArray: Coding[] = item.code?.coding || [];
    const loinc = codingArray[0]?.code || DEFAULT_CODE
    const icd_9 = codingArray[1]?.code || DEFAULT_CODE
    return {
      loinc,
      icd_9
    };
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!listData) return [];

    return listData.filter((item: ActivityDefinition) => {
      const title = item.title ||  "";
      const code = getLoincOrICDCode(item).loinc;

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
