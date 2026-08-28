import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import type { IApi, IEntity } from "@/modules/auth/types";
import * as authMappers from "@/modules/auth/mappers";
import { isTokenExpiring } from "@/modules/auth/utils/token";
import authEvents from "@/common/services/authEvents";
import storage from "./storage";
import {
  ACCESS_TOKEN_KEY,
  GUEST_WARNING_MESSAGE,
  REFRESH_TOKEN_KEY,
} from "@/modules/auth/constants";

import { useAuthStore } from "@/modules/auth/store";
import { VITE_API_BASE_URL } from "./env";

const BASE_URL = VITE_API_BASE_URL as string;

// Used for /auth/login and /auth/refresh — never carries an Authorization
// header and never triggers a refresh (which would recurse).
const pureRequest = axios.create({ baseURL: BASE_URL });

// Used for everything that needs the user's session (e.g. /auth/me).
// axios-auth-refresh is attached to this instance below.
const request = axios.create({ baseURL: BASE_URL });

export function persistSession(session: IEntity.Login): void {
  useAuthStore.getState().setAccessToken(session.accessToken);
  storage.local.set(ACCESS_TOKEN_KEY, session.accessToken);
  if (session.refreshToken) {
    storage.local.set(REFRESH_TOKEN_KEY, session.refreshToken);
  }
}

export function clearSession(): void {
  useAuthStore.getState().logout();
  storage.local.remove(ACCESS_TOKEN_KEY);
  storage.local.remove(REFRESH_TOKEN_KEY);
}

function fallbackToGuest(message: string = GUEST_WARNING_MESSAGE): void {
  clearSession();
  authEvents.emitGuest({ message });
}

let refreshPromise: Promise<string> | null = null;

/**
 * Exchanges the stored refresh token for a fresh access token and persists
 * both. Concurrent callers share one in-flight request, so a burst of
 * expired requests only hits /auth/refresh once. Rejects (leaving the
 * session untouched) when there is no refresh token or the server says no —
 * callers decide whether that means guest mode.
 */
export async function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = storage.local.get(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error("Missing refresh token");

      const { data } = await pureRequest.post<IApi.Refresh>("/auth/refresh", {
        refreshToken,
      });

      const session = authMappers.Refresh(data);
      if (!session.accessToken) throw new Error("Refresh returned no token");

      persistSession(session);
      return session.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

request.interceptors.request.use(async (cfg) => {
  let token = useAuthStore.getState().accessToken;

  // Proactive refresh: swap an expired (or nearly expired) access token
  // before the request leaves, instead of paying for a 401 round-trip.
  if (token && isTokenExpiring(token)) {
    try {
      token = await refreshSession();
    } catch (error) {
      fallbackToGuest();
      throw error;
    }
  }

  if (token) {
    cfg.headers = cfg.headers ?? ({} as AxiosRequestHeaders);
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

/**
 * Reactive refresh, for tokens the server rejects even though they looked
 * valid to us (revoked, unreadable `exp`, clock skew). axios-auth-refresh
 * calls this once per 401 while queueing other requests, then retries them.
 * If refreshing is impossible we drop into guest mode.
 */
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  try {
    const accessToken = await refreshSession();

    if (failedRequest.response) {
      failedRequest.response.config.headers =
        failedRequest.response.config.headers ?? ({} as AxiosRequestHeaders);
      failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return Promise.resolve();
  } catch {
    fallbackToGuest();
    return Promise.reject(failedRequest);
  }
};

createAuthRefreshInterceptor(request, refreshAuthLogic, {
  statusCodes: [401],
});

/**
 * 403 is a different case from 401: it's not "session expired, try to
 * refresh" — it's "not registered", and per spec should never be treated
 * as an error state. It drops straight to guest mode on both clients,
 * without ever attempting a refresh.
 */
function attachGuestFallback(client: typeof request): void {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        fallbackToGuest();
      }
      return Promise.reject(error);
    },
  );
}

attachGuestFallback(request);
attachGuestFallback(pureRequest);

const http = {
  request,
  pureRequest,
  refreshSession,
  persistSession,
  clearSession,
};

export default http;
