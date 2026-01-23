import React from "react";
import { FileJson } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { ActivityDefinition } from "../../features/activityDefinition/ActivityDefinition";
import { useAppStore } from "../../store/appStore";
import { useBasketStore } from "../../store/basketStore";

const requesterName = "Dr n. med. Jan Kowalski";

export interface OrderModalProps {
  basketItems: ActivityDefinition[];
}

export const OrderModal: React.FC<OrderModalProps> = ({
  basketItems,
}) => {
  const { isOrderModalOpen, setIsOrderModalOpen } = useAppStore();
  const { clearBasket } = useBasketStore();
  const [orderPriority, setOrderPriority] = React.useState("routine");
  const [patientName, setPatientName] = React.useState("");

  const generateServiceRequestJSON = (): string => {
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
      orderDetails: basketItems.map((item) => ({
        reference: `ActivityDefinition/${item.id}`,
        display: item.title,
      })),
    };
    return JSON.stringify(serviceRequest, null, 2);
  };

  const handleSubmit = () => {
    setIsOrderModalOpen(false);
    clearBasket();
    setOrderPriority("routine");
    setPatientName("");
  };

  return (
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
          <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
            Anuluj
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Wyślij Zlecenie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
