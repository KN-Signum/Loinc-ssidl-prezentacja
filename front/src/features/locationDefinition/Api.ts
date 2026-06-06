import axios from "axios";
import { useEffect, useState } from "react";
import { LocationDefinition } from "./LocationDefinition";
import { BACKEND_BASE_URL } from "../../config/apiBase";

export const useGetLocationDefinitionLB = () => {
  const [data, setData] = useState<LocationDefinition[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_BASE_URL}/terminology/laboratories`);
        setData(response.data);
        console.log(response.data)
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);
  return { data, loading, error };
};
export const useGetLocationDefinitionPP = () => {
  const [data, setData] = useState<LocationDefinition[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_BASE_URL}/terminology/intake`);
        setData(response.data);
        console.log(response.data)
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);
  return { data, loading, error };
};
