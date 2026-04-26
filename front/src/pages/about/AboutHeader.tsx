import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export function AboutHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            SSIDL
          </p>
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
            O nas i o projekcie
          </h1>
        </div>
        <a href="/">
          <Button variant="outline" size="sm" className="text-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrot do katalogu
          </Button>
        </a>
      </div>
    </header>
  );
}
