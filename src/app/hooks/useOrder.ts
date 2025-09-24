import { useState, useCallback, useMemo } from "react";
import type { Order, ApiError, CreateOrderRequest, UpdateOrderRequest } from "@app/types";
import { apiOrders } from "@app/lib/api";

export function useOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const normalizeResponse = <T,>(res: any): T => {
    return res?.data?.data ?? res?.data ?? res;
  };

  const getAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiOrders.get(``);
      const data = normalizeResponse<Order[]>(response);
      setOrders(data || []);
      return data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiOrders.get(`/${id}`);
      const data = normalizeResponse<Order>(response);
      // upsert into orders state so components can reuse cached data
      setOrders((prev) => {
        if (!data) return prev;
        const exists = prev.find((o) => o.id === data.id);
        if (exists) return prev.map((o) => (o.id === data.id ? data : o));
        return [...prev, data];
      });
      return data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  
  const createOrder = useCallback(async (payload: CreateOrderRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiOrders.post(`/`, payload);
      const created = normalizeResponse<Order>(response);
      if (created) setOrders((prev) => [...prev, created]);
      return created as Order;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (id: string, payload: UpdateOrderRequest): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiOrders.patch(`/${id}`, payload);
      const updated = normalizeResponse<Order>(response);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      return updated as Order;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiOrders.delete(`/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getByCustomer = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiOrders.get(`/by-customer/${userId}`);
      const data = normalizeResponse<Order[]>(response);
      return data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Payment actions: map to server endpoints
  // const approvePayment = useCallback(async (paymentId: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await apiOrders.post(`/payment/${paymentId}/approve`);
  //     const updated = normalizeResponse<Order>(response);
  //     setOrders((prev) => prev.map((o) => (o.paymentId === paymentId ? updated : o)));
  //     return updated;
  //   } catch (error: any) {
  //     setError({ message: error.message, statusCode: error.response?.status });
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const failPayment = useCallback(async (paymentId: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await apiOrders.post(`/payment/${paymentId}/fail`);
  //     const updated = normalizeResponse<Order>(response);
  //     setOrders((prev) => prev.map((o) => (o.paymentId === paymentId ? updated : o)));
  //     return updated;
  //   } catch (error: any) {
  //     setError({ message: error.message, statusCode: error.response?.status });
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const cancelPayment = useCallback(async (paymentId: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await apiOrders.post(`/payment/${paymentId}/cancel`);
  //     const updated = normalizeResponse<Order>(response);
  //     setOrders((prev) => prev.map((o) => (o.paymentId === paymentId ? updated : o)));
  //     return updated;
  //   } catch (error: any) {
  //     setError({ message: error.message, statusCode: error.response?.status });
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const resetOrderState = useCallback(async () => {
    setOrders([]);
    setLoading(false);
    setError(null);
  }, []);

  return useMemo(() => ({
    orders,
    loading,
    error,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getByCustomer,
    // approvePayment,
    // failPayment,
    // cancelPayment,
    resetOrderState
  }), [orders, loading, error, getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getByCustomer, resetOrderState]);
}
