import { useEffect } from "react";
import Header from "./layoutComponents/header/Header";
import { MainContent } from "./layoutComponents/App/MainContent";
import { BasketBar } from "./layoutComponents/App/BasketBar";
import { OrderModal } from "./layoutComponents/App/OrderModal";
import { DetailsSheet } from "./layoutComponents/App/DetailsSheet";
import { useGetSpecimenDefinition } from "./features/specimenDefinition/Api";
import { useGetObservationDefinition, useGetObservationDefinitionList } from "./features/observationDefinition/Api";
import { useGetActivityDefinitionsByTitle, useGetActivityDefinition } from "./features/activityDefinition/Api";
import { useGetCitations } from "./features/citations/Api";
import { useBasketStore } from "./store/basketStore";
import { useAppStore } from "./store/appStore";

function extractObsIds(observationResultRequirement: string[] | undefined): string[] {
  if (!observationResultRequirement?.length) return [];
  return observationResultRequirement.map((ref) => {
    const parts = ref.split("-");
    return parts[parts.length - 1];
  });
}

export default function App() {
  const {
    detailsId,
    selectedObsId,
    setSelectedObsId,
    searchTerm,
  } = useAppStore();

  const { getBasketItems, getBasketGroups } = useBasketStore();

  const activityDefinitionQuery = useGetActivityDefinition(detailsId ?? "");
  const activityDefinitionData = activityDefinitionQuery.data;

  const obsIds = extractObsIds(activityDefinitionData?.observationResultRequirement);
  const singleObsId = obsIds.length === 1 ? obsIds[0] : null;
  const isMultiObs = !activityDefinitionQuery.loading && obsIds.length > 1;

  useEffect(() => {
    if (singleObsId && !selectedObsId) {
      setSelectedObsId(singleObsId);
    }
  }, [singleObsId, selectedObsId, setSelectedObsId]);

  const specimenQuery = useGetSpecimenDefinition(detailsId);
  const observationListQuery = useGetObservationDefinitionList(isMultiObs ? detailsId : null);
  const observationQuery = useGetObservationDefinition(selectedObsId);
  const citationsQuery = useGetCitations(selectedObsId);
  const isDetailsLoading = specimenQuery.loading || observationQuery.loading || citationsQuery.loading;

  const {
    data: listData,
    loading: listLoading,
    error: listError,
    paginationTokenNext,
    paginationTokenPrev,
    fetchNextPage,
    fetchPrevPage,
  } = useGetActivityDefinitionsByTitle(
    searchTerm.length >= 2 ? searchTerm : "",
  );

  const basketItems = getBasketItems(listData || []);
  const basketGroups = getBasketGroups(listData || []);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-32">
      <Header />

      <MainContent
        listData={listData || []}
        listLoading={listLoading}
        listError={listError}
        paginationTokenNext={paginationTokenNext}
        paginationTokenPrev={paginationTokenPrev}
        fetchNextPage={fetchNextPage}
        fetchPrevPage={fetchPrevPage}
      />

      <BasketBar
        basketItems={basketItems}
        basketGroups={basketGroups}
      />

      <DetailsSheet
        specimenData={specimenQuery.data}
        observationData={observationQuery.data}
        observationList={observationListQuery.data}
        observationListLoading={observationListQuery.loading}
        activityDefinitionData={activityDefinitionData}
        isMultiObs={isMultiObs}
        citationsData={citationsQuery.data}
        isLoading={isDetailsLoading}
      />

      <OrderModal
        basketItems={basketItems}
      />
    </div>
  );
}
