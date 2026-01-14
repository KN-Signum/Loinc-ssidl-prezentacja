import ActivityDefinitionsTable from "./components/CatalogActivityDefinitionsTable";
import Searchbar from "./components/CatalogSearchbar";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";

type CatalogTableProps = {
  listData: ActivityDefinition[];
  listLoading: boolean;
};

const CatalogTable = (props: CatalogTableProps) => {

  return (
    <>
      <Searchbar />
      <ActivityDefinitionsTable
        listData={props.listData}
        listLoading={props.listLoading}
      />
    </>
  );
};
export default CatalogTable;
