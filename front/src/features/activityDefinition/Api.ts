import { useState, useEffect } from "react";
import axios from "axios";
import { ActivityDefinition } from "./ActivityDefinition";

const API_BASE_URL = "http://localhost:5001/knowledge";

function classifyAxiosError(err: any): string {
  if (!err.response) {
    return "Nie można połączyć się z serwerem aplikacji. Sprawdź, czy backend działa (ECONNREFUSED).";
  }
  return (
    err.response?.data?.error ||
    err.message ||
    "Nieznany błąd serwera."
  );
}

interface UseActivityDefinitionResult {
  data: ActivityDefinition | null;
  loading: boolean;
  error: string | null;
}

interface UseActivityDefinitionsResult {
  data: ActivityDefinition[];
  loading: boolean;
  error: string | null;
  paginationTokenNext: string | null;
  paginationTokenPrev: string | null;
  fetchNextPage: () => void;
  fetchPrevPage: () => void;
}

export const useGetActivityDefinition = (
  id: string,
): UseActivityDefinitionResult => {
  const [data, setData] = useState<ActivityDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchActivityDefinition = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/activity-definitions/${id}`,
        );
        setData(new ActivityDefinition(response.data));
      } catch (err: any) {
        setError(classifyAxiosError(err));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDefinition();
  }, [id]);

  return { data, loading, error };
};

export const useGetActivityDefinitionsByTitle = (
  title: string = "",
): UseActivityDefinitionsResult => {
  const [data, setData] = useState<ActivityDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationTokenNext, setPaginationTokenNext] = useState<string | null>(null);
  const [paginationTokenPrev, setPaginationTokenPrev] = useState<string | null>(null);

  const fetchActivityDefinitions = async (pageToken?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/activity-definitions`,
        {
          params: { title, token: pageToken },
        },
      );

      const entries =
        response.data.entry?.map(
          (entry: any) => new ActivityDefinition(entry.resource),
        ) || [];

      setPaginationTokenNext(response.data.paginationTokenNext || null);
      setPaginationTokenPrev(response.data.paginationTokenPrev || null);
      setData(entries);
    } catch (err: any) {
      setError(classifyAxiosError(err));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const fetchNextPage = () => {
    if (paginationTokenNext) fetchActivityDefinitions(paginationTokenNext);
  };

  const fetchPrevPage = () => {
    if (paginationTokenPrev) fetchActivityDefinitions(paginationTokenPrev);
  };

  return {
    data,
    loading,
    error,
    paginationTokenNext,
    paginationTokenPrev,
    fetchNextPage,
    fetchPrevPage,
  };
};
