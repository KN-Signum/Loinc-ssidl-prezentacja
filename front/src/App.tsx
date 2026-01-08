import React, { useState, useMemo } from "react";
import {
  FlaskConical,
  TestTube2,
  Stethoscope,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileJson,
  Truck,
  ClipboardList,
} from "lucide-react";

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { ScrollArea } from "./components/ui/scroll-area";
import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { useGetSpecimenDefinition } from "./features/specimenDefinition/Api";
import { useGetObservationDefinition } from "./features/observationDefinition/Api";
import MainTable from "./layoutComponents/ActivityDefinitionsTable/MainTable";
import { useGetActivityDefinitionsByTitle } from "./features/activityDefinition/Api";
import Header from "./layoutComponents/header/Header";

export default function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [orderPriority, setOrderPriority] = useState("routine");
  const [patientName, setPatientName] = useState("");
  const [requesterName] = useState("Dr n. med. Jan Kowalski");
  const [basket, setBasket] = useState<Set<string>>(new Set());
  const specimenQuery = useGetSpecimenDefinition(detailsId);
  const observationQuery = useGetObservationDefinition(detailsId);
  const isDetailsLoading = specimenQuery.loading || observationQuery.loading;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: listData, loading: listLoading } =
    useGetActivityDefinitionsByTitle(searchTerm.length >= 3 ? searchTerm : "");

  const basketItems = useMemo(() => {
    if (!listData) return [];
    return listData.filter((item: any) => basket.has(item.id));
  }, [basket, listData]);

  const basketGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    basketItems.forEach((item: any) => {
      const labName = item.laboratory || "Laboratorium Centralne";
      if (!groups[labName]) groups[labName] = [];
      groups[labName].push(item);
    });
    return groups;
  }, [basketItems]);
  const basketHasMultipleLabs = Object.keys(basketGroups).length > 1;

  const generateServiceRequestJSON = () => {
    const serviceRequest = {
      resourceType: "ServiceRequest",
      status: "active",
      intent: "order",
      priority: orderPriority,
      subject: {
        display: patientName || "Nieznany Pacjent",
      },
      requester: {
        display: requesterName,
      },
      orderDetails: basketItems.map((item: any) => ({
        reference: `ActivityDefinition/${item.id}`,
        display: item.title || item.name,
      })),
    };
    return JSON.stringify(serviceRequest, null, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-32">
      <Header requesterName={requesterName} />

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tworzenie Zlecenia
          </h2>
          <p className="mt-1 text-lg text-slate-600">
            Wybierz badania z katalogu, aby utworzyć nowe zlecenie
            laboratoryjne.
          </p>
        </div>

        <MainTable
          listData={listData}
          listLoading={listLoading}
          basket={basket}
          setBasket={setBasket}
          setDetailsId={setDetailsId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </main>

      {basket.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  Koszyk Zleceń ({basket.size}{" "}
                  {basket.size === 1 ? "badanie" : "badania"})
                </h3>
              </div>
              <div className="text-sm text-slate-500 line-clamp-1">
                Wybrano:{" "}
                {basketItems.map((i: any) => i.title || i.name).join(", ")}
              </div>
              {basketHasMultipleLabs && (
                <div className="mt-2 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 border border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  Uwaga: Wybrano badania z {
                    Object.keys(basketGroups).length
                  }{" "}
                  różnych laboratoriów. System wygeneruje oddzielne zlecenia.
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => setBasket(new Set())}
                className="text-slate-600"
              >
                Wyczyść
              </Button>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                onClick={() => setIsOrderModalOpen(true)}
              >
                Przejdź do Zlecenia
              </Button>
            </div>
          </div>
        </div>
      )}

      <Sheet
        open={!!detailsId}
        onOpenChange={(open: any) => !open && setDetailsId(null)}
      >
        <SheetContent className="w-full mx-4 sm:max-w-xl overflow-y-auto">
          {isDetailsLoading ? (
            <div className="flex h-full items-center justify-center flex-col gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-slate-500">
                Pobieranie definicji FHIR...
              </p>
            </div>
          ) : (
            <>
              <SheetHeader className="mb-1 space-y-1">
                <SheetTitle className="text-2xl leading-tight">
                  {observationQuery.data?.preferredReportName ||
                    "Szczegóły Badania"}
                </SheetTitle>
                <Badge
                  variant="outline"
                  className="w-fit mb-2 text-blue-700 border-blue-200 bg-blue-50 font-mono"
                >
                  LOINC: {specimenQuery.data?.collectionCode || "N/A"}
                </Badge>
              </SheetHeader>

              <div className="space-y-8 ">
                {specimenQuery.data && (
                  <section className=" rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                      <ClipboardList className="h-4 w-4" />
                      Przygotowanie Pacjenta
                    </h4>
                    {specimenQuery.data.patientPreparation.length > 0 ? (
                      <ul className="space-y-2">
                        {specimenQuery.data.patientPreparation.map(
                          (text, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm text-slate-700"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{text}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Brak specyficznych zaleceń.
                      </p>
                    )}
                  </section>
                )}

                {specimenQuery.data && (
                  <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                      <FlaskConical className="h-4 w-4" />
                      Specyfikacja Materiału
                    </h4>

                    <div className="space-y-4">
                      {/* Collection Type */}
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 shadow-sm">
                          <TestTube2 className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-500">
                            Typ Materiału
                          </span>
                          <div className="text-sm font-medium text-slate-900">
                            {specimenQuery.data.collectionSystem}
                          </div>
                        </div>
                      </div>

                      {specimenQuery.data.transportInstructions.length > 0 && (
                        <div className="flex items-start gap-3 pt-2 border-t border-slate-200 mt-2">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shadow-sm border border-amber-100">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <span className="block text-xs font-semibold text-slate-500 mb-1">
                              Warunki Transportu
                            </span>
                            <ul className="list-disc pl-4 space-y-1">
                              {specimenQuery.data.transportInstructions.map(
                                (instruction, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm font-medium text-slate-900"
                                  >
                                    {instruction}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      )}

                      {specimenQuery.data.stabilityInstructions.length > 0 && (
                        <div className="flex items-start gap-3 pt-2 border-t border-slate-200 mt-2">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <span className="block text-xs font-semibold text-slate-500 mb-1">
                              Stabilność Materiału
                            </span>
                            <ul className="list-disc pl-4 space-y-1">
                              {specimenQuery.data.stabilityInstructions.map(
                                (instruction, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm font-medium text-slate-900"
                                  >
                                    {instruction}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Konfiguracja Zlecenia (ServiceRequest)</DialogTitle>
            <DialogDescription>
              Uzupełnij dane zlecenia przed wysłaniem do laboratorium.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zlecający (Requester)</Label>
                <Input disabled value={requesterName} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Pacjent (Subject)</Label>
                <Input
                  placeholder="Wyszukaj pacjenta (np. PESEL)"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priorytet (Priority)</Label>
              <RadioGroup
                value={orderPriority}
                onValueChange={setOrderPriority}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="routine" id="r1" />
                  <Label htmlFor="r1">Rutynowy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="r2" />
                  <Label htmlFor="r2">Pilny (ASAP)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stat" id="r3" />
                  <Label htmlFor="r3" className="text-red-600 font-semibold">
                    CITO (STAT)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Podgląd zasobu FHIR (JSON)</Label>
                <Badge variant="outline" className="font-mono text-[10px]">
                  FHIR R4 / JSON
                </Badge>
              </div>
              <div className="relative rounded-md border bg-slate-950 p-4 text-xs font-mono text-slate-50 shadow-inner">
                <FileJson className="absolute right-4 top-4 h-4 w-4 text-slate-500" />
                <ScrollArea className="h-[200px]">
                  <pre className="whitespace-pre-wrap">
                    {generateServiceRequestJSON()}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOrderModalOpen(false)}
            >
              Anuluj
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setIsOrderModalOpen(false);
                setBasket(new Set());
              }}
            >
              Wyślij Zlecenie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
