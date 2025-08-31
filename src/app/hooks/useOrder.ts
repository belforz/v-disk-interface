import { useState } from "react";
import type { Order, ApiError} from "@app/types";
import axios from "axios";

const ORDERS_BASE_URL = import.meta.env.VITE_API_ORDERS;

export function useOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function getAllOrders() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${ORDERS_BASE_URL}/`);
      setOrders(response.data);
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function getOrderById(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${ORDERS_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }


async function createOrder(payload: Order) {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.post(`${ORDERS_BASE_URL}/`, payload);
        setOrders((prev) => [...prev, response.data]);
    } catch (error: any) {
        setError({ message: error.message, statusCode: error.response?.status });
    } finally {
        setLoading(false);
    }
}

interface UpdateOrderPayload extends Order {
    qty: number[];
    paymentId: string;
    isPaymentConfirmed: boolean;
    orderStatus: "pending" | "completed" | "cancelled";
}

  async function updateOrder(id: string, payload: UpdateOrderPayload): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${ORDERS_BASE_URL}/${id}`, payload);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? response.data : order))
      );
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrder(id: string) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${ORDERS_BASE_URL}/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function changeOrderPaymentStatus(id: string, status: "pending" | "completed" | "cancelled") {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${ORDERS_BASE_URL}/${id}/payment-status`, { status });
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? response.data : order))
      );
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function resetOrderState() {
    setOrders([]);
    setLoading(false);
    setError(null);
  }

  return {
    orders,
    loading,
    error,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    resetOrderState
  };
}
