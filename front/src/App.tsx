import React, { useState, useMemo } from "react";
import {
  Search,
  FlaskConical,
  Building2,
  TestTube2,
  Info,
  Filter,
  Stethoscope,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileJson,
  Truck,
  ClipboardList,
  Activity,
} from "lucide-react";

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";
import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

import { useGetActivityDefinitionsByTitle } from "./features/activityDefinition/Api";
import { useGetSpecimenDefinition } from "./features/specimenDefinition/Api";
import { useGetObservationDefinition } from "./features/observationDefinition/Api";

const LABORATORIES = [
  "Diagnostyka Łódź",
  "Szpital Wojewódzki",
  "Lab. Centralne",
];
const SPECIMENS = ["Krew żylna", "Mocz", "Surowica", "Osocze"];

export default function App() {
  const { data: listData, loading: listLoading } =
    useGetActivityDefinitionsByTitle("morf");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [selectedSpecimen, setSelectedSpecimen] = useState<string>("all");

  const [basket, setBasket] = useState<Set<string>>(new Set());

  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [orderPriority, setOrderPriority] = useState("routine");
  const [patientName, setPatientName] = useState("");
  const [requesterName] = useState("Dr n. med. Jan Kowalski");

  const specimenQuery = useGetSpecimenDefinition(detailsId);
  const observationQuery = useGetObservationDefinition(detailsId);
  const isDetailsLoading = specimenQuery.loading || observationQuery.loading;

  // Filtering Logic
  const filteredData = useMemo(() => {
    if (!listData) return [];

    return listData.filter((item: any) => {
      const title = item.title || item.name || "";
      const code = item.code?.coding?.[0]?.code || item.code || "";

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLab = selectedLab === "all" ? true : true;
      const matchesSpecimen = selectedSpecimen === "all" ? true : true;

      return matchesSearch && matchesLab && matchesSpecimen;
    });
  }, [searchTerm, selectedLab, selectedSpecimen, listData]);

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

  const toggleSelection = (id: string) => {
    const newBasket = new Set(basket);
    if (newBasket.has(id)) {
      newBasket.delete(id);
    } else {
      newBasket.add(id);
    }
    setBasket(newBasket);
  };

  const generateServiceRequestJSON = () => {
    const requests = Object.keys(basketGroups).map((labName) => ({
      resourceType: "ServiceRequest",
      status: "draft",
      intent: "order",
      priority: orderPriority,
      requester: { display: requesterName },
      subject: { display: patientName || "Nieokreślony Pacjent" },
      performer: [{ type: "Organization", display: labName }],
      code: {
        coding: basketGroups[labName].map((item: any) => ({
          system: "http://loinc.org",
          code: item.code?.coding?.[0]?.code || item.code || "UNKNOWN",
          display: item.title || item.name,
        })),
      },
    }));
    return JSON.stringify(
      requests.length === 1 ? requests[0] : requests,
      null,
      2,
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700">
            Dostępne
          </Badge>
        );
      case "unavailable":
        return (
          <Badge variant="secondary" className="text-slate-500">
            Niedostępne
          </Badge>
        );
      default:
        return <Badge variant="outline">Aktywne</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-32">
      <header className="sticky top-0 z-20 w-full border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Katalog Usług Diagnostycznych
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs font-medium text-slate-500">
                  Baza Wiedzy: Połączono (FHIR R4)
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm leading-tight text-slate-500 md:block">
              <span className="block font-semibold text-slate-700">
                {requesterName}
              </span>
              <span className="text-xs">Oddział Chorób Wewnętrznych</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-700">
              <span className="text-sm font-semibold">JK</span>
            </div>
          </div>
        </div>
      </header>

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

        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Search */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium leading-none">
                  Szukaj badania
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Nazwa badania, kod LOINC..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full space-y-2 md:w-[280px]">
                <label className="text-sm font-medium leading-none">
                  Laboratorium
                </label>
                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="h-4 w-4" />
                      <SelectValue placeholder="Wszystkie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie laboratoria</SelectItem>
                    {LABORATORIES.map((lab) => (
                      <SelectItem key={lab} value={lab}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full space-y-2 md:w-[240px]">
                <label className="text-sm font-medium leading-none">
                  Materiał
                </label>
                <Select
                  value={selectedSpecimen}
                  onValueChange={setSelectedSpecimen}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FlaskConical className="h-4 w-4" />
                      <SelectValue placeholder="Wszystkie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie materiały</SelectItem>
                    {SPECIMENS.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLab("all");
                  setSelectedSpecimen("all");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <div className="rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[50px] text-center"></TableHead>
                  <TableHead className="w-[350px]">Nazwa Badania</TableHead>
                  <TableHead className="w-[180px]">Kod (LOINC/Local)</TableHead>
                  <TableHead>Laboratorium</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right">Baza Wiedzy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-slate-500"
                    >
                      Ładowanie definicji...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-slate-500"
                    >
                      Nie znaleziono badań.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item: any) => {
                    const isSelected = basket.has(item.id);
                    const codeDisplay =
                      item.code?.coding?.[0]?.code || item.code || "Brak kodu";

                    return (
                      <TableRow
                        key={item.id}
                        className={`group transition-colors ${isSelected ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50/50"}`}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelection(item.id)}
                            aria-label={`Select ${item.title}`}
                          />
                        </TableCell>

                        <TableCell className="align-middle">
                          <span
                            className={`font-semibold transition-colors ${isSelected ? "text-blue-700" : "text-slate-900"}`}
                          >
                            {item.title || item.name}
                          </span>
                        </TableCell>

                        <TableCell className="align-middle">
                          <Badge
                            variant="outline"
                            className="px-2 py-1 font-mono text-xs bg-slate-50 text-slate-600 border-slate-200"
                          >
                            <Activity className="h-3 w-3 mr-1 inline-block" />
                            {codeDisplay}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-middle">
                          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                            <TestTube2 className="mr-1 h-3 w-3 text-slate-500" />
                            {item.laboratory || "Lab. Centralne"}
                          </div>
                        </TableCell>

                        <TableCell className="align-middle">
                          {getStatusBadge(item.status || "active")}
                        </TableCell>

                        <TableCell className="text-right align-middle">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailsId(item.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Info className="mr-2 h-4 w-4" />
                            Szczegóły
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
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
                          ),
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
                                ),
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
                                ),
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
