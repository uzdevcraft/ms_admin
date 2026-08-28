import { TOKEN_REFRESH_LEEWAY_MS } from "../constants";

type JwtPayload = { exp?: number };

const decodeJwt = (token: string): JwtPayload | null => {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
};

/** Expiration time in ms, or null when the token isn't a readable JWT. */
export const getTokenExpiresAt = (token: string): number | null => {
  const exp = decodeJwt(token)?.exp;
  return typeof exp === "number" ? exp * 1000 : null;
};

/**
 * True when the token is expired or about to expire within `leewayMs`.
 * Unreadable tokens return false — there's nothing to base a decision on,
 * so we let the server reject them and fall back to the 401 flow.
 */
export const isTokenExpiring = (
  token: string,
  leewayMs: number = TOKEN_REFRESH_LEEWAY_MS,
): boolean => {
  const expiresAt = getTokenExpiresAt(token);
  if (expiresAt === null) return false;
  return Date.now() >= expiresAt - leewayMs;
};
