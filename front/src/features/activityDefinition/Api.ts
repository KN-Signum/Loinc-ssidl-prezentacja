import { useState, useEffect } from "react";
import axios from "axios";
import { ActivityDefinition } from "./ActivityDefinition";

const API_BASE_URL = "http://localhost:5001/definitions";

interface UseActivityDefinitionResult {
  data: ActivityDefinition | null;
  loading: boolean;
  error: string | null;
}

interface UseActivityDefinitionsResult {
  data: ActivityDefinition[];
  loading: boolean;
  error: string | null;
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
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch activity definition",
        );
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

  useEffect(() => {
    const fetchActivityDefinitions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/activity-definitions`,
          {
            params: { title },
          },
        );
        const entries =
          response.data.entry?.map(
            (entry: any) => new ActivityDefinition(entry.resource),
          ) || [];
        setData(entries);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch activity definitions",
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDefinitions();
  }, [title]);

  return { data, loading, error };
};
