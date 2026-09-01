import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import type { IApi } from "@/modules/auth/types";
import * as authMappers from "@/modules/auth/mappers";
import { getRefreshToken, useAuthStore } from "@/modules/auth/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Used for /auth/login and /auth/refresh — never carries an Authorization
// header and never triggers a refresh (which would recurse).
const pureRequest = axios.create({ baseURL: BASE_URL });

// Used for everything that needs the user's session (e.g. /auth/me).
// axios-auth-refresh is attached to this instance below.
const request = axios.create({ baseURL: BASE_URL });

request.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    cfg.headers = cfg.headers ?? ({} as AxiosRequestHeaders);
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

let refreshPromise: Promise<string> | null = null;

/**
 * Exchanges the refresh token (read from its cookie) for a fresh access
 * token, then lets the store persist both again. Concurrent callers share
 * one in-flight request, so a burst of expired requests only hits
 * /auth/refresh once. Rejects — leaving the session untouched — when there
 * is no refresh token or the server says no; callers decide what that means.
 */
export async function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("Missing refresh token");

      const { data } = await pureRequest.post<IApi.Refresh>("/auth/refresh", {
        refreshToken,
      });

      const session = authMappers.Refresh(data);
      if (!session.accessToken) throw new Error("Refresh returned no token");

      // Keep the current refresh token when the server doesn't rotate it.
      useAuthStore.getState().login({
        ...session,
        refreshToken: session.refreshToken || refreshToken,
      });

      return session.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/**
 * axios-auth-refresh's refresh logic: called once per 401 (other requests
 * are queued meanwhile), then the failed request is retried with the new
 * token. If refreshing is impossible the session is dropped, which sends
 * the user back to the login page via the `Auth` route guard.
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
    useAuthStore.getState().logout();
    return Promise.reject(failedRequest);
  }
};

createAuthRefreshInterceptor(request, refreshAuthLogic, {
  statusCodes: [401],
});

/**
 * 403 is a different case from 401: it's not "session expired, try to
 * refresh" — it's "this account may not be here", so it drops straight to
 * guest mode on both clients without ever attempting a refresh.
 */
function attachGuestFallback(client: typeof request): void {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    },
  );
}

attachGuestFallback(request);
attachGuestFallback(pureRequest);

const http = { request, pureRequest, refreshSession };

export default http;
