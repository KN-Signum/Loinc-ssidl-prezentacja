import { useMemo, useState } from "react";
import ActivityDefinitionsTable from "./components/ActivityDefinitionsTable";
import Searchbar from "./components/Searchbar";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";

type MainTableProps = {
  basket: Set<string>;
  setBasket: (basket: Set<string>) => void;
  setDetailsId: (id: string) => void;
  listData: ActivityDefinition[];
  listLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const CatalogTable = (props:MainTableProps) => {
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [selectedSpecimen, setSelectedSpecimen] = useState<string>("all");
 

  const getLoincOrICDCode = (item: any) => {
    const codingArray = item.code?.coding || [];
    const code = codingArray.find(
      (c: any) =>
        (c.system === "http://loinc.org" && c.code) ||
        (c.system ===
          "http://hl7.org.pl/fhir/CodeSystem/pl-icd9plServiceCode-CS" &&
          c.code)
    )?.code;
    return code || "Brak kodu";
  };
  // Filtering Logic
  const filteredData = useMemo(() => {
    if (!props.listData) return [];

    return props.listData.filter((item: any) => {
      const title = item.title || item.name || "";
      const code = getLoincOrICDCode(item);

      const matchesSearch =
        title.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
        code.toLowerCase().includes(props.searchTerm.toLowerCase());

      const matchesLab = selectedLab === "all" ? true : true;
      const matchesSpecimen = selectedSpecimen === "all" ? true : true;

      return matchesSearch && matchesLab && matchesSpecimen;
    });
  }, [props.searchTerm, selectedLab, selectedSpecimen, props.listData]);


  const toggleSelection = (id: string) => {
    const newBasket = new Set(props.basket);
    if (newBasket.has(id)) {
      newBasket.delete(id);
    } else {
      newBasket.add(id);
    }
    props.setBasket(newBasket);
  };
  return (
    <>
      <Searchbar
        searchTerm={props.searchTerm}
        setSearchTerm={props.setSearchTerm}
        selectedLab={selectedLab}
        setSelectedLab={setSelectedLab}
        selectedSpecimen={selectedSpecimen}
        setSelectedSpecimen={setSelectedSpecimen}
      />
      <ActivityDefinitionsTable
        listData={props.listData}
        listLoading={props.listLoading}
        filteredData={filteredData}
        basket={props.basket}
        toggleSelection={toggleSelection}
        setDetailsId={props.setDetailsId}
        getLoincOrICDCode={getLoincOrICDCode}
      />
    </>
  );
};
export default CatalogTable;
