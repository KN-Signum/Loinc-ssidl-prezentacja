import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";

type ProjectOverviewSectionProps = {
  projectHighlights: string[];
};

export function ProjectOverviewSection({ projectHighlights }: ProjectOverviewSectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700">
            Program ABM
          </Badge>
          <h2 className="text-2xl font-bold text-slate-900">
            Wdrozenie slownika LOINC i prototypu SSIDL
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Celem projektu jest rozwoj polskojezycznej adaptacji LOINC oraz implementacja
            jej w Systemie Standaryzacji Informacji w Diagnostyce Laboratoryjnej (SSIDL),
            aby usprawnic wymiane danych badan laboratoryjnych w ochronie zdrowia.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Numer umowy</p>
              <p className="mt-1 font-medium">2024/ABM/03/KPO/KPOD.07.07-IW.07-0171/24-00</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Okres realizacji</p>
              <p className="mt-1 font-medium">01.10.2024 - 31.03.2026</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Wartosc projektu</p>
              <p className="mt-1 font-medium">7 995 666,25 PLN</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Dofinansowanie</p>
              <p className="mt-1 font-medium">7 995 666,25 PLN</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Kluczowe korzysci</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
            {projectHighlights.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
