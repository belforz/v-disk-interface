import { useState, useCallback, useMemo } from "react";
import type { CartOrder, CartUser, ApiError} from "@app/types";
import { apiCarts } from "@app/lib/api";


export function useCart() {
  const [cart, setCart] = useState<CartOrder[]>([]);
  const [cartUser, setCartUser] = useState<CartUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);


  const getUserCart = useCallback(async (userId: string) =>{
    setLoading(true);
    setError(null);
    try {
      const response = await apiCarts.get(`/${userId}`);
      setCartUser((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const createUserCart = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCarts.post(`/${userId}`);
      setCartUser((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUserCart = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiCarts.delete(`/${userId}`);
      setCartUser((prev) => prev.filter((item) => item.userId !== userId));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserCart = useCallback(async (userId: string, payload: CartOrder[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCarts.put(`/${userId}`, payload);
      setCartUser((prev) => prev.map((item) => (item.userId === userId ? response.data : item)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const addVinylToUserCart = useCallback(async (userId: string, vinylId:string) =>{
    setLoading(true);
    setError(null);
    try {
      const response = await apiCarts.post(`/${userId}/item/${vinylId}`);
      setCartUser((prev) => prev.map((item) => (item.userId === userId ? response.data : item)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);
  const removeVinylFromUserCart = useCallback(async (userId: string, vinylId:string) =>{
    setLoading(true);
    setError(null);
    try {
      await apiCarts.delete(`/${userId}/item/${vinylId}`);
      setCartUser((prev) => prev.map((item) => (item.userId === userId ? { ...item, vinyls: item.vinyls.filter((id) => id !== vinylId) } : item)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const getCart = useCallback(async (userId: string) => {
    try {
      const response = await apiCarts.get(`/${userId}`);
      return response.data; // Retorna o carrinho do usuário
    } catch (error) {
      throw new Error("Failed to fetch cart");
    }
  }, []);

  const addItemToCart = useCallback(async (userId: string, vinylId: string, quantity: number) => {
    try {
      
      const response = await apiCarts.post(`/${userId}/item/${vinylId}`, { quantity });
      return response.data; 
    } catch (error) {
      throw new Error("Failed to add item to cart");
    }
  }, []);

  const removeItemFromCart = useCallback(async (userId: string, vinylId: string) => {
    try {
      const response = await apiCarts.delete(`/${userId}/item/${vinylId}`);
      return response.data; 
    } catch (error) {
      throw new Error("Failed to remove item from cart");
    }
  }, []);

  const updateCart = useCallback(async (userId: string, cart: CartOrder[]) => {
    try {
      const payload: Record<string, number> = {};
      cart.forEach((c: any) => {
        const id = c.vinylId ?? c.id;
        const qty = (c.qt ?? c.qty ?? c.quantity) as number || 1;
        payload[id] = qty;
      });
      const response = await apiCarts.put(`/${userId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update cart");
    }
  }, []);

  const deleteCart = useCallback(async (userId: string) => {
    try {
      const response = await apiCarts.delete(`/${userId}`);
      return response.data; 
    } catch (error) {
      throw new Error("Failed to delete cart");
    }
  }, []);

  return useMemo(() => ({
    cart,
    cartUser,
    loading,
    error,
    getUserCart,
    createUserCart,
    deleteUserCart,
    updateUserCart,
    addVinylToUserCart,
    removeVinylFromUserCart,
    getCart,
    addItemToCart,
    removeItemFromCart,
    updateCart,
    deleteCart
  }), [cart, cartUser, loading, error, getUserCart, createUserCart, deleteUserCart, updateUserCart, addVinylToUserCart, removeVinylFromUserCart, getCart, addItemToCart, removeItemFromCart, updateCart, deleteCart]);
}