import { User, ApiError } from "@app/types";
import { useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Remove sensitive fields that may be returned by the API (e.g. password)
  const sanitizeUser = (u: any): User | null => {
    if (!u) return null;
    // create a shallow copy without `password` or other sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, pwd, ...rest } = u as any;
    return rest as User;
  };

  const handleFetchError = (err: unknown): ApiError => {
    if (err instanceof Error) {
      return { message: err.message, statusCode: 500 };
    }
    return { message: "An unknown error occurred", statusCode: 500 };
  };
  const AUTH_BASE = (import.meta.env.VITE_API_LOGIN as string) || `${import.meta.env.VITE_API_URL}/api/auth`;

  const auth = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
  const response = await fetch(`${AUTH_BASE}/login`, {
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

      // support both formats: { token } or { data: { token } }
      const tokenValue: string | null = data?.token ?? data?.data?.token ?? null;
      const userValue: any = data?.user ?? data?.data?.user ?? null;

      if (!tokenValue) {
        throw new Error("Token not found in login response");
      }

      setToken(tokenValue);
      setUser(sanitizeUser(userValue));
      localStorage.setItem("token", tokenValue);

      // return useful result for callers that want to await auth
      console.log('Auth hook result:', { token: tokenValue, user: userValue });
      return { token: tokenValue, user: userValue };
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
        `${AUTH_BASE}/verify-email`,
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
  const userValue: any = data?.user ?? data?.data?.user ?? null;
  setUser(sanitizeUser(userValue));
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
        `${AUTH_BASE}/refresh-token`,
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
  const tokenValue: string | null = data?.token ?? data?.data?.token ?? null;
  if (!tokenValue) throw new Error("Token not found in refresh response");
  setToken(tokenValue);
  localStorage.setItem("token", tokenValue);
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
        `${AUTH_BASE}/change-password`,
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
  const userValue: any = data?.user ?? data?.data?.user ?? null;
  setUser(sanitizeUser(userValue));
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