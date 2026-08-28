export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  AUTH: "auth",
  GUEST: "guest",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

/** Refresh this long before the access token actually expires. */
export const TOKEN_REFRESH_LEEWAY_MS = 30_000;

export const GUEST_WARNING_MESSAGE =
  "Davom etish uchun bot ichida ro'yxatdan o'ting";
