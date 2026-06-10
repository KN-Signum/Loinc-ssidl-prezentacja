import { useState, useEffect } from "react";
import axios from "axios";
import { CitationItem } from "./types";
import { BACKEND_BASE_URL } from "../../config/apiBase";

const API_BASE_URL = `${BACKEND_BASE_URL}/knowledge`;

interface UseCitationsResult {
  data: CitationItem[] | { message: string } | null;
  loading: boolean;
  error: string | null;
}

export const useGetAgeUnits = (): Record<string, string> => {
  const [units, setUnits] = useState<Record<string, string>>({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/age-units`).then((r) => setUnits(r.data)).catch(() => {});
  }, []);

  return units;
};

export const useGetCitations = (
  obsId: string | null,
): UseCitationsResult => {
  const [data, setData] = useState<CitationItem[] | { message: string } | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!obsId) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/citations/${obsId}`,
        );
        setData(response.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch citations",
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [obsId]);

  return { data, loading, error };
};
