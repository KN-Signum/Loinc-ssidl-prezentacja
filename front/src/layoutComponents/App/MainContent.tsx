import React from "react";
import BaseTable from "../ActivityDefinitionsTable/BaseTable";
import CatalogTable from "../ActivityDefinitionsTable/CatalogTable";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";

export interface MainContentProps {
  knowledgeBase: boolean;
  listData: ActivityDefinition[];
  listLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setDetailsId: (id: string) => void;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  fetchNextPage?: () => void;
  fetchPrevPage?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  knowledgeBase,
  listData,
  listLoading,
  searchTerm,
  setSearchTerm,
  setDetailsId,
  paginationTokenNext,
  paginationTokenPrev,
  fetchNextPage,
  fetchPrevPage,
}) => {
  return (
    <main className="mx-auto max-w-7xl p-6">
      {knowledgeBase ? (
        <BaseTable
          listData={listData}
          listLoading={listLoading}
          setDetailsId={setDetailsId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          paginationTokenNext={paginationTokenNext}
          paginationTokenPrev={paginationTokenPrev}
          fetchNextPage={fetchNextPage}
          fetchPrevPage={fetchPrevPage}
        />
      ) : (
        <CatalogTable
          listData={listData}
          listLoading={listLoading}
          setDetailsId={setDetailsId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </main>
  );
};
