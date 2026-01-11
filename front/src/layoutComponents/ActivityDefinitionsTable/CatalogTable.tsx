import ActivityDefinitionsTable from "./components/ActivityDefinitionsTable";
import Searchbar from "./components/Searchbar";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { useBasketStore } from "../../store/basketStore";
import { useTableFiltering } from "../../hooks/useTableFiltering";

type CatalogTableProps = {
  setDetailsId: (id: string) => void;
  listData: ActivityDefinition[];
  listLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const CatalogTable = (props: CatalogTableProps) => {
  const { basket, toggleItem } = useBasketStore();

  const {
    selectedLab,
    setSelectedLab,
    selectedSpecimen,
    setSelectedSpecimen,
    filteredData,
    getLoincOrICDCode,
  } = useTableFiltering({
    listData: props.listData,
    searchTerm: props.searchTerm,
  });

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
        basket={basket}
        toggleSelection={toggleItem}
        setDetailsId={props.setDetailsId}
        getLoincOrICDCode={getLoincOrICDCode}
      />
    </>
  );
};
export default CatalogTable;
