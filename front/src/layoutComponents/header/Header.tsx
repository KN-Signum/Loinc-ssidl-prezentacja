import { Stethoscope } from "lucide-react";

const Header = ( { requesterName }: { requesterName: string } ) => {
    return (
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
    );
}
export default Header;