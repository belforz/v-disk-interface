import { useState } from "react";
import type { User, ApiError} from "@app/types";
import axios from "axios";

const USERS_BASE_URL = import.meta.env.VITE_API_USERS;

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function getAllUsers() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${USERS_BASE_URL}/`);
      setUsers(response.data);
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function getUserById(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${USERS_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function createUser(payload: User) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${USERS_BASE_URL}/`, payload);
      setUsers((prev) => [...prev, response.data]);
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: string, payload: User) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${USERS_BASE_URL}/${id}`, payload);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? response.data : user))
      );
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: string) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${USERS_BASE_URL}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }

  async function resendEmailUser(id: string ){
    setLoading(true);
    setError(null);
    try {
        const response = await axios.post(`${USERS_BASE_URL}/resend-verifcation/${id}`);
        if(response.status === 200){
            return response.data, response.status;
        }
    } catch (error: any) {
        setError({message: error.message , statusCode: error.response?.status});
    } finally {
        setLoading(false);
    }
  }

  async function getUserToken(token: string) {
    if (!token) {
      setError({ message: "Token is invalid, expired or null", statusCode: 400 });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${USERS_BASE_URL}/verify/${token}`);
      return response.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function resetUserState() {
    setUsers([]);
    setLoading(false);
    setError(null);
  }

  return {
    users,
    loading,
    error,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserState
  };
}
