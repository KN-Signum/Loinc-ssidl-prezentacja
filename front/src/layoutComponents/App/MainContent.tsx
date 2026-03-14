import React from "react";
import BaseTable from "../ActivityDefinitionsTable/BaseTable";
import CatalogTable from "../ActivityDefinitionsTable/CatalogTable";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { useAppStore } from "../../store/appStore";

export interface MainContentProps {
  listData: ActivityDefinition[];
  listLoading: boolean;
  listError?: string | null;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  fetchNextPage?: () => void;
  fetchPrevPage?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  listData,
  listLoading,
  listError,
  paginationTokenNext,
  paginationTokenPrev,
  fetchNextPage,
  fetchPrevPage,
}) => {
  const { knowledgeBase } = useAppStore();

  return (
    <main className="mx-auto max-w-7xl p-6">
      {knowledgeBase ? (
        <BaseTable
          listData={listData}
          listLoading={listLoading}
          listError={listError}
          paginationTokenNext={paginationTokenNext}
          paginationTokenPrev={paginationTokenPrev}
          fetchNextPage={fetchNextPage}
          fetchPrevPage={fetchPrevPage}
        />
      ) : (
        <CatalogTable
          listData={listData}
          listLoading={listLoading}
          listError={listError}
        />
      )}
    </main>
  );
};
