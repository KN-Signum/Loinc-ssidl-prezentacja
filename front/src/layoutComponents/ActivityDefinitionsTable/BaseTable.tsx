import BaseActivityDefinitionsTable from "./components/BaseActivityDefinitionsTable";
import BaseSearchbar from "./components/BaseSearchbar";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { useBasketStore } from "../../store/basketStore";
import { useTableFiltering } from "../../hooks/useTableFiltering";

type BaseTableProps = {
  setDetailsId: (id: string) => void;
  listData: ActivityDefinition[];
  listLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  fetchNextPage?: () => void;
  fetchPrevPage?: () => void;
};

const BaseTable = (props: BaseTableProps) => {
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
      <BaseSearchbar
        searchTerm={props.searchTerm}
        setSearchTerm={props.setSearchTerm}
        selectedLab={selectedLab}
        setSelectedLab={setSelectedLab}
        selectedSpecimen={selectedSpecimen}
        setSelectedSpecimen={setSelectedSpecimen}
      />
      <BaseActivityDefinitionsTable
        listData={props.listData}
        listLoading={props.listLoading}
        filteredData={filteredData}
        basket={basket}
        toggleSelection={toggleItem}
        setDetailsId={props.setDetailsId}
        getLoincOrICDCode={getLoincOrICDCode}
        paginationTokenNext={props.paginationTokenNext}
        paginationTokenPrev={props.paginationTokenPrev}
        onNextPage={props.fetchNextPage}
        onPrevPage={props.fetchPrevPage}
      />
    </>
  );
};
export default BaseTable;
