import axios from "axios";
import { useEffect, useState } from "react";
import { ConditionDefinition } from "./ConditionDefinition";

const API_BASE_URL = "http://localhost:5001/knowledge";

interface UseConditionDefinitionResult {
  data: ConditionDefinition | null;
  loading: boolean;
  error: string | null;
}

export const useGetConditionDefinition = (
  conditionId: string | null,
): UseConditionDefinitionResult => {
  const [data, setData] = useState<ConditionDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conditionId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/condition-definitions/${conditionId}`,
        );
        if (!isActive) return;
        setData(new ConditionDefinition(response.data));
      } catch (err: any) {
        if (!isActive) return;
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch condition definition",
        );
        setData(null);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [conditionId]);

  return { data, loading, error };
};