import { useState, useEffect } from "react";
import axios from "axios";
import { SpecimenDefinition } from "./SpecimenDefinition";

const API_BASE_URL = "http://localhost:5001/knowledge";

interface UseSpecimenDefinitionResult {
  data: SpecimenDefinition | null;
  loading: boolean;
  error: string | null;
}

export const useGetSpecimenDefinition = (
  id: string | null,
): UseSpecimenDefinitionResult => {
  const [data, setData] = useState<SpecimenDefinition | null>(null);
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
          `${API_BASE_URL}/specimen-definitions/${id}`,
        );
        setData(new SpecimenDefinition(response.data));
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch specimen definition",
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
