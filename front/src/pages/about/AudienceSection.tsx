import { Card } from "../../components/ui/card";

type AudienceSectionProps = {
  items: string[];
};

export function AudienceSection({ items }: AudienceSectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Dla kogo powstaje SSIDL</h3>
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              {item}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
