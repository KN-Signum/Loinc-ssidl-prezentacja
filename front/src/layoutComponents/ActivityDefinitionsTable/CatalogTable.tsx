import ActivityDefinitionsTable from "./components/CatalogActivityDefinitionsTable";
import Searchbar from "./components/CatalogSearchbar";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";

type CatalogTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
  listError?: string | null;
};

const CatalogTable = (props: CatalogTableProps) => {
  return (
    <>
      <Searchbar />
      <ActivityDefinitionsTable
        listData={props.listData}
        listLoading={props.listLoading}
        listError={props.listError}
      />
    </>
  );
};
export default CatalogTable;
