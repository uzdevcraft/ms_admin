import axios, { AxiosError, type AxiosRequestHeaders } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import type { IApi } from "@/modules/auth/types";
import authEvents from "@/common/services/authEvents";
import { GUEST_WARNING_MESSAGE } from "@/modules/auth/constants";

import { useAuthStore } from "@/modules/auth/store";
import { VITE_API_BASE_URL } from "./env";

const BASE_URL = VITE_API_BASE_URL as string;

// Used for /login and /refresh — never carries an Authorization header.
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

function fallbackToGuest(message: string = GUEST_WARNING_MESSAGE): void {
  useAuthStore.getState().logout();
  authEvents.emitGuest({ message });
}

/**
 * axios-auth-refresh's refresh logic: called once (requests are queued and
 * paused meanwhile) whenever `request` gets a 401. On success it patches
 * the failed request's headers so axios-auth-refresh can retry it for us.
 * On failure — no refresh token, or /refresh itself rejects — there's no
 * logout flow to fall back to, so we drop straight into guest mode.
 */
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) {
    fallbackToGuest();
    return Promise.reject(failedRequest);
  }

  try {
    const { data } = await pureRequest.post<IApi.RefreshResponse>(
      "/refresh",
      null,
      {
        params: { refreshToken },
      },
    );

    useAuthStore.getState().setAccessToken(data.accessToken);
    cookieStore.set("refreshToken", data.refreshToken ?? "");

    if (failedRequest.response) {
      failedRequest.response.config.headers =
        failedRequest.response.config.headers ?? ({} as AxiosRequestHeaders);
      failedRequest.response.config.headers.Authorization = `Bearer ${data.accessToken}`;
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

const http = { request, pureRequest };

export default http;
