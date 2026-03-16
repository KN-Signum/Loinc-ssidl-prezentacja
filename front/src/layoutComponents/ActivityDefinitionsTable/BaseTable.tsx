import BaseActivityDefinitionsTable from "./components/BaseActivityDefinitionsTable";
import BaseSearchbar from "./components/BaseSearchbar";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";

type BaseTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
  listError?: string | null;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  fetchNextPage?: () => void;
  fetchPrevPage?: () => void;
};

const BaseTable = (props: BaseTableProps) => {
  return (
    <>
      <BaseSearchbar />
      <BaseActivityDefinitionsTable
        listData={props.listData}
        listLoading={props.listLoading}
        listError={props.listError}
        paginationTokenNext={props.paginationTokenNext}
        paginationTokenPrev={props.paginationTokenPrev}
        onNextPage={props.fetchNextPage}
        onPrevPage={props.fetchPrevPage}
      />
    </>
  );
};
export default BaseTable;
