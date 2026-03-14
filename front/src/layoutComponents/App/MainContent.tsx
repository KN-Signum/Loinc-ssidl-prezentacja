import React from "react";
import BaseTable from "../ActivityDefinitionsTable/BaseTable";
import CatalogTable from "../ActivityDefinitionsTable/CatalogTable";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { useAppStore } from "../../store/appStore";

export interface MainContentProps {
  listData: ActivityDefinition[];
  listLoading: boolean;
  paginationTokenNext?: string | null;
  paginationTokenPrev?: string | null;
  fetchNextPage?: () => void;
  fetchPrevPage?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  listData,
  listLoading,
  paginationTokenNext,
  paginationTokenPrev,
  fetchNextPage,
  fetchPrevPage,
}) => {
  const { knowledgeBase, isPreviewMode } = useAppStore();
  const showKnowledgeBase = !isPreviewMode || knowledgeBase;

  return (
    <main className="mx-auto max-w-7xl p-6">
      {showKnowledgeBase ? (
        <BaseTable
          listData={listData}
          listLoading={listLoading}
          paginationTokenNext={paginationTokenNext}
          paginationTokenPrev={paginationTokenPrev}
          fetchNextPage={fetchNextPage}
          fetchPrevPage={fetchPrevPage}
        />
      ) : (
        <CatalogTable
          listData={listData}
          listLoading={listLoading}
        />
      )}
    </main>
  );
};
