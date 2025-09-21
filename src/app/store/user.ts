import { create } from "zustand";
import type { User } from "@app/types";
import type { StateCreator } from "zustand";
import { setTokenGetter } from "@app/lib/api";

type AuthState = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clear: () => void;
};

export const useUserStore = create<AuthState>((set, get) => {
  const store = {
    // don't read localStorage at module-evaluation time (avoids SSR/terminal loss)
    token: null,
    user: null,
    setToken: (token: string | null) => {
      if (typeof window !== "undefined") {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
      }
      set({ token });
    },
    setUser: (user: User | null) => {
      if (typeof window !== "undefined") {
        try {
          if (user) localStorage.setItem("user", JSON.stringify(user));
          else localStorage.removeItem("user");
        } catch (e) {
          // ignore
        }
      }
      set({ user });
    },
    clear: () => {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (e) {}
      }
      set({ token: null, user: null });
    },
  };

  // Register token getter with API interceptor
  if (typeof window !== "undefined") {
    setTokenGetter(() => get().token);
  }

  return store;
});
