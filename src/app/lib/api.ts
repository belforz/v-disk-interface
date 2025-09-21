import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { notify } from "./toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_LOGIN,
  headers: {
    "Content-Type": "application/json",
  }
  ,
  // Include credentials for auth requests (useful if server uses httpOnly refresh cookies)
  withCredentials: true,
});



export const apiUsers = axios.create({
  baseURL: import.meta.env.VITE_API_USERS,
  headers:{
    "Content-Type": "application/json",
  }
});

export const apiCarts = axios.create({
  baseURL: import.meta.env.VITE_API_CARTS,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiOrders = axios.create({
  baseURL: import.meta.env.VITE_API_ORDERS,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiEmails = axios.create({
  baseURL: import.meta.env.VITE_API_EMAIL,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiVinyls = axios.create({
  baseURL: import.meta.env.VITE_API_VINYLS,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiCheckout = axios.create({
  baseURL: import.meta.env.VITE_API_CHECKOUT,
  headers: {
    "Content-Type": "application/json",
  }
  ,
  // Checkout endpoints may rely on auth cookies; ensure cookies are sent
  withCredentials: true,
});

// Function to get current token from zustand store (avoiding localStorage race conditions)
let getCurrentToken: () => string | null = () => {
  // Fallback to localStorage if store not available
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// Allow store to register token getter
export function setTokenGetter(getter: () => string | null) {
  getCurrentToken = getter;
  console.log("Token getter registered with API");
}

// NOTE: This app's backend does not provide a refresh-token endpoint. Token refresh logic
// was intentionally removed. Consumers should re-authenticate when they receive 401 responses.

// Handle logging out user
let logoutUser: () => void = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Will be replaced by actual logout function from useAuth
  window.location.href = "/login";
};

export function setLogoutHandler(handler: () => void) {
  logoutUser = handler;
  console.log("Logout handler registered with API");
}

// Add auth request interceptor
function attachAuthInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCurrentToken();
    const base = config.baseURL || "";
    const urlPart = config.url || "";
    const fullUrl = `${base}${urlPart}`;
    
    // Log only in development
    if (import.meta.env.DEV) {
      console.log(`Interceptor[${base}]: url=${urlPart} method=${config.method} token=${token ? 'yes' : 'no'}`);
    }

    // Routes that don't require authentication
    const isAuthRoute = fullUrl.includes("/api/auth");
    const isVinylGet = fullUrl.includes("/api/vinyls") && config.method === "get";
    const isMailRoute = fullUrl.includes("/api/emails");
    const isUserPost = fullUrl.includes("/api/users") && config.method === "post";
  const isResetPassword = fullUrl.endsWith("/reset-password.html");

  // Public routes don't need auth header
  const isPublic = isAuthRoute || isVinylGet || isMailRoute || isUserPost || isResetPassword;

    // Add token to authenticated requests
    if (token && !isPublic) {
      if (!config.headers) config.headers = {} as import("axios").AxiosRequestHeaders;
      (config.headers as any).Authorization = `Bearer ${token}`;
      
      if (import.meta.env.DEV) {
        console.log("Adding Authorization header for:", fullUrl);
      }
    }

    return config;
  });

  // Response interceptor for handling auth errors. The backend doesn't provide refresh tokens,
  // so when a 401 is encountered we logout the user and reject the request.
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle auth errors (401 Unauthorized)
      if (error.response?.status === 401) {
        logoutUser();
        notify.error("Your session has expired. Please log in again.");
        return Promise.reject(error);
      }

      // Handle forbidden errors (403)
      if (error.response?.status === 403) {
        notify.error("You don't have permission to perform this action");
      }

      return Promise.reject(error);
    }
  );
}

// Attach auth interceptors to all API instances
attachAuthInterceptor(api);
attachAuthInterceptor(apiAuth);
attachAuthInterceptor(apiUsers);
attachAuthInterceptor(apiCarts);
attachAuthInterceptor(apiOrders);
attachAuthInterceptor(apiEmails);
attachAuthInterceptor(apiVinyls);
attachAuthInterceptor(apiCheckout);


const BASE = import.meta.env.VITE_API_URL || "http://localhost:3333";

export async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}