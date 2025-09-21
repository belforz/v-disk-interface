import { useState, useCallback, useMemo } from "react";
import type { User, ApiError} from "@app/types";
import { apiUsers } from "@app/lib/api";


const USERS_BASE_URL = import.meta.env.VITE_API_USERS;

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUsers.get(`${USERS_BASE_URL}`);
      const payload = response.data?.data ?? response.data;
      setUsers(payload);
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUsers.get(`${USERS_BASE_URL}/${id}`);
      return response.data?.data ?? response.data;
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (payload: User) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUsers.post(`${USERS_BASE_URL}`, payload);
      const created = response.data?.data ?? response.data;
      setUsers((prev) => [...prev, created]);
      return created;
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, payload: User) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUsers.patch(`${USERS_BASE_URL}/${id}`, payload);
      const updated = response.data?.data ?? response.data;
      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUsers.delete(`${USERS_BASE_URL}/${id}`);
      // Some APIs return the deleted resource or an acknowledgement
      if (response.status === 200) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      }
    } catch (error: any) {
      setError({message: error.message , statusCode: error.response?.status});
    } finally {
      setLoading(false);
    }
  }, []);

  const resendEmailUser = useCallback(async (id: string ) =>{
    setLoading(true);
    setError(null);
    try {
    const response = await apiUsers.post(`${USERS_BASE_URL}/resend-verifcation/${id}`);
    if(response.status === 200){
      return response.data?.data ?? response.data;
    }
    } catch (error: any) {
        setError({message: error.message , statusCode: error.response?.status});
    } finally {
        setLoading(false);
    }
  }, []);

  const getUserToken = useCallback(async (token: string) => {
    if (!token) {
      setError({ message: "Token is invalid, expired or null", statusCode: 400 });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiUsers.get(`${USERS_BASE_URL}/verify/${token}`);
      return response.data?.data ?? response.data;
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const resetUserState = useCallback(async () => {
    setUsers([]);
    setLoading(false);
    setError(null);
  }, []);

  return useMemo(() => ({
    users,
    loading,
    error,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserState,
    resendEmailUser,
    getUserToken
  }), [users, loading, error, getAllUsers, getUserById, createUser, updateUser, deleteUser, resetUserState, resendEmailUser, getUserToken]);
}
