import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckSquare, Loader2, Target } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { BACKEND_BASE_URL } from "../../config/apiBase";

const GOAL_EXTENSION_URL =
  "http://loinc-ssidl.umed.pl/fhir/ig/ssidl/StructureDefinition/activityDefinition-reasonReference";

const API_BASE_URL = `${BACKEND_BASE_URL}/knowledge`;

interface ConditionGoalItem {
  id: string;
  description: string;
}

type ActivityDefinitionLike = {
  extension?: Array<{
    url?: string;
    valueCanonical?: string;
  }>;
};

function extractConditionId(valueCanonical: string): string | null {
  const match = valueCanonical.match(/ConditionDefinition\/([^/?#]+)/i);
  if (match?.[1]) {
    return match[1];
  }

  const segments = valueCanonical.split("/").filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : null;
}

function uniqueConditionIds(activityDefinitionData: ActivityDefinitionLike | null | undefined): string[] {
  const ids = (activityDefinitionData?.extension ?? [])
    .filter((extension) => extension.url === GOAL_EXTENSION_URL)
    .map((extension) => extension.valueCanonical)
    .filter((valueCanonical): valueCanonical is string => Boolean(valueCanonical))
    .map(extractConditionId)
    .filter((id): id is string => Boolean(id));

  return Array.from(new Set(ids));
}

export const ActivityGoalSection: React.FC<{
  activityDefinitionData: ActivityDefinitionLike | null | undefined;
}> = ({ activityDefinitionData }) => {
  const conditionIds = useMemo(
    () => uniqueConditionIds(activityDefinitionData),
    [activityDefinitionData],
  );
  const [goals, setGoals] = useState<ConditionGoalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activityId = activityDefinitionData?.id;

    if (!activityId) {
      setGoals([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/activity-definitions/${activityId}/condition-definitions`,
        );

        if (!isActive) return;

        setGoals((response.data ?? []) as ConditionGoalItem[]);
      } catch (err: any) {
        if (!isActive) return;

        setGoals([]);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch condition definitions",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchGoals();

    return () => {
      isActive = false;
    };
  }, [activityDefinitionData?.id]);

  if (conditionIds.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        <Target className="h-4 w-4" />
        Cel badania
        <Badge variant="outline" className="ml-1 text-xs">
          {conditionIds.length}
        </Badge>
      </h4>

      <ul className="space-y-2">
        {loading && (
          <li className="flex items-start gap-2 text-sm text-slate-600">
            <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-blue-600" />
            <span>Ładowanie celu badania...</span>
          </li>
        )}
        {!loading && error && (
          <li className="flex items-start gap-2 text-sm text-slate-500">
            <CheckSquare className="mt-0.5 h-4 w-4 text-amber-500" />
            <span>Nie udało się pobrać celu badania.</span>
          </li>
        )}
        {!loading && !error &&
          goals.map((goal) => (
            <li key={goal.id} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckSquare className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
              <span>{goal.description || "Brak opisu celu badania."}</span>
            </li>
          ))}
      </ul>
    </section>
  );
};