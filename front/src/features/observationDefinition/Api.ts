import { useState, useEffect } from "react";
import axios from "axios";
import { ObservationDefinition } from "./ObservationDefintion";
import { BACKEND_BASE_URL } from "../../config/apiBase";

const API_BASE_URL = `${BACKEND_BASE_URL}/knowledge`;

interface UseObservationDefinitionResult {
  data: ObservationDefinition | null;
  loading: boolean;
  error: string | null;
}

export const useGetObservationDefinition = (
  obsId: string | null,
): UseObservationDefinitionResult => {
  const [data, setData] = useState<ObservationDefinition | null>(null);
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
          `${API_BASE_URL}/observation-definitions/${obsId}`,
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
  }, [obsId]);

  return { data, loading, error };
};

export interface ObservationDefinitionListItem {
  id: string;
  preferredReportName: string | null;
}

interface UseObservationDefinitionListResult {
  data: ObservationDefinitionListItem[];
  loading: boolean;
  error: string | null;
}

export const useGetObservationDefinitionList = (
  id: string | null,
): UseObservationDefinitionListResult => {
  const [data, setData] = useState<ObservationDefinitionListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/observation-definitions-list/${id}`,
        );
        setData(response.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch observation definition list",
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};
