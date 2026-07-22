import Header from "./layoutComponents/header/Header";
import { MainContent } from "./layoutComponents/App/MainContent";
import { BasketBar } from "./layoutComponents/App/BasketBar";
import { OrderModal } from "./layoutComponents/App/OrderModal";
import { DetailsModal } from "./layoutComponents/App/DetailsModal";
import { Footer } from "./layoutComponents/footer/Footer";
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
    searchTerm,
  } = useAppStore();

  const { getBasketItems, getBasketGroups } = useBasketStore();

  const activityDefinitionQuery = useGetActivityDefinition(detailsId ?? "");
  const activityDefinitionData = activityDefinitionQuery.data;
  const dataIsForCurrentId = activityDefinitionQuery.loadedId === detailsId;

  const obsIds = dataIsForCurrentId
    ? extractObsIds(activityDefinitionData?.observationResultRequirement)
    : [];
  const singleObsId = obsIds.length === 1 ? obsIds[0] : null;
  const isMultiObs = dataIsForCurrentId && obsIds.length > 1;

  const specimenQuery = useGetSpecimenDefinition(detailsId);
  const observationListQuery = useGetObservationDefinitionList(
    obsIds.length > 0 ? detailsId : null,
  );
  const observationQuery = useGetObservationDefinition(selectedObsId);
  const citationsQuery = useGetCitations(selectedObsId);

  const activityViewLoading =
    !dataIsForCurrentId ||
    activityDefinitionQuery.loading ||
    specimenQuery.loading ||
    (obsIds.length > 0 && observationListQuery.loading);
  const observationViewLoading =
    observationQuery.loading || citationsQuery.loading;

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
    <div
      className={`min-h-screen bg-slate-50/50 font-sans text-slate-900 ${basketItems.length > 0 ? "pb-32" : "pb-0"}`}
    >
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

      <Footer />

      <BasketBar
        basketItems={basketItems}
        basketGroups={basketGroups}
      />

      <DetailsModal
        specimenData={specimenQuery.data}
        observationData={observationQuery.data}
        observationList={observationListQuery.data}
        activityDefinitionData={activityDefinitionData}
        isMultiObs={isMultiObs}
        singleObsId={singleObsId}
        citationsData={citationsQuery.data}
        activityViewLoading={activityViewLoading}
        observationViewLoading={observationViewLoading}
      />

      <OrderModal
        basketItems={basketItems}
      />
    </div>
  );
}
