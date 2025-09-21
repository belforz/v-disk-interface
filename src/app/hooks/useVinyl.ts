import { useState, useCallback, useMemo } from "react";
import type { Vinyl, ApiError } from "@app/types";
import {apiVinyls} from "@app/lib/api";


const VINYL_BASE_URL = import.meta.env.VITE_API_VINYL;

export function useVinyl() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getAllVinyl = useCallback(async (limit: number, offset: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVinyls.get(`${VINYL_BASE_URL}`, {
        params: { limit, offset },
      });
      setVinyls(response.data.data);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const getVinylbyId = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVinyls.get(`${VINYL_BASE_URL}/${id}`);
      return response.data.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const createVinyl = useCallback(async (payload: Vinyl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVinyls.post(`${VINYL_BASE_URL}`, payload);
      setVinyls((prev) => [...prev, response.data.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVinyl = useCallback(async (id: string, payload: Vinyl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVinyls.patch(`${VINYL_BASE_URL}/${id}`, payload);
      const updated = response.data?.data ?? response.data;
      setVinyls((prev) => prev.map((vinyl) => (vinyl.id === id ? updated : vinyl)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVinyl = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiVinyls.delete(`${VINYL_BASE_URL}/${id}`);
      setVinyls((prev) => prev.filter((vinyl) => vinyl.id !== id));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const getVinylByTerm = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVinyls.get(`${VINYL_BASE_URL}/search`, {
        params: { t: term },
      });
      return response.data.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const getHomeVinyl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVinyls.get(`${VINYL_BASE_URL}/principal`);
      return response.data?.data ?? response.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(() => ({
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
  }), [vinyls, loading, error, getAllVinyl, getVinylbyId, createVinyl, updateVinyl, deleteVinyl, getVinylByTerm, getHomeVinyl]);
}
