import { useState } from "react";
import type { CheckoutOrder, ApiError} from "@app/types";
import axios from "axios";

const CHECKOUT_BASE_URL = import.meta.env.VITE_API_CHECKOUT;

export function useCheckout() {
  const [checkout, setCheckout] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function createCheckoutSession(paymentId: string , payload: CheckoutOrder) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${CHECKOUT_BASE_URL}/`,
        { ...payload, paymentId: payload.paymentId ?? paymentId }
      );
      setCheckout((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function getCheckoutSession(paymentId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${CHECKOUT_BASE_URL}/${paymentId}`);
      setCheckout((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function deleteCheckoutSession(paymentId: string) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${CHECKOUT_BASE_URL}/${paymentId}`);
      setCheckout((prev) => prev.filter((item) => item.paymentId !== paymentId));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function resetOrderState() {
    setCheckout([]);
    setLoading(false);
    setError(null);
  }

  return {
    checkout,
    loading,
    error,
    createCheckoutSession,
    getCheckoutSession,
    deleteCheckoutSession,
    resetOrderState
  };
}
