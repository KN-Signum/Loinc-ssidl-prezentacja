import { useState, useEffect } from "react";
import axios from "axios";
import { ObservationDefinition } from "./ObservationDefintion";

const API_BASE_URL = "http://localhost:5001/definitions";

interface UseObservationDefinitionResult {
  data: ObservationDefinition | null;
  loading: boolean;
  error: string | null;
}

export const useGetObservationDefinition = (
  id: string | null,
): UseObservationDefinitionResult => {
  const [data, setData] = useState<ObservationDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/observation-definitions/${id}`,
        );
        setData(new ObservationDefinition(response.data));
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch observation definition",
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};
