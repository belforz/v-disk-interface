import { User, ApiError } from "@app/types";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useUserStore } from "@app/store/user";
import { apiAuth, setLogoutHandler } from "@app/lib/api";

export function useAuth() {
  const token = useUserStore((s) => s.token);
  const user = useUserStore((s) => s.user);
  const setToken = useUserStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);


  const removeSensitiveFields = (obj: any): any => {
    if (obj == null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(removeSensitiveFields);
    const out: any = {};
    const sensitive = /password|pwd|pass|secret|token|auth/i;
    for (const [k, v] of Object.entries(obj)) {
      if (sensitive.test(k)) continue;
      out[k] = removeSensitiveFields(v);
    }
    return out;
  };

  const sanitizeUser = (u: any): User | null => {
    if (!u || typeof u !== "object") return null;
    const cleaned = removeSensitiveFields(u);
    const normalized = { ...cleaned } as any;
    if (normalized.id == null) normalized.id = cleaned._id ?? u?.id ?? u?.userId ?? null;
    if (normalized.roles && !Array.isArray(normalized.roles)) {
      normalized.roles = [normalized.roles];
    }
    return normalized as User;
  };

  const handleFetchError = (err: unknown): ApiError => {
    if (err instanceof Error) {
      return { message: err.message, statusCode: 500 };
    }
    return { message: "An unknown error occurred", statusCode: 500 };
  };

  const auth = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use axios instance for consistency with other API calls
      const response = await apiAuth.post("/login", { email, password });
      const data = response.data;

      // support both formats: { token } or { data: { token } }
      const tokenValue: string | null = data?.token ?? data?.data?.token ?? null;
      const userValue: any = data?.user ?? data?.data?.user ?? null;

      if (!tokenValue) {
        throw new Error("Token not found in login response");
      }

      setToken(tokenValue);
      const safeUser = sanitizeUser(userValue);
      setUser(safeUser);

      // return useful result for callers that want to await auth
      return { token: tokenValue, user: safeUser };
    } catch (err: any) {
      const apiErr = { message: err?.response?.data?.message || err?.message || "Failed to authenticate", statusCode: err?.response?.status } as ApiError;
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, [setToken, setUser]);

  const verifyEmail = useCallback(async (verificationToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiAuth.post("/verify-email", { token: verificationToken });
      const data = response.data;
      const userValue: any = data?.user ?? data?.data?.user ?? null;
      setUser(sanitizeUser(userValue));
    } catch (err: any) {
      const apiErr = { message: err?.response?.data?.message || err?.message || "Failed to verify email", statusCode: err?.response?.status } as ApiError;
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      clearUser();
    } catch (err: any) {
      const apiErr = handleFetchError(err);
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, [clearUser, setToken, setUser]);

  // Token refresh is not supported by backend; users must re-authenticate on 401.

  // const changePassword = useCallback(async (newPassword: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await apiAuth.post("/change-password", { newPassword });
  //     const data = response.data;
  //     const userValue: any = data?.user ?? data?.data?.user ?? null;
  //     setUser(sanitizeUser(userValue));
  //   } catch (err: any) {
  //     const apiErr = { message: err?.response?.data?.message || err?.message || "Failed to change password", statusCode: err?.response?.status } as ApiError;
  //     setError(apiErr);
  //     throw apiErr;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [setUser]);

 
  const changePasswordWithToken = useCallback(async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/change-password?token=${encodeURIComponent(token)}`;
      const response = await apiAuth.post(url, { newPassword });
      const data = response.data;
      const userValue: any = data?.user ?? data?.data?.user ?? null;
      setUser(sanitizeUser(userValue));
    } catch (err: any) {
      const apiErr = { message: err?.response?.data?.message || err?.message || "Failed to change password", statusCode: err?.response?.status } as ApiError;
      setError(apiErr);
      throw apiErr;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

 
  useEffect(() => {
    setLogoutHandler(() => {
      void logout();
    });
  }, [logout]);
  return useMemo(() => ({
    token,
    loading,
    error,
    user,
    auth,
    verifyEmail,
    changePasswordWithToken,
    logout,
  }), [token, loading, error, user, auth, verifyEmail, changePasswordWithToken, logout]);
}