import axios from "axios";
import { useEffect, useState } from "react";
import { LocationDefinition } from "./LocationDefinition";

const API_URL23 = "http://localhost:5001/definitions";

export const useGetLocationDefinitionLB = () => {
  const [data, setData] = useState<LocationDefinition[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/knowledge/locations/lab`);
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
        const response = await axios.get(`http://localhost:5001/knowledge/locations/pp`);
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
