import { useState } from "react";
import type { CartOrder, CartUser, ApiError} from "@app/types";
import axios from "axios";


const CART_BASE_URL = import.meta.env.VITE_API_CARTS;

export function useCart() {
  const [cart, setCart] = useState<CartOrder[]>([]);
  const [cartUser, setCartUser] = useState<CartUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);


  async function getUserCart(userId: string){
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${CART_BASE_URL}/${userId}`);
      setCartUser((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function createUserCart(userId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${CART_BASE_URL}/${userId}`);
      setCartUser((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function deleteUserCart(userId: string) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${CART_BASE_URL}/${userId}`);
      setCartUser((prev) => prev.filter((item) => item.userId !== userId));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function updateUserCart(userId: string, payload: CartOrder[]) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${CART_BASE_URL}/${userId}`, payload);
      setCartUser((prev) => prev.map((item) => (item.userId === userId ? response.data : item)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function addVinylToUserCart(userId: string, vinylId:string){
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${CART_BASE_URL}/${userId}/item/${vinylId}`);
      setCartUser((prev) => prev.map((item) => (item.userId === userId ? response.data : item)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }
  async function removeVinylFromUserCart(userId: string, vinylId:string){
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${CART_BASE_URL}/${userId}/item/${vinylId}`);
      setCartUser((prev) => prev.map((item) => (item.userId === userId ? { ...item, vinyls: item.vinyls.filter((id) => id !== vinylId) } : item)));
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function getCart(userId: string) {
    try {
      const response = await axios.get(`${CART_BASE_URL}/cart/${userId}`);
      return response.data; // Retorna o carrinho do usuário
    } catch (error) {
      throw new Error("Failed to fetch cart");
    }
  }

  async function addItemToCart(userId: string, vinylId: string, quantity: number) {
    try {
      const response = await axios.post(`${CART_BASE_URL}/cart/${userId}/item/${vinylId}`, { qt: quantity });
      return response.data; 
    } catch (error) {
      throw new Error("Failed to add item to cart");
    }
  }

  async function removeItemFromCart(userId: string, vinylId: string) {
    try {
      const response = await axios.delete(`${CART_BASE_URL}/cart/${userId}/item/${vinylId}`);
      return response.data; 
    } catch (error) {
      throw new Error("Failed to remove item from cart");
    }
  }

  async function updateCart(userId: string, cart: CartOrder[]) {
    try {
      const response = await axios.put(`${CART_BASE_URL}/cart/${userId}`, { cart });
      return response.data; 
    } catch (error) {
      throw new Error("Failed to update cart");
    }
  }

  async function deleteCart(userId: string) {
    try {
      const response = await axios.delete(`${CART_BASE_URL}/cart/${userId}`);
      return response.data; 
    } catch (error) {
      throw new Error("Failed to delete cart");
    }
  }
  return {
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
  }
}