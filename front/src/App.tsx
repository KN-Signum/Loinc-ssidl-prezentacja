import Header from "./layoutComponents/header/Header";
import { MainContent } from "./layoutComponents/App/MainContent";
import { BasketBar } from "./layoutComponents/App/BasketBar";
import { OrderModal } from "./layoutComponents/App/OrderModal";
import { DetailsSheet } from "./layoutComponents/App/DetailsSheet";
import { useGetSpecimenDefinition } from "./features/specimenDefinition/Api";
import { useGetObservationDefinition } from "./features/observationDefinition/Api";
import { useGetActivityDefinitionsByTitle } from "./features/activityDefinition/Api";
import { useGetCitations } from "./features/citations/Api";
import { useBasketStore } from "./store/basketStore";
import { useAppStore } from "./store/appStore";

export default function App() {
  const {
    detailsId,
    searchTerm,
  } = useAppStore();

  const { getBasketItems, getBasketGroups } = useBasketStore();

  const specimenQuery = useGetSpecimenDefinition(detailsId);
  const observationQuery = useGetObservationDefinition(detailsId);
  const citationsQuery = useGetCitations(detailsId);
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

  const activityDefinitionData = detailsId
    ? listData?.find((item) => item.id === detailsId)
    : null;

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
        activityDefinitionData={activityDefinitionData}
        citationsData={citationsQuery.data}
        isLoading={isDetailsLoading}
      />

      <OrderModal
        basketItems={basketItems}
      />
    </div>
  );
}
