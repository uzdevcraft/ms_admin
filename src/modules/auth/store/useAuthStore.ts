import { create } from "zustand";
import { devtools } from "zustand/middleware";

import config from "@/config/config";

// Imported by path (not through `@/common/services`) because that barrel
// pulls in `http`, which itself reads from this store.
import cookie from "@/common/services/cookie";
import storage from "@/common/services/storage";

import type { IStore } from "../types";

/** The access token lives in localStorage, so a reload keeps the session. */
const getStoredAccessToken = (): string | null =>
  storage.local.get(config.accessToken) || null;

/** The refresh token lives in a cookie — never in localStorage. */
export const getRefreshToken = (): string | null =>
  cookie.get(config.refreshToken);

const useAuthStore = create<IStore.State>()(
  devtools(
    (set) => ({
      user: null,
      error: null,
      accessToken: getStoredAccessToken(),
      isAuthenticated: !!getStoredAccessToken(),

      login: (session) => {
        storage.local.set(config.accessToken, session.accessToken);

        if (session.refreshToken) {
          cookie.set(config.refreshToken, session.refreshToken);
        }

        set({
          error: null,
          isAuthenticated: !!session.accessToken,
          accessToken: session.accessToken,
        });
      },

      logout: () => {
        storage.local.remove(config.accessToken);
        cookie.remove(config.refreshToken);

        set({
          user: null,
          error: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setAccessToken: (accessToken) => {
        storage.local.set(config.accessToken, accessToken);

        set({
          accessToken,
          isAuthenticated: !!accessToken,
        });
      },

      setUser: (user) => set({ user }),

      setError: (error) => set({ error }),
    }),
    { name: "auth-store" },
  ),
);

export default useAuthStore;
