import { User, ApiError } from "@app/types";
import { useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleFetchError = (err: unknown): ApiError => {
    if (err instanceof Error) {
      return { message: err.message, statusCode: 500 };
    }
    return { message: "An unknown error occurred", statusCode: 500 };
  };

  const auth = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to authenticate");
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (verificationToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${verificationToken}`,
          },
          body: JSON.stringify({ token: verificationToken }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify email");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
    //   await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to refresh token");
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    loading,
    error,
    user,
    auth,
    verifyEmail,
    changePassword,
    logout,
    refreshToken,
  };
}