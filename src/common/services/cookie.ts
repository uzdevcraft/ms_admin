// core/services/cookie.ts
interface IOptions {
  days?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
}

const defaults: Required<IOptions> = {
  days: 30,
  path: "/",
  sameSite: "Strict",
};

const cookie = {
  get: (key: string): string | null => {
    const prefix = `${encodeURIComponent(key)}=`;

    const match = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(prefix));

    return match ? decodeURIComponent(match.slice(prefix.length)) : null;
  },

  set: (key: string, value: string, options: IOptions = {}) => {
    const { days, path, sameSite } = { ...defaults, ...options };

    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000,
    ).toUTCString();

    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      value,
    )}; Expires=${expires}; Path=${path}; SameSite=${sameSite}${secure}`;
  },

  remove: (key: string, options: Pick<IOptions, "path"> = {}) => {
    const { path } = { ...defaults, ...options };

    document.cookie = `${encodeURIComponent(
      key,
    )}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}`;
  },
};

export default cookie;
