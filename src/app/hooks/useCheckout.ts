import { useState, useCallback, useMemo } from "react";
import type { ApiError } from "@app/types";
import { apiCheckout } from "@app/lib/api";

const CHECKOUT_BASE_URL = import.meta.env.VITE_API_CHECKOUT;


//will be removed whenn refact is applied

export function useCheckout() {
  const [checkout, setCheckout] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createCheckoutSession = useCallback(async (request: { userId: string; paymentId: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCheckout.post(`/`, request);
      setCheckout((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const getCheckoutSession = useCallback(async (paymentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCheckout.get(`${CHECKOUT_BASE_URL}/${paymentId}`);
      setCheckout((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCheckoutSession = useCallback(async (paymentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiCheckout.delete(`${CHECKOUT_BASE_URL}/${paymentId}`);
      setCheckout((prev) => prev.filter((item) => item.paymentId !== paymentId));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const resetOrderState = useCallback(async () => {
    setCheckout([]);
    setLoading(false);
    setError(null);
  }, []);

  return useMemo(() => ({
    checkout,
    loading,
    error,
    createCheckoutSession,
    getCheckoutSession,
    deleteCheckoutSession,
    resetOrderState
  }), [checkout, loading, error, createCheckoutSession, getCheckoutSession, deleteCheckoutSession, resetOrderState]);
}
