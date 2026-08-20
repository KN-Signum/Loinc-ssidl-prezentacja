import { Stethoscope } from "lucide-react";
import BaseSwitcher from "../BaseSwitcher/BaseSwitcher";
import { useAppStore } from "../../store/appStore";
import { ShowSettings } from "../Settings/Settings";

const Header = () => {
  const { isPreviewMode } = useAppStore();
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Aplikacja prezentacyjna bazy wiedzy LOINC-SSIDL
            </h1>
          </div>
        </div>
        <div className="flex-1 flex justify-center min-w-0 px-2">
          {isPreviewMode && <BaseSwitcher />}
        </div>
        <div className="flex items-center gap-1">
          <img
            src="/hl7polska.png"
            alt="Polskie Stowarzyszenie HL7"
            className="h-11 w-auto object-contain hidden sm:block"
          />
          <ShowSettings />
        </div>
      </div>
    </header>
  );
};
export default Header;
