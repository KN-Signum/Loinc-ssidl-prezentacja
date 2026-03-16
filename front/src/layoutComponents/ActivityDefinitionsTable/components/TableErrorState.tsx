import { AlertTriangle, WifiOff, KeyRound, Clock, ServerCrash } from "lucide-react";

type ErrorKind = "fhir_down" | "backend_down" | "auth" | "timeout" | "generic";

interface TableErrorStateProps {
  error: string;
  colSpan?: number;
}

function classifyError(error: string): ErrorKind {
  const msg = error.toLowerCase();
  if (
    msg.includes("połączyć się z serwerem fhir") ||
    msg.includes("niedostępny") ||
    msg.includes("503")
  )
    return "fhir_down";
  if (
    msg.includes("network error") ||
    msg.includes("połączyć się z serwerem aplikacji") ||
    msg.includes("econnrefused")
  )
    return "backend_down";
  if (
    msg.includes("uwierzytelni") ||
    msg.includes("dane dostępu") ||
    msg.includes("401") ||
    msg.includes("403")
  )
    return "auth";
  if (
    msg.includes("timeout") ||
    msg.includes("nie odpowiedział") ||
    msg.includes("504") ||
    msg.includes("408")
  )
    return "timeout";
  return "generic";
}

const CONFIG: Record<
  ErrorKind,
  { icon: React.ReactNode; title: string; hint: string; color: string }
> = {
  fhir_down: {
    icon: <ServerCrash className="h-8 w-8" />,
    title: "Serwer FHIR jest niedostępny",
    hint: "Zewnętrzny serwer danych medycznych nie odpowiada. Spróbuj ponownie za chwilę.",
    color: "text-red-500",
  },
  backend_down: {
    icon: <WifiOff className="h-8 w-8" />,
    title: "Brak połączenia z serwerem aplikacji",
    hint: "Nie można nawiązać połączenia z lokalnym serwerem. Sprawdź, czy backend działa.",
    color: "text-orange-500",
  },
  auth: {
    icon: <KeyRound className="h-8 w-8" />,
    title: "Błąd uwierzytelnienia",
    hint: "Dane dostępu do serwera FHIR są nieprawidłowe lub wygasły.",
    color: "text-amber-500",
  },
  timeout: {
    icon: <Clock className="h-8 w-8" />,
    title: "Przekroczono czas oczekiwania",
    hint: "Serwer FHIR nie odpowiedział w wyznaczonym czasie. Spróbuj ponownie.",
    color: "text-amber-500",
  },
  generic: {
    icon: <AlertTriangle className="h-8 w-8" />,
    title: "Błąd ładowania danych",
    hint: "Wystąpił nieoczekiwany błąd podczas pobierania danych.",
    color: "text-slate-500",
  },
};

export const TableErrorState = ({
  error,
  colSpan = 6,
}: TableErrorStateProps) => {
  const kind = classifyError(error);
  const { icon, title, hint, color } = CONFIG[kind];

  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className={color}>{icon}</span>
          <div>
            <p className={`font-semibold text-sm ${color}`}>{title}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">{hint}</p>
          </div>
          <details className="text-left max-w-sm">
            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
              Szczegóły błędu
            </summary>
            <p className="text-xs text-slate-400 mt-1 font-mono break-all bg-slate-50 rounded p-2 border">
              {error}
            </p>
          </details>
        </div>
      </td>
    </tr>
  );
};
