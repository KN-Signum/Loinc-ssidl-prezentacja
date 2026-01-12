import { useState } from "react";
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

export default function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState<boolean>(true);

  const requesterName = "Dr n. med. Jan Kowalski";

  const { getBasketItems, getBasketGroups, clearBasket } = useBasketStore();

  const specimenQuery = useGetSpecimenDefinition(detailsId);
  const observationQuery = useGetObservationDefinition(detailsId);
  const citationsQuery = useGetCitations(detailsId);
  const isDetailsLoading = specimenQuery.loading || observationQuery.loading || citationsQuery.loading;

  const {
    data: listData,
    loading: listLoading,
    paginationTokenNext,
    paginationTokenPrev,
    fetchNextPage,
    fetchPrevPage,
  } = useGetActivityDefinitionsByTitle(
    searchTerm.length >= 1 ? searchTerm : "",
  );

  const basketItems = getBasketItems(listData || []);
  const basketGroups = getBasketGroups(listData || []);

  const activityDefinitionData = detailsId
    ? listData?.find((item) => item.id === detailsId)
    : null;

  const handleOrderSubmit = () => {
    setIsOrderModalOpen(false);
    clearBasket();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-32">
      <Header
        requesterName={requesterName}
        knowledgeBase={knowledgeBase}
        setKnowledgeBase={setKnowledgeBase}
      />

      <MainContent
        knowledgeBase={knowledgeBase}
        listData={listData || []}
        listLoading={listLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setDetailsId={setDetailsId}
        paginationTokenNext={paginationTokenNext}
        paginationTokenPrev={paginationTokenPrev}
        fetchNextPage={fetchNextPage}
        fetchPrevPage={fetchPrevPage}
      />

      <BasketBar
        basketItems={basketItems}
        basketGroups={basketGroups}
        onProceedToOrder={() => setIsOrderModalOpen(true)}
      />

      <DetailsSheet
        detailsId={detailsId}
        onClose={() => setDetailsId(null)}
        specimenData={specimenQuery.data}
        observationData={observationQuery.data}
        activityDefinitionData={activityDefinitionData}
        citationsData={citationsQuery.data}
        isLoading={isDetailsLoading}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        basketItems={basketItems}
        requesterName={requesterName}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}
