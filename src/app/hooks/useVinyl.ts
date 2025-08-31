import { useState } from "react";
import type { Vinyl, ApiError } from "@app/types";
import axios from "axios";

const VINYL_BASE_URL = import.meta.env.VITE_API_VINYL;

export function useVinyl() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function getAllVinyl(limit: number, offset: number) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${VINYL_BASE_URL}/`, {
        params: { limit, offset },
      });
      setVinyls(response.data);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function getVinylbyId(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${VINYL_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function createVinyl(payload: Vinyl) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${VINYL_BASE_URL}/`, payload);
      setVinyls((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function updateVinyl(id: string, payload: Vinyl) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${VINYL_BASE_URL}/${id}`, payload);
      setVinyls((prev) =>
        prev.map((vinyl) => (vinyl.id === id ? response.data : vinyl))
      );
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function deleteVinyl(id: string) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${VINYL_BASE_URL}/${id}`);
      setVinyls((prev) => prev.filter((vinyl) => vinyl.id !== id));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function getVinylByTerm(term: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${VINYL_BASE_URL}/search`, {
        params: { t: term },
      });
      return response.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function getHomeVinyl(id: string, principal: boolean) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${VINYL_BASE_URL}/principal/`, {
        params: { id, principal },
      });
      return response.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }

    function resetVinylState() {
      setVinyls([]);
      setLoading(false);
      setError(null);
    }
  }

  return {
    vinyls,
    loading,
    error,
    getAllVinyl,
    getVinylbyId,
    createVinyl,
    updateVinyl,
    deleteVinyl,
    getVinylByTerm,
    getHomeVinyl,
  };
}
